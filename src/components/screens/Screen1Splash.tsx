import React from 'react';
import { Shield, KeyRound, Sparkles, ArrowRight } from 'lucide-react';
import { ScreenId } from '../../types';

interface Screen1SplashProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Screen1Splash: React.FC<Screen1SplashProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-hidden bg-slate-950 text-white select-none">
      {/* Background Graphic & Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 inset-x-0 h-3/5 bg-gradient-to-b from-slate-900 via-slate-950/90 to-slate-950 z-10"></div>
        {/* Visual Hero Illustration / Photography Representation */}
        <div className="w-full h-3/5 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.35),transparent_60%)]"></div>
          
          {/* Conceptual Tech Portrait Art */}
          <div className="relative w-full h-full flex items-center justify-center pt-8">
            <div className="relative w-64 h-72 rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-900/30 flex items-center justify-center bg-gradient-to-tr from-slate-900/90 via-slate-800/80 to-cyan-950/70 backdrop-blur-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-md"></div>
              
              {/* Central Glowing Key / Persona Graphic */}
              <div className="relative flex flex-col items-center z-10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-b from-cyan-500/30 to-blue-700/20 border border-cyan-400/40 flex items-center justify-center mb-3 shadow-inner">
                  <Shield className="w-12 h-12 text-cyan-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[11px] text-cyan-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Enclave Cryptographique</span>
                </div>
              </div>

              {/* Hologram Grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="relative z-10 pt-4"></div>

      {/* Bottom Content Card */}
      <div className="relative z-20 px-6 pb-10 flex flex-col items-center text-center">
        {/* Brand Title */}
        <div className="flex items-baseline justify-center gap-1.5 mb-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">
            LUXIA
          </h1>
          <span className="text-3xl font-bold tracking-tight text-cyan-400 font-['Space_Grotesk']">
            Key
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium text-slate-300 leading-snug max-w-xs mb-8">
          Votre identité. Vos comptes.<br />
          Votre vie numérique. Partout en sécurité.
        </p>

        {/* Central Shield Icon Badge */}
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-8">
          <KeyRound className="w-8 h-8 text-cyan-400" />
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => onNavigate('create-identity')}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Commencer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full py-3 px-6 rounded-2xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white font-medium text-xs active:scale-[0.98] transition-all"
          >
            J'ai déjà un compte
          </button>
        </div>
      </div>
    </div>
  );
};
