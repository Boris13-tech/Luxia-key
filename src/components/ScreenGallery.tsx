import React from 'react';
import { ScreenId, AccountItem, DeviceItem, SecurityActivity, AuthRequestData, SensitiveActionData, UserProfile } from '../types';
import { Screen1Splash } from './screens/Screen1Splash';
import { Screen2CreateIdentity } from './screens/Screen2CreateIdentity';
import { Screen3InitialConfig } from './screens/Screen3InitialConfig';
import { Screen4Dashboard } from './screens/Screen4Dashboard';
import { Screen5Accounts } from './screens/Screen5Accounts';
import { Screen6AccountDetail } from './screens/Screen6AccountDetail';
import { Screen7Devices } from './screens/Screen7Devices';
import { Screen8AuthRequest } from './screens/Screen8AuthRequest';
import { Screen9Scanner } from './screens/Screen9Scanner';
import { Screen10SensitiveAction } from './screens/Screen10SensitiveAction';
import { Screen11Activity } from './screens/Screen11Activity';
import { Screen12Security } from './screens/Screen12Security';
import { Screen13Lockdown } from './screens/Screen13Lockdown';
import { Screen14Recovery } from './screens/Screen14Recovery';
import { Screen15Identity } from './screens/Screen15Identity';
import { Screen16Settings } from './screens/Screen16Settings';
import { StatusBar } from './common/StatusBar';
import { BottomNavBar } from './common/BottomNavBar';
import { Smartphone, ExternalLink } from 'lucide-react';

interface ScreenGalleryProps {
  user: UserProfile;
  accounts: AccountItem[];
  selectedAccount: AccountItem | null;
  devices: DeviceItem[];
  recentDevices: DeviceItem[];
  pendingAuth: AuthRequestData | null;
  sensitiveAction: SensitiveActionData;
  activities: SecurityActivity[];
  onSelectScreenToSimulate: (screen: ScreenId) => void;
  onSelectAccount: (accountId: string) => void;
  onQuickApproveAuth: () => void;
  onQuickBlockAuth: () => void;
  onToggleLockdown: () => void;
  onDeleteAccount: (accountId: string) => void;
  onTogglePasskey: (accountId: string) => void;
  onResetData: () => void;
  onOpenAddModal: () => void;
  onOpenPairModal: () => void;
  onOpenRecoveryCodesModal: () => void;
  onOpenQrIdentityModal: () => void;
  onOpenTotpModal: () => void;
}

