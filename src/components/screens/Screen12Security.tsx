import React from 'react';
import { ChevronLeft, ChevronRight, KeyRound, Smartphone, Lock, ShieldCheck, Key, Eye, ShieldAlert, Sliders } from 'lucide-react';
import { ScreenId } from '../../types';

interface Screen12SecurityProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenTotpModal: () => void;
}

export const Screen12Security: React.FC<Screen12SecurityProps> = ({
  onNavigate,
  onOpenTotpModal,
}) => {
  const securityItems = [
    {
      id: 'passkeys',
      title: 'Passkeys',
      subtitle: 'Authentification sans mot de passe',
      icon: KeyRound,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/80 border-cyan-500/30',
      action: () => onNavigate('accounts'),
    },
    {
      id: 'devices',
      title: 'Appareils',
      subtitle: 'Gérez vos appareils de confiance',
      icon: Smartphone,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/80 border-sky-500/30',
      action: () => onNavigate('devices'),
    },
    {
      id: 'lockdown',
      title: 'Verrouillage d\'identité',
      subtitle: 'Bloquez temporairement votre identité',
      icon: Lock,
      color: 'text-red-400',
      bgColor: 'bg-red-950/80 border-red-500/30',
      action: () => onNavigate('lockdown'),
    },
    {
      id: 'recovery',
      title: 'Récupération de compte',
      subtitle: 'Options sécurisées',
      icon: ShieldCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/80 border-blue-500/30',
      action: () => onNavigate('recovery'),
    },
    {
      id: 'totp',
      title: 'Codes TOTP',
      subtitle: 'Générez des codes pour vos comptes',
      icon: Key,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/80 border-emerald-500/30',
      action: onOpenTotpModal,
    },
    {
      id: 'privacy',
      title: 'Confidentialité',
      subtitle: 'Vos données vous appartiennent',
      icon: Eye,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/80 border-indigo-500/30',
      action: () => onNavigate('settings'),
    },
    {
      id: 'surveillance',
      title: 'Surveillance avancée',
      subtitle: 'Détection des activités inhabituelles',
      icon: ShieldAlert,
      color: 'text-purple-400',
      bgColor: 'bg-purple-950/80 border-purple-500/30',
      action: () => onNavigate('activity'),
    },
    {
      id: 'advanced',
      title: 'Paramètres avancés',
      subtitle: 'Notifications, apparence, langue...',
      icon: Sliders,
      color: 'text-slate-400',
      bgColor: 'bg-slate-800/80 border-slate-700/60',
      action: () => onNavigate('settings'),
    },
  ];

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
          <h2 className="text-base font-bold text-white tracking-tight">Sécurité</h2>
          <div className="w-9"></div>
        </div>

        {/* List of Security Options */}
        <div className="space-y-2 pt-1">
          {securityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={item.action}
                className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.bgColor} ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
