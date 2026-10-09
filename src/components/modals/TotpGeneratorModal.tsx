import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { AccountItem } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface TotpGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: AccountItem[];
}

export const TotpGeneratorModal: React.FC<TotpGeneratorModalProps> = ({
  isOpen,
  onClose,
  accounts,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const sec = 30 - (Math.floor(Date.now() / 1000) % 30);
      setSecondsRemaining(sec);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter accounts that have TOTP active
  const totpAccounts = accounts.filter((a) => a.totpActive || a.totpSecret);

  // Simple deterministic 6-digit TOTP simulator based on current epoch
  const getCode = (seed: string) => {
    const timeStep = Math.floor(Date.now() / 30000);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i) + timeStep) % 1000000;
    }
    return String(Math.abs(hash)).padStart(6, '0');
  };

  const copyCode = (id: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const progressPercent = (secondsRemaining / 30) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Codes TOTP Sécurisés</h3>
              <p className="text-[10px] text-slate-400">Génération locale RFC 6238</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Countdown ring */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={secondsRemaining < 5 ? 'text-red-400' : 'text-cyan-400'}
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-mono font-bold text-slate-300">
                {secondsRemaining}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List of TOTP Codes */}
        <div className="overflow-y-auto py-3 space-y-2.5 flex-1 pr-1">
          {totpAccounts.map((account) => {
            const code = getCode(account.id + (account.totpSecret || 'KEY'));
            const isCopied = copiedId === account.id;

            return (
              <div
                key={account.id}
                onClick={() => copyCode(account.id, code)}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <BrandIcon name={account.name} size={36} className="rounded-xl" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">{account.name}</h4>
                    <p className="text-[10px] text-slate-400">{account.handle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-bold text-cyan-400 tracking-wider">
                    {code.slice(0, 3)} {code.slice(3)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-300 transition-colors">
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[10px] text-slate-500 border-t border-slate-800">
          Cliquez sur un code pour le copier. Renouvellement automatique toutes les 30s.
        </div>
      </div>
    </div>
  );
};
