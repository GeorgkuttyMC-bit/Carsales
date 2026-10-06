import React, { useState } from 'react';
import { MARUTI_MODELS, KOCHI_LOCALITIES } from '../data/marutiModels';
import { 
  Car, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ArrowRightLeft, 
  Clock, 
  Award,
  ChevronRight,
  MessageCircle
} from 'lucide-react';

interface CustomerPortalViewProps {
  onLeadSubmitted: (newLead: any) => void;
  onSwitchToSalesDashboard: () => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  onLeadSubmitted,
  onSwitchToSalesDashboard,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(KOCHI_LOCALITIES[1]);
  const [interestedModel, setInterestedModel] = useState(MARUTI_MODELS[0].name);
  const [preferredDate, setPreferredDate] = useState('This Weekend');
  const [hasExchange, setHasExchange] = useState(false);
  const [oldCarDetails, setOldCarDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setSubmitting(true);
    const newLeadPayload = {
      fullName,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      location,
      localityDistrict: 'Kochi, Ernakulam',
      interestedModel,
      buyingTimeline: 'Immediate (Within 48h)',
      budget: 'Customer Requested Quote',
      intentScore: 98,
      sourcePlatform: 'Doorstep Web Portal',
      sourceSnippet: `Customer ${fullName} requested free doorstep test drive for ${interestedModel} at ${location} (Date: ${preferredDate}). ${hasExchange ? `Exchange car: ${oldCarDetails}` : 'No exchange.'}`,
      exchangeCar: hasExchange && oldCarDetails ? {
        makeModel: oldCarDetails,
        year: 2017,
        estimatedValue: 'Pending Free Home Evaluation',
      } : undefined,
      notes: `Inbound direct booking from Kochi Web Portal. Requested doorstep test drive at ${location}.`,
      status: 'New',
      tags: ['Website Booking', 'Doorstep Test Drive', 'Urgent Lead'],
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLeadPayload),
      });
      const data = await res.json();
      if (data.success) {
        onLeadSubmitted(data.lead);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      onLeadSubmitted(newLeadPayload);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* Top Bar for Sales RM Switcher */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-2 text-xs text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Kochi Customer Booking Portal • Popular & Indus Authorized Consultant</span>
        </div>
        <button
          onClick={onSwitchToSalesDashboard}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer transition"
        >
          <span>Open Sales Executive Lead Radar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-950/30 via-zinc-950 to-zinc-950 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left pitch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Authorized Maruti Suzuki Senior Sales Consultant • Ernakulam & Kochi</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Get Your Dream Maruti Suzuki in Kochi with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                  Doorstep Test Drive
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl">
                Free doorstep test drive delivered to your home or office anywhere in Ernakulam — Kakkanad, Edappally, Aluva, Vyttila, Tripunithura or MG Road. Highest exchange valuation on old cars & immediate stock delivery!
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100% Free</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Doorstep Test Drive</div>
                </div>
                <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">₹55,000+</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Max Exchange Bonus</div>
                </div>
                <div className="bg-zinc-900/80 p-3.5 rounded-xl border border-zinc-800">
                  <div className="text-xl sm:text-2xl font-black text-blue-400 font-mono">7 Days</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Fast-track Delivery</div>
                </div>
              </div>
            </div>

            {/* Right Booking Form */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                {submitted ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Booking Request Received!</h3>
                    <p className="text-sm text-zinc-300">
                      Namaskaram {fullName}! Our Senior Sales Executive will call you at <strong className="text-emerald-400">{phone}</strong> within 15 minutes to confirm your doorstep test drive in {location}.
                    </p>
                    <a
                      href={`https://wa.me/919847142890?text=${encodeURIComponent(`Hi Arun, I just booked a doorstep test drive for ${interestedModel} at ${location}. Please send on-road quote!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-sm font-semibold transition shadow-lg"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp Now
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Book Doorstep Test Drive / Quote
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Instant priority booking for Kochi & Ernakulam residents
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sreejith Menon"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">
                        WhatsApp Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98471 28492"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Kochi Locality *
                        </label>
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
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Vehicle of Interest *
                        </label>
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

                    {/* Trade in old car checkbox */}
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/80 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="checkbox"
                          checked={hasExchange}
                          onChange={(e) => setHasExchange(e.target.checked)}
                          className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                        />
                        <span className="font-medium text-amber-300">
                          I want to exchange my old car (Get ₹50,000 extra bonus)
                        </span>
                      </label>
                      {hasExchange && (
                        <input
                          type="text"
                          value={oldCarDetails}
                          onChange={(e) => setOldCarDetails(e.target.value)}
                          placeholder="e.g. 2016 Swift VXi, 52,000 km, KL-07"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500"
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {submitting ? 'Submitting...' : 'Request Doorstep Test Drive in Kochi'}
                    </button>

                    <p className="text-[11px] text-zinc-500 text-center">
                      🔒 Official authorized showroom consultant. No spam guarantee.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Model Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Explore 2026 Maruti Suzuki Range in Kochi
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Authorized Arena & Nexa vehicles with Kerala on-road estimates & instant test drive availability
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARUTI_MODELS.map((car, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-zinc-950">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold shadow ${car.channel === 'Nexa' ? 'bg-amber-950/90 text-amber-300 border border-amber-600/50' : 'bg-blue-950/90 text-blue-300 border border-blue-600/50'}`}>
                      {car.channel}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-900/90 text-zinc-300 border border-zinc-700">
                      {car.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">{car.name}</h3>
                    <span className="text-xs font-semibold text-emerald-400">{car.mileage}</span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2">
                    {car.keyHighlight}
                  </p>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-1 text-xs">
                    <div className="flex justify-between text-zinc-300">
                      <span>Ex-Showroom from:</span>
                      <strong className="text-white font-mono">{car.startingPriceExShowroom}</strong>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Kochi On-Road Range:</span>
                      <strong className="text-amber-300 font-mono">{car.kochiOnRoadRange}</strong>
                    </div>
                    <div className="flex justify-between text-zinc-400 pt-1 border-t border-zinc-900 text-[11px]">
                      <span>Waiting in Ernakulam:</span>
                      <span className="text-zinc-200">{car.waitingPeriodKochi}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => {
                    setInterestedModel(car.name);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" /> Book Doorstep Test Drive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
