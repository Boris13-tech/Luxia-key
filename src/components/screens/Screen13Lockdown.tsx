import React from 'react';
import { ChevronLeft, ShieldAlert, Check, Lock, Unlock, AlertCircle } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';

interface Screen13LockdownProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onToggleLockdown: () => void;
}

export const Screen13Lockdown: React.FC<Screen13LockdownProps> = ({
  user,
  onNavigate,
  onToggleLockdown,
}) => {
  const isLocked = user.isLockedDown;

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-6 py-4">
      <div className="space-y-4 pb-4">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('security')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-white tracking-tight">Verrouillage d'identité</h2>
          <div className="w-9"></div>
        </div>

        {/* Giant Glowing Shield Icon */}
        <div className="pt-2 flex flex-col items-center text-center">
          <div className={`relative w-28 h-28 rounded-3xl flex items-center justify-center mb-4 transition-all ${
            isLocked
              ? 'bg-red-600/30 border-2 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]'
              : 'bg-red-950/60 border border-red-500/40 shadow-xl shadow-red-950/50'
          }`}>
            <div className="absolute inset-0 rounded-3xl bg-red-500/10 animate-ping"></div>
            {isLocked ? (
              <Lock className="w-14 h-14 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            ) : (
              <ShieldAlert className="w-14 h-14 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
            )}
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight mb-2">
            {isLocked ? "Identité Actuellement Verrouillée" : "Verrouiller mon identité"}
          </h3>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
            {isLocked
              ? "Toutes les connexions et actions sensibles sont actuellement suspendues pour protéger vos comptes."
              : "Bloquez rapidement toutes les nouvelles connexions, appareils et modifications sensibles sur vos comptes compatibles."
            }
          </p>
        </div>

        {/* Protection Checklist */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Nouvelles connexions</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Nouveaux appareils</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Réinitialisation d'email / téléphone</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Actions sensibles de mot de passe</span>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-200">
            <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>Comptes sensibles</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Button & Learn More */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onToggleLockdown}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all ${
            isLocked
              ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950'
          }`}
        >
          {isLocked ? (
            <>
              <Unlock className="w-4 h-4" />
              <span>Désactiver le verrouillage</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Activer le verrouillage</span>
            </>
          )}
        </button>

        <div className="text-center">
          <button
            onClick={() => alert("Le mode Verrouillage d'urgence révoque instantanément les jetons OAuth et suspend les Passkeys non authentifiées sur le matériel local.")}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
};
