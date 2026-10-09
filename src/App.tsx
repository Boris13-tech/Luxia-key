import React, { useState } from 'react';
import {
  ScreenId,
  AccountItem,
  DeviceItem,
  SecurityActivity,
  AuthRequestData,
  SensitiveActionData,
  UserProfile,
} from './types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_DEVICES,
  INITIAL_RECENT_DEVICES,
  INITIAL_ACTIVITIES,
  INITIAL_AUTH_REQUEST,
  INITIAL_SENSITIVE_ACTION,
  INITIAL_USER,
} from './data/mockData';

// Screens
import { Screen1Splash } from './components/screens/Screen1Splash';
import { Screen2CreateIdentity } from './components/screens/Screen2CreateIdentity';
import { Screen3InitialConfig } from './components/screens/Screen3InitialConfig';
import { Screen4Dashboard } from './components/screens/Screen4Dashboard';
import { Screen5Accounts } from './components/screens/Screen5Accounts';
import { Screen6AccountDetail } from './components/screens/Screen6AccountDetail';
import { Screen7Devices } from './components/screens/Screen7Devices';
import { Screen8AuthRequest } from './components/screens/Screen8AuthRequest';
import { Screen9Scanner } from './components/screens/Screen9Scanner';
import { Screen10SensitiveAction } from './components/screens/Screen10SensitiveAction';
import { Screen11Activity } from './components/screens/Screen11Activity';
import { Screen12Security } from './components/screens/Screen12Security';
import { Screen13Lockdown } from './components/screens/Screen13Lockdown';
import { Screen14Recovery } from './components/screens/Screen14Recovery';
import { Screen15Identity } from './components/screens/Screen15Identity';
import { Screen16Settings } from './components/screens/Screen16Settings';

// Common & Modals
import { PhoneFrame } from './components/common/PhoneFrame';
import { BiometricModal } from './components/common/BiometricModal';
import { AddAccountModal } from './components/modals/AddAccountModal';
import { PairDeviceModal } from './components/modals/PairDeviceModal';
import { RecoveryCodesModal } from './components/modals/RecoveryCodesModal';
import { QrIdentityModal } from './components/modals/QrIdentityModal';
import { TotpGeneratorModal } from './components/modals/TotpGeneratorModal';
import { ScreenGallery } from './components/ScreenGallery';

