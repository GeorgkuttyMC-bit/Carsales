export interface CarBuyerLead {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  location: string;
  localityDistrict: string;
  interestedModel: string;
  channel: 'Arena' | 'Nexa';
  budget: string;
  intentScore: number;
  buyingTimeline: 'Immediate (Within 48h)' | 'Within 7 Days' | 'Within 2-3 Weeks' | 'Next Month';
  sourcePlatform: 'Team-BHP Kerala' | 'Facebook Kochi Car Hub' | 'OLX Exchange Inquiries' | 'Reddit r/Kochi' | 'Infopark IT Community' | 'Google Showroom Review Query' | 'Doorstep Web Portal';
  sourceSnippet: string;
  exchangeCar?: {
    makeModel: string;
    year: number;
    regNumber?: string;
    estimatedValue: string;
  };
  financingNeed: string;
  notes: string;
  status: 'New' | 'Contacted' | 'Test Drive Scheduled' | 'Quotation Shared' | 'Booked' | 'Cold / Follow-up Later';
  createdAt: string;
  tags: string[];
}

export interface MarutiCarModel {
  name: string;
  channel: 'Arena' | 'Nexa';
  category: 'Hatchback' | 'Sedan' | 'Compact SUV' | 'Mid SUV' | 'MPV' | 'Off-Roader';
  startingPriceExShowroom: string;
  kochiOnRoadRange: string;
  mileage: string;
  transmission: string;
  keyHighlight: string;
  waitingPeriodKochi: string;
  popularVariants: string[];
  image: string;
}

export interface PitchResult {
  whatsappEnglish: string;
  whatsappMalayalam: string;
  callScriptOpening: string;
  closingTip: string;
}

export interface ObjectionResult {
  quickComeback: string;
  malayalamComeback: string;
  keyFacts: string[];
  actionOffer: string;
}

export interface MarketIntel {
  topDemandedModelsKochi?: string[];
  waitingPeriodsKochi?: Record<string, string> | any[];
  kochiBuyerTrends?: string[];
  bankLoanOffersKerala?: Record<string, string> | any[];
  recommendedPitchHighlight?: string;
}

export interface DailySyncState {
  lastSyncedAt: string;
  nextSyncAt: string;
  autoSyncEnabled: boolean;
  syncFrequency: string;
  totalBatchesSynced: number;
  todayNewCount: number;
  lastBatchSource: string;
  history: {
    date: string;
    count: number;
    batchSummary: string;
  }[];
}

