import React from 'react';
import { Home, LayoutGrid, Scan, Clock, ShieldCheck } from 'lucide-react';
import { ScreenId } from '../../types';

interface BottomNavBarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  hasActivityAlert?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  hasActivityAlert = false,
}) => {
  const isHome = currentScreen === 'dashboard';
  const isAccounts = currentScreen === 'accounts' || currentScreen === 'account-detail';
  const isActivity = currentScreen === 'activity';
  const isSecurity = currentScreen === 'security' || currentScreen === 'lockdown' || currentScreen === 'recovery';

  return (
    <div className="w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-4 pt-2 pb-6 flex items-center justify-around relative z-30 shrink-0">
      {/* 1. Accueil */}
      <button
        onClick={() => onNavigate('dashboard')}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all active:scale-95 ${
          isHome ? 'text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          {isHome && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"></span>
          )}
        </div>
        <span className="text-[11px] mt-1 tracking-tight">Accueil</span>
      </button>

      {/* 2. Comptes */}
      <button
        onClick={() => onNavigate('accounts')}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all active:scale-95 ${
          isAccounts ? 'text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <LayoutGrid className={`w-5 h-5 ${isAccounts ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          {isAccounts && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"></span>
          )}
        </div>
        <span className="text-[11px] mt-1 tracking-tight">Comptes</span>
      </button>

      {/* 3. Floating Scanner Center Button */}
      <div className="-mt-6 flex flex-col items-center justify-center">
        <button
          onClick={() => onNavigate('scanner')}
          aria-label="Scanner un code QR"
          className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-cyan-300/40"
        >
          <div className="w-full h-full rounded-[14px] bg-slate-950/30 flex items-center justify-center text-white">
            <Scan className="w-6 h-6 stroke-[2.5px]" />
          </div>
        </button>
      </div>

      {/* 4. Activité */}
      <button
        onClick={() => onNavigate('activity')}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all active:scale-95 ${
          isActivity ? 'text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Clock className={`w-5 h-5 ${isActivity ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          {hasActivityAlert && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-slate-900 animate-pulse"></span>
          )}
          {isActivity && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"></span>
          )}
        </div>
        <span className="text-[11px] mt-1 tracking-tight">Activité</span>
      </button>

      {/* 5. Sécurité */}
      <button
        onClick={() => onNavigate('security')}
        className={`flex flex-col items-center justify-center min-w-[56px] py-1 transition-all active:scale-95 ${
          isSecurity ? 'text-cyan-400 font-medium' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <ShieldCheck className={`w-5 h-5 ${isSecurity ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
          {isSecurity && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"></span>
          )}
        </div>
        <span className="text-[11px] mt-1 tracking-tight">Sécurité</span>
      </button>
    </div>
  );
};
