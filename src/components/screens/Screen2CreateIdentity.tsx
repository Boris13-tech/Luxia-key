import React from 'react';
import { Key, Smartphone, ShieldCheck, Lock, ChevronLeft, ArrowRight, ScanFace } from 'lucide-react';
import { ScreenId } from '../../types';

interface Screen2CreateIdentityProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen2CreateIdentity: React.FC<Screen2CreateIdentityProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-6 py-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('splash')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold tracking-tight text-white font-['Space_Grotesk']">LUXIA</span>
            <span className="text-lg font-bold tracking-tight text-cyan-400 font-['Space_Grotesk']">Key</span>
          </div>

          <div className="w-9"></div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white leading-tight mb-1">
            Créez votre identité sécurisée
          </h2>
          <p className="text-xs text-slate-400">
            et reprenez le contrôle.
          </p>
        </div>

        {/* Central Graphic Element */}
        <div className="relative w-full max-w-[280px] mx-auto h-40 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
          
          {/* Glass Phone Mockup Silhouette */}
          <div className="relative w-32 h-36 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-cyan-500/40 shadow-xl flex flex-col items-center justify-center p-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="w-16 h-1.5 rounded-full bg-slate-700 mb-1"></div>
            <div className="w-10 h-1 rounded-full bg-cyan-400/60"></div>
          </div>

          {/* Floating Orbiting Glyphs */}
          <div className="absolute -left-2 top-6 w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-md flex items-center justify-center text-cyan-300 animate-bounce duration-1000">
            <Key className="w-5 h-5" />
          </div>

          <div className="absolute -right-2 bottom-6 w-11 h-11 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-md flex items-center justify-center text-sky-300">
            <ScanFace className="w-5 h-5" />
          </div>
        </div>

        {/* 4 Feature Items */}
        <div className="space-y-2.5 max-w-sm mx-auto">
          {/* Item 1 */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3.5 hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-semibold text-white">Connexion sans mot de passe</h4>
              <p className="text-[11px] text-slate-400">Passkeys et biométrie</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3.5 hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-semibold text-white">Protection multi-appareils</h4>
              <p className="text-[11px] text-slate-400">Téléphone, ordinateur, tablette</p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3.5 hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-semibold text-white">Récupération sécurisée</h4>
              <p className="text-[11px] text-slate-400">Ne perdez jamais vos comptes</p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-3.5 hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-semibold text-white">Confidentialité par défaut</h4>
              <p className="text-[11px] text-slate-400">Vos données vous appartiennent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 pb-2">
        <button
          onClick={() => onNavigate('initial-config')}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <span>Créer mon identité</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
