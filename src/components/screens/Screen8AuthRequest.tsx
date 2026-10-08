import React, { useState } from 'react';
import { ChevronLeft, MapPin, AlertTriangle, X, Check, Globe, Shield, Terminal } from 'lucide-react';
import { ScreenId, AuthRequestData } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface Screen8AuthRequestProps {
  authRequest: AuthRequestData;
  onNavigate: (screen: ScreenId) => void;
  onBlock: () => void;
  onApprove: () => void;
}

export const Screen8AuthRequest: React.FC<Screen8AuthRequestProps> = ({
  authRequest,
  onNavigate,
  onBlock,
  onApprove,
}) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

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
          <h2 className="text-sm font-semibold text-white tracking-tight">Demande d'authentification</h2>
          <div className="w-9"></div>
        </div>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center pt-1">
          <BrandIcon name={authRequest.service} size={52} className="rounded-2xl shadow-lg mb-2" />
          <h3 className="text-lg font-bold text-white tracking-tight">{authRequest.service}</h3>
          <p className="text-xs text-slate-400">{authRequest.type}</p>
        </div>

        {/* Map Preview Widget */}
        <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner flex items-center justify-center">
          {/* Stylized vector map background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40"></div>
          
          {/* Simulated river / roads lines */}
          <svg className="absolute inset-0 w-full h-full opacity-30 stroke-cyan-500" fill="none">
            <path d="M-20 60 Q 90 20 180 70 T 380 50" strokeWidth="3" />
            <path d="M50 0 Q 120 80 140 140" strokeWidth="1.5" />
            <path d="M220 0 Q 200 70 240 140" strokeWidth="1.5" />
          </svg>

          {/* Pulse Pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <span className="w-8 h-8 rounded-full bg-red-500/30 animate-ping absolute"></span>
              <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shadow-lg text-white">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
            </div>
            <span className="mt-1 text-[11px] font-bold text-white drop-shadow-md bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
              {authRequest.city}
            </span>
          </div>
        </div>

        {/* Location & Time details */}
        <div className="text-center">
          <p className="text-xs font-semibold text-white">{authRequest.location}</p>
          <p className="text-[11px] text-slate-400">{authRequest.timeAgo}</p>
        </div>

        {/* Technical specs pill */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-center space-y-1">
          <p className="text-xs font-semibold text-slate-200">{authRequest.device}</p>
          <p className="text-[11px] text-slate-400">
            {authRequest.os} · IP {authRequest.ip}
          </p>
          <p className="text-[11px] text-slate-400">{authRequest.browser}</p>
        </div>

        {/* Risk Box (Risque élevé) */}
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Risque élevé</span>
          </div>

          <div className="space-y-1 text-left">
            {authRequest.riskFactors.map((factor, index) => (
              <div key={index} className="flex items-center gap-2 text-[11px] text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span>{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={onBlock}
            className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-950 active:scale-95 transition-all"
          >
            <X className="w-4 h-4 stroke-[3]" />
            <span>Bloquer</span>
          </button>

          <button
            onClick={onApprove}
            className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950 active:scale-95 transition-all"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>C'est moi</span>
          </button>
        </div>

        {/* Link: Plus de détails */}
        <div className="text-center pt-0.5">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {showTechnicalDetails ? 'Masquer les détails' : 'Plus de détails'}
          </button>
        </div>

        {/* Technical Inspector Collapsible */}
        {showTechnicalDetails && (
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 font-mono space-y-1 text-left">
            <div className="flex items-center gap-1 text-cyan-400 font-bold mb-1">
              <Terminal className="w-3 h-3" />
              <span>TLS / WebAuthn Telemetry</span>
            </div>
            <div>TLS: TLS_AES_256_GCM_SHA384 (TLSv1.3)</div>
            <div>JA4 Fingerprint: t13d1516h2_8daaf6152771</div>
            <div>ASN: AS16509 Amazon Data Services UK</div>
            <div>Challenge Nonce: 0x89fc32a10b44...</div>
          </div>
        )}
      </div>
    </div>
  );
};
