import React, { useEffect, useState } from 'react';
import { ScanFace, Check, Fingerprint, Shield, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
  type?: 'face' | 'fingerprint' | 'passkey';
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Confirmation Biométrique',
  subtitle = 'Vérification Face ID requise pour signer cette action.',
  type = 'face',
}) => {
  const [state, setState] = useState<'scanning' | 'success'>('scanning');

  useEffect(() => {
    if (isOpen) {
      setState('scanning');
      const timer = setTimeout(() => {
        setState('success');
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#3b82f6', '#10b981'],
          });
        } catch {
          // ignore
        }
        const doneTimer = setTimeout(() => {
          onSuccess();
        }, 900);
        return () => clearTimeout(doneTimer);
      }, 1400);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Biometric Icon Ring */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center relative mb-5 shadow-lg shadow-cyan-500/10">
          {state === 'scanning' ? (
            <>
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-pulse"></div>
              {type === 'fingerprint' ? (
                <Fingerprint className="w-10 h-10 text-cyan-400 animate-pulse" />
              ) : (
                <ScanFace className="w-10 h-10 text-cyan-400 animate-pulse" />
              )}
            </>
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white scale-110 transition-transform">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">{subtitle}</p>

        <div className="py-2.5 px-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-cyan-300 font-medium flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Enclave Sécurisée FIDO2 / Passkey</span>
        </div>
      </div>
    </div>
  );
};
