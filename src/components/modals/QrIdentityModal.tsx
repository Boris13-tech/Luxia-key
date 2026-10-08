import React from 'react';
import { X, ShieldCheck, QrCode, Copy, Check } from 'lucide-react';
import { UserProfile } from '../../types';

interface QrIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const QrIdentityModal: React.FC<QrIdentityModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const didString = `did:luxia:key:${user.handle}:0x49f28a8d11c09b83`;

  const copyDid = () => {
    navigator.clipboard?.writeText(didString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative text-center animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-white mb-0.5">{user.name}</h3>
        <p className="text-xs text-cyan-400 font-medium mb-4">{user.level}</p>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-3xl w-48 h-48 mx-auto mb-4 flex items-center justify-center shadow-lg">
          <QrCode className="w-40 h-40 text-slate-950" />
        </div>

        <p className="text-[11px] text-slate-400 mb-2">Identifiant DID W3C Décentralisé</p>
        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 break-all select-all mb-4">
          {didString}
        </div>

        <button
          onClick={copyDid}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'DID copié !' : 'Copier l\'identifiant DID'}</span>
        </button>
      </div>
    </div>
  );
};
