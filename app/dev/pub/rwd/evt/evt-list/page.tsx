'use client';
import {
  CustomBottomModal,
  CustomBottomModalButtonOneToTwo,
  CustomButton,
  CustomCheckboxGroup,
  CustomTabs,
  EmptyState,
  EventListCard,
} from '@/components/common/ui';
import type { Checkbox, GetProp } from 'antd';
import { useState } from 'react';

type CheckboxValueType = string | number;
const tabItems = [
  { key: 'tab1', label: '전체', value: '1', index: 0, children: null },
  { key: 'tab2', label: 'H.point', value: '2', index: 1, children: null },
  { key: 'tab3', label: '관심스토어', value: '3', index: 2, children: null },
  { key: 'tab4', label: '백화점아울렛', value: '4', index: 3, children: null },
  { key: 'tab5', label: '제휴사', value: '5', index: 4, children: null },
  { key: 'tab6', label: '커피', value: '6', index: 5, children: null },
  { key: 'tab7', label: '주차', value: '7', index: 6, children: null },
  { key: 'tab8', label: '설날', value: '8', index: 7, children: null },
];

// 카테고리
const cateOptions = [
  { label: '관심 스토어 전체', value: 'all' },
  { label: '현대백화점 압구정본점바나나', value: 'apkujung' },
  { label: '현대백화점 무역센터점', value: 'muyuk', disabled: true },
  { label: '더현대서울', value: 'seoul1' },
  { label: '더현대서울1', value: 'seoul2' },
  { label: '더현대서울2', value: 'seoul3' },
  { label: '더현대서울3', value: 'seou4l' },
  { label: '더현대서울4', value: 'seoul5' },
  { label: '더현대서울5', value: 'seoul6' },
  { label: '더현대서울6', value: 'seoul7' },
  { label: '더현대서울7', value: 'seou8l' },
];

// 관심지점
const likeStoreOptions = [
  { label: '관심 스토어 전체', value: 'all' },
  { label: '현대백화점 압구정본점바나나', value: 'apkujung' },
  { label: '현대백화점 무역센터점', value: 'muyuk', disabled: true },
  { label: '더현대서울', value: 'seoul1' },
  { label: '더현대서울1', value: 'seoul2' },
  { label: '더현대서울2', value: 'seoul3' },
  { label: '더현대서울3', value: 'seou4l' },
  { label: '더현대서울4', value: 'seoul5' },
  { label: '더현대서울5', value: 'seoul6' },
  { label: '더현대서울6', value: 'seoul7' },
  { label: '더현대서울7', value: 'seou8l' },
];

// 지점
const storeOptions = [
  { label: '관심 스토어 전체', value: 'all' },
  { label: '현대백화점 압구정본점바나나', value: 'apkujung' },
  { label: '현대백화점 무역센터점', value: 'muyuk', disabled: true },
  { label: '더현대서울', value: 'seoul1' },
  { label: '더현대서울1', value: 'seoul2' },
  { label: '더현대서울2', value: 'seoul3' },
  { label: '더현대서울3', value: 'seou4l' },
  { label: '더현대서울4', value: 'seoul5' },
  { label: '더현대서울5', value: 'seoul6' },
  { label: '더현대서울6', value: 'seoul7' },
  { label: '더현대서울7', value: 'seou8l' },
];

