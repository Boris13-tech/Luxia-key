import React from 'react';
import { ChevronLeft, AlertTriangle, X, Check, Laptop, MapPin, Clock, ShieldAlert } from 'lucide-react';
import { ScreenId, SensitiveActionData } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface Screen10SensitiveActionProps {
  actionData: SensitiveActionData;
  onNavigate: (screen: ScreenId) => void;
  onBlock: () => void;
  onSignAndAuthorize: () => void;
}

export const Screen10SensitiveAction: React.FC<Screen10SensitiveActionProps> = ({
  actionData,
  onNavigate,
  onBlock,
  onSignAndAuthorize,
}) => {
  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-3.5 pb-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-sm font-semibold text-white tracking-tight">Vérification d'une action</h2>
          <div className="w-9"></div>
        </div>

        {/* Brand & Action Type */}
        <div className="flex flex-col items-center text-center pt-1">
          <BrandIcon name={actionData.service} size={50} className="rounded-2xl shadow-lg mb-2" />
          <h3 className="text-base font-bold text-white tracking-tight">{actionData.service}</h3>
          <p className="text-xs text-red-400 font-medium">{actionData.actionTitle}</p>
        </div>

        {/* Details Card */}
        <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
          {/* Current Address */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
            <span className="text-slate-400">Adresse actuelle</span>
            <span className="text-white font-medium">{actionData.currentEmail}</span>
          </div>

          {/* New Requested Address (Red Alert) */}
          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-between text-xs">
            <span className="text-red-300 font-medium flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Nouvelle adresse
            </span>
            <span className="text-red-200 font-bold font-mono">{actionData.newEmail}</span>
          </div>

          {/* Device */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
              Appareil
            </span>
            <span className="text-white font-medium">{actionData.device}</span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Localisation
            </span>
            <span className="text-white font-medium">{actionData.location}</span>
          </div>

          {/* Time & Risk */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Heure
            </span>
            <span className="text-white font-medium">{actionData.time}</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              Risque
            </span>
            <span className="text-red-400 font-bold px-2 py-0.5 rounded-md bg-red-950/80 border border-red-500/30">
              {actionData.riskLevel}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={onBlock}
            className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950 active:scale-[0.98] transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Bloquer</span>
          </button>

          <button
            onClick={onSignAndAuthorize}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 active:scale-[0.98] transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Signer et autoriser</span>
          </button>
        </div>
      </div>
    </div>
  );
};
