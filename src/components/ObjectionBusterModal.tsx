import React, { useState } from 'react';
import { ObjectionResult } from '../types';
import { 
  ShieldAlert, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  MessageSquare, 
  Languages, 
  Gift, 
  X,
  Lightbulb
} from 'lucide-react';

interface ObjectionBusterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_OBJECTIONS = [
  {
    title: 'Punch vs Swift Safety',
    text: 'Customer says Tata Punch has 5-star safety rating, why should I buy New Swift?',
    model: 'New Swift',
  },
  {
    title: 'Creta vs Grand Vitara',
    text: 'Customer says Hyundai Creta feels more premium and features panoramic sunroof, why Grand Vitara?',
    model: 'Grand Vitara',
  },
  {
    title: 'Dealer Discount War',
    text: 'Customer says Indus Motors Edappally / Popular Maradu offered ₹35,000 more cash discount. Match it or I am booking there.',
    model: 'Any Maruti Model',
  },
  {
    title: 'AMT Gearbox Hesitation',
    text: 'Customer is worried that Maruti AGS/AMT is jerky in Kakkanad & Vyttila stop-and-go traffic.',
    model: 'Swift / Baleno / Fronx',
  },
  {
    title: 'Ertiga Waiting Period',
    text: 'Customer needs Ertiga CNG immediately, but official waiting period is 8 weeks.',
    model: 'Ertiga CNG',
  },
];

export const ObjectionBusterModal: React.FC<ObjectionBusterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedObjection, setSelectedObjection] = useState(COMMON_OBJECTIONS[0].text);
  const [targetModel, setTargetModel] = useState(COMMON_OBJECTIONS[0].model);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ObjectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSolveObjection = async (objectionText: string, modelName: string) => {
    setSelectedObjection(objectionText);
    setTargetModel(modelName);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sales/objection-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objection: objectionText,
          targetModel: modelName,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to solve objection');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error solving objection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Kerala Sales Objection Buster AI
                <span className="text-[11px] font-semibold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/30">
                  Deal Closer
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Winning counter-arguments, Kerala market facts, and conversational Malayalam scripts
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2">
              Select or Customize Customer Objection:
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_OBJECTIONS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSolveObjection(item.text, item.model)}
                  disabled={loading}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition text-left cursor-pointer ${
                    selectedObjection === item.text
                      ? 'bg-rose-600/20 border-rose-500 text-rose-200'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={selectedObjection}
              onChange={(e) => setSelectedObjection(e.target.value)}
              placeholder="Or type what the customer in Kochi just said..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
            />
            <button
              onClick={() => handleSolveObjection(selectedObjection, targetModel)}
              disabled={loading || !selectedObjection}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Counter
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              <p className="text-sm font-medium text-zinc-300">
                Formulating winning sales defense & Kerala dealer advantage...
              </p>
            </div>
          ) : analysis ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Quick English Comeback */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Instant Sales Comeback (English)
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg text-sm text-zinc-100 font-medium leading-relaxed border border-zinc-850">
                  "{analysis.quickComeback}"
                </div>
              </div>

              {/* Malayalam Script */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Languages className="w-3.5 h-3.5" />
                  കസ്റ്റമറോട് സംസാരിക്കാനുള്ള മലയാളം വാചകം
                </div>
                <div className="p-3 bg-zinc-900 rounded-lg text-sm text-emerald-200 leading-relaxed border border-zinc-850">
                  "{analysis.malayalamComeback}"
                </div>
              </div>

              {/* Key Hard Facts */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Kerala Market Proof Points (Maruti vs Competitors)
                </div>
                <ul className="space-y-1.5">
                  {analysis.keyFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Closing Action Offer */}
              {analysis.actionOffer && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                  <Gift className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold mb-0.5 text-amber-300">
                      Closing Action to Offer Right Now:
                    </strong>
                    <span>{analysis.actionOffer}</span>
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
