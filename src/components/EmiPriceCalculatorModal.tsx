import React, { useState } from 'react';
import { MARUTI_MODELS } from '../data/marutiModels';
import { 
  Calculator, 
  Send, 
  Copy, 
  Check, 
  X, 
  Percent, 
  IndianRupee, 
  FileText,
  Car
} from 'lucide-react';

interface EmiPriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCustomerPhone?: string;
  defaultCustomerName?: string;
}

export const EmiPriceCalculatorModal: React.FC<EmiPriceCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultCustomerPhone = '',
  defaultCustomerName = '',
}) => {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [exShowroom, setExShowroom] = useState<number>(649000);
  const [discount, setDiscount] = useState<number>(25000);
  const [exchangeBonus, setExchangeBonus] = useState<number>(20000);
  const [downPayment, setDownPayment] = useState<number>(150000);
  const [interestRate, setInterestRate] = useState<number>(8.75); // SBI Car Loan Kerala rate
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [customerPhone, setCustomerPhone] = useState(defaultCustomerPhone);
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Kerala Motor Vehicle Department Road Tax:
  // Under ₹5L: 9% | ₹5L to ₹10L: 11-13% (effective ~13%) | ₹10L to ₹15L: 15% | ₹15L to ₹20L: 15% | Above ₹20L: 21%
  const getKeralaRoadTax = (price: number) => {
    if (price < 500000) return price * 0.09;
    if (price <= 1000000) return price * 0.13;
    if (price <= 2000000) return price * 0.15;
    return price * 0.21;
  };

  const roadTax = Math.round(getKeralaRoadTax(exShowroom));
  const insurance = Math.round(exShowroom * 0.042 + 4500); // 1-yr Own Damage + 3-yr Third Party approx
  const registrationFastagTcs = Math.round(1500 + 600 + (exShowroom > 1000000 ? exShowroom * 0.01 : 0));
  const basicKitAccessories = 8500;

  const grossOnRoad = exShowroom + roadTax + insurance + registrationFastagTcs + basicKitAccessories;
  const netOnRoad = grossOnRoad - discount - exchangeBonus;

  // Loan calculation
  const loanAmount = Math.max(0, netOnRoad - downPayment);
  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  const emi = loanAmount > 0 && monthlyRate > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1))
    : 0;

  const totalPayableLoan = emi * totalMonths;
  const totalInterest = totalPayableLoan - loanAmount;

  const model = MARUTI_MODELS[selectedModelIndex];

  const handleSelectModel = (idx: number) => {
    setSelectedModelIndex(idx);
    const m = MARUTI_MODELS[idx];
    // extract starting numeric lakh
    const match = m.startingPriceExShowroom.match(/₹([\d.]+)/);
    if (match) {
      const lakhs = parseFloat(match[1]);
      const price = Math.round(lakhs * 100000);
      setExShowroom(price);
      setDownPayment(Math.round(price * 0.2));
    }
  };

  const quoteSummary = `*MARUTI SUZUKI KOCHI - ON-ROAD ESTIMATE*
Car: ${model.name} (${model.channel})
Prepared for: ${customerName || 'Valued Customer'}
Showroom: Ernakulam, Kerala

1. Ex-Showroom Price: ₹${exShowroom.toLocaleString('en-IN')}
2. Kerala RTO Tax: ₹${roadTax.toLocaleString('en-IN')}
3. Comprehensive Insurance (1+3 Yr): ₹${insurance.toLocaleString('en-IN')}
4. Reg, FASTag & Charges: ₹${registrationFastagTcs.toLocaleString('en-IN')}
5. Basic Kit: ₹${basicKitAccessories.toLocaleString('en-IN')}
-------------------------
*Gross On-Road:* ₹${grossOnRoad.toLocaleString('en-IN')}
*Special Festive Discount:* -₹${discount.toLocaleString('en-IN')}
*Exchange Bonus:* -₹${exchangeBonus.toLocaleString('en-IN')}
-------------------------
*FINAL NET ON-ROAD KOCHI:* ₹${netOnRoad.toLocaleString('en-IN')}

*EMI FINANCING BREAKDOWN:*
- Down Payment: ₹${downPayment.toLocaleString('en-IN')}
- Loan Amount: ₹${loanAmount.toLocaleString('en-IN')}
- Bank: SBI / Federal Bank (${interestRate}% p.a.)
- Tenure: ${tenureYears} Years (${totalMonths} months)
*Monthly EMI: ₹${emi.toLocaleString('en-IN')}/month*

Call/WhatsApp for Doorstep Test Drive anywhere in Kochi!`;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsAppQuote = () => {
    const clean = customerPhone.replace(/[^0-9]/g, '');
    const targetWa = clean.startsWith('91') ? clean : `91${clean.replace(/^0+/, '')}`;
    const url = targetWa.length >= 10
      ? `https://wa.me/${targetWa}?text=${encodeURIComponent(quoteSummary)}`
      : `https://wa.me/?text=${encodeURIComponent(quoteSummary)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Kerala On-Road Price & EMI Calculator
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  KL-07 RTO Accurate
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Official Kerala Motor Vehicle Tax slab calculation & instant WhatsApp quotation
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Model Selector Bar */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Select Vehicle to Quote:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
              {MARUTI_MODELS.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectModel(idx)}
                  className={`p-2 rounded-xl text-center border transition cursor-pointer flex flex-col items-center justify-center ${
                    selectedModelIndex === idx
                      ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xs font-bold truncate w-full">{m.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-zinc-500 truncate">{m.channel}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls (Left Column) */}
            <div className="lg:col-span-6 space-y-4 bg-zinc-950 p-5 rounded-2xl border border-zinc-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-850 pb-2">
                <Car className="w-4 h-4 text-blue-400" /> Price & Discount Inputs
              </h3>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Ex-Showroom Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 text-sm font-bold">₹</span>
                  <input
                    type="number"
                    value={exShowroom}
                    onChange={(e) => setExShowroom(Number(e.target.value))}
                    step="5000"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-sm text-white font-mono focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Special Cash Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    step="1000"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-emerald-400 font-mono focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Exchange Bonus (₹)
                  </label>
                  <input
                    type="number"
                    value={exchangeBonus}
                    onChange={(e) => setExchangeBonus(Number(e.target.value))}
                    step="1000"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-amber-400 font-mono focus:border-amber-500"
                  />
                </div>
              </div>

              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-850 pb-2 pt-2">
                <Percent className="w-4 h-4 text-emerald-400" /> EMI & Loan Settings
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Down Payment (₹)
                  </label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    step="10000"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Interest Rate (% p.a.)
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    step="0.05"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Loan Tenure: {tenureYears} Years ({tenureYears * 12} Months)
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6, 7].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setTenureYears(yr)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        tenureYears === yr
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {yr} Yrs
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-zinc-850 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Menon"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      Customer Phone (WhatsApp)
                    </label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 98471XXXXX"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results & Quotation Output (Right Column) */}
            <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3.5">
                <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Kochi On-Road Breakdown
                  </span>
                  <span className="text-xs font-semibold text-blue-400">
                    {model.name}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span>Ex-Showroom:</span>
                    <span className="font-mono font-semibold">₹{exShowroom.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Kerala RTO Tax (State MV Dept):</span>
                    <span className="font-mono font-semibold text-amber-300">₹{roadTax.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Comprehensive Insurance (1+3 Yr):</span>
                    <span className="font-mono font-semibold">₹{insurance.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Registration, FASTag, HP, Kit:</span>
                    <span className="font-mono font-semibold">₹{(registrationFastagTcs + basicKitAccessories).toLocaleString('en-IN')}</span>
                  </div>
                  
                  {(discount > 0 || exchangeBonus > 0) && (
                    <div className="border-t border-dashed border-zinc-800 pt-2 space-y-1">
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Dealer Festive Discount:</span>
                          <span className="font-mono font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      {exchangeBonus > 0 && (
                        <div className="flex justify-between text-amber-400">
                          <span>Old Car Exchange Bonus:</span>
                          <span className="font-mono font-semibold">-₹{exchangeBonus.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-zinc-700 pt-2 flex justify-between text-sm font-bold text-white">
                    <span>Final Net On-Road Price:</span>
                    <span className="font-mono text-emerald-400 text-base">₹{netOnRoad.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* EMI Box */}
                <div className="bg-gradient-to-br from-blue-950/60 to-indigo-950/60 border border-blue-800/50 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
                    <span>Estimated Monthly EMI</span>
                    <span>{tenureYears} Years @ {interestRate}%</span>
                  </div>
                  <div className="text-2xl font-mono font-black text-white">
                    ₹{emi.toLocaleString('en-IN')}<span className="text-sm font-normal text-zinc-400">/month</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 border-t border-blue-900/50 pt-1.5">
                    <span>Loan: ₹{loanAmount.toLocaleString('en-IN')}</span>
                    <span>Down Payment: ₹{downPayment.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyQuote}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Quotation Copied' : 'Copy Quote Text'}
                </button>
                <button
                  onClick={handleSendWhatsAppQuote}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-green-600/30 transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Share Quote on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