export default function EventPage() {
  const [visible1, setVisible1] = useState(false); //카테고리 팝업
  const [selectedCate, setSelectedCate] = useState<CheckboxValueType[]>([]);

  const [visible2, setVisible2] = useState(false); //관심스토어 팝업
  const [selectedLikeStore, setSelectedLikeStore] = useState<CheckboxValueType[]>([]);

  const [visible3, setVisible3] = useState(false); //지점 팝업
  const [selectedStore, setSelectedStore] = useState<CheckboxValueType[]>([]);

  const handleClick = () => console.log('클릭');
  const handleTabScroll = (info: { direction: 'left' | 'right' | 'top' | 'bottom' }) => {
    console.log('현재 스크롤 방향:', info.direction);

    if (info.direction === 'right') {
    }
  };
  return (
    <div className="pt-4 px-6 bg-white">
      {/* tab */}
      <CustomTabs items={tabItems} defaultActiveKey="home" />

      {/* filter */}
      <div></div>

      {/* list top */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-title-s text-font-500">
          총<span className="text-primary-700 font-bold">26</span>개
        </p>
        <div className="flex items-center gap-2">
          <CustomButton
            variant="text"
            size="md"
            rightIcon="ic_arrow_down_solid_12"
            onClick={() => setVisible3(true)}
          >
            지점
          </CustomButton>
          <CustomButton
            variant="text"
            size="md"
            rightIcon="ic_arrow_down_solid_12"
            onClick={() => setVisible2(true)}
          >
            관심스토어
          </CustomButton>
          <CustomButton
            variant="text"
            size="md"
            rightIcon="ic_arrow_down_solid_12"
            onClick={() => setVisible1(true)}
          >
            추천순
          </CustomButton>
        </div>
      </div>

      {/* list */}
      <div className="flex flex-col gap-3">
        <EventListCard />
        <EventListCard />
        <EmptyState
          imageSrc="icon_map.svg"
          title="설정된 관심 스토어가 없어요"
          description={
            <>
              관심 스토어를 설정하면
              <br />
              관심 스토어 혜택을 모아볼 수 있어요.
            </>
          }
          buttonText="관심 스토어 설정하기"
          onButtonClick={handleClick}
        />
        <EmptyState imageSrc="ic_info_32.svg" title="진행중인 이벤트가 없어요" />
      </div>

      {/* 카테고리 팝업 */}
      {visible1 && (
        <CustomBottomModal
          visible={visible1}
          closeOnSwipe
          buttons={{
            text: '확인',
            variant: 'primary',
          }}
          onClose={() => setVisible1(false)}
          onMaskClick={() => setVisible1(false)}
          title="카테고리"
        >
          <div className="overflow-y-auto max-h-[168px]">
            <CustomCheckboxGroup
              options={cateOptions}
              value={selectedCate}
              onChange={(vals) => setSelectedCate(vals as CheckboxValueType[])}
              size="md"
              vertical
              className="!flex !flex-col !gap-y-4"
            />
          </div>
        </CustomBottomModal>
      )}

      {/* 관심스토어 팝업 */}
      {visible2 && (
        <CustomBottomModalButtonOneToTwo
          visible={visible2}
          closeOnSwipe
          buttons={{
            text1: '초기화',
            text2: '확인',
            button1_variant: 'default',
            button2_variant: 'primary',
            onClick1: () => setSelectedLikeStore([]),
            onClick2: () => setVisible2(false),
            button1_icon: 'ic_reset_20',
          }}
          onClose={() => setVisible2(false)}
          onMaskClick={() => setVisible2(false)}
          title="관심스토어"
          headerAction={
            <CustomButton variant="default" size="sm">
              관심스토어 설정
            </CustomButton>
          }
        >
          {/* 관심 지점 리스트 */}
          <div className="overflow-y-auto max-h-[168px]">
            <CustomCheckboxGroup
              options={likeStoreOptions}
              value={selectedLikeStore}
              onChange={(vals) => setSelectedLikeStore(vals as CheckboxValueType[])}
              size="md"
              vertical
              className="!flex !flex-col !gap-y-4"
            />
          </div>

          {/* 선택한 관심 지점 리스트 */}
          {selectedLikeStore.length > 0 && (
            <div className="overflow-x-auto flex items-center gap-2 p-2 border-t border-t-outline-200 mt-2 whitespace-nowrap">
              {selectedLikeStore.map((storeValue) => {
                // likeStoreOptions에서 현재 값에 해당하는 레이블 찾기
                const store = likeStoreOptions.find((opt) => opt.value === storeValue);
                if (!store || store.value === 'all') return null;

                return (
                  <CustomButton
                    key={storeValue}
                    variant="text"
                    size="sm"
                    rightIcon="ic_del_12"
                    className="px-0 gap-0 !text-primary-700 shrink-0"
                    onClick={() => {
                      setSelectedLikeStore(selectedLikeStore.filter((item) => item !== storeValue));
                    }}
                  >
                    {store.label}
                  </CustomButton>
                );
              })}
            </div>
          )}
        </CustomBottomModalButtonOneToTwo>
      )}

      {/* 지점 팝업 */}
      {visible3 && (
        <CustomBottomModalButtonOneToTwo
          visible={visible3}
          closeOnSwipe
          buttons={{
            text1: '초기화',
            text2: '확인',
            button1_variant: 'default',
            button2_variant: 'primary',
            onClick1: () => setSelectedStore([]),
            onClick2: () => setVisible3(false),
            button1_icon: 'ic_reset_20',
          }}
          onClose={() => setVisible3(false)}
          onMaskClick={() => setVisible3(false)}
          title="지점"
        >
          {/* 스토어 지점 리스트 */}
          <div className="overflow-y-auto max-h-[168px]">
            <CustomCheckboxGroup
              options={storeOptions}
              value={selectedStore}
              onChange={(vals) => setSelectedStore(vals as CheckboxValueType[])}
              size="md"
              vertical
              className="!flex !flex-col !gap-y-4"
            />
          </div>

          {/* 선택한 스토어 지점 리스트 */}
          {selectedStore.length > 0 && (
            <div className="overflow-x-auto flex items-center gap-2 p-2 border-t border-t-outline-200 mt-2 whitespace-nowrap">
              {selectedStore.map((storeValue) => {
                // storeOptions에서 현재 값에 해당하는 레이블 찾기
                const store = storeOptions.find((opt) => opt.value === storeValue);
                if (!store || store.value === 'all') return null;

                return (
                  <CustomButton
                    key={storeValue}
                    variant="text"
                    size="sm"
                    rightIcon="ic_del_12"
                    className="px-0 gap-0 !text-primary-700 shrink-0"
                    onClick={() => {
                      setSelectedStore(selectedStore.filter((item) => item !== storeValue));
                    }}
                  >
                    {store.label}
                  </CustomButton>
                );
              })}
            </div>
          )}
        </CustomBottomModalButtonOneToTwo>
      )}
    </div>
  );
}
