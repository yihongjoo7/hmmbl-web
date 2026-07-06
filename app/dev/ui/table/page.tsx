import { Table } from '@/components/common/ui/display/Table';

const columns = [
  { key: 'id', header: 'ID', width: '80px' },
  { key: 'name', header: '이름' },
  { key: 'status', header: '상태', align: 'center' as const },
];
const data = [
  { id: '1', name: '홍길동', status: 'active' },
  { id: '2', name: '김철수', status: 'inactive' },
];

export default function TableDevPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Table</h1>
      <Table columns={columns} data={data} rowKey="id" />
    </div>
  );
}
