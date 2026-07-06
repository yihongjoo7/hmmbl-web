'use client';
import { useState } from 'react';

import { Input }          from '@/components/common/ui/input/Input';
import { Textarea }       from '@/components/common/ui/input/Textarea';
import { Select }         from '@/components/common/ui/input/Select';
import { Toggle }         from '@/components/common/ui/input/Toggle';
import { SearchBar }      from '@/components/common/ui/input/SearchBar';
import { DatePicker }     from '@/components/common/ui/input/DatePicker';
import { ImageUploader }  from '@/components/common/ui/input/ImageUploader';

import { Button }         from '@/components/common/ui/action/Button';
import { FilterChip }     from '@/components/common/ui/action/FilterChip';
import { BubbleButton }   from '@/components/common/ui/action/BubbleButton';

import { Badge }          from '@/components/common/ui/display/Badge';
import { Card }           from '@/components/common/ui/display/Card';
import { Spinner }        from '@/components/common/ui/display/Spinner';
import { Skeleton }       from '@/components/common/ui/display/Skeleton';
import { EmptyState }     from '@/components/common/ui/display/EmptyState';
import { Header }         from '@/components/common/ui/display/Header';
import { TabBar }         from '@/components/common/ui/display/TabBar';
import { Table }          from '@/components/common/ui/display/Table';

import { Modal }          from '@/components/common/ui/overlay/Modal';
import { ConfirmDialog }  from '@/components/common/ui/overlay/ConfirmDialog';
import { Tooltip }        from '@/components/common/ui/overlay/Tooltip';
import { BottomSheet }    from '@/components/common/ui/overlay/BottomSheet';
import { ToastContainer } from '@/components/common/ui/overlay/Toast';

import { Pagination }            from '@/components/common/ui/navigation/Pagination';
import { Breadcrumb }            from '@/components/common/ui/navigation/Breadcrumb';
import { Stepper }               from '@/components/common/ui/navigation/Stepper';
import { InfiniteScrollTrigger } from '@/components/common/ui/navigation/InfiniteScrollTrigger';

import { useToastStore } from '@/hooks/useToastStore';
import { useModalStore } from '@/hooks/useModalStore';

const TABS = [
  { id: 0, label: '입력' },
  { id: 1, label: '액션' },
  { id: 2, label: '표시' },
  { id: 3, label: '오버레이' },
  { id: 4, label: '탐색' },
] as const;
type TabId = typeof TABS[number]['id'];

const TABLE_COLS = [
  { key: 'id',   header: 'ID',   width: '60px', align: 'center' as const },
  { key: 'name', header: '이름', align: 'left'  as const },
  { key: 'role', header: '역할', align: 'left'  as const },
];
const TABLE_DATA = [
  { id: 1, name: '홍길동', role: 'Admin' },
  { id: 2, name: '김철수', role: 'User' },
  { id: 3, name: '이영희', role: 'Editor' },
];

const STEPPER_STEPS = [
  { id: 'step1', label: '기본 정보' },
  { id: 'step2', label: '인증' },
  { id: 'step3', label: '완료' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-start' }}>
        {children}
      </div>
    </div>
  );
}

