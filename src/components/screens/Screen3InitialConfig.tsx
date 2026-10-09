import React, { useState } from 'react';
import { KeyRound, Fingerprint, ScanFace, Key, ChevronLeft, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { ScreenId } from '../../types';

interface Screen3InitialConfigProps {
  onNavigate: (screen: ScreenId) => void;
  onEnrollPasskey?: () => void;
}

export const Screen3InitialConfig: React.FC<Screen3InitialConfigProps> = ({ onNavigate, onEnrollPasskey }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('passkey');

  const methods = [
    {
      id: 'passkey',
      title: 'Passkey (Recommandé)',
      subtitle: 'Le plus sécurisé',
      icon: KeyRound,
      recommended: true,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/80 border-cyan-500/30',
    },
    {
      id: 'fingerprint',
      title: 'Empreinte digitale',
      subtitle: 'Rapide et pratique',
      icon: Fingerprint,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/80 border-sky-500/30',
    },
    {
      id: 'face',
      title: 'Reconnaissance faciale',
      subtitle: 'Simple et sécurisé',
      icon: ScanFace,
      color: 'text-blue-400',
      bgColor: 'bg-blue-950/80 border-blue-500/30',
    },
    {
      id: 'pin',
      title: 'Code PIN',
      subtitle: 'Utilisé en secours',
      icon: Key,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-950/80 border-indigo-500/30',
    },
    {
      id: 'yubikey',
      title: 'Clé de sécurité physique',
      subtitle: 'YubiKey, etc.',
      icon: ShieldCheck,
      color: 'text-teal-400',
      bgColor: 'bg-teal-950/80 border-teal-500/30',
    },
  ];

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-6 py-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => onNavigate('create-identity')}
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

        {/* Headings */}
        <div className="text-left mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-white leading-tight mb-1">
            Sécurisez votre identité
          </h2>
          <p className="text-xs text-slate-400">
            Choisissez votre méthode principale de connexion.
          </p>
        </div>

        {/* Options List */}
        <div className="space-y-3 max-w-sm mx-auto">
          {methods.map((method) => {
            const isSelected = selectedMethod === method.id;
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all border active:scale-[0.99] ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-400/80 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${method.bgColor} ${method.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{method.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{method.subtitle}</p>
                  </div>
                </div>

                {/* Radio Indicator */}
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                    : 'border-slate-600 bg-slate-900/50'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA & Later Link */}
      <div className="pt-6 pb-2 space-y-2.5">
        <button
          onClick={() => {
            if (selectedMethod === 'passkey' && onEnrollPasskey) {
              onEnrollPasskey();
              onNavigate('dashboard');
            } else {
              onNavigate('dashboard');
            }
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <span>Continuer</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate('dashboard')}
          className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
};
