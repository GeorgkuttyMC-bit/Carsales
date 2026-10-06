import React, { useState, useEffect } from 'react';
import { CarBuyerLead, DailySyncState } from './types';
import { KOCHI_LOCALITIES, MARUTI_MODELS } from './data/marutiModels';
import { LeadCard } from './components/LeadCard';
import { LeadScannerModal } from './components/LeadScannerModal';
import { PitchModal } from './components/PitchModal';
import { ObjectionBusterModal } from './components/ObjectionBusterModal';
import { EmiPriceCalculatorModal } from './components/EmiPriceCalculatorModal';
import { MarketIntelModal } from './components/MarketIntelModal';
import { AddLeadModal } from './components/AddLeadModal';
import { CustomerPortalView } from './components/CustomerPortalView';
import { DailySyncManagerModal } from './components/DailySyncManagerModal';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Phone, 
  Car, 
  MapPin, 
  Flame, 
  ShieldAlert, 
  Calculator, 
  TrendingUp, 
  Download, 
  UserPlus, 
  RefreshCw, 
  CheckCircle2, 
  Globe, 
  Users,
  Award,
  Layers,
  ArrowUpDown,
  Calendar,
  Zap,
  Clock
} from 'lucide-react';

export default function App() {
  const [leads, setLeads] = useState<CarBuyerLead[]>([]);
  const [dailySyncState, setDailySyncState] = useState<DailySyncState | null>(null);
  const [syncingToday, setSyncingToday] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'sales' | 'customer'>('sales');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('All Kochi & Ernakulam');
  const [selectedModel, setSelectedModel] = useState('All Models');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedPlatform, setSelectedPlatform] = useState('All Sources');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week'>('all');
  const [sortBy, setSortBy] = useState<'intent' | 'newest'>('intent');

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPitchOpen, setIsPitchOpen] = useState(false);
  const [selectedLeadForPitch, setSelectedLeadForPitch] = useState<CarBuyerLead | null>(null);
  const [isObjectionOpen, setIsObjectionOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isIntelOpen, setIsIntelOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isDailySyncModalOpen, setIsDailySyncModalOpen] = useState(false);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
      }
      if (data.dailySyncState) {
        setDailySyncState(data.dailySyncState);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerDailySync = async () => {
    setSyncingToday(true);
    try {
      const res = await fetch('/api/leads/trigger-daily-sync', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.newLeads) {
        setLeads((prev) => [...data.newLeads, ...prev]);
        if (data.dailySyncState) {
          setDailySyncState(data.dailySyncState);
        }
      }
    } catch (err) {
      console.error('Error during daily sync:', err);
    } finally {
      setSyncingToday(false);
    }
  };

  const handleUpdateSyncSettings = async (enabled: boolean, frequency: string) => {
    try {
      const res = await fetch('/api/leads/sync-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoSyncEnabled: enabled, syncFrequency: frequency }),
      });
      const data = await res.json();
      if (data.success && data.dailySyncState) {
        setDailySyncState(data.dailySyncState);
      }
    } catch (err) {
      console.error('Error updating sync settings:', err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: CarBuyerLead['status']) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );

    try {
      await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleLeadsDiscovered = (newLeads: CarBuyerLead[]) => {
    setLeads((prev) => [...newLeads, ...prev]);
  };

  const handleManualLeadAdded = (newLead: CarBuyerLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleOpenPitch = (lead: CarBuyerLead) => {
    setSelectedLeadForPitch(lead);
    setIsPitchOpen(true);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'Full Name',
      'Phone Number',
      'Location',
      'Interested Model',
      'Channel',
      'Budget',
      'Intent Score',
      'Buying Timeline',
      'Source Platform',
      'Status',
      'Exchange Car',
      'Created At',
    ];

    const rows = leads.map((l) => [
      `"${l.fullName}"`,
      `"${l.phone}"`,
      `"${l.location}"`,
      `"${l.interestedModel}"`,
      `"${l.channel}"`,
      `"${l.budget}"`,
      `"${l.intentScore}%"`,
      `"${l.buyingTimeline}"`,
      `"${l.sourcePlatform}"`,
      `"${l.status}"`,
      `"${l.exchangeCar ? l.exchangeCar.makeModel : 'None'}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kochi_Maruti_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads
  const filteredLeads = leads
    .filter((lead) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        lead.fullName.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.location.toLowerCase().includes(q) ||
        lead.interestedModel.toLowerCase().includes(q) ||
        (lead.exchangeCar?.makeModel && lead.exchangeCar.makeModel.toLowerCase().includes(q));

      const matchesLocality =
        selectedLocality === 'All Kochi & Ernakulam' ||
        lead.location.toLowerCase().includes(selectedLocality.split(' ')[0].toLowerCase());

      const matchesModel =
        selectedModel === 'All Models' ||
        lead.interestedModel.toLowerCase().includes(selectedModel.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All Statuses' || lead.status === selectedStatus;

      const matchesPlatform =
        selectedPlatform === 'All Sources' || lead.sourcePlatform === selectedPlatform;

      const isToday =
        lead.tags?.includes("Today's Fresh Drop") ||
        new Date(lead.createdAt).toDateString() === new Date().toDateString();

      const isWeek =
        Date.now() - new Date(lead.createdAt).getTime() <= 7 * 24 * 3600 * 1000;

      const matchesDate =
        dateFilter === 'all' ||
        (dateFilter === 'today' && isToday) ||
        (dateFilter === 'week' && isWeek);

      return matchesSearch && matchesLocality && matchesModel && matchesStatus && matchesPlatform && matchesDate;
    })
    .sort((a, b) => {
      if (sortBy === 'intent') {
        return b.intentScore - a.intentScore;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Key metrics
  const totalCount = leads.length;
  const todayDropsCount = leads.filter(
    (l) => l.tags?.includes("Today's Fresh Drop") || new Date(l.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const hotLeadsCount = leads.filter((l) => l.intentScore >= 90).length;
  const testDrivesCount = leads.filter((l) => l.status === 'Test Drive Scheduled').length;
  const bookedCount = leads.filter((l) => l.status === 'Booked').length;

  if (viewMode === 'customer') {
    return (
      <CustomerPortalView
        onLeadSubmitted={(newLead) => {
          setLeads((prev) => [newLead, ...prev]);
        }}
        onSwitchToSalesDashboard={() => setViewMode('sales')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased">
      {/* Top Navigation & Executive Badge */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo & Sales RM Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    KOCHI MARUTI SALES PRO
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Radar Active
                  </span>
                </div>
                <div className="text-xs text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>Kochi & Ernakulam (Popular & Indus Motors) • Arun Kumar (RM)</span>
                </div>
              </div>
            </div>

            {/* Quick Mode & Tool Switchers */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('customer')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold border border-zinc-700 transition cursor-pointer"
                title="Preview Customer Doorstep Booking Page"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Customer Portal Mode
              </button>

              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Scan Kochi Leads</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-zinc-400">Total Kochi Prospects</div>
              <div className="text-2xl font-black text-white font-mono mt-0.5">{totalCount}</div>
            </div>
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" /> Hot Intent (90%+)
              </div>
              <div className="text-2xl font-black text-rose-300 font-mono mt-0.5">{hotLeadsCount}</div>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-amber-400">Test Drives In Kochi</div>
              <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">{testDrivesCount}</div>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Car className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-400">Bookings Closed</div>
              <div className="text-2xl font-black text-emerald-300 font-mono mt-0.5">{bookedCount}</div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Automated Daily Lead Drop & Sync Bar */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-blue-950/40 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  Daily Kochi Lead Ingestion:
                  <span className="text-emerald-400 font-mono font-black">+{todayDropsCount} Fresh Today</span>
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Auto-Sync Active (Every 24h)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Last refreshed: {dailySyncState?.lastSyncedAt ? new Date(dailySyncState.lastSyncedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today 06:00 AM IST'} • Scrapes Team-BHP, FB Kochi, OLX & Reddit daily
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setDateFilter(dateFilter === 'today' ? 'all' : 'today')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
                dateFilter === 'today'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              {dateFilter === 'today' ? 'Showing Today\'s Leads Only' : `Filter Today's Drop (${todayDropsCount})`}
            </button>

            <button
              onClick={handleTriggerDailySync}
              disabled={syncingToday}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingToday ? 'animate-spin' : ''}`} />
              <span>{syncingToday ? 'Syncing Today\'s Batch...' : 'Sync Today\'s Fresh Drop'}</span>
            </button>

            <button
              onClick={() => setIsDailySyncModalOpen(true)}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition border border-zinc-700 cursor-pointer"
              title="Daily Scheduler & Archive Logs"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Tools Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-blue-950/40 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Kochi Sales Acceleration Command Center
            </h2>
            <p className="text-xs text-zinc-400">
              Direct contact numbers, doorstep test-drive scheduler, AI sales scripts & official Kerala RTO quotes
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-zinc-750 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              Kerala RTO & EMI Calc
            </button>

            <button
              onClick={() => setIsObjectionOpen(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-zinc-750 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              Objection Buster AI
            </button>

            <button
              onClick={() => setIsIntelOpen(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-zinc-750 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Kochi Market Radar
            </button>

            <button
              onClick={() => setIsAddLeadOpen(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-zinc-750 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-400" />
              Add Lead
            </button>

            <button
              onClick={handleExportCSV}
              className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl transition border border-zinc-750"
              title="Export Leads to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by buyer name, phone number (+91 9847...), locality, or exchange car..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Quick Refresh */}
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs text-zinc-400 hover:text-white transition flex items-center gap-1.5 shrink-0"
              title="Refresh Leads"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Kochi Locality
              </label>
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                {KOCHI_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Model Filter
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="All Models">All Models (Arena & Nexa)</option>
                {MARUTI_MODELS.map((m) => (
                  <option key={m.name} value={m.name.split(' ')[0]}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Lead Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="New">🟢 New Lead</option>
                <option value="Contacted">📞 Contacted</option>
                <option value="Test Drive Scheduled">🚗 Test Drive Scheduled</option>
                <option value="Quotation Shared">📄 Quotation Shared</option>
                <option value="Booked">🎉 Booked</option>
                <option value="Cold / Follow-up Later">⏳ Cold / Follow-up</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Source Platform
              </label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="All Sources">All 6 Platforms</option>
                <option value="Team-BHP Kerala">Team-BHP Kerala</option>
                <option value="Facebook Kochi Car Hub">FB Kochi Car Hub</option>
                <option value="OLX Exchange Inquiries">OLX Exchange</option>
                <option value="Reddit r/Kochi">Reddit r/Kochi</option>
                <option value="Infopark IT Community">Infopark Kakkanad</option>
                <option value="Google Showroom Review Query">Google Query</option>
                <option value="Doorstep Web Portal">Web Portal</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
              >
                <option value="intent">🔥 Highest Intent Score</option>
                <option value="newest">🕒 Most Recent Inquiry</option>
              </select>
            </div>
          </div>

          {/* Quick Date Scope Filter Buttons */}
          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2.5 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-zinc-400">Date Filter:</span>
              <button
                type="button"
                onClick={() => setDateFilter('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  dateFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                All Time ({leads.length})
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('today')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                  dateFilter === 'today'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3 text-amber-300" />
                Today's Fresh Drop ({todayDropsCount})
              </button>
              <button
                type="button"
                onClick={() => setDateFilter('week')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  dateFilter === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white'
                }`}
              >
                Past 7 Days
              </button>
            </div>

            <span className="text-[11px] text-zinc-500">
              Auto-updating everyday across Kerala automotive forums
            </span>
          </div>
        </div>

        {/* Lead Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Prospective Car Buyers in Kochi</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                {filteredLeads.length} leads
              </span>
            </h2>

            <span className="text-xs text-zinc-400 hidden sm:inline">
              Click <strong className="text-emerald-400">Call</strong> or <strong className="text-green-400">WhatsApp</strong> to connect directly with the buyer
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm text-zinc-300 font-medium">Loading Kochi car buyer leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="w-14 h-14 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Leads Matched Your Filter</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Try broadening your locality or model filter, or hit "Scan Kochi Leads" to scrape new prospects across Team-BHP, Facebook, and OLX.
              </p>
              <button
                onClick={() => setIsScannerOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Scan For New Kochi Leads
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onOpenPitch={handleOpenPitch}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <LeadScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onLeadsDiscovered={handleLeadsDiscovered}
      />

      <PitchModal
        lead={selectedLeadForPitch}
        isOpen={isPitchOpen}
        onClose={() => {
          setIsPitchOpen(false);
          setSelectedLeadForPitch(null);
        }}
      />

      <ObjectionBusterModal
        isOpen={isObjectionOpen}
        onClose={() => setIsObjectionOpen(false)}
      />

      <EmiPriceCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <MarketIntelModal
        isOpen={isIntelOpen}
        onClose={() => setIsIntelOpen(false)}
      />

      <AddLeadModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onLeadAdded={handleManualLeadAdded}
      />

      <DailySyncManagerModal
        isOpen={isDailySyncModalOpen}
        onClose={() => setIsDailySyncModalOpen(false)}
        syncState={dailySyncState}
        onTriggerSync={handleTriggerDailySync}
        onUpdateSettings={handleUpdateSyncSettings}
      />
    </div>
  );
}
