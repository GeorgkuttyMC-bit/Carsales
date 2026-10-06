import React, { useState } from 'react';
import { CarBuyerLead } from '../types';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  Car, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ArrowRightLeft, 
  CreditCard, 
  ExternalLink,
  Flame,
  Clock,
  Quote
} from 'lucide-react';

interface LeadCardProps {
  lead: CarBuyerLead;
  onOpenPitch: (lead: CarBuyerLead) => void;
  onUpdateStatus: (id: string, newStatus: CarBuyerLead['status']) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onOpenPitch, onUpdateStatus }) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
  const cleanPhoneForWa = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone.replace(/^0+/, '')}`;

  const defaultWaText = encodeURIComponent(
    `Namaskaram ${lead.fullName} Sir/Madam, I am Arun Kumar from Maruti Suzuki Kochi. Regarding your interest in the ${lead.interestedModel}, we have immediate test-drive delivery & special Kerala dealer benefits available in Ernakulam. May I share the on-road quote?`
  );

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(lead.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Status colors
  const statusColors: Record<CarBuyerLead['status'], { bg: string; text: string; border: string }> = {
    'New': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Contacted': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
    'Test Drive Scheduled': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Quotation Shared': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
    'Booked': { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/50' },
    'Cold / Follow-up Later': { bg: 'bg-zinc-500/10', text: 'text-zinc-400', border: 'border-zinc-500/30' },
  };

  // Platform badges
  const platformBadges: Record<string, { bg: string; text: string; label: string }> = {
    'Team-BHP Kerala': { bg: 'bg-red-500/20', text: 'text-red-300', label: 'Team-BHP Kerala' },
    'Facebook Kochi Car Hub': { bg: 'bg-blue-600/20', text: 'text-blue-300', label: 'FB Kochi Car Hub' },
    'OLX Exchange Inquiries': { bg: 'bg-purple-600/20', text: 'text-purple-300', label: 'OLX Kochi' },
    'Reddit r/Kochi': { bg: 'bg-orange-500/20', text: 'text-orange-300', label: 'Reddit r/Kochi' },
    'Infopark IT Community': { bg: 'bg-cyan-500/20', text: 'text-cyan-300', label: 'Infopark Kakkanad' },
    'Google Showroom Review Query': { bg: 'bg-amber-500/20', text: 'text-amber-300', label: 'Google Inquiry' },
    'Doorstep Web Portal': { bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Direct Web Portal' },
  };

  const badgeInfo = platformBadges[lead.sourcePlatform] || {
    bg: 'bg-zinc-800',
    text: 'text-zinc-300',
    label: lead.sourcePlatform,
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between">
      {/* Header Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${badgeInfo.bg} ${badgeInfo.text}`}>
                {badgeInfo.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${lead.channel === 'Nexa' ? 'bg-amber-950/60 text-amber-300 border border-amber-700/50' : 'bg-blue-950/60 text-blue-300 border border-blue-700/50'}`}>
                {lead.channel}
              </span>
              {(lead.tags?.includes("Today's Fresh Drop") || new Date(lead.createdAt).toDateString() === new Date().toDateString()) && (
                <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Today's Drop
                </span>
              )}
              {lead.intentScore >= 90 && (
                <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold animate-pulse">
                  <Flame className="w-3 h-3 text-rose-400" /> Hot {lead.intentScore}%
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold text-white truncate tracking-tight">{lead.fullName}</h3>
            
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="truncate">{lead.location}</span>
            </div>
          </div>

          {/* Status selector */}
          <div className="relative shrink-0">
            <select
              value={lead.status}
              onChange={(e) => onUpdateStatus(lead.id, e.target.value as CarBuyerLead['status'])}
              className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border appearance-none pr-6 cursor-pointer bg-zinc-950 ${statusColors[lead.status].text} ${statusColors[lead.status].border}`}
            >
              <option value="New">🟢 New Lead</option>
              <option value="Contacted">📞 Contacted</option>
              <option value="Test Drive Scheduled">🚗 Test Drive Scheduled</option>
              <option value="Quotation Shared">📄 Quotation Shared</option>
              <option value="Booked">🎉 Booked</option>
              <option value="Cold / Follow-up Later">⏳ Cold / Follow-up</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-1.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Interested Vehicle Box */}
        <div className="bg-zinc-950/80 rounded-lg p-3 border border-zinc-800/80 mb-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1 font-medium text-zinc-300">
              <Car className="w-3.5 h-3.5 text-blue-400" /> Target Vehicle:
            </span>
            <span className="text-zinc-300 font-semibold">{lead.budget}</span>
          </div>
          <div className="text-sm font-semibold text-white tracking-wide">
            {lead.interestedModel}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              Timeline: <strong className="text-zinc-200">{lead.buyingTimeline}</strong>
            </span>
          </div>
        </div>

        {/* Phone & Direct Contact Bar */}
        <div className="bg-zinc-800/60 rounded-lg p-2.5 flex items-center justify-between gap-2 border border-zinc-750">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-sm font-mono font-bold text-white tracking-wider">
              {lead.phone}
            </span>
            <button
              onClick={handleCopyPhone}
              title="Copy Phone Number"
              className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${lead.phone}`}
              className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md flex items-center gap-1 transition shadow-sm"
              title="Direct Call"
            >
              <Phone className="w-3 h-3" /> Call
            </a>
            <a
              href={`https://wa.me/${cleanPhoneForWa}?text=${defaultWaText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-xs font-semibold bg-green-600 hover:bg-green-500 text-white rounded-md flex items-center gap-1 transition shadow-sm"
              title="Open WhatsApp"
            >
              <MessageCircle className="w-3 h-3" /> WhatsApp
            </a>
          </div>
        </div>

        {/* Source Snippet Quote */}
        <div className="mt-3 p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800 text-xs text-zinc-300 italic relative">
          <Quote className="w-3 h-3 text-zinc-600 inline mr-1 -mt-1" />
          "{lead.sourceSnippet}"
        </div>

        {/* Trade-in / Financing Details dropdown */}
        {(lead.exchangeCar || lead.financingNeed) && (
          <div className="mt-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition"
            >
              <span>{showDetails ? 'Hide' : 'View'} Exchange & Loan Details</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>

            {showDetails && (
              <div className="mt-2 p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs space-y-1.5 animate-fadeIn">
                {lead.exchangeCar && (
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      Exchange Car: <strong className="text-white">{lead.exchangeCar.makeModel}</strong> ({lead.exchangeCar.year}) ~ Est. <span className="text-amber-400 font-semibold">{lead.exchangeCar.estimatedValue}</span>
                    </span>
                  </div>
                )}
                {lead.financingNeed && (
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Funding: <strong className="text-white">{lead.financingNeed}</strong></span>
                  </div>
                )}
                {lead.notes && (
                  <div className="text-zinc-400 border-t border-zinc-850 pt-1.5 mt-1.5">
                    <span className="text-zinc-500 font-medium">Notes:</span> {lead.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="text-[11px] text-zinc-500">
          Found {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>

        <button
          onClick={() => onOpenPitch(lead)}
          className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg flex items-center gap-1.5 shadow transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          AI Sales Pitch & Scripts
        </button>
      </div>
    </div>
  );
};
