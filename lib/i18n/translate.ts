// 서버 사이드 전용 Azure Translator 동적 번역
const MAX_CACHE_SIZE = 1000;
const cache = new Map<string, { value: string; expires: number }>();
const TTL        = 24 * 60 * 60 * 1000;
const BATCH_LIMIT = 100; // Azure Translator 단일 요청 최대 문자열 수

export async function translateText(text: string, targetLocale: string, sourceLocale = 'ko'): Promise<string> {
  if (targetLocale === 'ko') return text;

  const key    = `${sourceLocale}:${targetLocale}:${text}`;
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    // 히트 시 삭제 후 재삽입 → Map 삽입 순서 기준 LRU 갱신
    cache.delete(key);
    cache.set(key, cached);
    return cached.value;
  }

  try {
    const { config } = await import('../config');
    const apiKey     = config.azureTranslatorKey;
    const region     = config.azureTranslatorRegion;

    if (!apiKey) {
      console.warn('[translate] AZURE_TRANSLATOR_KEY 미설정 — 원문 반환');
      return text;
    }

    const res = await fetch(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLocale}&to=${targetLocale}`,
      {
        method:  'POST',
        headers: {
          'Content-Type':                  'application/json',
          'Ocp-Apim-Subscription-Key':     apiKey,
          'Ocp-Apim-Subscription-Region':  region,
        },
        body: JSON.stringify([{ Text: text }]),
         next: { revalidate: 86400 },  // cache: 'no-store', 대체
      },
    );

    if (!res.ok) throw new Error(`Azure Translator API error: ${res.status}`);

    const data      = await res.json();
    const translated = data?.[0]?.translations?.[0]?.text ?? text;

    if (cache.size >= MAX_CACHE_SIZE) {
      cache.delete(cache.keys().next().value!);
    }
    cache.set(key, { value: translated, expires: Date.now() + TTL });

    return translated;
  } catch (err) {
    console.error('[translate] 번역 실패:', err);
    return text;
  }
}

/**
 * 여러 문자열을 Azure Translator에 배치로 번역한다.
 * 캐시 히트 항목은 API 호출 없이 즉시 반환하고,
 * 미스 항목만 100개 단위로 묶어 병렬 요청한다.
 */
export async function translateBatch(
  texts: string[],
  targetLocale: string,
  sourceLocale = 'en',
): Promise<string[]> {
  if (texts.length === 0) return [];

  const now     = Date.now();
  const results = new Array<string>(texts.length);
  const missIndices: number[] = [];
  const missTexts: string[]   = [];

  for (let i = 0; i < texts.length; i++) {
    const key    = `${sourceLocale}:${targetLocale}:${texts[i]}`;
    const cached = cache.get(key);
    if (cached && cached.expires > now) {
      cache.delete(key);
      cache.set(key, cached);
      results[i] = cached.value;
    } else {
      missIndices.push(i);
      missTexts.push(texts[i]);
    }
  }

  if (missTexts.length === 0) return results;

  try {
    const { config } = await import('../config');
    if (!config.azureTranslatorKey) {
      console.warn('[translate] AZURE_TRANSLATOR_KEY 미설정 — 원문 반환');
      for (let i = 0; i < missIndices.length; i++) results[missIndices[i]] = missTexts[i];
      return results;
    }

    const endpoint = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLocale}&to=${targetLocale}`;
    const headers  = {
      'Content-Type':                  'application/json',
      'Ocp-Apim-Subscription-Key':     config.azureTranslatorKey,
      'Ocp-Apim-Subscription-Region':  config.azureTranslatorRegion,
    };

    // 100개 단위로 청크 분할 후 병렬 요청
    const chunks: string[][] = [];
    for (let i = 0; i < missTexts.length; i += BATCH_LIMIT) {
      chunks.push(missTexts.slice(i, i + BATCH_LIMIT));
    }

    const chunkResults = await Promise.all(
      chunks.map(chunk =>
        fetch(endpoint, {
          method:  'POST',
          headers,
          body:    JSON.stringify(chunk.map(t => ({ Text: t }))),
          next: { revalidate: 86400 },  // cache:   'no-store', 대체
        }).then(res => {
          if (!res.ok) throw new Error(`Azure Translator API error: ${res.status}`);
          return res.json() as Promise<Array<{ translations: Array<{ text: string }> }>>;
        }),
      ),
    );

    const translated = chunkResults.flat();
    for (let i = 0; i < missIndices.length; i++) {
      const value = translated[i]?.translations?.[0]?.text ?? missTexts[i];
      results[missIndices[i]] = value;

      const key = `${sourceLocale}:${targetLocale}:${missTexts[i]}`;
      if (cache.size >= MAX_CACHE_SIZE) cache.delete(cache.keys().next().value!);
      cache.set(key, { value, expires: Date.now() + TTL });
    }
  } catch (err) {
    console.error('[translate] 배치 번역 실패:', err);
    for (let i = 0; i < missIndices.length; i++) results[missIndices[i]] = missTexts[i];
  }

  return results;
}
