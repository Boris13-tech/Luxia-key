import React from 'react';
import { ChevronLeft, Smartphone, Laptop, Monitor, Tablet, Watch, Check, Plus, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ScreenId, DeviceItem } from '../../types';

interface Screen7DevicesProps {
  devices: DeviceItem[];
  recentDevices: DeviceItem[];
  onNavigate: (screen: ScreenId) => void;
  onOpenPairModal: () => void;
}

export const Screen7Devices: React.FC<Screen7DevicesProps> = ({
  devices,
  recentDevices,
  onNavigate,
  onOpenPairModal,
}) => {
  const getDeviceIcon = (type: DeviceItem['type']) => {
    switch (type) {
      case 'phone':
        return Smartphone;
      case 'laptop':
        return Laptop;
      case 'desktop':
        return Monitor;
      case 'tablet':
        return Tablet;
      case 'watch':
        return Watch;
      default:
        return Smartphone;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-4 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('security')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-tight">Mes appareils</h2>
          <div className="w-9 flex justify-end">
            <span className="text-xs text-slate-400 font-mono">{devices.length}</span>
          </div>
        </div>

        {/* Authorized Devices List */}
        <div className="space-y-2">
          {devices.map((device) => {
            const Icon = getDeviceIcon(device.type);
            return (
              <div
                key={device.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      {device.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {device.isCurrent ? (
                        <span className="text-cyan-400 font-medium">Cet appareil · Actif</span>
                      ) : (
                        <span>{device.os} · {device.location}</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="shrink-0">
                  {device.isActive ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-slate-600 bg-slate-800 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action: Associer un nouvel appareil */}
        <div className="pt-1">
          <button
            onClick={onOpenPairModal}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Associer un nouvel appareil</span>
          </button>
        </div>

        {/* Section: Appareils récents */}
        <div className="pt-2">
          <h3 className="text-xs font-bold text-white mb-2.5">Appareils récents</h3>

          <div className="space-y-2">
            {recentDevices.map((dev) => {
              const isBlocked = dev.status === 'blocked';
              return (
                <div
                  key={dev.id}
                  className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isBlocked
                        ? 'bg-red-950/80 border border-red-500/30 text-red-400'
                        : 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
                    }`}>
                      {isBlocked ? <ShieldAlert className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{dev.name}</h4>
                      <p className="text-[10px] text-slate-400">{dev.location}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      isBlocked
                        ? 'bg-red-950 text-red-400 border border-red-500/30'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {dev.lastActive}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
