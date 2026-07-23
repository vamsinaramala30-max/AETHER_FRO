import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { conversationService } from './conversionservice';
import { ConversationSearch } from './conversationsearch';
import { ConversationList } from './conversationlist';
import type { Conversation } from '../assistant/assistantservice';
import { AssistantPage } from '../assistant/assistantpage';

export const ConversationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        const res = await conversationService.getConversations();
        setConversations(res);
        if (res.length > 0 && !conversationId) {
          navigate(`/ai/conversations/${res[0].id}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistry();
  }, [conversationId, navigate]);

  const handleCreate = async () => {
    const title = prompt('Enter session topic context:');
    if (!title?.trim()) return;
    const fresh = await conversationService.createConversation(title.trim());
    setConversations([fresh, ...conversations]);
    navigate(`/ai/conversations/${fresh.id}`);
  };

  const filtered = conversations.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-full h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Thread Navigation Panel */}
      <div className="w-80 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full bg-white dark:bg-slate-900 shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Context Buffers</h2>
          <button
            onClick={handleCreate}
            className="p-1 rounded-md text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Initialize Context Thread"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <ConversationSearch value={searchTerm} onChange={setSearchTerm} />
        {loading ? (
          <div className="p-6 text-center text-xs text-slate-400 animate-pulse">Syncing catalog...</div>
        ) : (
          <ConversationList
            conversations={filtered}
            activeId={conversationId || ''}
            onSelect={(id) => navigate(`/ai/conversations/${id}`)}
          />
        )}
      </div>

      {/* Main Execution Viewports */}
      <div className="flex-1 h-full relative">
        {conversationId ? (
          <AssistantPage />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <p className="text-xs text-slate-400">No telemetry context selected.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ConversationsPage;