export default function UITestPage() {
  const [tab, setTab]               = useState<TabId>(0);
  const [inputVal, setInputVal]     = useState('');
  const [pwVal, setPwVal]           = useState('');
  const [textareaVal, setTextareaVal] = useState('');
  const [selectVal, setSelectVal]   = useState('');
  const [toggle, setToggle]         = useState(false);
  const [search, setSearch]         = useState('');
  const [date, setDate]             = useState('');
  const [dateTime, setDateTime]     = useState('');
  const [dateYear, setDateYear]     = useState('');
  const [dateMonth, setDateMonth]   = useState('');
  const [chips, setChips]           = useState<string[]>([]);
  const [innerTab, setInnerTab]     = useState('tab1');
  const [page, setPage]             = useState(1);
  const [step, setStep]             = useState(0);
  const [sheetOpen, setSheetOpen]   = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [skelPaused, setSkelPaused]   = useState(false);
  const [skelPulsePaused, setSkelPulsePaused] = useState(false);
  const [infiniteMore, setInfiniteMore] = useState(true);

  const { addToast }            = useToastStore();
  const { open, close }         = useModalStore();

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <ToastContainer />
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>공통 UI 테스트</h1>

      {/* 탭 헤더 */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: 28 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px',
              border: 'none',
              borderBottom: tab === t.id ? '3px solid #3b82f6' : '3px solid transparent',
              background: 'none',
              color: tab === t.id ? '#2563eb' : '#6b7280',
              fontWeight: tab === t.id ? 700 : 400,
              cursor: 'pointer',
              marginBottom: -2,
              fontSize: 14,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 입력 탭 */}
      {tab === 0 && (
        <div>
          <Section title="Input">
            <Input label="이름" value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="입력하세요" />
            <Input label="비밀번호" type="password" value={pwVal} onChange={e => setPwVal(e.target.value)} placeholder="••••••••" />
            <Input label="에러 상태" value="잘못된 값" onChange={() => {}} error="올바르지 않은 형식입니다" />
            <Input label="비활성" value="" onChange={() => {}} disabled placeholder="비활성화됨" />
          </Section>
          <Section title="Textarea">
            <Textarea label="메모" value={textareaVal} onChange={e => setTextareaVal(e.target.value)} placeholder="내용을 입력하세요" rows={3} />
          </Section>
          <Section title="Select">
            <Select label="역할" value={selectVal} onChange={e => setSelectVal(e.target.value)}
              options={[{ value: '', label: '선택하세요' }, { value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]} />
          </Section>
          <Section title="Toggle">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Toggle checked={toggle} onChange={setToggle} />
              <span style={{ fontSize: 14 }}>{toggle ? 'ON' : 'OFF'}</span>
            </div>
          </Section>
          <Section title="SearchBar">
            <SearchBar value={search} onChange={(v) => setSearch(v)} placeholder="검색어를 입력하세요" />
          </Section>
          <Section title="DatePicker">
            <DatePicker label="년-월-일" mode="date" value={date} onChange={e => setDate(e.target.value)} />
            <DatePicker label="년-월-일-시-분" mode="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} />
            <DatePicker label="년" mode="year" value={dateYear} onChange={e => setDateYear(e.target.value)} />
            <DatePicker label="년-월" mode="month" value={dateMonth} onChange={e => setDateMonth(e.target.value)} />
          </Section>
          <Section title="ImageUploader">
            <ImageUploader onSelect={(file) => console.log('selected:', file)} />
          </Section>
        </div>
      )}

      {/* ── 액션 탭 */}
      {tab === 1 && (
        <div>
          <Section title="Button — Variants">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline">Outline</Button>
          </Section>
          <Section title="Button — Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Section>
          <Section title="Button — Icon">
            <Button leftIcon={<span>＋</span>}>추가</Button>
            <Button leftIcon={<span>↑</span>} variant="secondary">업로드</Button>
            <Button rightIcon={<span>→</span>} variant="outline">다음</Button>
            <Button rightIcon={<span>↓</span>} variant="ghost">다운로드</Button>
            <Button leftIcon={<span>🔍</span>} rightIcon={<span>✕</span>} variant="secondary">검색 초기화</Button>
            <Button leftIcon={<span>🗑</span>} variant="danger" size="sm">삭제</Button>
            <Button rightIcon={<span>✓</span>} variant="primary" size="lg">저장</Button>
          </Section>
          <Section title="Button — States">
            <Button isLoading>로딩 중</Button>
            <Button disabled>비활성</Button>
            <Button fullWidth>Full Width</Button>
          </Section>
          <Section title="FilterChip">
            {['전체', '공지', '이벤트', '업데이트'].map((label) => (
              <FilterChip
                key={label}
                label={label}
                selected={chips.includes(label)}
                onToggle={(sel) =>
                  setChips(prev => sel ? [...prev, label] : prev.filter(c => c !== label))
                }
              />
            ))}
            <span style={{ fontSize: 12, color: '#9ca3af', alignSelf: 'center' }}>
              선택: {chips.join(', ') || '없음'}
            </span>
          </Section>
          <div style={{ paddingTop: 8, paddingBottom: 8 }}>
            <Section title="BubbleButton — Tail Position">
              <BubbleButton tailPosition="top">Top</BubbleButton>
              <BubbleButton tailPosition="bottom">Bottom</BubbleButton>
              <BubbleButton tailPosition="left">Left</BubbleButton>
              <BubbleButton tailPosition="right">Right</BubbleButton>
            </Section>
            <Section title="BubbleButton — Variants">
              <BubbleButton variant="primary">Primary</BubbleButton>
              <BubbleButton variant="secondary">Secondary</BubbleButton>
              <BubbleButton variant="outline">Outline</BubbleButton>
              <BubbleButton variant="danger">Danger</BubbleButton>
            </Section>
            <Section title="BubbleButton — Sizes">
              <BubbleButton size="sm">Small</BubbleButton>
              <BubbleButton size="md">Medium</BubbleButton>
              <BubbleButton size="lg">Large</BubbleButton>
            </Section>
          </div>
        </div>
      )}

      {/* ── 표시 탭 */}
      {tab === 2 && (
        <div>
          <Section title="Badge">
            <Badge>기본</Badge>
            <Badge variant="success">성공</Badge>
            <Badge variant="warning">경고</Badge>
            <Badge variant="error">오류</Badge>
            <Badge variant="info">정보</Badge>
          </Section>
          <Section title="Card">
            <Card style={{ width: 200, padding: 16 }}>
              <p style={{ fontSize: 14 }}>일반 카드</p>
            </Card>
            <Card style={{ width: 200, padding: 16 }} onClick={() => alert('카드 클릭')}>
              <p style={{ fontSize: 14, cursor: 'pointer' }}>클릭 가능 카드</p>
            </Card>
          </Section>
          <Section title="Spinner">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Section>
          <Section title="Skeleton">
            <div
              onClick={() => setSkelPaused(p => !p)}
              style={{ width: 220, cursor: 'pointer', userSelect: 'none' }}
              title="클릭하여 애니메이션 토글"
            >
              <Skeleton className="h-4 w-full mb-2" paused={skelPaused} />
              <Skeleton className="h-4 w-3/4 mb-2" paused={skelPaused} />
              <Skeleton className="h-4 w-1/2" paused={skelPaused} />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>
                {skelPaused ? '▶ 클릭하여 재생' : '⏸ 클릭하여 정지'}
              </p>
            </div>
          </Section>
          <Section title="Skeleton — Pulse (깜빡임)">
            <div
              onClick={() => setSkelPulsePaused(p => !p)}
              style={{ width: 220, cursor: 'pointer', userSelect: 'none' }}
              title="클릭하여 애니메이션 토글"
            >
              <Skeleton className="h-4 w-full mb-2" variant="pulse" paused={skelPulsePaused} />
              <Skeleton className="h-4 w-3/4 mb-2" variant="pulse" paused={skelPulsePaused} />
              <Skeleton className="h-4 w-1/2" variant="pulse" paused={skelPulsePaused} />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, textAlign: 'center' }}>
                {skelPulsePaused ? '▶ 클릭하여 재생' : '⏸ 클릭하여 정지'}
              </p>
            </div>
          </Section>
          <Section title="EmptyState">
            <EmptyState title="데이터 없음" description="표시할 항목이 없습니다." />
          </Section>
          <Section title="Header">
            <div style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <Header
                title="페이지 제목"
                left={<button onClick={() => {}} style={{ fontSize: 13 }}>← 뒤로</button>}
                right={<Button size="sm">저장</Button>}
              />
            </div>
          </Section>
          <Section title="TabBar">
            <div style={{ width: 400, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
              <TabBar
                tabs={[{ id: 'tab1', label: '탭 1' }, { id: 'tab2', label: '탭 2' }, { id: 'tab3', label: '탭 3' }]}
                activeTab={innerTab}
                onTabChange={setInnerTab}
              />
              <div style={{ padding: 16, fontSize: 14, color: '#6b7280' }}>{innerTab} 내용</div>
            </div>
          </Section>
          <Section title="Table">
            <div style={{ width: '100%' }}>
              <Table columns={TABLE_COLS} data={TABLE_DATA} rowKey="id" onRowClick={(row) => console.log('row:', row)} />
            </div>
          </Section>
        </div>
      )}

      {/* ── 오버레이 탭 */}
      {tab === 3 && (
        <div>
          <Section title="Toast">
            <Button variant="primary"   onClick={() => addToast('성공 메시지입니다', 'success')}>Success</Button>
            <Button variant="danger"    onClick={() => addToast('오류가 발생했습니다', 'error')}>Error</Button>
            <Button variant="secondary" onClick={() => addToast('안내 메시지입니다', 'info')}>Info</Button>
            <Button variant="outline"   onClick={() => addToast('주의가 필요합니다', 'warning')}>Warning</Button>
          </Section>
          <Section title="Modal">
            <Button onClick={() => open('test-modal')}>모달 열기</Button>
            <Modal id="test-modal" title="테스트 모달">
              <p style={{ fontSize: 14, color: '#374151' }}>모달 내용입니다.</p>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="sm" onClick={() => close('test-modal')}>닫기</Button>
              </div>
            </Modal>
          </Section>
          <Section title="ConfirmDialog">
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>삭제 확인</Button>
            <ConfirmDialog
              open={confirmOpen}
              title="정말 삭제하시겠습니까?"
              message="이 작업은 되돌릴 수 없습니다."
              confirmLabel="삭제"
              cancelLabel="취소"
              variant="danger"
              onConfirm={() => { addToast('삭제되었습니다', 'success'); setConfirmOpen(false); }}
              onCancel={() => setConfirmOpen(false)}
            />
          </Section>
          <Section title="Tooltip">
            <Tooltip content="툴팁 내용입니다">
              <Button variant="outline">호버하세요</Button>
            </Tooltip>
          </Section>
          <Section title="BottomSheet">
            <Button onClick={() => setSheetOpen(true)}>BottomSheet 열기</Button>
            <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="바텀시트">
              <p style={{ fontSize: 14, color: '#374151', padding: '8px 0' }}>바텀시트 내용입니다.</p>
              <Button fullWidth onClick={() => setSheetOpen(false)}>닫기</Button>
            </BottomSheet>
          </Section>
        </div>
      )}

      {/* ── 탐색 탭 */}
      {tab === 4 && (
        <div>
          <Section title="Pagination">
            <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
            <span style={{ fontSize: 13, color: '#6b7280', alignSelf: 'center' }}>{page}페이지</span>
          </Section>
          <Section title="Breadcrumb">
            <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '설정', href: '/settings' }, { label: '프로필' }]} />
          </Section>
          <Section title="Stepper">
            <div style={{ width: '100%' }}>
              <Stepper steps={STEPPER_STEPS} currentStep={step} />
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Button size="sm" variant="secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>이전</Button>
                <Button size="sm" onClick={() => setStep(s => Math.min(2, s + 1))} disabled={step === 2}>다음</Button>
              </div>
            </div>
          </Section>
          <Section title="InfiniteScrollTrigger">
            <div style={{ fontSize: 13, color: '#6b7280' }}>스크롤 끝 도달 시 트리거 (hasMore: {String(infiniteMore)})</div>
            <InfiniteScrollTrigger
              hasMore={infiniteMore}
              onTrigger={() => {
                addToast('다음 페이지 로드!', 'info');
                setInfiniteMore(false);
              }}
            />
            {!infiniteMore && (
              <Button size="sm" variant="secondary" onClick={() => setInfiniteMore(true)}>리셋</Button>
            )}
          </Section>
        </div>
      )}
    </div>
  );
}
