import React, { useState } from 'react';
import { DailySyncState } from '../types';
import { 
  Calendar, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  Zap, 
  History,
  Settings,
  BellRing
} from 'lucide-react';

interface DailySyncManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncState: DailySyncState | null;
  onTriggerSync: () => Promise<void>;
  onUpdateSettings: (enabled: boolean, frequency: string) => Promise<void>;
}

export const DailySyncManagerModal: React.FC<DailySyncManagerModalProps> = ({
  isOpen,
  onClose,
  syncState,
  onTriggerSync,
  onUpdateSettings,
}) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');
  const [freq, setFreq] = useState(syncState?.syncFrequency || 'Every 24 Hours');
  const [autoEnabled, setAutoEnabled] = useState(syncState?.autoSyncEnabled ?? true);
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setLoading(true);
    try {
      await onTriggerSync();
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    await onUpdateSettings(autoEnabled, freq);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Automated Daily Lead Refresh Engine
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Active 24/7
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Pulls fresh car buyer inquiries across Kochi platforms every single day
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="px-6 py-2.5 bg-zinc-950/60 border-b border-zinc-850 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            Daily Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            Daily Archive History
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            Scheduler Settings
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Daily Highlight Card */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-blue-950/40 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Everyday Automated Lead Radar</span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                    {syncState?.syncFrequency || 'Every 24 Hours'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <span className="text-[11px] text-zinc-400 block">Today's Fresh Leads</span>
                    <span className="text-xl font-black text-white font-mono mt-0.5 block">
                      +{syncState?.todayNewCount || 4} Drop
                    </span>
                  </div>
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                    <span className="text-[11px] text-zinc-400 block">Last Refreshed</span>
                    <span className="text-xs font-bold text-emerald-300 font-mono mt-1 block">
                      {formatDateTime(syncState?.lastSyncedAt)}
                    </span>
                  </div>
                  <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-zinc-400 block">Next Auto Drop</span>
                    <span className="text-xs font-bold text-blue-300 font-mono mt-1 block">
                      {formatDateTime(syncState?.nextSyncAt)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                  The automated daily scraper continuously monitors public automotive buying inquiries in Kochi (Team-BHP, Facebook Ernakulam Car Groups, OLX upgrades, and Reddit r/Kochi) and injects fresh prospects into your pipeline every day.
                </p>
              </div>

              {/* Force Trigger Card */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Want Today's Extra Drop Right Now?
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Force an immediate scan across Kochi platforms to pull fresh prospective buyers.
                  </p>
                </div>
                <button
                  onClick={handleManualSync}
                  disabled={loading}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Ingesting Today\'s Drop...' : 'Sync Today\'s Fresh Leads Now'}
                </button>
              </div>

              {/* What happens everyday */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Everyday Verification Protocol
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Scrapes newly published inquiries in Ernakulam localities (Kakkanad, Edappally, Aluva, Vyttila, Tripunithura, Palarivattom).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Extracts verified phone numbers and direct WhatsApp links for one-tap calling.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Identifies old trade-in cars (WagonR, Swift, i10) to pitch highest exchange bonuses.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Recent Daily Sync Drop History</span>
                <span className="font-mono text-zinc-500">{syncState?.history?.length || 0} batches recorded</span>
              </div>

              <div className="space-y-2.5">
                {(syncState?.history || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white font-mono">{item.date}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                          +{item.count} Leads
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{item.batchSummary}</p>
                    </div>
                    <span className="text-[11px] text-zinc-500 shrink-0">Automated</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">Automated Daily Synchronization</h4>
                    <p className="text-xs text-zinc-400">Automatically pull fresh leads on schedule</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoEnabled}
                    onChange={(e) => setAutoEnabled(e.target.checked)}
                    className="w-5 h-5 rounded border-zinc-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Sync Frequency
                  </label>
                  <select
                    value={freq}
                    onChange={(e) => setFreq(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Every 24 Hours">Every 24 Hours (Recommended Daily Cadence)</option>
                    <option value="Every 12 Hours">Every 12 Hours (Twice a day - Morning & Evening)</option>
                    <option value="Every 6 Hours">Every 6 Hours (High-Frequency Turbo)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {savedMessage ? (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settings saved!
                    </span>
                  ) : <span />}
                  <button
                    onClick={handleSaveSettings}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition"
                  >
                    Save Scheduler Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
