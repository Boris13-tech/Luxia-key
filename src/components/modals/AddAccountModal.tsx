import React, { useState } from 'react';
import { X, Plus, Key, Shield, Sparkles } from 'lucide-react';
import { AccountItem } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Partial<AccountItem>) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [serviceName, setServiceName] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState<'social' | 'email' | 'finance' | 'work'>('social');
  const [passkeyActive, setPasskeyActive] = useState(true);
  const [totpActive, setTotpActive] = useState(false);

  const presets = [
    { name: 'Discord', category: 'social' as const, handle: 'boris#0001' },
    { name: 'Netflix', category: 'social' as const, handle: 'boris.legrand' },
    { name: 'Spotify', category: 'social' as const, handle: 'boris.audio' },
    { name: 'Coinbase', category: 'finance' as const, handle: 'boris.vault' },
    { name: 'GitLab', category: 'work' as const, handle: 'boris.dev' },
    { name: 'Notion', category: 'work' as const, handle: 'boris.work' },
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) return;

    onAddAccount({
      name: serviceName.trim(),
      handle: handle.trim() || 'boris.legrand',
      category,
      passkeyActive,
      totpActive,
      notificationsActive: true,
      monitoringActive: true,
      email: 'boris.legrand@gmail.com',
      phone: '+40 7XX XXX XXX',
      website: `${serviceName.toLowerCase().replace(/\s+/g, '')}.com`,
      luxiaIntegration: passkeyActive ? 'Passkey FIDO2 Matériel' : 'TOTP Local Chiffré',
      createdAt: 'Aujourd\'hui',
      lastUsed: 'À l\'instant',
    });

    onClose();
  };

  const applyPreset = (preset: typeof presets[0]) => {
    setServiceName(preset.name);
    setCategory(preset.category);
    setHandle(preset.handle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Ajouter un nouveau compte</h3>
            <p className="text-[10px] text-slate-400">Enrôler une Passkey ou code de sécurité</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mb-4">
          <label className="text-[10px] font-semibold text-slate-400 mb-1.5 block">Suggestions rapides</label>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="py-1 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <BrandIcon name={preset.name} size={14} className="rounded" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Nom du service</label>
            <input
              type="text"
              required
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="ex: Spotify, GitHub, Netflix..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Identifiant / Pseudo</label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="ex: boris.legrand"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 font-medium block mb-1">Catégorie</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['social', 'email', 'finance', 'work'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-1.5 rounded-xl font-medium text-[10px] capitalize transition-colors ${
                    category === cat
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {cat === 'social' ? 'Social' : cat === 'email' ? 'Email' : cat === 'finance' ? 'Finance' : 'Pro'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-800">
            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <span className="text-[11px] text-slate-300 font-medium">Activer Passkey (Biométrie FIDO2)</span>
              <input
                type="checkbox"
                checked={passkeyActive}
                onChange={(e) => setPasskeyActive(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer">
              <span className="text-[11px] text-slate-300 font-medium">Générer clé de secours TOTP</span>
              <input
                type="checkbox"
                checked={totpActive}
                onChange={(e) => setTotpActive(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 transition-all active:scale-95"
          >
            Enregistrer dans LUXIA Key
          </button>
        </form>
      </div>
    </div>
  );
};
