import React, { useState, useEffect } from 'react';
import { CarBuyerLead, PitchResult } from '../types';
import { DEALERSHIPS_KOCHI } from '../data/marutiModels';
import { 
  Sparkles, 
  MessageCircle, 
  Phone, 
  Copy, 
  Check, 
  Send, 
  Loader2, 
  Lightbulb, 
  User, 
  Car, 
  X,
  Languages
} from 'lucide-react';

interface PitchModalProps {
  lead: CarBuyerLead | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ lead, isOpen, onClose }) => {
  const [dealership, setDealership] = useState(DEALERSHIPS_KOCHI[0]);
  const [salesName, setSalesName] = useState('Arun Kumar (Senior Sales RM)');
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState<PitchResult | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'english' | 'malayalam' | 'call'>('english');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && lead) {
      generatePitch();
    }
  }, [isOpen, lead]);

  if (!isOpen || !lead) return null;

  const generatePitch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pitch/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          executiveName: salesName,
          dealership,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate pitch');
      }

      setPitch(data.pitch);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error generating sales pitch');
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
  const cleanPhoneForWa = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSendWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${cleanPhoneForWa}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Pitch & Outreach Generator
                <span className="text-[11px] font-semibold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                  {lead.interestedModel}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Tailored for {lead.fullName} • {lead.location} • {lead.phone}
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

        {/* Lead Context Pill */}
        <div className="px-6 py-2.5 bg-zinc-950/60 border-b border-zinc-850 flex items-center justify-between flex-wrap gap-2 text-xs text-zinc-300">
          <div className="flex items-center gap-3">
            <span>Budget: <strong className="text-white">{lead.budget}</strong></span>
            <span>Timeline: <strong className="text-amber-400">{lead.buyingTimeline}</strong></span>
            {lead.exchangeCar && (
              <span>Trade-in: <strong className="text-emerald-400">{lead.exchangeCar.makeModel}</strong></span>
            )}
          </div>
          <button
            onClick={generatePitch}
            disabled={loading}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
          >
            <Sparkles className="w-3 h-3" /> Regenerate Pitch
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-xs">
              {error}
            </div>
          )}

          {/* Dealership & RM Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Your Dealership / Showroom
              </label>
              <select
                value={dealership}
                onChange={(e) => setDealership(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                {DEALERSHIPS_KOCHI.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Sales RM Profile
              </label>
              <input
                type="text"
                value={salesName}
                onChange={(e) => setSalesName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium text-zinc-300">
                Crafting personalized Kochi sales pitch for {lead.fullName}...
              </p>
              <p className="text-xs text-zinc-500">
                Analyzing fuel economy, Kerala monsoon benefits & exchange bonus
              </p>
            </div>
          ) : pitch ? (
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <button
                  onClick={() => setActiveTab('english')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === 'english'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp (English)
                </button>
                <button
                  onClick={() => setActiveTab('malayalam')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === 'malayalam'
                      ? 'bg-green-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  WhatsApp (മലയാളം)
                </button>
                <button
                  onClick={() => setActiveTab('call')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                    activeTab === 'call'
                      ? 'bg-amber-600 text-white shadow'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  30s Phone Script (Manglish)
                </button>
              </div>

              {/* English Tab */}
              {activeTab === 'english' && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400">
                      Direct WhatsApp Pitch (English)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(pitch.whatsappEnglish, 'en')}
                        className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md flex items-center gap-1 transition"
                      >
                        {copiedType === 'en' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedType === 'en' ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleSendWhatsApp(pitch.whatsappEnglish)}
                        className="px-3 py-1 text-xs font-semibold bg-green-600 hover:bg-green-500 text-white rounded-md flex items-center gap-1.5 shadow transition"
                      >
                        <Send className="w-3.5 h-3.5" /> Send to WhatsApp
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg text-sm text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed border border-zinc-850">
                    {pitch.whatsappEnglish}
                  </div>
                </div>
              )}

              {/* Malayalam Tab */}
              {activeTab === 'malayalam' && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400">
                      വാട്സാപ്പ് മെസ്സേജ് (മലയാളം)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(pitch.whatsappMalayalam, 'ml')}
                        className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md flex items-center gap-1 transition"
                      >
                        {copiedType === 'ml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedType === 'ml' ? 'Copied' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleSendWhatsApp(pitch.whatsappMalayalam)}
                        className="px-3 py-1 text-xs font-semibold bg-green-600 hover:bg-green-500 text-white rounded-md flex items-center gap-1.5 shadow transition"
                      >
                        <Send className="w-3.5 h-3.5" /> Send to WhatsApp
                      </button>
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-900 rounded-lg text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed border border-zinc-850">
                    {pitch.whatsappMalayalam}
                  </div>
                </div>
              )}

              {/* Call Script Tab */}
              {activeTab === 'call' && (
                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400">
                      Direct Telephone Call Opening (Kochi / Kerala Tone)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(pitch.callScriptOpening, 'call')}
                        className="px-2.5 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-md flex items-center gap-1 transition"
                      >
                        {copiedType === 'call' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedType === 'call' ? 'Copied' : 'Copy'}
                      </button>
                      <a
                        href={`tel:${lead.phone}`}
                        className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center gap-1.5 shadow transition"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Now ({lead.phone})
                      </a>
                    </div>
                  </div>
                  <div className="p-3.5 bg-zinc-900 rounded-lg text-sm text-amber-200/90 whitespace-pre-wrap font-mono leading-relaxed border border-zinc-850">
                    {pitch.callScriptOpening}
                  </div>
                </div>
              )}

              {/* Psychological Closing Tip */}
              {pitch.closingTip && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold mb-0.5">Kochi Deal Closer Tip:</strong>
                    <span>{pitch.closingTip}</span>
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
