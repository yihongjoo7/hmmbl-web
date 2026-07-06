import { useState } from 'react';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fileApi } from '@/features/shared/services/fileApi';
import { validateFile, type UploadResult } from '@/lib/api/fileUploadClient';

type UploadKind = 'general' | 'image';
type UseFileUploadReturn = UseMutationResult<UploadResult, Error, File> & { progress: number };

export function useFileUpload(kind: UploadKind = 'general'): UseFileUploadReturn {
  const [progress, setProgress] = useState(0);
  const mutation = useMutation<UploadResult, Error, File>({
    mutationFn: async (file: File) => {
      setProgress(0);
      // validateFile은 "오류 메시지 문자열(실패) | null(유효)"을 반환한다.
      // 기존: if (!validateFile(file)) throw → null(유효)에서 throw되어 정상 파일도 거부되는 버그.
      const validationError = validateFile(file);
      if (validationError) throw new Error(validationError);
      const upload = kind === 'image' ? fileApi.uploadImage : fileApi.upload;
      return upload(file, setProgress);
    },
  });
  return { ...mutation, progress };
}
