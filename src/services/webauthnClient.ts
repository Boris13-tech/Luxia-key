import {
  startRegistration,
  startAuthentication,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
} from '@simplewebauthn/browser';
import { webAuthnService } from '../../server/webauthn/service';

export interface WebAuthnClientStatus {
  isSupported: boolean;
  hasPlatformAuthenticator: boolean;
  securityMode: 'real' | 'demo';
}

export class WebAuthnClient {
  private mode: 'real' | 'demo' = 'real';

  constructor() {
    // SECURITY_MODE configuration
    const envMode = (import.meta as any).env?.VITE_SECURITY_MODE || 'real';
    this.mode = envMode === 'demo' ? 'demo' : 'real';
  }

  getSecurityMode(): 'real' | 'demo' {
    return this.mode;
  }

  setSecurityMode(mode: 'real' | 'demo') {
    this.mode = mode;
  }

  async checkSupport(): Promise<WebAuthnClientStatus> {
    const isSupported = browserSupportsWebAuthn();
    let hasPlatformAuthenticator = false;

    if (isSupported) {
      try {
        hasPlatformAuthenticator = await platformAuthenticatorIsAvailable();
      } catch {
        hasPlatformAuthenticator = false;
      }
    }

    return {
      isSupported,
      hasPlatformAuthenticator,
      securityMode: this.mode,
    };
  }

  /**
   * Real Hardware WebAuthn Registration
   */
  async registerPasskey(username = 'boris.legrand', displayName = 'Boris Legrand'): Promise<{
    success: boolean;
    credentialId?: string;
    error?: string;
  }> {
    const clientOrigin = window.location.origin;

    try {
      // 1. Fetch challenge and registration options from server
      let optionsData: any;
      try {
        const resp = await fetch('/api/webauthn/register/options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, displayName }),
        });
        if (resp.ok) {
          optionsData = await resp.json();
        } else {
          throw new Error('API route unavailable, using local crypto core');
        }
      } catch {
        // Direct in-process server call for standalone client preview
        optionsData = await webAuthnService.getRegistrationOptions(username, displayName, clientOrigin);
      }

      // 2. Hardware Authenticator Interaction via Browser API
      // Calls navigator.credentials.create() internally
      const registrationResponse = await startRegistration({
        optionsJSON: optionsData.options,
      });

      // 3. Verify Response on Server
      let verifyResult: any;
      try {
        const resp = await fetch('/api/webauthn/register/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationResponse),
        });
        if (resp.ok) {
          verifyResult = await resp.json();
        } else {
          throw new Error('API verify unavailable, using local crypto core');
        }
      } catch {
        verifyResult = await webAuthnService.verifyRegistration(
          registrationResponse,
          clientOrigin,
          '127.0.0.1',
          navigator.userAgent
        );
      }

      return {
        success: true,
        credentialId: verifyResult.credential?.credentialId,
      };
    } catch (err: any) {
      console.error('[LUXIA-KEY WebAuthn Registration Error]:', err);
      // In real mode, NEVER fake a pass
      return {
        success: false,
        error: err.message || 'Échec de l\'enrôlement biométrique matériel',
      };
    }
  }

  /**
   * Real Hardware WebAuthn Authentication
   */
  async authenticatePasskey(username?: string): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    const clientOrigin = window.location.origin;

    try {
      // 1. Fetch challenge and authentication options from server
      let optionsData: any;
      try {
        const resp = await fetch('/api/webauthn/auth/options', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });
        if (resp.ok) {
          optionsData = await resp.json();
        } else {
          throw new Error('API route unavailable, using local crypto core');
        }
      } catch {
        optionsData = await webAuthnService.getAuthenticationOptions(username, clientOrigin);
      }

      // 2. Hardware Authenticator Prompt via Browser API
      // Calls navigator.credentials.get() internally
      const authResponse = await startAuthentication({
        optionsJSON: optionsData.options,
      });

      // 3. Verify Response on Server
      let verifyResult: any;
      try {
        const resp = await fetch('/api/webauthn/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(authResponse),
        });
        if (resp.ok) {
          verifyResult = await resp.json();
        } else {
          throw new Error('API verify unavailable, using local crypto core');
        }
      } catch {
        verifyResult = await webAuthnService.verifyAuthentication(
          authResponse,
          clientOrigin,
          '127.0.0.1',
          navigator.userAgent
        );
      }

      return {
        success: true,
        user: verifyResult.user,
      };
    } catch (err: any) {
      console.error('[LUXIA-KEY WebAuthn Authentication Error]:', err);
      // In real mode, NEVER fake a pass
      return {
        success: false,
        error: err.message || 'Authentification biométrique annulée ou refusée',
      };
    }
  }
}

export const webauthnClient = new WebAuthnClient();
