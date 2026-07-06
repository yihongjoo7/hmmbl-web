'use client';
import { Input } from '@/components/common/ui/input/Input';
import { Textarea } from '@/components/common/ui/input/Textarea';
import { Select } from '@/components/common/ui/input/Select';
import { Toggle } from '@/components/common/ui/input/Toggle';
import { SearchBar } from '@/components/common/ui/input/SearchBar';
import { useState } from 'react';

export default function InputDevPage() {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="flex flex-col gap-8 max-w-md">
      <h1 className="text-xl font-bold">Input Components</h1>
      <Input label="기본 입력" placeholder="입력하세요" />
      <Input label="에러 상태" placeholder="입력하세요" error="필수 항목입니다" />
      <Textarea label="텍스트에어리어" placeholder="내용을 입력하세요" />
      <Select label="선택" options={[{value:'a',label:'옵션 A'},{value:'b',label:'옵션 B'}]} placeholder="선택하세요" />
      <Toggle checked={toggle} onChange={setToggle} label={toggle ? '켜짐' : '꺼짐'} />
      <SearchBar onSearch={v => console.log('검색:', v)} />
    </div>
  );
}
