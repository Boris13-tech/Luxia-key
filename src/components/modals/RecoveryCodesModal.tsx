import React, { useState } from 'react';
import { X, Copy, Check, Download, ShieldCheck } from 'lucide-react';

interface RecoveryCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecoveryCodesModal: React.FC<RecoveryCodesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const codes = [
    'A89B-441F-209E',
    '7C31-88D4-FA02',
    'E190-2B34-C881',
    '3F92-550A-DE41',
    '99B8-43C0-1A84',
    '62D0-EF82-991A',
    '18AC-773B-55D2',
    'D409-91FE-2C80',
    '44B1-662A-EE01',
    '98EF-332D-77B4',
  ];

  if (!isOpen) return null;

  const copyAll = () => {
    navigator.clipboard?.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCodes = () => {
    const blob = new Blob([codes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'luxia-recovery-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Codes de récupération</h3>
            <p className="text-[10px] text-slate-400">10 codes à usage unique</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-300 mb-3 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30">
          ⚠️ Conservez ces codes hors ligne dans un endroit sûr. Chaque code ne peut être utilisé qu'une seule fois.
        </p>

        {/* Grid of 10 codes */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-[11px] text-cyan-300">
          {codes.map((code, idx) => (
            <div key={idx} className="flex items-center justify-between p-1 bg-slate-900/60 rounded-lg">
              <span className="text-[10px] text-slate-500">{idx + 1}.</span>
              <span>{code}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={copyAll}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier tout'}</span>
          </button>

          <button
            onClick={downloadCodes}
            className="py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger .txt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
