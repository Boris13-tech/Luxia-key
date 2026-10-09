import React, { useState } from 'react';
import { ChevronLeft, Info, AlertTriangle, XCircle, CheckCircle2, Key, Laptop, ShieldCheck, X } from 'lucide-react';
import { ScreenId, SecurityActivity } from '../../types';

interface Screen11ActivityProps {
  activities: SecurityActivity[];
  onNavigate: (screen: ScreenId) => void;
}

export const Screen11Activity: React.FC<Screen11ActivityProps> = ({
  activities,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'logins' | 'actions' | 'alerts'>('all');
  const [selectedActivity, setSelectedActivity] = useState<SecurityActivity | null>(null);

  const filtered = activities.filter((act) => {
    if (filter === 'logins') return act.type === 'login_attempt' || act.type === 'login_approved';
    if (filter === 'actions') return act.type === 'email_change' || act.type === 'passkey_added' || act.type === 'device_paired';
    if (filter === 'alerts') return act.status === 'warning' || act.status === 'blocked';
    return true;
  });

  const todayActivities = filtered.filter((a) => a.dateGroup === 'today');
  const yesterdayActivities = filtered.filter((a) => a.dateGroup === 'yesterday');

  const getActivityIcon = (type: SecurityActivity['type'], status: SecurityActivity['status']) => {
    if (status === 'blocked') return <XCircle className="w-4 h-4 text-red-400" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    if (type === 'passkey_added') return <Key className="w-4 h-4 text-cyan-400" />;
    if (type === 'device_paired') return <Laptop className="w-4 h-4 text-sky-400" />;
    if (type === 'recovery_trigger') return <ShieldCheck className="w-4 h-4 text-indigo-400" />;
    return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  };

  const getIconContainerStyle = (status: SecurityActivity['status']) => {
    if (status === 'blocked') return 'bg-red-950/70 border-red-500/30';
    if (status === 'warning') return 'bg-amber-950/70 border-amber-500/30';
    return 'bg-slate-800/80 border-slate-700/60';
  };

  return (
    <div className="relative w-full h-full min-h-[680px] flex flex-col justify-between overflow-y-auto bg-slate-950 text-white select-none px-5 py-3">
      <div className="space-y-3.5 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-tight">Activité récente</h2>
          <button
            onClick={() => alert("Journal cryptographique d'audit inviolable LUXIA Ledger.")}
            className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Segment Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              filter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('logins')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              filter === 'logins'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800'
            }`}
          >
            Connexions
          </button>
          <button
            onClick={() => setFilter('actions')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              filter === 'actions'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800'
            }`}
          >
            Actions
          </button>
          <button
            onClick={() => setFilter('alerts')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 ${
              filter === 'alerts'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-900/70 text-slate-400 border border-slate-800'
            }`}
          >
            Alertes
          </button>
        </div>

        {/* Section: Aujourd'hui */}
        {todayActivities.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white pt-1">Aujourd'hui</h3>
            <div className="space-y-2">
              {todayActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getIconContainerStyle(act.status)}`}>
                      {getActivityIcon(act.type, act.status)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{act.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {act.service} · {act.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Hier */}
        {yesterdayActivities.length > 0 && (
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-bold text-white">Hier</h3>
            <div className="space-y-2">
              {yesterdayActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => setSelectedActivity(act)}
                  className="p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getIconContainerStyle(act.status)}`}>
                      {getActivityIcon(act.type, act.status)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{act.title}</h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {act.service} · {act.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">
                    {act.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Details Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl relative">
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${getIconContainerStyle(selectedActivity.status)}`}>
                  {getActivityIcon(selectedActivity.type, selectedActivity.status)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{selectedActivity.title}</h4>
                  <p className="text-xs text-slate-400">{selectedActivity.service}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs py-2 border-y border-slate-800">
                <div className="flex justify-between"><span className="text-slate-400">Heure</span><span className="font-mono text-white">{selectedActivity.timestamp}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Localisation</span><span className="text-white">{selectedActivity.location}</span></div>
                {selectedActivity.details?.ip && (
                  <div className="flex justify-between"><span className="text-slate-400">Adresse IP</span><span className="font-mono text-cyan-300">{selectedActivity.details.ip}</span></div>
                )}
                {selectedActivity.details?.device && (
                  <div className="flex justify-between"><span className="text-slate-400">Appareil</span><span className="text-white">{selectedActivity.details.device}</span></div>
                )}
                {selectedActivity.details?.riskLevel && (
                  <div className="flex justify-between"><span className="text-slate-400">Niveau de risque</span><span className="font-bold text-amber-400">{selectedActivity.details.riskLevel}</span></div>
                )}
              </div>

              {selectedActivity.details?.notes && (
                <p className="mt-3 text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {selectedActivity.details.notes}
                </p>
              )}

              <button
                onClick={() => setSelectedActivity(null)}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
