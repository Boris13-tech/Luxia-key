import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell, Moon, Globe, Shield, Sliders, HelpCircle, Info, Check } from 'lucide-react';
import { ScreenId } from '../../types';

interface Screen16SettingsProps {
  onNavigate: (screen: ScreenId) => void;
  onResetData: () => void;
}

export const Screen16Settings: React.FC<Screen16SettingsProps> = ({
  onNavigate,
  onResetData,
}) => {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-3 pb-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-tight">Paramètres</h2>
          <div className="w-9"></div>
        </div>

        {/* Settings List */}
        <div className="space-y-2 pt-1">
          {/* 1. Notifications */}
          <div
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-red-950/80 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Notifications</h4>
                <p className="text-[11px] text-slate-400">Alertes et préférences</p>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
              notificationsEnabled ? 'bg-cyan-500' : 'bg-slate-700'
            }`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}></div>
            </div>
          </div>

          {/* 2. Apparence */}
          <div
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Apparence</h4>
                <p className="text-[11px] text-slate-400">Thème {theme === 'dark' ? 'sombre' : 'clair'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 3. Langue */}
          <div
            onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Langue</h4>
                <p className="text-[11px] text-slate-400">{language === 'fr' ? 'Français' : 'English'}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 4. Confidentialité */}
          <div
            onClick={() => alert("Chiffrement de bout en bout actif. Vos clés privées ne quittent jamais votre matériel.")}
            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Confidentialité</h4>
                <p className="text-[11px] text-slate-400">Gestion des données</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 5. Sécurité avancée */}
          <div
            onClick={() => onNavigate('lockdown')}
            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Sécurité avancée</h4>
                <p className="text-[11px] text-slate-400">Options expertes & Killswitch</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 6. Aide et support */}
          <div
            onClick={() => alert("Assistance LUXIA Security 24/7 disponible sur luxia.security/support")}
            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-500/30 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Aide et support</h4>
                <p className="text-[11px] text-slate-400">Centre d'aide</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* 7. À propos */}
          <div
            onClick={() => alert("LUXIA Key v1.0.0 Pro - Développé avec FIDO2 & W3C Verifiable Credentials")}
            className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">À propos</h4>
                <p className="text-[11px] text-slate-400">Version 1.0.0</p>
              </div>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono">v1.0.0</span>
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <div className="pt-2">
          <button
            onClick={onResetData}
            className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs transition-colors"
          >
            Réinitialiser les données de démonstration
          </button>
        </div>
      </div>
    </div>
  );
};
