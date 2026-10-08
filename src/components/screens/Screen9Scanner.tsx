import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Camera,
  CameraOff,
  QrCode,
  Key,
  Share2,
  CheckCircle2,
  Sparkles,
  Upload,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  X,
  RefreshCw,
} from 'lucide-react';
import jsQR from 'jsqr';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { ScreenId, AccountItem } from '../../types';
import { BrandIcon } from '../common/BrandIcon';

interface Screen9ScannerProps {
  onNavigate: (screen: ScreenId) => void;
  onLinkAccount: (account: Partial<AccountItem>) => void;
}

interface DetectedPayload {
  service: string;
  handle: string;
  category: 'social' | 'email' | 'finance' | 'work';
  passkeyActive: boolean;
  totpActive: boolean;
  email: string;
  website: string;
  rawPayload: string;
}

export const Screen9Scanner: React.FC<Screen9ScannerProps> = ({
  onNavigate,
  onLinkAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'generator' | 'manual'>('scan');

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Scanned payload & Confirmation Modal
  const [detectedData, setDetectedData] = useState<DetectedPayload | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dynamic QR Code Generator State (to generate an image to scan)
  const [genService, setGenService] = useState('Amazon AWS');
  const [genHandle, setGenHandle] = useState('boris.cloud');
  const [genCategory, setGenCategory] = useState<'social' | 'email' | 'finance' | 'work'>('work');
  const [genQrDataUrl, setGenQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Manual code
  const [manualCode, setManualCode] = useState('');

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'accès à la caméra n'est pas supporté par ce navigateur.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Accès caméra refusé. Activez la permission caméra dans votre navigateur.'
          : 'Impossible de démarrer la caméra. Vous pouvez utiliser le générateur dynamique ou l\'import d\'image.'
      );
      setIsCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Frame Scanning Loop using jsQR
  useEffect(() => {
    if (!isCameraActive || !videoRef.current || !canvasRef.current || detectedData) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    let scanning = true;

    const scanFrame = () => {
      if (!scanning) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          handleQrContentFound(code.data);
          scanning = false;
          return;
        }
      }

      animationFrameId.current = requestAnimationFrame(scanFrame);
    };

    animationFrameId.current = requestAnimationFrame(scanFrame);

    return () => {
      scanning = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isCameraActive, detectedData]);

  // Generate dynamic QR Code for testing and external link
  useEffect(() => {
    const payload = JSON.stringify({
      protocol: 'luxia_passkey_v1',
      action: 'link_account',
      service: genService,
      handle: genHandle,
      category: genCategory,
      passkeyActive: true,
      totpActive: false,
      timestamp: Date.now(),
      website: `${genService.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    });

    QRCode.toDataURL(
      payload,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      },
      (err, url) => {
        if (!err && url) {
          setGenQrDataUrl(url);
        }
      }
    );
  }, [genService, genHandle, genCategory]);

  // Parse QR content
  const handleQrContentFound = (rawContent: string) => {
    try {
      let parsed: any = null;
      if (rawContent.startsWith('{') && rawContent.endsWith('}')) {
        parsed = JSON.parse(rawContent);
      } else if (rawContent.startsWith('luxia://')) {
        const url = new URL(rawContent);
        parsed = {
          service: url.searchParams.get('service') || 'Compte Externe',
          handle: url.searchParams.get('handle') || 'boris.legrand',
          category: url.searchParams.get('category') || 'social',
          passkeyActive: url.searchParams.get('passkey') === 'true',
          totpActive: url.searchParams.get('totp') === 'true',
          website: url.searchParams.get('website') || 'external.com',
        };
      } else if (rawContent.startsWith('otpauth://')) {
        const url = new URL(rawContent);
        const label = decodeURIComponent(url.pathname.replace(/^\/\/?totp\//i, ''));
        const parts = label.split(':');
        parsed = {
          service: parts[0] || 'Service 2FA',
          handle: parts[1] || 'boris.legrand',
          category: 'social',
          passkeyActive: true,
          totpActive: true,
          website: 'service.com',
        };
      } else {
        // Fallback for simple string or test labels
        parsed = {
          service: rawContent.replace(/^(WebAuthn Passkey:\s*|FIDO2:\s*)/i, ''),
          handle: 'boris.legrand',
          category: 'work',
          passkeyActive: true,
          totpActive: false,
          website: 'service.com',
        };
      }

      setDetectedData({
        service: parsed.service || 'Nouveau Service',
        handle: parsed.handle || 'boris.legrand',
        category: (parsed.category as any) || 'social',
        passkeyActive: parsed.passkeyActive ?? true,
        totpActive: parsed.totpActive ?? false,
        email: 'boris.legrand@gmail.com',
        website: parsed.website || `${(parsed.service || 'service').toLowerCase().replace(/\s+/g, '')}.com`,
        rawPayload: rawContent,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#06b6d4', '#3b82f6', '#10b981'],
        });
      } catch {}
    } catch {
      // In case of error, show fallback detected payload
      setDetectedData({
        service: 'Service Externe',
        handle: 'boris.legrand',
        category: 'social',
        passkeyActive: true,
        totpActive: false,
        email: 'boris.legrand@gmail.com',
        website: 'external.com',
        rawPayload: rawContent,
      });
    }
  };

  // Image File Scanner Handler (scan a saved QR image from disk or photo library)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imgData.data, imgData.width, imgData.height);
          if (code && code.data) {
            handleQrContentFound(code.data);
          } else {
            alert('Aucun QR code lisible détecté dans cette image. Essayez une image plus nette.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Confirm Linking the Account into LUXIA Key
  const handleConfirmLink = () => {
    if (!detectedData) return;
    setIsProcessing(true);

    setTimeout(() => {
      onLinkAccount({
        name: detectedData.service,
        handle: detectedData.handle,
        category: detectedData.category,
        passkeyActive: detectedData.passkeyActive,
        totpActive: detectedData.totpActive,
        notificationsActive: true,
        monitoringActive: true,
        email: detectedData.email,
        phone: '+40 7XX XXX XXX',
        website: detectedData.website,
        luxiaIntegration: 'Passkey FIDO2 Liée par QR',
        createdAt: 'Aujourd\'hui',
        lastUsed: 'À l\'instant',
      });

      setIsProcessing(false);
      setDetectedData(null);
      stopCamera();
      onNavigate('accounts');
    }, 700);
  };

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      {/* Hidden processing canvas for webcam frames */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="space-y-3.5 pb-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => {
              stopCamera();
              onNavigate('dashboard');
            }}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h2 className="text-base font-bold text-white tracking-tight">Scanner un QR code</h2>
            <span className="text-[10px] text-cyan-400 font-mono">FIDO2 WebAuthn & Liaison</span>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/80 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('scan');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'scan'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Caméra</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('generator');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'generator'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Générer QR</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('manual');
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Manuel</span>
          </button>
        </div>

        {/* TAB 1: REAL CAMERA & VIEWFINDER SCANNER */}
        {activeTab === 'scan' && (
          <div className="space-y-3">
            <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-2xl">
              {/* Live Video Feed or Placeholder */}
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-lg">
                    <Camera className="w-7 h-7" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Caméra inactive</h4>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Activez votre webcam ou caméra pour scanner un QR code en temps réel.
                  </p>
                  <button
                    onClick={startCamera}
                    className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Démarrer le scan caméra</span>
                  </button>
                </div>
              )}

              {/* Viewfinder Overlays */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl pointer-events-none"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl pointer-events-none"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-xl pointer-events-none"></div>

              {/* Animated Laser Sweep when active */}
              {isCameraActive && (
                <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] animate-scan-laser z-20 pointer-events-none"></div>
              )}
            </div>

            {/* Camera Controls Bar */}
            <div className="flex items-center justify-center gap-2">
              {isCameraActive ? (
                <button
                  onClick={stopCamera}
                  className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  <CameraOff className="w-3.5 h-3.5 text-red-400" />
                  <span>Arrêter la caméra</span>
                </button>
              ) : (
                <button
                  onClick={startCamera}
                  className="py-2 px-3.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Activer la caméra</span>
                </button>
              )}

              {/* Upload image file to scan */}
              <label className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Importer une image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {cameraError && (
              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Quick Test: Scan the dynamically generated QR target directly */}
            <div className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-2">
              <span className="text-[11px] text-slate-400 block">
                Pas de deuxième écran sous la main ?
              </span>
              <button
                onClick={() => {
                  if (genQrDataUrl) {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        const code = jsQR(imgData.data, imgData.width, imgData.height);
                        if (code && code.data) {
                          handleQrContentFound(code.data);
                        }
                      }
                    };
                    img.src = genQrDataUrl;
                  }
                }}
                className="py-2 px-3.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-xs font-medium inline-flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tester le scan de l'image dynamique ({genService})</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: DYNAMIC QR CODE GENERATOR (To scan with another phone or webcam mirror) */}
        {activeTab === 'generator' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Compte externe à générer</span>
                <span className="text-[10px] text-cyan-400 font-mono">Image Dynamique</span>
              </div>

              {/* Service Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                {[
                  { name: 'Amazon AWS', cat: 'work' as const, handle: 'boris.cloud' },
                  { name: 'Proton Mail', cat: 'email' as const, handle: 'boris.security' },
                  { name: 'Coinbase Vault', cat: 'finance' as const, handle: 'boris.crypto' },
                  { name: 'Spotify Premium', cat: 'social' as const, handle: 'boris.audio' },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setGenService(item.name);
                      setGenCategory(item.cat);
                      setGenHandle(item.handle);
                    }}
                    className={`py-1 px-2.5 rounded-xl border shrink-0 transition-colors ${
                      genService === item.name
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Service</label>
                  <input
                    type="text"
                    value={genService}
                    onChange={(e) => setGenService(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Identifiant</label>
                  <input
                    type="text"
                    value={genHandle}
                    onChange={(e) => setGenHandle(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Generated QR Code Card */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center shadow-xl">
              <p className="text-[11px] text-slate-300 mb-2.5">
                Scannez ce QR Code avec votre caméra ou un second appareil :
              </p>

              {genQrDataUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-xl mb-3">
                  <img
                    src={genQrDataUrl}
                    alt="QR Code dynamique de liaison"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-slate-950 rounded-2xl flex items-center justify-center mb-3">
                  <RefreshCw className="w-6 h-6 text-slate-600 animate-spin" />
                </div>
              )}

              <div className="flex items-center gap-2 w-full">
                <button
                  onClick={() => {
                    if (genQrDataUrl) {
                      const link = document.createElement('a');
                      link.download = `luxia-link-${genService.toLowerCase()}.png`;
                      link.href = genQrDataUrl;
                      link.click();
                    }
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Télécharger l'image PNG
                </button>

                <button
                  onClick={() => {
                    handleQrContentFound(
                      JSON.stringify({
                        protocol: 'luxia_passkey_v1',
                        action: 'link_account',
                        service: genService,
                        handle: genHandle,
                        category: genCategory,
                        passkeyActive: true,
                        totpActive: false,
                        website: `${genService.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                      })
                    );
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-colors"
                >
                  Scanner ce QR
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANUAL CODE ENTRY */}
        {activeTab === 'manual' && (
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white">Saisir un code de session</h4>
            <p className="text-[11px] text-slate-400">Entrez le code ou l'URL WebAuthn / TOTP fournie.</p>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="ex: AWS-PASSKEY-8821"
              className="w-full text-center tracking-widest text-sm font-mono py-3 rounded-2xl bg-slate-950 border border-slate-700 text-cyan-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => {
                if (manualCode) {
                  handleQrContentFound(manualCode);
                }
              }}
              disabled={!manualCode}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs transition-all"
            >
              Valider et lier le compte
            </button>
          </div>
        )}

        {/* Bottom caption */}
        <div className="pt-1 text-center">
          <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
            Décodeur universel conforme FIDO2, W3C Passkeys et RFC 6238.
          </p>
        </div>
      </div>

      {/* CONFIRMATION MODAL WHEN A QR CODE IS DETECTED */}
      {detectedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900 border border-cyan-500/50 rounded-3xl p-5 shadow-2xl relative">
            <button
              onClick={() => setDetectedData(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <BrandIcon name={detectedData.service} size={44} className="rounded-2xl shadow-md" />
              <div>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30">
                  Liaison détectée
                </span>
                <h3 className="text-base font-bold text-white mt-1">{detectedData.service}</h3>
                <p className="text-xs text-slate-400">{detectedData.handle}</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Protocole</span>
                <span className="text-cyan-300 font-medium">Passkey FIDO2 Matériel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Catégorie</span>
                <span className="text-white capitalize">{detectedData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Site Web</span>
                <span className="text-slate-300 font-mono text-[11px]">{detectedData.website}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleConfirmLink}
                disabled={isProcessing}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 active:scale-95 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Enrôlement de la Passkey...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Lier ce compte à LUXIA Key</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setDetectedData(null)}
                className="w-full py-2 text-xs text-slate-400 hover:text-white"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
