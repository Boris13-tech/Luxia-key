import React from 'react';
import { Wifi, Signal, Battery, ShieldAlert } from 'lucide-react';

interface StatusBarProps {
  hasAlert?: boolean;
  onDynamicIslandClick?: () => void;
  darkText?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  hasAlert = false,
  onDynamicIslandClick,
  darkText = false,
}) => {
  return (
    <div className={`w-full px-7 pt-3 pb-1 flex items-center justify-between text-xs select-none relative z-30 ${darkText ? 'text-slate-900' : 'text-slate-200'}`}>
      {/* Clock */}
      <div className="font-semibold text-[14px] tracking-tight w-14">
        9:41
      </div>

      {/* Dynamic Island pill */}
      <div
        onClick={onDynamicIslandClick}
        className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md cursor-pointer hover:scale-[1.02] transition-transform active:scale-95 group"
        title="Dynamic Island - Cliquez pour inspecter"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-cyan-500 group-hover:scale-125 transition-transform"></div>
        </div>

        {hasAlert ? (
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            <ShieldAlert className="w-3 h-3 text-red-400" />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>SECURE</span>
          </div>
        )}

        <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800"></div>
      </div>

      {/* Signal, Wifi, Battery */}
      <div className="flex items-center gap-1.5 w-14 justify-end">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-current" />
      </div>
    </div>
  );
};
