import React, { useEffect, useState } from 'react';
import { ScanFace, Check, Fingerprint, Shield, X, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { webauthnClient } from '../../services/webauthnClient';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
  type?: 'face' | 'fingerprint' | 'passkey';
  securityMode?: 'real' | 'demo';
  actionType?: 'authenticate' | 'register';
  username?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title = 'Vérification WebAuthn / Passkey',
  subtitle = 'Votre navigateur et OS vérifient votre identité matérielle.',
  type = 'passkey',
  securityMode = 'real',
  actionType = 'authenticate',
  username = 'boris.legrand',
}) => {
  const [state, setState] = useState<'idle' | 'prompting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const executeRealHardwareVerification = async () => {
    setState('prompting');
    setErrorMessage(null);

    try {
      let result;
      if (actionType === 'register') {
        result = await webauthnClient.registerPasskey(username, 'Boris Legrand');
      } else {
        result = await webauthnClient.authenticatePasskey(username);
      }

      if (result.success) {
        setState('success');
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#3b82f6', '#10b981'],
          });
        } catch {}
        setTimeout(() => {
          onSuccess();
        }, 800);
      } else {
        setState('error');
        setErrorMessage(result.error || 'Vérification matérielle refusée');
      }
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || 'Erreur inattendue WebAuthn');
    }
  };

  const executeDemoSimulation = () => {
    setState('prompting');
    const timer = setTimeout(() => {
      setState('success');
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          colors: ['#06b6d4', '#3b82f6', '#10b981'],
        });
      } catch {}
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 1200);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (isOpen) {
      if (securityMode === 'real') {
        executeRealHardwareVerification();
      } else {
        executeDemoSimulation();
      }
    } else {
      setState('idle');
      setErrorMessage(null);
    }
  }, [isOpen, securityMode, actionType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-xs bg-slate-900 border border-slate-700/80 rounded-3xl p-6 text-center shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Mode Indicator Badge */}
        <div className="mb-4 flex justify-center">
          {securityMode === 'real' ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-500/50 text-cyan-300">
              MODE RÉEL · WebAuthn W3C
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 border border-amber-500/50 text-amber-300">
              MODE DÉMO · Simulation
            </span>
          )}
        </div>

        {/* Biometric Icon State */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center relative mb-4 shadow-lg shadow-cyan-500/10">
          {state === 'prompting' && (
            <>
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-pulse"></div>
              {type === 'fingerprint' ? (
                <Fingerprint className="w-10 h-10 text-cyan-400 animate-pulse" />
              ) : (
                <ScanFace className="w-10 h-10 text-cyan-400 animate-pulse" />
              )}
            </>
          )}

          {state === 'success' && (
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white scale-110 transition-transform">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
          )}

          {state === 'error' && (
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
              <AlertCircle className="w-7 h-7" />
            </div>
          )}

          {state === 'idle' && <Shield className="w-10 h-10 text-cyan-400" />}
        </div>

        <h3 className="text-base font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">{subtitle}</p>

        {/* Error Feedback in Real Mode */}
        {state === 'error' && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/60 border border-red-500/50 text-left space-y-2">
            <div className="text-[11px] font-semibold text-red-300">
              Échec de la validation cryptographique
            </div>
            <p className="text-[10px] text-red-200 font-mono leading-tight">
              {errorMessage}
            </p>
            <button
              onClick={executeRealHardwareVerification}
              className="w-full py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Réessayer le prompt matériel</span>
            </button>
          </div>
        )}

        <div className="py-2 px-3 rounded-xl bg-slate-800/60 border border-slate-700 text-[11px] text-cyan-300 font-medium flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          <span>Clé matérielle FIDO2 / Secure Enclave</span>
        </div>
      </div>
    </div>
  );
};
