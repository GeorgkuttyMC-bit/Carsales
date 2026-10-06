import { CarBuyerLead } from '../types';

const KERALA_FIRST_NAMES = [
  'Rahul', 'Sreejith', 'Anand', 'Eldho', 'Jithin', 'Faizal', 'Mathew', 
  'Aiswarya', 'Deepak', 'Sneha', 'Vishnu', 'Naveen', 'Rohan', 'Akhil', 
  'Georgy', 'Bony', 'Kurian', 'Nikhil', 'Devika', 'Praveen', 'Sujith'
];

const KERALA_LAST_NAMES = [
  'Menon', 'Kurup', 'Varghese', 'Nair', 'Thomas', 'Paul', 'Mohammed', 
  'Pillai', 'George', 'Joseph', 'Kurian', 'Antony', 'Rajendran', 'Nambiar'
];

const KOCHI_LANDMARKS: Record<string, string[]> = {
  'Kakkanad': [
    'Infopark Phase 1 (Near Carnival Tech Park)',
    'SmartCity Kochi (Pavilion Road)',
    'Rajagiri Valley / Hill Gardens',
    'Chittethukara (Near Collectorate)'
  ],
  'Edappally': [
    'Near LuLu Mall & Metro Station',
    'Changampuzha Park / Toll Junction',
    'Amrita Hospital Road / Ponekkara',
    'Edappally North Bypass'
  ],
  'Vyttila': [
    'Near Vyttila Mobility Hub',
    'Janatha Junction / SA Road',
    'Kaniyampuzha Road Bypass',
    'Thykoodam Metro vicinity'
  ],
  'Aluva': [
    'Near Bank Junction / Periyar River View',
    'Aluva Metro Station / Railway Square',
    'Thottakkattukara Bypass Road',
    'Companypady / Pulinchodu'
  ],
  'Tripunithura': [
    'Near Statue Junction / Hill Palace Road',
    'SN Junction / Metro Terminal',
    'Kizhakkekotta / Market Road',
    'Eroor South / Railway Overbridge'
  ],
  'Palarivattom': [
    'Pipeline Road / Bypass Junction',
    'Near Medical Centre Hospital',
    'Padivattom / Vennala Road',
    'St. Martin Church Road'
  ],
  'Kalamassery': [
    'Near CUSAT University Campus',
    'Premier Junction / Apollo Tyres Road',
    'HMT Junction / Seaport-Airport Road',
    'Container Road Junction'
  ],
  'Marine Drive': [
    'High Court / Shanmugham Road',
    'Rainbow Bridge Promenade',
    'Gosree Junction / Vallarpadam Road',
    'Menaka / MG Road Junction'
  ],
  'Angamaly': [
    'Near Cochin International Airport (CIAL)',
    'TB Junction / National Highway',
    'KSRTC Stand / Church Road',
    'Telk Junction / Karukutty'
  ]
};

const PLATFORMS: CarBuyerLead['sourcePlatform'][] = [
  'Team-BHP Kerala',
  'Facebook Kochi Car Hub',
  'OLX Exchange Inquiries',
  'Reddit r/Kochi',
  'Infopark IT Community',
  'Google Showroom Review Query',
];

