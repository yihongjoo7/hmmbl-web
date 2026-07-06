'use client';
/** [개발자] 통합검색 Container */
import { useSearch } from './hooks/useSearch';
import { SearchView } from './components/SearchView/SearchView';

export default function SearchPage() {
  const { query, setQuery, results, isLoading } = useSearch();
  return <SearchView query={query} onQueryChange={setQuery} results={results} isLoading={isLoading} />;
}
