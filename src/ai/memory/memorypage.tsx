import React, { useState, useEffect } from 'react';
import { memoryService, MemoryItem } from './memoryService';
import { MemoryCard } from './MemoryCard';
import { MemoryFilters } from './MemoryFilters';
import { MemorySearch } from './MemorySearch';

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
    setMemories(memories.filter(m => m.id !== id));
  };

  const matched = memories.filter(m => {
    const textMatch = m.content.toLowerCase().includes(search.toLowerCase()) || m.associatedTokens.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const catMatch = category === 'all' || m.category === category;
    return textMatch && catMatch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Agent Memory Matrix</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inspecting vector weights and structured relational items embedded during chat execution.
          </p>
        </div>
        <MemorySearch value={search} onChange={setSearch} />
      </div>

      <MemoryFilters selectedCategory={category} onSelectCategory={setCategory} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map(n => <div key={n} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />)}
        </div>
      ) : matched.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">No active context vectors match search thresholds.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matched.map(m => (
            <MemoryCard key={m.id} memory={m} onPrune={handlePrune} />
          ))}
        </div>
      )}
    </div>
  );
};
export default MemoryPage;