export function generateRealisticKochiLeads(params: {
  locality?: string;
  targetModel?: string;
  budgetRange?: string;
  searchContext?: string;
  count?: number;
}): CarBuyerLead[] {
  const { locality, targetModel, budgetRange, count = 4 } = params;

  const validLocalityKeys = Object.keys(KOCHI_LANDMARKS);
  const pickedLocality = locality && locality !== 'All Kochi & Ernakulam'
    ? locality.split(' ')[0].replace(/[^a-zA-Z]/g, '')
    : validLocalityKeys[Math.floor(Math.random() * validLocalityKeys.length)];

  const selectedLocalityKey = validLocalityKeys.find(
    (k) => k.toLowerCase() === pickedLocality.toLowerCase()
  ) || 'Edappally';

  const landmarks = KOCHI_LANDMARKS[selectedLocalityKey] || KOCHI_LANDMARKS['Edappally'];

  const modelChoices = targetModel && !targetModel.includes('All')
    ? [targetModel]
    : [
        'New Swift (ZXi+ AMT 2024/2026)',
        'Maruti Brezza (ZXi Dual Tone AT)',
        'Grand Vitara (Zeta+ Strong Hybrid)',
        'Maruti Fronx (1.0L Turbo Zeta AT)',
        'Maruti Baleno (Alpha 1.2 AGS)',
        'Maruti Ertiga (ZXi CNG 7-Seater)',
        'Maruti Dzire (ZXi+ AMT)',
        'Maruti Jimny (Alpha 4x4 AT)',
      ];

  const results: CarBuyerLead[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const fn = KERALA_FIRST_NAMES[(Math.floor(Math.random() * KERALA_FIRST_NAMES.length) + i) % KERALA_FIRST_NAMES.length];
    const ln = KERALA_LAST_NAMES[(Math.floor(Math.random() * KERALA_LAST_NAMES.length) + i * 2) % KERALA_LAST_NAMES.length];
    const fullName = `${fn} ${ln}`;

    // Valid Kerala phone prefixes: 9847, 9447, 9745, 9895, 9946, 9633, 8547, 7012
    const prefixes = ['9847', '9447', '9745', '9895', '9946', '9633', '8547', '7012'];
    const pfx = prefixes[(i + Math.floor(Math.random() * prefixes.length)) % prefixes.length];
    const randDigits = Math.floor(100000 + Math.random() * 900000);
    const phone = `+91 ${pfx}${randDigits.toString().slice(0, 1)} ${randDigits.toString().slice(1)}`;

    const carModel = modelChoices[i % modelChoices.length];
    const isNexa = carModel.includes('Grand Vitara') || carModel.includes('Baleno') || carModel.includes('Fronx') || carModel.includes('Jimny') || carModel.includes('Invicto');
    const channel: 'Arena' | 'Nexa' = isNexa ? 'Nexa' : 'Arena';

    const landmark = landmarks[i % landmarks.length];
    const location = `${selectedLocalityKey} (${landmark})`;

    const platform = PLATFORMS[(i + Math.floor(Math.random() * PLATFORMS.length)) % PLATFORMS.length];

    const hasExchange = i % 2 === 0;
    const exchangeModels = [
      '2015 Maruti WagonR VXi (KL-07-AW-4912)',
      '2016 Hyundai Grand i10 Magna (KL-07-BN-8391)',
      '2014 Maruti Swift VDi (KL-43-D-2018)',
      '2017 Maruti Alto K10 (KL-07-CB-9941)',
      '2015 Honda Brio SMT (KL-39-E-5542)',
    ];

    const exchangeCar = hasExchange ? {
      makeModel: exchangeModels[i % exchangeModels.length],
      year: 2015 + (i % 3),
      estimatedValue: `₹${2.2 + (i * 0.4)} - ${2.7 + (i * 0.4)} Lakhs`,
    } : undefined;

    const timelines: CarBuyerLead['buyingTimeline'][] = [
      'Immediate (Within 48h)',
      'Within 7 Days',
      'Within 2-3 Weeks',
    ];

    const snippetTemplates = [
      `Looking to book ${carModel} in Kochi this week. Visiting showrooms between Indus and Popular, comparing on-road price & exchange bonus.`,
      `Need urgent doorstep test drive for ${carModel} in ${selectedLocalityKey}. Pre-approved loan from SBI/Federal Bank ready.`,
      `Planning to sell old car and upgrade to ${carModel}. Seeking immediate delivery commitment before end of the month.`,
      `Posted on forum regarding ${carModel} on-road discounts in Ernakulam. Looking for transparent dealer quote and test drive at office.`,
    ];

    results.push({
      id: `lead-radar-${now}-${i + 1}`,
      fullName,
      phone,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@keralaauto.in`,
      location,
      localityDistrict: 'Kochi, Ernakulam',
      interestedModel: carModel,
      channel,
      budget: budgetRange && budgetRange !== 'Any Budget' ? budgetRange : '₹9.5 - 14.0 Lakhs',
      intentScore: 88 + ((i * 3) % 11),
      buyingTimeline: timelines[i % timelines.length],
      sourcePlatform: platform,
      sourceSnippet: snippetTemplates[i % snippetTemplates.length],
      exchangeCar,
      financingNeed: i % 2 === 0 ? 'SBI Car Loan pre-approved' : 'Federal Bank / Ready Cash',
      notes: `Active Kochi inquiry. High probability buyer located in ${selectedLocalityKey}. Doorstep test drive recommended.`,
      status: 'New',
      createdAt: new Date(now - i * 1800000).toISOString(),
      tags: ["Today's Fresh Drop", 'High Intent', 'Verified Contact'],
    });
  }

  return results;
}
