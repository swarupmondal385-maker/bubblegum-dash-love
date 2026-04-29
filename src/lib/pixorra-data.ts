export type TaskBlock = {
  id: string;
  title: string;
  emoji: string;
  time: string;
  owner: string;
  tone: 'amber' | 'pink' | 'mint' | 'violet' | 'orange' | 'blue';
  tasks: string[];
};

export const opsBlocks: TaskBlock[] = [
  {
    id: 'startup', title: 'Startup', emoji: '🚀', time: '9:00 – 9:30 AM',
    owner: 'All Team', tone: 'amber',
    tasks: [
      'Sam — Check yesterday Excel: deals, pipeline, revenue',
      'Saniya — Manus AI 100 leads: categorise Hot / Warm / Cold',
      'Debojyoti — Clear overnight WhatsApp replies',
      'Argha — Schedule morning Reel or Story',
      'Suvo — Check all active project statuses',
    ],
  },
  {
    id: 'morning-calls', title: 'Morning Calls', emoji: '📞', time: '9:30 AM – 1:00 PM',
    owner: 'Saniya', tone: 'pink',
    tasks: [
      'Saniya — Spy call if needed (SIM A, high-value only)',
      'Saniya — Pitch calls (SIM B): 25 minimum before lunch',
      'Saniya — WhatsApp within 2 min of every interested lead',
      'Saniya — Handoff interested leads to Debojyoti with notes',
      'Debojyoti — Start demo sites for 3+ minute conversations',
      'Suvo — Active dev: Day 1–5 tasks on current projects',
    ],
  },
  {
    id: 'operations', title: 'Operations', emoji: '⚙️', time: '1:00 – 4:00 PM',
    owner: 'Debojyoti + Suvo', tone: 'mint',
    tasks: [
      'Debojyoti — Send WA Messages 2–5 to morning pipeline leads',
      'Debojyoti — Reverse psychology to 5+ day stale leads',
      'Debojyoti — Collect payments: send Razorpay links',
      'Suvo — Send Day 6 preview links: pass feedback via Debojyoti',
      'Argha — Batch film 2–3 videos for upcoming content',
      'Sam — Review pipeline: assist on high-ticket deals',
    ],
  },
  {
    id: 'afternoon-calls', title: 'Afternoon Calls', emoji: '☎️', time: '4:00 – 7:00 PM',
    owner: 'Saniya', tone: 'violet',
    tasks: [
      'Saniya — Round 2 pitch calls: focus on warm leads',
      'Saniya — Reconnect with morning no-answers',
      'Debojyoti — Drive demos to closing: payment link push',
      'Suvo — Push Day 7 launches live before EOD',
    ],
  },
  {
    id: 'wrapup', title: 'Wrap Up', emoji: '🌙', time: '7:00 – 8:00 PM',
    owner: 'All Team', tone: 'orange',
    tasks: [
      'Sam — Update master Excel: deals, revenue, leads',
      'Saniya — Log call counts + pipeline notes',
      'Debojyoti — Confirm tomorrow follow-up list',
      'Suvo — Commit code, push live builds',
      'Argha — Schedule tomorrow morning Reel',
      'Team — 10 min stand-down: wins + blockers',
      'Sam — Set tomorrow priorities',
    ],
  },
];

export const totalTasks = opsBlocks.reduce((s, b) => s + b.tasks.length, 0);

export const team = [
  { name: 'Sam', role: 'CEO', emoji: '👑', tone: 'amber', tags: ['Vision', 'Strategy', 'Growth'], status: 'In office' },
  { name: 'Saniya', role: 'Sales Executive', emoji: '📞', tone: 'pink', tags: ['Calls', 'Leads', 'Closures'], status: 'On call' },
  { name: 'Debojyoti', role: 'Operations Manager', emoji: '⚙️', tone: 'mint', tags: ['Follow-ups', 'Demos', 'Delivery'], status: 'Available' },
  { name: 'Argha', role: 'Social Media Manager', emoji: '🎬', tone: 'violet', tags: ['Content', 'Growth', 'Brand'], status: 'Filming' },
  { name: 'Suvo', role: 'Web Developer', emoji: '💻', tone: 'blue', tags: ['Build', 'Deliver', 'Optimise'], status: 'Shipping' },
] as const;

export const workflow = [
  { step: 1, title: 'Manus AI delivers 100 leads', sub: 'Automated · 9 AM daily', icon: '🤖' },
  { step: 2, title: 'Saniya calls → Interested lead', sub: 'Saniya · SIM A/B', icon: '📞' },
  { step: 3, title: 'Demo site built', sub: 'Debojyoti · 30 min turnaround', icon: '🖥️' },
  { step: 4, title: 'Follow-up + close', sub: 'Debojyoti · WhatsApp + Razorpay', icon: '💬' },
  { step: 5, title: 'Project kickoff (Day 1–7)', sub: 'Suvo · Build & deliver', icon: '🚀' },
  { step: 6, title: 'Delivery + payment collected', sub: 'Sam · Reconcile', icon: '💎' },
];

