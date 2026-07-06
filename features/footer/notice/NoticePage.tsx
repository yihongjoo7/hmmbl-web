'use client';
import { useNotice } from '../hooks/useNotice';
import { NoticeView } from '../components/NoticeView/NoticeView';
export default function NoticePage() { const { notices, isLoading } = useNotice(); return <NoticeView notices={notices} isLoading={isLoading} />; }
