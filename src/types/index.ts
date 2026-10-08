export type ScreenId =
  | 'splash'            // 1. Splash & Bienvenue
  | 'create-identity'   // 2. Créer votre identité
  | 'initial-config'    // 3. Configuration initiale
  | 'dashboard'         // 4. Accueil (Dashboard)
  | 'accounts'          // 5. Mes comptes
  | 'account-detail'    // 6. Détail d'un compte
  | 'devices'           // 7. Mes appareils
  | 'auth-request'      // 8. Demande d'authentification
  | 'scanner'           // 9. Scanner / Se connecter
  | 'sensitive-action'  // 10. Action sensible
  | 'activity'          // 11. Activité récente
  | 'security'          // 12. Sécurité
  | 'lockdown'          // 13. Verrouillage d'identité
  | 'recovery'          // 14. Récupération de compte
  | 'identity'          // 15. Mon identité
  | 'settings';         // 16. Paramètres

export interface AccountItem {
  id: string;
  name: string;
  handle: string;
  category: 'social' | 'email' | 'finance' | 'work';
  icon: string;
  color: string;
  passkeyActive: boolean;
  totpActive: boolean;
  notificationsActive: boolean;
  monitoringActive: boolean;
  email: string;
  phone: string;
  website: string;
  luxiaIntegration: string;
  createdAt: string;
  lastUsed: string;
  totpSecret?: string;
}

export interface DeviceItem {
  id: string;
  name: string;
  type: 'phone' | 'laptop' | 'desktop' | 'tablet' | 'watch';
  os: string;
  location: string;
  ip: string;
  isCurrent: boolean;
  isActive: boolean;
  lastActive: string;
  status: 'active' | 'inactive' | 'blocked' | 'approved';
}

export interface SecurityActivity {
  id: string;
  title: string;
  service: string;
  location: string;
  timestamp: string;
  dateGroup: 'today' | 'yesterday' | 'older';
  type: 'login_attempt' | 'blocked_attempt' | 'email_change' | 'login_approved' | 'passkey_added' | 'device_paired' | 'recovery_trigger';
  status: 'warning' | 'blocked' | 'approved' | 'info';
  details?: {
    ip?: string;
    device?: string;
    browser?: string;
    riskLevel?: 'Faible' | 'Moyen' | 'Élevé';
    notes?: string;
  };
}

export interface AuthRequestData {
  id: string;
  service: string;
  type: string;
  location: string;
  city: string;
  country: string;
  timeAgo: string;
  device: string;
  os: string;
  ip: string;
  browser: string;
  riskLevel: 'Faible' | 'Moyen' | 'Élevé';
  riskFactors: string[];
  resolved?: 'blocked' | 'approved';
}

export interface SensitiveActionData {
  id: string;
  service: string;
  actionTitle: string;
  currentEmail: string;
  newEmail: string;
  device: string;
  location: string;
  time: string;
  riskLevel: 'Élevé' | 'Critique';
  resolved?: 'blocked' | 'signed';
}

export interface UserProfile {
  name: string;
  handle: string;
  level: string;
  isVerified: boolean;
  email: string;
  phone: string;
  trustedDevicesCount: number;
  trustedContactsCount: number;
  verifiableCredentialsCount: number;
  securityScore: number;
  isLockedDown: boolean;
}
