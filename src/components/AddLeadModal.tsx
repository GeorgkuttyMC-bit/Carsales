import React, { useState } from 'react';
import { MARUTI_MODELS, KOCHI_LOCALITIES } from '../data/marutiModels';
import { UserPlus, X, Phone, Car, MapPin, Check } from 'lucide-react';
import { CarBuyerLead } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: (lead: CarBuyerLead) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onLeadAdded }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(KOCHI_LOCALITIES[1]);
  const [interestedModel, setInterestedModel] = useState(MARUTI_MODELS[0].name);
  const [budget, setBudget] = useState('₹8 - 11 Lakhs');
  const [buyingTimeline, setBuyingTimeline] = useState<CarBuyerLead['buyingTimeline']>('Within 7 Days');
  const [sourcePlatform, setSourcePlatform] = useState<CarBuyerLead['sourcePlatform']>('Facebook Kochi Car Hub');
  const [exchangeModel, setExchangeModel] = useState('');
  const [financingNeed, setFinancingNeed] = useState('SBI Car Loan');
  const [notes, setNotes] = useState('');
  const [intentScore, setIntentScore] = useState(90);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/^0+/, '')}`;

    const newLead: CarBuyerLead = {
      id: `lead-manual-${Date.now()}`,
      fullName,
      phone: formattedPhone,
      location,
      localityDistrict: 'Kochi, Ernakulam',
      interestedModel,
      channel: interestedModel.includes('Grand Vitara') || interestedModel.includes('Baleno') || interestedModel.includes('Fronx') || interestedModel.includes('Jimny') || interestedModel.includes('Invicto') ? 'Nexa' : 'Arena',
      budget,
      intentScore,
      buyingTimeline,
      sourcePlatform,
      sourceSnippet: notes || `Direct inquiry logged by sales consultant for ${interestedModel} at ${location}.`,
      exchangeCar: exchangeModel ? {
        makeModel: exchangeModel,
        year: 2016,
        estimatedValue: 'Evaluation pending',
      } : undefined,
      financingNeed,
      notes,
      status: 'New',
      createdAt: new Date().toISOString(),
      tags: ['Manual Entry', 'Direct Contact'],
    };

    onLeadAdded(newLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add New Kochi Prospect</h2>
              <p className="text-xs text-zinc-400">Log inquiry with contact details and vehicle requirement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Antony Jacob"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Mobile / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98471 23456"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Kochi Locality</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              >
                {KOCHI_LOCALITIES.slice(1).map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Model</label>
              <select
                value={interestedModel}
                onChange={(e) => setInterestedModel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              >
                {MARUTI_MODELS.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.channel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Source Channel</label>
              <select
                value={sourcePlatform}
                onChange={(e) => setSourcePlatform(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              >
                <option value="Facebook Kochi Car Hub">Facebook Kochi Car Hub</option>
                <option value="Team-BHP Kerala">Team-BHP Kerala</option>
                <option value="OLX Exchange Inquiries">OLX Exchange Inquiries</option>
                <option value="Reddit r/Kochi">Reddit r/Kochi</option>
                <option value="Infopark IT Community">Infopark IT Community</option>
                <option value="Google Showroom Review Query">Google Showroom Query</option>
                <option value="Doorstep Web Portal">Direct Web Portal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Buying Timeline</label>
              <select
                value={buyingTimeline}
                onChange={(e) => setBuyingTimeline(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              >
                <option value="Immediate (Within 48h)">Immediate (Within 48h)</option>
                <option value="Within 7 Days">Within 7 Days</option>
                <option value="Within 2-3 Weeks">Within 2-3 Weeks</option>
                <option value="Next Month">Next Month</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Exchange Car (Optional)</label>
              <input
                type="text"
                value={exchangeModel}
                onChange={(e) => setExchangeModel(e.target.value)}
                placeholder="e.g. 2015 Hyundai Eon / WagonR"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Financing Preference</label>
              <input
                type="text"
                value={financingNeed}
                onChange={(e) => setFinancingNeed(e.target.value)}
                placeholder="e.g. Federal Bank / SBI Car Loan / Cash"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Sales Notes & Specific Demands</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Wants test drive on Sunday at Kakkanad office, requested on-road quote."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Check className="w-4 h-4" /> Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
