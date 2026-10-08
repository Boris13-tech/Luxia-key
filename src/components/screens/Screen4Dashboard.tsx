import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Bell,
  CheckCircle2,
  ChevronRight,
  X,
  Check,
  Grid,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { ScreenId, AccountItem, AuthRequestData, UserProfile } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface Screen4DashboardProps {
  user: UserProfile;
  accounts: AccountItem[];
  pendingAuth: AuthRequestData | null;
  onNavigate: (screen: ScreenId) => void;
  onSelectAccount: (accountId: string) => void;
  onQuickApproveAuth: () => void;
  onQuickBlockAuth: () => void;
}

const ACTIVITY_DATA = [
  { day: 'J-6', auths: 14, blocked: 0, date: '02 Oct' },
  { day: 'J-5', auths: 19, blocked: 1, date: '03 Oct' },
  { day: 'J-4', auths: 12, blocked: 0, date: '04 Oct' },
  { day: 'J-3', auths: 24, blocked: 2, date: '05 Oct' },
  { day: 'J-2', auths: 28, blocked: 1, date: '06 Oct' },
  { day: 'Hier', auths: 22, blocked: 3, date: '07 Oct' },
  { day: 'Auj.', auths: 31, blocked: 1, date: '08 Oct' },
];

export const Screen4Dashboard: React.FC<Screen4DashboardProps> = ({
  user,
  accounts,
  pendingAuth,
  onNavigate,
  onSelectAccount,
  onQuickApproveAuth,
  onQuickBlockAuth,
}) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'auths' | 'blocked'>('all');

  const totalAuths = ACTIVITY_DATA.reduce((acc, curr) => acc + curr.auths, 0);
  const totalBlocked = ACTIVITY_DATA.reduce((acc, curr) => acc + curr.blocked, 0);

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      {/* Scrollable Content Container */}
      <div className="space-y-4 pb-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold tracking-tight text-white font-['Space_Grotesk']">LUXIA</span>
            <span className="text-xl font-bold tracking-tight text-cyan-400 font-['Space_Grotesk']">Key</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* User Avatar with Profile Jump */}
            <button
              onClick={() => onNavigate('identity')}
              className="relative p-0.5 rounded-full border border-cyan-500/40 hover:border-cyan-400 transition-colors group"
              title="Mon profil et identité"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center font-bold text-xs text-cyan-200">
                BL
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
            </button>

            {/* Score Ring / Pill */}
            <div className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums">96<span className="text-[10px] text-emerald-500/80 font-normal">/100</span></span>
            </div>
          </div>
        </div>

        {/* Greeting Section */}
        <div className="text-left pt-1">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
            Bonjour Boris <span className="animate-wiggle">👋</span>
          </h2>
          <p className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
            {user.isLockedDown ? (
              <span className="text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                Mode Verrouillage Activé (Protection Maximale)
              </span>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Votre identité est protégée
              </>
            )}
          </p>
        </div>

        {/* 4 Stat Counters */}
        <div className="grid grid-cols-4 gap-2">
          {/* 1. Comptes */}
          <button
            onClick={() => onNavigate('accounts')}
            className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors flex flex-col items-center justify-center text-center active:scale-95"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-950/80 text-cyan-400 flex items-center justify-center mb-1">
              <Grid className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white font-mono tabular-nums">{accounts.length}</span>
            <span className="text-[10px] text-slate-400">Comptes</span>
          </button>

          {/* 2. Appareils */}
          <button
            onClick={() => onNavigate('devices')}
            className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-sky-500/40 transition-colors flex flex-col items-center justify-center text-center active:scale-95"
          >
            <div className="w-6 h-6 rounded-lg bg-sky-950/80 text-sky-400 flex items-center justify-center mb-1">
              <Smartphone className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white font-mono tabular-nums">3</span>
            <span className="text-[10px] text-slate-400">Appareils</span>
          </button>

          {/* 3. Alerte */}
          <button
            onClick={() => onNavigate(pendingAuth ? 'auth-request' : 'activity')}
            className={`p-2.5 rounded-2xl transition-colors flex flex-col items-center justify-center text-center active:scale-95 border ${
              pendingAuth
                ? 'bg-red-950/40 border-red-500/50 hover:border-red-400'
                : 'bg-slate-900/60 border-slate-800/80'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1 ${
              pendingAuth ? 'bg-red-900/80 text-red-400' : 'bg-slate-800 text-slate-400'
            }`}>
              <Bell className="w-3.5 h-3.5" />
            </div>
            <span className={`text-sm font-bold font-mono tabular-nums ${pendingAuth ? 'text-red-400' : 'text-slate-300'}`}>
              {pendingAuth ? '1' : '0'}
            </span>
            <span className="text-[10px] text-slate-400">Alerte</span>
          </button>

          {/* 4. Score sécu */}
          <button
            onClick={() => onNavigate('security')}
            className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors flex flex-col items-center justify-center text-center active:scale-95"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">96</span>
            <span className="text-[10px] text-slate-400">Score</span>
          </button>
        </div>

        {/* Status Card: Tout est sous contrôle */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Tout est sous contrôle</h4>
            <p className="text-[11px] text-slate-300">Aucune activité critique détectée.</p>
          </div>
        </div>

        {/* VISUALISATION RECHARTS: COURBE D'ACTIVITÉ SÉCURISÉE SUR LES 7 DERNIERS JOURS */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg space-y-3">
          {/* Card Header with Metrics */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Activité sécurisée (7 jours)</h3>
                <p className="text-[10px] text-slate-400">Validations Passkeys & menaces bloquées</p>
              </div>
            </div>

            {/* Quick Filter Pill */}
            <div className="flex items-center gap-1 text-[10px] font-mono">
              <span className="text-cyan-400 font-bold tabular-nums">+{totalAuths}</span>
              <span className="text-slate-500">connexions</span>
            </div>
          </div>

          {/* Recharts Area Chart Container */}
          <div className="w-full h-36 relative -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={ACTIVITY_DATA}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  {/* Cyan Gradient for Passkey Auths */}
                  <linearGradient id="cyanAuthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Red Gradient for Blocked Threats */}
                  <linearGradient id="redBlockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-[10px] space-y-1">
                          <p className="font-bold text-white border-b border-slate-800 pb-0.5">
                            {data.day} ({data.date})
                          </p>
                          <p className="text-cyan-300 font-medium">
                            ✓ {data.auths} Passkeys approuvées
                          </p>
                          {data.blocked > 0 && (
                            <p className="text-red-400 font-medium">
                              ✕ {data.blocked} menaces bloquées
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Primary Passkey Authentications Curve */}
                <Area
                  type="monotone"
                  dataKey="auths"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#cyanAuthGradient)"
                  dot={{ r: 3, fill: '#38bdf8', stroke: '#0f172a', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
                />

                {/* Blocked Threats Curve */}
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke="#f87171"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fillOpacity={1}
                  fill="url(#redBlockedGradient)"
                  dot={{ r: 2, fill: '#f87171' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend & Summary */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Passkeys ({totalAuths})
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                Bloquées ({totalBlocked})
              </span>
            </div>
            <button
              onClick={() => onNavigate('activity')}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center"
            >
              Historique <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Urgent Alert Banner (Pending Auth Request) */}
        {pendingAuth && (
          <div className="rounded-2xl bg-gradient-to-b from-red-950/60 to-slate-900 border border-red-500/40 p-3.5 shadow-lg shadow-red-950/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => onNavigate('auth-request')}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Demande en attente</span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </div>

            <div className="flex items-center gap-3 mb-3 cursor-pointer" onClick={() => onNavigate('auth-request')}>
              <BrandIcon name={pendingAuth.service} size={38} className="rounded-xl shadow-md" />
              <div>
                <h4 className="text-xs font-bold text-white">{pendingAuth.service}</h4>
                <p className="text-[11px] text-slate-300">Nouvelle connexion</p>
                <p className="text-[10px] text-slate-400">{pendingAuth.location} · {pendingAuth.timeAgo}</p>
              </div>
            </div>

            {/* Direct Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickBlockAuth();
                }}
                className="py-2 px-3 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <X className="w-3.5 h-3.5 stroke-[3]" />
                <span>Bloquer</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickApproveAuth();
                }}
                className="py-2 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>C'est moi</span>
              </button>
            </div>
          </div>
        )}

        {/* Section: Mes comptes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-white">Mes comptes</h3>
            <button
              onClick={() => onNavigate('accounts')}
              className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center"
            >
              Voir tout <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="space-y-2">
            {accounts.slice(0, 2).map((account) => (
              <div
                key={account.id}
                onClick={() => {
                  onSelectAccount(account.id);
                  onNavigate('account-detail');
                }}
                className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <BrandIcon name={account.name} size={36} className="rounded-xl" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">{account.name}</h4>
                    <p className="text-[10px] text-emerald-400 font-medium">Passkey active</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
