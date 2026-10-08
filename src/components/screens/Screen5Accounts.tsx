import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { ScreenId, AccountItem } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface Screen5AccountsProps {
  accounts: AccountItem[];
  onNavigate: (screen: ScreenId) => void;
  onSelectAccount: (accountId: string) => void;
  onOpenAddModal: () => void;
}

export const Screen5Accounts: React.FC<Screen5AccountsProps> = ({
  accounts,
  onNavigate,
  onSelectAccount,
  onOpenAddModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'social' | 'email' | 'finance'>('all');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    return acc.category === activeCategory;
  });

  const socialCount = accounts.filter((a) => a.category === 'social').length;
  const emailCount = accounts.filter((a) => a.category === 'email').length;
  const financeCount = accounts.filter((a) => a.category === 'finance').length;

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-3 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-base font-bold text-white tracking-tight">Mes comptes</h2>

          <div className="w-9 flex justify-end">
            <span className="text-xs text-slate-400 font-mono font-medium">{accounts.length}</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un compte..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Tous ({accounts.length})
          </button>
          <button
            onClick={() => setActiveCategory('social')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              activeCategory === 'social'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Réseaux sociaux ({socialCount})
          </button>
          <button
            onClick={() => setActiveCategory('email')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              activeCategory === 'email'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Email ({emailCount})
          </button>
          <button
            onClick={() => setActiveCategory('finance')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              activeCategory === 'finance'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            Finance ({financeCount})
          </button>
        </div>

        {/* Accounts List */}
        <div className="space-y-2 pt-1">
          {filteredAccounts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Aucun compte ne correspond à votre recherche.
            </div>
          ) : (
            filteredAccounts.map((account) => (
              <div
                key={account.id}
                onClick={() => {
                  onSelectAccount(account.id);
                  onNavigate('account-detail');
                }}
                className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BrandIcon name={account.name} size={36} className="rounded-xl shadow-sm" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">{account.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{account.handle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Badges */}
                  <div className="flex items-center gap-1">
                    {account.passkeyActive && (
                      <span className="text-[10px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                        Passkey
                      </span>
                    )}
                    {account.totpActive && (
                      <span className="text-[10px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                        TOTP
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Account Button */}
        <div className="pt-2">
          <button
            onClick={onOpenAddModal}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Ajouter un compte</span>
          </button>
        </div>
      </div>
    </div>
  );
};
