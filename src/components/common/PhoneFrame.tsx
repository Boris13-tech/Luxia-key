import React from 'react';
import { StatusBar } from './StatusBar';
import { BottomNavBar } from './BottomNavBar';
import { ScreenId } from '../../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  hasAlert: boolean;
  onDynamicIslandClick: () => void;
  isSimulatorMode: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  currentScreen,
  onNavigate,
  hasAlert,
  onDynamicIslandClick,
  isSimulatorMode,
}) => {
  // Screens that show the fixed bottom tab bar
  const showBottomNav = ['dashboard', 'accounts', 'activity', 'security'].includes(currentScreen);

  if (!isSimulatorMode) {
    // Responsive Mobile/Web Viewport
    return (
      <div className="w-full max-w-md mx-auto min-h-screen bg-slate-950 flex flex-col shadow-2xl relative overflow-hidden text-slate-100 border-x border-slate-900">
        <StatusBar
          hasAlert={hasAlert}
          onDynamicIslandClick={onDynamicIslandClick}
        />
        <main className="flex-1 flex flex-col overflow-y-auto relative">
          {children}
        </main>
        {showBottomNav && (
          <BottomNavBar
            currentScreen={currentScreen}
            onNavigate={onNavigate}
            hasActivityAlert={hasAlert}
          />
        )}
        {/* iOS Home Indicator Bar */}
        <div className="w-full py-2 bg-slate-950 flex justify-center">
          <div className="w-32 h-1 bg-slate-700/80 rounded-full"></div>
        </div>
      </div>
    );
  }

  // Realistic iPhone 17 Pro Simulator Bezel
  return (
    <div className="relative mx-auto my-4 transition-all duration-300">
      {/* Outer Titanium Frame */}
      <div className="w-[395px] h-[835px] bg-[#1a1f2c] rounded-[52px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_3px_2px_rgba(255,255,255,0.1)] relative">
        {/* Hardware Buttons on sides */}
        {/* Silent / Action Button */}
        <div className="absolute -left-[13px] top-[115px] w-[3px] h-[26px] bg-[#2d3748] rounded-l-sm shadow-sm"></div>
        {/* Volume Up */}
        <div className="absolute -left-[13px] top-[160px] w-[3px] h-[50px] bg-[#2d3748] rounded-l-sm shadow-sm"></div>
        {/* Volume Down */}
        <div className="absolute -left-[13px] top-[225px] w-[3px] h-[50px] bg-[#2d3748] rounded-l-sm shadow-sm"></div>
        {/* Power Button */}
        <div className="absolute -right-[13px] top-[180px] w-[3px] h-[75px] bg-[#2d3748] rounded-r-sm shadow-sm"></div>

        {/* Inner OLED Display Glass */}
        <div className="w-full h-full bg-slate-950 rounded-[44px] overflow-hidden flex flex-col relative border border-slate-800/90 shadow-inner">
          {/* Status Bar with Dynamic Island */}
          <StatusBar
            hasAlert={hasAlert}
            onDynamicIslandClick={onDynamicIslandClick}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col overflow-y-auto relative no-scrollbar">
            {children}
          </main>

          {/* Bottom Tab Bar (if applicable on this screen) */}
          {showBottomNav && (
            <BottomNavBar
              currentScreen={currentScreen}
              onNavigate={onNavigate}
              hasActivityAlert={hasAlert}
            />
          )}

          {/* iOS Home Indicator Bar */}
          <div className="w-full pb-2 pt-1 bg-slate-950 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-600/80 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
