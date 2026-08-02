import React, { useState, useEffect } from 'react';
import { memoryService, MemoryItem } from './memoryservice';
import { MemoryCard } from './memorycard';
import { MemoryFilters } from './memoryfilters';
import { MemorySearch } from './memorysearch';
import { PageWrapper } from '@/components/layout/PageWrapper';

export const MemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncState = async () => {
      const data = await memoryService.getMemories();
      setMemories(data);
      setLoading(false);
    };
    syncState();
  }, []);

  const handlePrune = async (id: string) => {
    await memoryService.deleteMemory(id);
    setMemories(memories.filter((m) => m.id !== id));
  };

  const matched = memories.filter((m) => {
    const textMatch =
      m.content.toLowerCase().includes(search.toLowerCase()) ||
      m.associatedTokens.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const catMatch = category === 'all' || m.category === category;
    return textMatch && catMatch;
  });

  return (
    <PageWrapper>
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Agent Memory Matrix
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Inspecting vector weights and structured relational items embedded during chat
            execution.
          </p>
        </div>
        <MemorySearch value={search} onChange={setSearch} />
      </div>

      <MemoryFilters selectedCategory={category} onSelectCategory={setCategory} />

      {loading ? (
        <div className="grid animate-pulse grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : matched.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs text-slate-400">
            No active context vectors match search thresholds.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matched.map((m) => (
            <MemoryCard key={m.id} memory={m} onPrune={handlePrune} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
};
export default MemoryPage;
