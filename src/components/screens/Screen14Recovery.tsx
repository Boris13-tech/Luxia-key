import React from 'react';
import { ChevronLeft, ChevronRight, ShieldCheck, Smartphone, Users, Laptop, KeyRound, Clock, AlertTriangle } from 'lucide-react';
import { ScreenId } from '../../types';

interface Screen14RecoveryProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenRecoveryCodesModal: () => void;
}

export const Screen14Recovery: React.FC<Screen14RecoveryProps> = ({
  onNavigate,
  onOpenRecoveryCodesModal,
}) => {
  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-3.5 pb-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('security')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-tight">Récupération de compte</h2>
          <div className="w-9"></div>
        </div>

        {/* Status Callout Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Récupération sécurisée</h4>
            <p className="text-[11px] text-slate-300">Ne perdez jamais accès à vos comptes.</p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-2 pt-1">
          {/* 1. Nouvel appareil */}
          <div
            onClick={() => alert("Assistant d'enrôlement de nouvel appareil ouvert.")}
            className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Nouvel appareil</h4>
                <p className="text-[11px] text-slate-400">Configurer un nouveau téléphone</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 2. Contact de confiance */}
          <div
            onClick={() => alert("Contacts de confiance : Sarah (Sœur) et Alex (Partenaire) activés.")}
            className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Contact de confiance</h4>
                <p className="text-[11px] text-slate-400">2 contacts configurés</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 3. Appareil de secours */}
          <div
            onClick={() => alert("Appareil de secours : MacBook Pro M3 enregistré comme clé de repli.")}
            className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Appareil de secours</h4>
                <p className="text-[11px] text-slate-400">1 appareil configuré</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 4. Codes de récupération */}
          <div
            onClick={onOpenRecoveryCodesModal}
            className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Codes de récupération</h4>
                <p className="text-[11px] text-slate-400">10 codes générés</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 5. Délai de sécurité */}
          <div
            onClick={() => alert("Délai de sécurité 48h : protège vos comptes contre les prises de contrôle soudaines.")}
            className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Délai de sécurité</h4>
                <p className="text-[11px] text-slate-400">48 heures pour les changements</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 6. Récupération d'urgence */}
          <div
            onClick={() => alert("Protocole de récupération d'urgence par consensus social initiable.")}
            className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Récupération d'urgence</h4>
                <p className="text-[11px] text-slate-400">Procédure en cas de perte totale</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-2">
        <button
          onClick={() => alert("Protocole de récupération assistée par clé cryptographique démarré.")}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 active:scale-[0.98] transition-all"
        >
          Démarrer une récupération
        </button>
      </div>
    </div>
  );
};