export const ScreenGallery: React.FC<ScreenGalleryProps> = ({
  user,
  accounts,
  selectedAccount,
  devices,
  recentDevices,
  pendingAuth,
  sensitiveAction,
  activities,
  onSelectScreenToSimulate,
  onSelectAccount,
  onQuickApproveAuth,
  onQuickBlockAuth,
  onToggleLockdown,
  onDeleteAccount,
  onTogglePasskey,
  onResetData,
  onOpenAddModal,
  onOpenPairModal,
  onOpenRecoveryCodesModal,
  onOpenQrIdentityModal,
  onOpenTotpModal,
}) => {
  const screensList: { id: ScreenId; title: string; num: number; component: React.ReactNode; showBottomNav?: boolean }[] = [
    {
      id: 'splash',
      num: 1,
      title: 'Splash & Bienvenue',
      component: <Screen1Splash onNavigate={onSelectScreenToSimulate} />,
    },
    {
      id: 'create-identity',
      num: 2,
      title: 'Créer votre identité',
      component: <Screen2CreateIdentity onNavigate={onSelectScreenToSimulate} />,
    },
    {
      id: 'initial-config',
      num: 3,
      title: 'Configuration initiale',
      component: <Screen3InitialConfig onNavigate={onSelectScreenToSimulate} />,
    },
    {
      id: 'dashboard',
      num: 4,
      title: 'Accueil (Dashboard)',
      showBottomNav: true,
      component: (
        <Screen4Dashboard
          user={user}
          accounts={accounts}
          pendingAuth={pendingAuth}
          onNavigate={onSelectScreenToSimulate}
          onSelectAccount={onSelectAccount}
          onQuickApproveAuth={onQuickApproveAuth}
          onQuickBlockAuth={onQuickBlockAuth}
        />
      ),
    },
    {
      id: 'accounts',
      num: 5,
      title: 'Mes comptes',
      showBottomNav: true,
      component: (
        <Screen5Accounts
          accounts={accounts}
          onNavigate={onSelectScreenToSimulate}
          onSelectAccount={onSelectAccount}
          onOpenAddModal={onOpenAddModal}
        />
      ),
    },
    {
      id: 'account-detail',
      num: 6,
      title: 'Détail d\'un compte',
      component: (
        <Screen6AccountDetail
          account={selectedAccount || accounts[0]}
          onNavigate={onSelectScreenToSimulate}
          onDeleteAccount={onDeleteAccount}
          onTogglePasskey={onTogglePasskey}
        />
      ),
    },
    {
      id: 'devices',
      num: 7,
      title: 'Mes appareils',
      component: (
        <Screen7Devices
          devices={devices}
          recentDevices={recentDevices}
          onNavigate={onSelectScreenToSimulate}
          onOpenPairModal={onOpenPairModal}
        />
      ),
    },
    {
      id: 'auth-request',
      num: 8,
      title: 'Demande d\'authentification',
      component: (
        <Screen8AuthRequest
          authRequest={
            pendingAuth || {
              id: 'sample',
              service: 'Instagram',
              type: 'Nouvelle connexion détectée',
              location: 'Londres, Royaume-Uni',
              city: 'Londres',
              country: 'Royaume-Uni',
              timeAgo: 'Il y a 2 minutes',
              device: 'iPhone 17 Pro',
              os: 'iOS 18',
              ip: '185.199.110.24',
              browser: 'Safari · Instagram',
              riskLevel: 'Élevé',
              riskFactors: [
                'Appareil inconnu',
                'Nouvelle localisation',
                'Première connexion sur cet appareil',
              ],
            }
          }
          onNavigate={onSelectScreenToSimulate}
          onBlock={onQuickBlockAuth}
          onApprove={onQuickApproveAuth}
        />
      ),
    },
    {
      id: 'scanner',
      num: 9,
      title: 'Scanner / Se connecter',
      component: (
        <Screen9Scanner
          onNavigate={onSelectScreenToSimulate}
          onLinkAccount={(newAcc) => onSelectScreenToSimulate('accounts')}
        />
      ),
    },
    {
      id: 'sensitive-action',
      num: 10,
      title: 'Action sensible',
      component: (
        <Screen10SensitiveAction
          actionData={sensitiveAction}
          onNavigate={onSelectScreenToSimulate}
          onBlock={() => alert('Modification de l\'adresse email bloquée !')}
          onSignAndAuthorize={() => alert('Action signée avec succès par clé matérielle !')}
        />
      ),
    },
    {
      id: 'activity',
      num: 11,
      title: 'Activité récente',
      showBottomNav: true,
      component: (
        <Screen11Activity
          activities={activities}
          onNavigate={onSelectScreenToSimulate}
        />
      ),
    },
    {
      id: 'security',
      num: 12,
      title: 'Sécurité',
      showBottomNav: true,
      component: (
        <Screen12Security
          onNavigate={onSelectScreenToSimulate}
          onOpenTotpModal={onOpenTotpModal}
        />
      ),
    },
    {
      id: 'lockdown',
      num: 13,
      title: 'Verrouillage d\'identité',
      component: (
        <Screen13Lockdown
          user={user}
          onNavigate={onSelectScreenToSimulate}
          onToggleLockdown={onToggleLockdown}
        />
      ),
    },
    {
      id: 'recovery',
      num: 14,
      title: 'Récupération de compte',
      component: (
        <Screen14Recovery
          onNavigate={onSelectScreenToSimulate}
          onOpenRecoveryCodesModal={onOpenRecoveryCodesModal}
        />
      ),
    },
    {
      id: 'identity',
      num: 15,
      title: 'Mon identité',
      showBottomNav: true,
      component: (
        <Screen15Identity
          user={user}
          onNavigate={onSelectScreenToSimulate}
          onOpenQrIdentityModal={onOpenQrIdentityModal}
        />
      ),
    },
    {
      id: 'settings',
      num: 16,
      title: 'Paramètres',
      component: (
        <Screen16Settings
          onNavigate={onSelectScreenToSimulate}
          onResetData={onResetData}
        />
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-2xl font-extrabold text-white font-['Space_Grotesk'] tracking-tight">LUXIA</span>
            <span className="text-2xl font-bold text-cyan-400 font-['Space_Grotesk'] tracking-tight">Key</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-mono font-medium ml-2">
              16 Écrans
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Vue d'ensemble architecturale complète du parcours utilisateur LUXIA Key. Cliquez sur un écran pour l'interagir en direct dans le simulateur.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => onSelectScreenToSimulate('dashboard')}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-950 transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4" />
            <span>Ouvrir dans le simulateur iPhone 17 Pro</span>
          </button>
        </div>
      </div>

      {/* Grid of 16 Mockup Frames */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {screensList.map((screen) => (
          <div
            key={screen.id}
            className="flex flex-col rounded-3xl bg-slate-900/60 border border-slate-800 p-3 hover:border-cyan-500/50 transition-all group"
          >
            {/* Header label */}
            <div className="flex items-center justify-between px-2 py-1.5 mb-2">
              <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300 transition-colors">
                {screen.num}. {screen.title}
              </span>
              <button
                onClick={() => onSelectScreenToSimulate(screen.id)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium group-hover:underline"
              >
                <span>Tester</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Scaled Phone Miniature */}
            <div
              onClick={() => onSelectScreenToSimulate(screen.id)}
              className="w-full h-[540px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col relative cursor-pointer shadow-lg hover:shadow-cyan-900/20 transition-all hover:scale-[1.01]"
            >
              <StatusBar hasAlert={screen.id === 'auth-request' || screen.id === 'dashboard'} />
              <div className="flex-1 overflow-y-auto no-scrollbar pointer-events-none">
                {screen.component}
              </div>
              {screen.showBottomNav && (
                <div className="pointer-events-none">
                  <BottomNavBar currentScreen={screen.id} onNavigate={() => {}} />
                </div>
              )}
              <div className="w-full py-1.5 bg-slate-950 flex justify-center">
                <div className="w-20 h-0.5 bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
