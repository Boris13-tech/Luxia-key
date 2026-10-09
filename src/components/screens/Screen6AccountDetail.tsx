import React, { useState } from 'react';
import { ChevronLeft, ShieldCheck, Bell, Shield, KeyRound, ExternalLink, Info, Trash2, Settings, Check } from 'lucide-react';
import { ScreenId, AccountItem } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface Screen6AccountDetailProps {
  account: AccountItem | null;
  onNavigate: (screen: ScreenId) => void;
  onDeleteAccount: (accountId: string) => void;
  onTogglePasskey: (accountId: string) => void;
}

export const Screen6AccountDetail: React.FC<Screen6AccountDetailProps> = ({
  account,
  onNavigate,
  onDeleteAccount,
  onTogglePasskey,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSettingsNotice, setShowSettingsNotice] = useState(false);

  if (!account) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Compte introuvable.</p>
        <button onClick={() => onNavigate('accounts')} className="mt-4 text-xs text-cyan-400">Retour aux comptes</button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('accounts')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-white tracking-tight">Détail d'un compte</h2>
          <div className="w-9"></div>
        </div>

        {/* Brand Profile Center */}
        <div className="flex flex-col items-center text-center pt-2">
          <BrandIcon name={account.name} size={64} className="rounded-3xl shadow-xl mb-3" />
          <h3 className="text-xl font-bold text-white tracking-tight">{account.name}</h3>
          <p className="text-xs text-slate-400 mb-2">{account.handle}</p>

          {/* Badge Protégé */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protégé</span>
          </div>
        </div>

        {/* 3 Status Indicators */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {/* Passkey */}
          <div
            onClick={() => onTogglePasskey(account.id)}
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center cursor-pointer hover:border-cyan-500/30 transition-all"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 ${
              account.passkeyActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
            }`}>
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-semibold text-white">Passkey</span>
            <span className="text-[10px] text-emerald-400 font-medium">
              {account.passkeyActive ? 'Active' : 'Désactivée'}
            </span>
          </div>

          {/* Notifications */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-1.5">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Notifications</span>
            <span className="text-[10px] text-sky-400 font-medium">Actives</span>
          </div>

          {/* Surveillance */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-white">Surveillance</span>
            <span className="text-[10px] text-cyan-400 font-medium">Active</span>
          </div>
        </div>

        {/* Section: Informations */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <h4 className="text-xs font-bold text-white mb-1">Informations</h4>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60 text-xs">
            <span className="text-slate-400">Nom d'utilisateur</span>
            <span className="text-white font-medium">{account.handle}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60 text-xs">
            <span className="text-slate-400">Email</span>
            <span className="text-white font-medium">{account.email}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60 text-xs">
            <span className="text-slate-400">Numéro de téléphone</span>
            <span className="text-white font-medium">{account.phone}</span>
          </div>

          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-slate-400">Site web</span>
            <a
              href={`https://${account.website}`}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
            >
              <span>{account.website}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Callout: Intégration LUXIA */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs">
            <h5 className="font-semibold text-cyan-200">Intégration LUXIA</h5>
            <p className="text-cyan-300/80 text-[11px] mt-0.5">
              {account.luxiaIntegration}. Authentification cryptographique matérielle directe sans mot de passe.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => setShowSettingsNotice(true)}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Gérer les paramètres</span>
          </button>

          {showDeleteConfirm ? (
            <div className="p-3 rounded-2xl bg-red-950/50 border border-red-500/50 text-center space-y-2">
              <p className="text-xs text-red-300">Voulez-vous révoquer la protection pour {account.name} ?</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onDeleteAccount(account.id);
                    onNavigate('accounts');
                  }}
                  className="flex-1 py-2 rounded-xl bg-red-600 text-xs font-semibold text-white"
                >
                  Confirmer
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-4 rounded-2xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Supprimer ce compte</span>
            </button>
          )}
        </div>

        {showSettingsNotice && (
          <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-xs text-slate-300 flex items-center justify-between">
            <span>Passkey synchronisée avec l'enclave sécurisée de votre appareil.</span>
            <button onClick={() => setShowSettingsNotice(false)} className="text-cyan-400 font-bold ml-2">OK</button>
          </div>
        )}
      </div>
    </div>
  );
};
