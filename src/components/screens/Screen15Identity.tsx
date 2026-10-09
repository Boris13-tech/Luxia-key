import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, QrCode, Mail, Phone, Smartphone, Users, Award, Shield } from 'lucide-react';
import { ScreenId, UserProfile } from '../../types';

interface Screen15IdentityProps {
  user: UserProfile;
  onNavigate: (screen: ScreenId) => void;
  onOpenQrIdentityModal: () => void;
}

export const Screen15Identity: React.FC<Screen15IdentityProps> = ({
  user,
  onNavigate,
  onOpenQrIdentityModal,
}) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'credentials'>('identity');

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-4 pb-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-tight">Mon identité</h2>
          <div className="w-9"></div>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center pt-1">
          {/* Avatar with Glow & Verified Ring */}
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 p-0.5 shadow-xl shadow-cyan-900/30">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xl text-cyan-200">
                BL
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-md">
              <CheckCircle2 className="w-4 h-4 fill-slate-950 text-cyan-400 stroke-[3]" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-lg font-bold text-white tracking-tight">{user.name}</h3>
            <span className="w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center text-[10px] text-slate-950 font-bold">✓</span>
          </div>

          {/* Verification Badge */}
          <div
            onClick={onOpenQrIdentityModal}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs text-cyan-300 cursor-pointer hover:border-cyan-400 transition-colors shadow-sm"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Identité LUXIA · {user.level}</span>
            <QrCode className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Segmented Control Tabs */}
        <div className="p-1 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('identity')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'identity'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Identité
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-2 rounded-xl transition-all ${
              activeTab === 'credentials'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Credentials
          </button>
        </div>

        {/* Tab 1 Content: Identité */}
        {activeTab === 'identity' && (
          <div className="space-y-2">
            {/* Email */}
            <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Email</h4>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Téléphone */}
            <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Téléphone</h4>
                  <p className="text-[11px] text-slate-400">{user.phone}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Appareils de confiance */}
            <div
              onClick={() => onNavigate('devices')}
              className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Appareils de confiance</h4>
                  <p className="text-[11px] text-cyan-400">{user.trustedDevicesCount} appareils</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Contacts de confiance */}
            <div
              onClick={() => onNavigate('recovery')}
              className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Contacts de confiance</h4>
                  <p className="text-[11px] text-cyan-400">{user.trustedContactsCount} contacts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Identifiants vérifiables */}
            <div
              onClick={() => setActiveTab('credentials')}
              className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Identifiants vérifiables</h4>
                  <p className="text-[11px] text-slate-400">{user.verifiableCredentialsCount} credential</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        )}

        {/* Tab 2 Content: Credentials */}
        {activeTab === 'credentials' && (
          <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
            <Award className="w-10 h-10 text-cyan-400 mx-auto" />
            <h4 className="text-xs font-bold text-white">Aucun justificatif vérifiable</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              Vous pouvez ajouter des justificatifs décentralisés (permis numérique, diplôme, preuve d'âge anonyme zéro-connaissance ZK-Proof).
            </p>
            <button
              onClick={() => alert("Émission d'un justificatif vérifiable W3C VC simulée avec succès !")}
              className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white"
            >
              Ajouter un justificatif
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
