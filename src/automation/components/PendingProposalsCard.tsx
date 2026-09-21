import React, { useEffect, useState } from 'react';
import { Sparkles, Check, X, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ruleEngine } from '../engine/RuleEngine';
import { Patch } from '../engine/types';

export const PendingProposalsCard: React.FC = () => {
  const [proposals, setProposals] = useState<Patch[]>(ruleEngine.getState().pendingProposals);

  useEffect(() => {
    return ruleEngine.subscribe((state) => {
      setProposals(state.pendingProposals);
    });
  }, []);

  if (proposals.length === 0) return null;

  return (
    <div className="space-y-3">
      {proposals.map((proposal) => (
        <div
          key={proposal.id}
          className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 shadow-sm animate-in fade-in duration-300 dark:border-amber-500/30"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/20">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Schedule Rebuild Proposal
                  </span>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-700 dark:text-amber-300">
                    REQUIRES ACCEPTANCE
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{proposal.description}</h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{proposal.reason}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => ruleEngine.rejectProposal(proposal.id)}
                className="h-9 border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 font-bold"
              >
                <X className="mr-1.5 h-4 w-4 text-rose-500" /> Reject / Keep Missed
              </Button>

              <Button
                size="sm"
                onClick={() => ruleEngine.acceptProposal(proposal.id)}
                className="h-9 bg-amber-500 text-white hover:bg-amber-600 font-bold shadow-md shadow-amber-500/20"
              >
                <Check className="mr-1.5 h-4 w-4" /> Accept Schedule Patch
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
