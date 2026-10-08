import React from 'react';

interface BrandIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ name, className = 'w-6 h-6', size = 24 }) => {
  const normalized = name.toLowerCase();

  if (normalized.includes('instagram')) {
    return (
      <div
        className={`rounded-xl flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{
          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          width: size,
          height: size,
        }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </div>
    );
  }

  if (normalized.includes('tiktok')) {
    return (
      <div
        className={`rounded-xl bg-black flex items-center justify-center shrink-0 border border-slate-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.06A6.34 6.34 0 0 0 3 15.68a6.34 6.34 0 0 0 10.82 4.49 6.3 6.3 0 0 0 1.87-4.49v-7.1a8.16 8.16 0 0 0 4.77 1.52v-3.41z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('facebook')) {
    return (
      <div
        className={`rounded-xl bg-[#1877F2] flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('twitter') || normalized === 'x') {
    return (
      <div
        className={`rounded-xl bg-black border border-slate-700 flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('google')) {
    return (
      <div
        className={`rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.65} height={size * 0.65}>
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('whatsapp')) {
    return (
      <div
        className={`rounded-xl bg-[#25D366] flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
          <path d="M12.031 2c-5.509 0-9.986 4.477-9.986 9.986 0 1.761.458 3.483 1.332 5.006L2 22l5.163-1.353a9.948 9.948 0 0 0 4.868 1.267h.004c5.508 0 9.986-4.477 9.986-9.986 0-5.509-4.478-9.986-9.99-9.986zm5.834 14.168c-.244.686-1.42 1.31-1.956 1.393-.509.078-1.171.11-1.895-.121-.439-.14-1.002-.326-1.73-.642-3.056-1.326-5.06-4.407-5.213-4.61-.153-.203-1.242-1.654-1.242-3.154s.783-2.237 1.061-2.544c.277-.306.604-.383.805-.383.201 0 .403.002.579.012.188.01.44-.071.688.525.257.614.88 2.148.956 2.304.076.155.127.337.025.541-.102.203-.153.33-.306.509-.153.178-.321.398-.458.535-.153.153-.312.32-.134.626.178.306.792 1.306 1.7 2.115 1.168 1.042 2.153 1.365 2.459 1.518.306.153.484.127.662-.076.178-.204.764-.891.968-1.196.204-.305.408-.255.688-.152.28.102 1.782.84 2.088.993.306.153.51.229.586.357.076.127.076.738-.168 1.424z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('youtube')) {
    return (
      <div
        className={`rounded-xl bg-[#FF0000] flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('snapchat')) {
    return (
      <div
        className={`rounded-xl bg-[#FFFC00] flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="black">
          <path d="M12 2.5c-4.14 0-6.5 2.86-6.5 6.3 0 1.25.32 2.5 1.05 3.25-.26.83-1.07 1.03-1.8 1.15-.35.06-.5.44-.27.71.55.65 1.48 1.05 2.52.95.35 1.22 1.4 2.14 3.1 2.14.7 0 1.4-.2 1.9-.4.5.2 1.2.4 1.9.4 1.7 0 2.75-.92 3.1-2.14 1.04.1 1.97-.3 2.52-.95.23-.27.08-.65-.27-.71-.73-.12-1.54-.32-1.8-1.15.73-.75 1.05-2 1.05-3.25 0-3.44-2.36-6.3-6.5-6.3z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('linkedin')) {
    return (
      <div
        className={`rounded-xl bg-[#0A66C2] flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('github')) {
    return (
      <div
        className={`rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
        </svg>
      </div>
    );
  }

  if (normalized.includes('binance')) {
    return (
      <div
        className={`rounded-xl bg-[#F0B90B] flex items-center justify-center shrink-0 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="#1E2026">
          <path d="M12 2l3.4 3.4-6.8 6.8L5.2 8.8 12 2zm0 20l-3.4-3.4 6.8-6.8 3.4 3.4L12 22zm-7.6-7.6l2.4-2.4 2.4 2.4-2.4 2.4-2.4-2.4zm15.2 0l2.4-2.4 2.4 2.4-2.4 2.4-2.4-2.4zm-7.6-2.4l3.4-3.4 3.4 3.4-3.4 3.4-3.4-3.4z"/>
        </svg>
      </div>
    );
  }

  // Default fallback shield
  return (
    <div
      className={`rounded-xl bg-cyan-600 flex items-center justify-center text-white shrink-0 font-bold ${className}`}
      style={{ width: size, height: size }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
