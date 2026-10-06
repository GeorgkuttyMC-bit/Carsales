import React, { useState, useEffect } from 'react';
import { MarketIntel } from '../types';
import { 
  TrendingUp, 
  Loader2, 
  X, 
  Sparkles, 
  Clock, 
  Landmark, 
  Flame, 
  CheckCircle2, 
  Award,
  RefreshCw
} from 'lucide-react';

interface MarketIntelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MarketIntelModal: React.FC<MarketIntelModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [intel, setIntel] = useState<MarketIntel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !intel) {
      fetchIntel();
    }
  }, [isOpen]);

  const fetchIntel = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/market/intel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch market intel');
      }
      setIntel(data.intel);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error loading Kochi market intel');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Kochi & Ernakulam Auto Market Radar
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live Intelligence
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Trends, waiting periods, bank loan deals & sales closing recommendations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchIntel}
              disabled={loading}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              title="Refresh Intel"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm font-medium text-zinc-300">
                Synthesizing Kochi automotive market trends...
              </p>
            </div>
          ) : intel ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Highlight Advice */}
              {intel.recommendedPitchHighlight && (
                <div className="p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/40 rounded-xl space-y-1">
                  <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Executive Weekly Sales Strategy:
                  </span>
                  <p className="text-sm text-zinc-200 font-medium leading-relaxed">
                    {intel.recommendedPitchHighlight}
                  </p>
                </div>
              )}

              {/* Top Demanded Models */}
              {intel.topDemandedModelsKochi && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-400" /> Top In-Demand Models in Kochi
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {intel.topDemandedModelsKochi.map((mod: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-850 flex items-center gap-2 text-xs text-zinc-200"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold">{typeof mod === 'string' ? mod : JSON.stringify(mod)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kochi Buyer Trends */}
              {intel.kochiBuyerTrends && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2.5">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Kochi Consumer Behavior
                  </h3>
                  <div className="space-y-2">
                    {intel.kochiBuyerTrends.map((trend: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{typeof trend === 'string' ? trend : JSON.stringify(trend)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Car Loan Offers */}
              {intel.bankLoanOffersKerala && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-amber-400" /> Prevailing Kerala Car Loan Interest Rates
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {Object.entries(intel.bankLoanOffersKerala).map(([bank, rate]: [string, any], idx: number) => (
                      <div key={idx} className="p-3 bg-zinc-900 rounded-xl border border-zinc-850 text-center">
                        <span className="text-[11px] font-medium text-zinc-400 block truncate">{bank}</span>
                        <span className="text-sm font-bold text-amber-300 font-mono mt-0.5 block">{String(rate)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
