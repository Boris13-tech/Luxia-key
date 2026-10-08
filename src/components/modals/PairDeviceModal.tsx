import React, { useState } from 'react';
import { X, Smartphone, Check, QrCode, RefreshCw } from 'lucide-react';
import { DeviceItem } from '../../types';

interface PairDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDevicePaired: (device: DeviceItem) => void;
}

export const PairDeviceModal: React.FC<PairDeviceModalProps> = ({
  isOpen,
  onClose,
  onDevicePaired,
}) => {
  const [deviceType, setDeviceType] = useState<DeviceItem['type']>('laptop');
  const [deviceName, setDeviceName] = useState('MacBook Air M3');
  const [isPairing, setIsPairing] = useState(false);

  if (!isOpen) return null;

  const handlePair = () => {
    setIsPairing(true);
    setTimeout(() => {
      onDevicePaired({
        id: `device-${Date.now()}`,
        name: deviceName,
        type: deviceType,
        os: deviceType === 'laptop' ? 'macOS Sequoia' : deviceType === 'desktop' ? 'Windows 11' : 'iPadOS 18',
        location: 'Paris, France',
        ip: '82.64.120.45',
        isCurrent: false,
        isActive: true,
        lastActive: 'À l\'instant',
        status: 'active',
      });
      setIsPairing(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-sm font-bold text-white mb-1">Associer un nouvel appareil</h3>
        <p className="text-[11px] text-slate-400 mb-4">
          Scannez ce QR Code depuis votre deuxième appareil ou saisissez le code cryptographique.
        </p>

        {/* QR Code graphic */}
        <div className="p-4 bg-white rounded-2xl w-36 h-36 mx-auto mb-4 flex items-center justify-center shadow-md">
          <QrCode className="w-28 h-28 text-slate-950" />
        </div>

        <div className="text-center mb-4">
          <span className="text-[10px] text-slate-400 block mb-1">Code de couplage éphémère (valide 5 min)</span>
          <span className="font-mono text-base font-bold text-cyan-400 tracking-wider bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            LX-9428-71
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Nom de l'appareil</label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
            />
          </div>

          <button
            onClick={handlePair}
            disabled={isPairing}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
          >
            {isPairing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synchronisation de l'enclave...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simuler l'approbation du jumelage</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