import {
  Smartphone,
  LayoutGrid,
  Bell,
  Lock,
  RotateCcw,
  Shield,
  Key,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Navigation & View Mode
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [viewMode, setViewMode] = useState<'simulator' | 'responsive' | 'gallery'>('simulator');

  // Application Data States
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [accounts, setAccounts] = useState<AccountItem[]>(INITIAL_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('instagram');
  const [devices, setDevices] = useState<DeviceItem[]>(INITIAL_DEVICES);
  const [recentDevices, setRecentDevices] = useState<DeviceItem[]>(INITIAL_RECENT_DEVICES);
  const [activities, setActivities] = useState<SecurityActivity[]>(INITIAL_ACTIVITIES);
  const [pendingAuth, setPendingAuth] = useState<AuthRequestData | null>(INITIAL_AUTH_REQUEST);
  const [sensitiveAction, setSensitiveAction] = useState<SensitiveActionData>(INITIAL_SENSITIVE_ACTION);

  // Security Mode: 'real' vs 'demo'
  const [securityMode, setSecurityMode] = useState<'real' | 'demo'>('real');
  const [biometricActionType, setBiometricActionType] = useState<'authenticate' | 'register'>('authenticate');

  // Modals
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricTitle, setBiometricTitle] = useState('Confirmation Biométrique');
  const [biometricSubtitle, setBiometricSubtitle] = useState('Face ID requis pour signer cette action.');
  const [biometricCallback, setBiometricCallback] = useState<(() => void) | null>(null);

  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isPairDeviceModalOpen, setIsPairDeviceModalOpen] = useState(false);
  const [isRecoveryCodesModalOpen, setIsRecoveryCodesModalOpen] = useState(false);
  const [isQrIdentityModalOpen, setIsQrIdentityModalOpen] = useState(false);
  const [isTotpModalOpen, setIsTotpModalOpen] = useState(false);

  // Toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0] || null;

  // Handlers for App Actions
  const handleRegisterPasskeyHardware = () => {
    setBiometricActionType('register');
    setBiometricTitle('Enrôlement Passkey FIDO2');
    setBiometricSubtitle('Votre système génère une clé matérielle dans le Secure Enclave.');
    setBiometricCallback(() => () => {
      showToast('Passkey matérielle WebAuthn créée et enregistrée avec succès !');
      try {
        confetti({ particleCount: 50, spread: 70 });
      } catch {}
    });
    setIsBiometricModalOpen(true);
  };

  const handleQuickApproveAuth = () => {
    setBiometricActionType('authenticate');
    setBiometricTitle('Vérification Passkey WebAuthn');
    setBiometricSubtitle('Validation matérielle de la demande d\'accès.');
    setBiometricCallback(() => () => {
      setPendingAuth(null);
      const newAct: SecurityActivity = {
        id: `act-${Date.now()}`,
        title: 'Connexion approuvée',
        service: 'Instagram',
        location: 'Londres, UK',
        timestamp: 'À l\'instant',
        dateGroup: 'today',
        type: 'login_approved',
        status: 'approved',
        details: {
          ip: '185.199.110.24',
          device: 'iPhone 17 Pro',
          browser: 'Safari',
          riskLevel: 'Faible',
          notes: 'Connexion autorisée par authentification cryptographique WebAuthn.',
        },
      };
      setActivities([newAct, ...activities]);
      showToast('Connexion Instagram approuvée par Passkey matérielle !');
      if (currentScreen === 'auth-request') {
        setCurrentScreen('dashboard');
      }
    });
    setIsBiometricModalOpen(true);
  };

  const handleQuickBlockAuth = () => {
    setPendingAuth(null);
    const newAct: SecurityActivity = {
      id: `act-${Date.now()}`,
      title: 'Connexion bloquée',
      service: 'Instagram',
      location: 'Londres, UK',
      timestamp: 'À l\'instant',
      dateGroup: 'today',
      type: 'blocked_attempt',
      status: 'blocked',
      details: {
        ip: '185.199.110.24',
        device: 'iPhone 17 Pro',
        browser: 'Safari',
        riskLevel: 'Élevé',
        notes: 'Session suspecte révoquée et jeton réinitialisé.',
      },
    };
    setActivities([newAct, ...activities]);
    showToast('Connexion suspecte révoquée et bloquée !');
    if (currentScreen === 'auth-request') {
      setCurrentScreen('dashboard');
    }
  };

  const handleBlockSensitiveAction = () => {
    showToast('Modification de l\'adresse email bloquée avec succès.');
    const newAct: SecurityActivity = {
      id: `act-${Date.now()}`,
      title: 'Modification email bloquée',
      service: 'Google',
      location: 'São Paulo, BR',
      timestamp: 'À l\'instant',
      dateGroup: 'today',
      type: 'email_change',
      status: 'blocked',
      details: {
        ip: '177.18.230.91',
        device: 'Windows 11 · Chrome',
        riskLevel: 'Élevé',
        notes: 'Attaque par détournement d\'adresse arrêtée.',
      },
    };
    setActivities([newAct, ...activities]);
    setCurrentScreen('dashboard');
  };

  const handleSignSensitiveAction = () => {
    setBiometricTitle('Signature Cryptographique');
    setBiometricSubtitle('Validation biométrique de la modification de l\'adresse Google.');
    setBiometricCallback(() => () => {
      showToast('Action signée et autorisée par clé matérielle.');
      setCurrentScreen('dashboard');
    });
    setIsBiometricModalOpen(true);
  };

  const handleToggleLockdown = () => {
    const nextLocked = !user.isLockedDown;
    setUser({ ...user, isLockedDown: nextLocked });
    if (nextLocked) {
      showToast('🛡️ Mode Verrouillage Activé : toutes les connexions sont gelées.');
    } else {
      showToast('Verrouillage levé : comptes réactivés en mode normal.');
    }
  };

  const handleAddAccount = (newAccData: Partial<AccountItem>) => {
    const id = (newAccData.name || 'compte').toLowerCase().replace(/\s+/g, '-');
    const newAcc: AccountItem = {
      id,
      name: newAccData.name || 'Nouveau compte',
      handle: newAccData.handle || 'user.handle',
      category: newAccData.category || 'social',
      icon: id,
      color: '#06b6d4',
      passkeyActive: newAccData.passkeyActive ?? true,
      totpActive: newAccData.totpActive ?? false,
      notificationsActive: true,
      monitoringActive: true,
      email: user.email,
      phone: user.phone,
      website: newAccData.website || `${id}.com`,
      luxiaIntegration: newAccData.luxiaIntegration || 'Passkey Enclave',
      createdAt: 'Aujourd\'hui',
      lastUsed: 'À l\'instant',
      totpSecret: 'KRSXG5CTMVRXEZLU',
    };
    setAccounts([newAcc, ...accounts]);
    showToast(`Compte ${newAcc.name} ajouté avec succès !`);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
    showToast('Compte supprimé de LUXIA Key.');
  };

  const handleTogglePasskey = (id: string) => {
    setAccounts(
      accounts.map((a) => (a.id === id ? { ...a, passkeyActive: !a.passkeyActive } : a))
    );
    showToast('Statut de la Passkey mis à jour.');
  };

  const handleDevicePaired = (newDevice: DeviceItem) => {
    setDevices([newDevice, ...devices]);
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {}
    showToast(`Nouvel appareil ${newDevice.name} associé avec succès !`);
  };

  const handleResetData = () => {
    setUser(INITIAL_USER);
    setAccounts(INITIAL_ACCOUNTS);
    setDevices(INITIAL_DEVICES);
    setRecentDevices(INITIAL_RECENT_DEVICES);
    setActivities(INITIAL_ACTIVITIES);
    setPendingAuth(INITIAL_AUTH_REQUEST);
    setSensitiveAction(INITIAL_SENSITIVE_ACTION);
    showToast('Données de démonstration réinitialisées.');
  };

  const screensInfo: { id: ScreenId; title: string; num: number }[] = [
    { id: 'splash', num: 1, title: 'Splash & Bienvenue' },
    { id: 'create-identity', num: 2, title: 'Créer votre identité' },
    { id: 'initial-config', num: 3, title: 'Configuration initiale' },
    { id: 'dashboard', num: 4, title: 'Accueil (Dashboard)' },
    { id: 'accounts', num: 5, title: 'Mes comptes' },
    { id: 'account-detail', num: 6, title: 'Détail d\'un compte' },
    { id: 'devices', num: 7, title: 'Mes appareils' },
    { id: 'auth-request', num: 8, title: 'Demande d\'authentification' },
    { id: 'scanner', num: 9, title: 'Scanner / Se connecter' },
    { id: 'sensitive-action', num: 10, title: 'Action sensible' },
    { id: 'activity', num: 11, title: 'Activité récente' },
    { id: 'security', num: 12, title: 'Sécurité' },
    { id: 'lockdown', num: 13, title: 'Verrouillage d\'identité' },
    { id: 'recovery', num: 14, title: 'Récupération de compte' },
    { id: 'identity', num: 15, title: 'Mon identité' },
    { id: 'settings', num: 16, title: 'Paramètres' },
  ];

  // Render Current Screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <Screen1Splash onNavigate={setCurrentScreen} />;
      case 'create-identity':
        return <Screen2CreateIdentity onNavigate={setCurrentScreen} />;
      case 'initial-config':
        return (
          <Screen3InitialConfig
            onNavigate={setCurrentScreen}
            onEnrollPasskey={handleRegisterPasskeyHardware}
          />
        );
      case 'dashboard':
        return (
          <Screen4Dashboard
            user={user}
            accounts={accounts}
            pendingAuth={pendingAuth}
            onNavigate={setCurrentScreen}
            onSelectAccount={(id) => setSelectedAccountId(id)}
            onQuickApproveAuth={handleQuickApproveAuth}
            onQuickBlockAuth={handleQuickBlockAuth}
          />
        );
      case 'accounts':
        return (
          <Screen5Accounts
            accounts={accounts}
            onNavigate={setCurrentScreen}
            onSelectAccount={(id) => setSelectedAccountId(id)}
            onOpenAddModal={() => setIsAddAccountModalOpen(true)}
          />
        );
      case 'account-detail':
        return (
          <Screen6AccountDetail
            account={selectedAccount}
            onNavigate={setCurrentScreen}
            onDeleteAccount={handleDeleteAccount}
            onTogglePasskey={handleTogglePasskey}
          />
        );
      case 'devices':
        return (
          <Screen7Devices
            devices={devices}
            recentDevices={recentDevices}
            onNavigate={setCurrentScreen}
            onOpenPairModal={() => setIsPairDeviceModalOpen(true)}
          />
        );
      case 'auth-request':
        return (
          <Screen8AuthRequest
            authRequest={pendingAuth || INITIAL_AUTH_REQUEST}
            onNavigate={setCurrentScreen}
            onBlock={handleQuickBlockAuth}
            onApprove={handleQuickApproveAuth}
          />
        );
      case 'scanner':
        return (
          <Screen9Scanner
            onNavigate={setCurrentScreen}
            onLinkAccount={(newAcc) => {
              handleAddAccount(newAcc);
              showToast(`Compte ${newAcc.name || 'externe'} lié avec succès !`);
              setCurrentScreen('accounts');
            }}
          />
        );
      case 'sensitive-action':
        return (
          <Screen10SensitiveAction
            actionData={sensitiveAction}
            onNavigate={setCurrentScreen}
            onBlock={handleBlockSensitiveAction}
            onSignAndAuthorize={handleSignSensitiveAction}
          />
        );
      case 'activity':
        return (
          <Screen11Activity
            activities={activities}
            onNavigate={setCurrentScreen}
          />
        );
      case 'security':
        return (
          <Screen12Security
            onNavigate={setCurrentScreen}
            onOpenTotpModal={() => setIsTotpModalOpen(true)}
          />
        );
      case 'lockdown':
        return (
          <Screen13Lockdown
            user={user}
            onNavigate={setCurrentScreen}
            onToggleLockdown={handleToggleLockdown}
          />
        );
      case 'recovery':
        return (
          <Screen14Recovery
            onNavigate={setCurrentScreen}
            onOpenRecoveryCodesModal={() => setIsRecoveryCodesModalOpen(true)}
          />
        );
      case 'identity':
        return (
          <Screen15Identity
            user={user}
            onNavigate={setCurrentScreen}
            onOpenQrIdentityModal={() => setIsQrIdentityModalOpen(true)}
          />
        );
      case 'settings':
        return (
          <Screen16Settings
            onNavigate={setCurrentScreen}
            onResetData={handleResetData}
          />
        );
      default:
        return (
          <Screen4Dashboard
            user={user}
            accounts={accounts}
            pendingAuth={pendingAuth}
            onNavigate={setCurrentScreen}
            onSelectAccount={(id) => setSelectedAccountId(id)}
            onQuickApproveAuth={handleQuickApproveAuth}
            onQuickBlockAuth={handleQuickBlockAuth}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Workspace Bar (Presenter & Screen Navigator) */}
      <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1 cursor-pointer" onClick={() => setCurrentScreen('dashboard')}>
            <span className="text-lg font-extrabold tracking-tight text-white font-['Space_Grotesk']">LUXIA</span>
            <span className="text-lg font-bold tracking-tight text-cyan-400 font-['Space_Grotesk']">Key</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono">
            FIDO2 · Passkeys
          </span>
        </div>

        {/* Center Zone: Screen Switcher (1-16) */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentScreen}
              onChange={(e) => {
                setCurrentScreen(e.target.value as ScreenId);
                if (viewMode === 'gallery') setViewMode('simulator');
              }}
              className="appearance-none bg-slate-950 border border-slate-700 hover:border-cyan-500/50 text-xs font-medium text-slate-200 py-1.5 pl-3 pr-8 rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer shadow-sm transition-all"
            >
              {screensInfo.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.num}. {s.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* SECURITY_MODE Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px]">
            <span className="text-slate-400 font-mono text-[10px] hidden sm:inline">MODE:</span>
            <button
              onClick={() => {
                const next = securityMode === 'real' ? 'demo' : 'real';
                setSecurityMode(next);
                showToast(next === 'real' ? 'Mode RÉEL activé (WebAuthn FIDO2 matériel)' : 'Mode DÉMO activé (Simulation)');
              }}
              className={`px-2 py-0.5 rounded-lg font-mono font-bold transition-colors ${
                securityMode === 'real'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/50'
              }`}
              title="Basculer entre vérification matérielle WebAuthn réelle et mode démonstration"
            >
              {securityMode === 'real' ? 'REAL' : 'DEMO'}
            </button>
          </div>

          {/* Quick Real Passkey Enrollment Trigger */}
          <button
            onClick={handleRegisterPasskeyHardware}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors"
            title="Générer une nouvelle Passkey matérielle FIDO2"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Enrôler Passkey</span>
          </button>

          {/* Quick Simulation Triggers */}
          <button
            onClick={() => {
              setPendingAuth(INITIAL_AUTH_REQUEST);
              setCurrentScreen('auth-request');
              showToast('Nouvelle alerte de connexion reçue !');
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 text-xs font-medium transition-colors"
            title="Déclencher une demande d'authentification frauduleuse à Londres"
          >
            <Bell className="w-3.5 h-3.5 text-red-400" />
            <span>Alerte Instagram</span>
          </button>

          <button
            onClick={() => {
              setCurrentScreen('sensitive-action');
            }}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 text-xs font-medium transition-colors"
            title="Vérifier une tentative de modification d'adresse email critique Google"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Action Google</span>
          </button>

          <button
            onClick={() => setIsTotpModalOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
            title="Ouvrir le trousseau de codes TOTP"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>Codes TOTP</span>
          </button>
        </div>

        {/* View Mode Switcher (Simulator / Responsive / Gallery) */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('simulator')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'simulator'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Simulateur</span>
          </button>

          <button
            onClick={() => setViewMode('responsive')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'responsive'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="hidden sm:inline">Plein Écran</span>
            <span className="sm:hidden">Web</span>
          </button>

          <button
            onClick={() => setViewMode('gallery')}
            className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              viewMode === 'gallery'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">16 Écrans</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col justify-center relative overflow-x-hidden">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* View Mode Renderer */}
        {viewMode === 'gallery' ? (
          <ScreenGallery
            user={user}
            accounts={accounts}
            selectedAccount={selectedAccount}
            devices={devices}
            recentDevices={recentDevices}
            pendingAuth={pendingAuth}
            sensitiveAction={sensitiveAction}
            activities={activities}
            onSelectScreenToSimulate={(s) => {
              setCurrentScreen(s);
              setViewMode('simulator');
            }}
            onSelectAccount={(id) => setSelectedAccountId(id)}
            onQuickApproveAuth={handleQuickApproveAuth}
            onQuickBlockAuth={handleQuickBlockAuth}
            onToggleLockdown={handleToggleLockdown}
            onDeleteAccount={handleDeleteAccount}
            onTogglePasskey={handleTogglePasskey}
            onResetData={handleResetData}
            onOpenAddModal={() => setIsAddAccountModalOpen(true)}
            onOpenPairModal={() => setIsPairDeviceModalOpen(true)}
            onOpenRecoveryCodesModal={() => setIsRecoveryCodesModalOpen(true)}
            onOpenQrIdentityModal={() => setIsQrIdentityModalOpen(true)}
            onOpenTotpModal={() => setIsTotpModalOpen(true)}
          />
        ) : (
          <div className="py-2 flex-1 flex flex-col justify-center items-center">
            <PhoneFrame
              currentScreen={currentScreen}
              onNavigate={setCurrentScreen}
              hasAlert={Boolean(pendingAuth)}
              onDynamicIslandClick={() => {
                if (pendingAuth) {
                  setCurrentScreen('auth-request');
                } else {
                  showToast('Enclave cryptographique LUXIA : active et inviolable.');
                }
              }}
              isSimulatorMode={viewMode === 'simulator'}
            >
              {renderCurrentScreen()}
            </PhoneFrame>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <BiometricModal
        isOpen={isBiometricModalOpen}
        title={biometricTitle}
        subtitle={biometricSubtitle}
        securityMode={securityMode}
        actionType={biometricActionType}
        onSuccess={() => {
          setIsBiometricModalOpen(false);
          if (biometricCallback) biometricCallback();
        }}
        onCancel={() => setIsBiometricModalOpen(false)}
      />

      <AddAccountModal
        isOpen={isAddAccountModalOpen}
        onClose={() => setIsAddAccountModalOpen(false)}
        onAddAccount={handleAddAccount}
      />

      <PairDeviceModal
        isOpen={isPairDeviceModalOpen}
        onClose={() => setIsPairDeviceModalOpen(false)}
        onDevicePaired={handleDevicePaired}
      />

      <RecoveryCodesModal
        isOpen={isRecoveryCodesModalOpen}
        onClose={() => setIsRecoveryCodesModalOpen(false)}
      />

      <QrIdentityModal
        isOpen={isQrIdentityModalOpen}
        onClose={() => setIsQrIdentityModalOpen(false)}
        user={user}
      />

      <TotpGeneratorModal
        isOpen={isTotpModalOpen}
        onClose={() => setIsTotpModalOpen(false)}
        accounts={accounts}
      />
    </div>
  );
}