export const coachPrompts = [
  { label: 'Gym Opener', icon: '🏋️' },
  { label: 'Price Too High', icon: '💸' },
  { label: 'Not Interested', icon: '🚫' },
  { label: 'No Time', icon: '⏱️' },
  { label: 'WA Follow-up', icon: '💬' },
  { label: 'Clinic Opener', icon: '🏥' },
  { label: 'Closing Line', icon: '🎯' },
  { label: 'Reverse Psych', icon: '🧠' },
];

export const rejectionLaws = [
  { n: 1, text: 'Every NO is closer to YES — keep dialing.' },
  { n: 2, text: 'Tone over script. Confidence closes.' },
  { n: 3, text: 'Listen 70%, talk 30%.' },
  { n: 4, text: '40 calls = a successful day. Deals are a side effect of volume.' },
  { n: 5, text: 'Follow-up beats first-call every single time.' },
];

export const monthlyTarget = 200000;

// Demo data (so the app feels alive)
export const sampleLeads = [
  { id: 'L-1024', name: 'Rajat Mehra', business: 'Mehra Fitness Hub', city: 'Kalyani', stage: 'new', value: 14999, hot: true, when: '12 min ago', phone: '+91 98765 12340' },
  { id: 'L-1023', name: 'Dr. Priya Sen', business: 'Sen Dental Clinic', city: 'Barrackpore', stage: 'demo', value: 24999, hot: true, when: '38 min ago', phone: '+91 98765 12341' },
  { id: 'L-1022', name: 'Karan Singh', business: 'KS Auto Garage', city: 'Naihati', stage: 'neg', value: 19999, hot: false, when: '1 h ago', phone: '+91 98765 12342' },
  { id: 'L-1021', name: 'Anita Roy', business: 'Bloom Beauty Salon', city: 'Kalyani', stage: 'demo', value: 14999, hot: true, when: '2 h ago', phone: '+91 98765 12343' },
  { id: 'L-1020', name: 'Sourav Das', business: 'Das Tiffin Service', city: 'Chakdaha', stage: 'won', value: 14999, hot: false, when: 'Yesterday', phone: '+91 98765 12344' },
  { id: 'L-1019', name: 'Ritika Banerjee', business: 'Cafe Verde', city: 'Kalyani', stage: 'lost', value: 14999, hot: false, when: 'Yesterday', phone: '+91 98765 12345' },
  { id: 'L-1018', name: 'Mohit Aggarwal', business: 'Aggarwal Sweets', city: 'Ranaghat', stage: 'new', value: 14999, hot: false, when: '2 d ago', phone: '+91 98765 12346' },
];

export const sampleClients = [
  { id: 'C-204', name: 'Sen Dental Clinic', owner: 'Dr. Priya Sen', city: 'Barrackpore', value: 24999, paid: 24999, status: 'completed', day: 7 },
  { id: 'C-205', name: 'Mehra Fitness Hub', owner: 'Rajat Mehra', city: 'Kalyani', value: 14999, paid: 7500, status: 'active', day: 3 },
  { id: 'C-206', name: 'Bloom Beauty Salon', owner: 'Anita Roy', city: 'Kalyani', value: 14999, paid: 0, status: 'active', day: 1 },
  { id: 'C-207', name: 'Das Tiffin Service', owner: 'Sourav Das', city: 'Chakdaha', value: 14999, paid: 14999, status: 'completed', day: 7 },
  { id: 'C-208', name: 'KS Auto Garage', owner: 'Karan Singh', city: 'Naihati', value: 19999, paid: 5000, status: 'hold', day: 4 },
];

// 7-day series — use seeded numbers so chart isn't flat
export const week7 = [
  { d: 'Thu', rev: 14999, calls: 22 },
  { d: 'Fri', rev: 0, calls: 28 },
  { d: 'Sat', rev: 29998, calls: 31 },
  { d: 'Sun', rev: 0, calls: 8 },
  { d: 'Mon', rev: 14999, calls: 26 },
  { d: 'Tue', rev: 24999, calls: 33 },
  { d: 'Wed', rev: 14999, calls: 24 },
];

export const activityFeed = [
  { id: 1, kind: 'won', who: 'Saniya', text: 'closed Sen Dental Clinic for ₹24,999', time: '2 m ago', icon: '💎' },
  { id: 2, kind: 'demo', who: 'Debojyoti', text: 'sent demo to Bloom Beauty Salon', time: '14 m ago', icon: '🖥️' },
  { id: 3, kind: 'call', who: 'Saniya', text: 'logged 12 morning calls (SIM B)', time: '1 h ago', icon: '📞' },
  { id: 4, kind: 'lead', who: 'Manus AI', text: 'delivered 100 fresh leads', time: '3 h ago', icon: '🤖' },
  { id: 5, kind: 'ship', who: 'Suvo', text: 'pushed Day 7 launch for Das Tiffin', time: '5 h ago', icon: '🚀' },
  { id: 6, kind: 'reel', who: 'Argha', text: 'scheduled morning Reel', time: '6 h ago', icon: '🎬' },
];
