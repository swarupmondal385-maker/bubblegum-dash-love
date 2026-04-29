export type TaskBlock = {
  id: string;
  title: string;
  emoji: string;
  time: string;
  owner: string;
  tone: 'yellow' | 'pink' | 'mint' | 'purple' | 'peach' | 'blue';
  tasks: string[];
};

export const opsBlocks: TaskBlock[] = [
  {
    id: 'startup',
    title: 'Startup',
    emoji: '🚀',
    time: '9:00–9:30 AM',
    owner: 'All Team',
    tone: 'yellow',
    tasks: [
      'Sam: Check yesterday Excel — deals, pipeline, revenue',
      'Saniya: Manus AI 100 leads — categorise Hot/Warm/Cold',
      'Debojyoti: Clear overnight WhatsApp replies',
      'Argha: Schedule morning Reel or Story',
      'Suvo: Check all active project statuses',
    ],
  },
  {
    id: 'morning-calls',
    title: 'Morning Calls',
    emoji: '📞',
    time: '9:30 AM–1:00 PM',
    owner: 'Saniya',
    tone: 'pink',
    tasks: [
      'Saniya: Spy call if needed (SIM A — high-value only)',
      'Saniya: Pitch calls (SIM B) — 25 minimum before lunch',
      'Saniya: WhatsApp within 2 min of every interested lead',
      'Saniya: Handoff interested leads to Debojyoti with notes',
      'Debojyoti: Start demo sites for 3+ minute conversations',
      'Suvo: Active dev — Day 1–5 tasks on current projects',
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    emoji: '⚙️',
    time: '1:00–4:00 PM',
    owner: 'Debojyoti + Suvo',
    tone: 'mint',
    tasks: [
      'Debojyoti: Send WA Messages 2–5 to morning pipeline leads',
      'Debojyoti: Reverse psychology to 5+ day stale leads',
      'Debojyoti: Collect payments — send Razorpay links',
      'Suvo: Send Day 6 preview links — pass feedback via Debojyoti',
      'Argha: Batch film 2–3 videos for upcoming content',
      'Sam: Review pipeline — assist on high-ticket deals',
    ],
  },
  {
    id: 'afternoon-calls',
    title: 'Afternoon Calls',
    emoji: '☎️',
    time: '4:00–7:00 PM',
    owner: 'Saniya',
    tone: 'purple',
    tasks: [
      'Saniya: Round 2 pitch calls — focus on warm leads',
      'Saniya: Reconnect with morning no-answers',
      'Debojyoti: Drive demos to closing — payment link push',
      'Suvo: Push Day 7 launches live before EOD',
    ],
  },
  {
    id: 'wrapup',
    title: 'Wrap Up',
    emoji: '🌙',
    time: '7:00–8:00 PM',
    owner: 'All Team',
    tone: 'peach',
    tasks: [
      'Sam: Update master Excel — deals, revenue, leads',
      'Saniya: Log call counts + pipeline notes',
      'Debojyoti: Confirm tomorrow follow-up list',
      'Suvo: Commit code, push live builds',
      'Argha: Schedule tomorrow morning Reel',
      'Team: 10 min stand-down — wins + blockers',
      'Sam: Set tomorrow priorities',
    ],
  },
];

export const totalTasks = opsBlocks.reduce((s, b) => s + b.tasks.length, 0);

export const team = [
  { name: 'Sam', role: 'CEO', emoji: '👑', tone: 'yellow', tags: ['Vision', 'Strategy', 'Growth'] },
  { name: 'Saniya', role: 'Sales Executive', emoji: '📞', tone: 'pink', tags: ['Calls', 'Leads', 'Closures'] },
  { name: 'Debojyoti', role: 'Operations Manager', emoji: '⚙️', tone: 'mint', tags: ['Follow-ups', 'Demos', 'Delivery'] },
  { name: 'Argha', role: 'Social Media Manager', emoji: '🎬', tone: 'purple', tags: ['Content', 'Growth', 'Brand'] },
  { name: 'Suvo', role: 'Web Developer', emoji: '💻', tone: 'blue', tags: ['Build', 'Deliver', 'Optimise'] },
] as const;

export const workflow = [
  { step: 1, title: 'Manus AI → 100 leads', sub: 'Auto · 9 AM' },
  { step: 2, title: 'Saniya calls → Interested lead', sub: 'Saniya' },
  { step: 3, title: 'Demo site built', sub: 'Debojyoti' },
  { step: 4, title: 'Follow-up + close', sub: 'Debojyoti' },
  { step: 5, title: 'Project kickoff (Day 1–7)', sub: 'Suvo' },
  { step: 6, title: 'Delivery + payment', sub: 'Sam' },
];

export const coachPrompts = [
  'Gym Opener', 'Price High', 'Not Interested', 'No Time',
  'WA Follow-up', 'Clinic Opener', 'Closing Line',
];

export const rejectionLaws = [
  '"Every NO is closer to YES — keep dialing."',
  '"Tone over script. Confidence closes."',
  '"Listen 70%, talk 30%."',
  '"40 calls = a successful day. Deals are a side effect of volume."',
  '"Follow-up beats first-call every single time."',
];

export const monthlyTarget = 200000;
