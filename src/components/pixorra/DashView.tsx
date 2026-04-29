import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { monthlyTarget } from '@/lib/pixorra-data';

const week = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
const revenueData = week.map((d) => ({ d, v: 0 }));
const callsData = week.map((d) => ({ d, v: 0 }));

const funnel = [
  { label: 'Leads', value: 100, max: 100, color: 'hsl(var(--yellow))', emoji: '🤖' },
  { label: 'Calls Made', value: 0, max: 100, color: 'hsl(var(--pink))', emoji: '📞' },
  { label: 'Conversations', value: 0, max: 100, color: 'hsl(var(--mint))', emoji: '💬' },
  { label: 'Demos Sent', value: 0, max: 100, color: 'hsl(var(--blue))', emoji: '🖥️' },
  { label: 'Follow-ups', value: 0, max: 100, color: 'hsl(var(--purple))', emoji: '📲' },
  { label: 'Deals Closed', value: 0, max: 100, color: 'hsl(var(--peach))', emoji: '💰' },
];

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass-card p-5 ${className}`}>{children}</div>
);

export const DashView = () => {
  const todayRevenue = 0;
  const monthlyPct = (todayRevenue / monthlyTarget) * 100;

  return (
    <div className="space-y-5">
      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 bg-gradient-hero shadow-glow text-white relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
        <div className="flex items-start justify-between gap-4 relative">
          <div>
            <p className="label-tiny text-white/80">Today's Revenue</p>
            <p className="font-display text-5xl mt-1 leading-none">₹{todayRevenue}</p>
            <p className="text-xs text-white/80 mt-2">0 deal(s) × ₹14,999 avg</p>
          </div>
          <div className="text-right">
            <p className="label-tiny text-white/80">Tasks</p>
            <p className="font-display text-4xl mt-1 leading-none">0<span className="text-2xl opacity-70">/28</span></p>
            <p className="text-xs text-white/80 mt-2">today</p>
          </div>
        </div>
        <div className="mt-5 relative">
          <div className="h-1.5 rounded-full bg-white/25 overflow-hidden">
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${monthlyPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-white rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-white/85">
            <span>{monthlyPct.toFixed(0)}% of monthly</span>
            <span>₹{monthlyTarget.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard tone="mint" label="Week Rev" value="₹0K" />
        <StatCard tone="pink" label="Week Calls" value="0" />
        <StatCard tone="purple" label="Today Calls" value="0" />
      </div>

      {/* 7-day revenue */}
      <Card>
        <p className="label-tiny mb-4">7-day Revenue</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 4]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-card)' }} />
              <Line type="monotone" dataKey="v" stroke="hsl(var(--pink))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--pink))' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Calls this week */}
      <Card>
        <p className="label-tiny mb-4">Calls this week</p>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={callsData} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 4]} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: 'var(--shadow-card)' }} />
              <Bar dataKey="v" fill="hsl(var(--purple))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Funnel */}
      <Card>
        <p className="label-tiny mb-4">Today's Funnel</p>
        <div className="space-y-4">
          {funnel.map((f) => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span>{f.emoji}</span> {f.label}
                </p>
                <span className="font-display text-base" style={{ color: f.color }}>{f.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(f.value / f.max) * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ background: f.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Conversion engine */}
      <Card>
        <p className="label-tiny mb-4">Conversion Engine</p>
        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--purple-soft))" strokeWidth="14" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--pink))" strokeWidth="14" strokeDasharray="0 251" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--mint))" strokeWidth="14" strokeDasharray="0 251" strokeDashoffset="-80" strokeLinecap="round" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--yellow))" strokeWidth="14" strokeDasharray="0 251" strokeDashoffset="-160" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="font-display text-2xl text-pink leading-none">0</p>
                <p className="label-tiny mt-1">Deals</p>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-3">
            {[
              { label: 'Call → Convo', color: 'hsl(var(--pink))' },
              { label: 'Convo → Demo', color: 'hsl(var(--mint))' },
              { label: 'Demo → Deal', color: 'hsl(var(--yellow))' },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold">{r.label}</span>
                  <span className="font-display" style={{ color: r.color }}>0%</span>
                </div>
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full" style={{ background: r.color, width: '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="rounded-3xl p-6 bg-gradient-card-mint border border-white/60 relative overflow-hidden"
      >
        <span className="absolute top-3 right-4 text-2xl opacity-50">✨</span>
        <p className="label-tiny text-emerald-700">Rejection Law #4</p>
        <p className="font-display italic text-base mt-2 text-emerald-900/80">
          "40 calls = a successful day. Deals are a side effect of volume."
        </p>
      </motion.div>
    </div>
  );
};

const StatCard = ({ tone, label, value }: { tone: 'mint' | 'pink' | 'purple'; label: string; value: string }) => {
  const map = {
    mint: { bg: 'bg-gradient-card-mint', text: 'text-emerald-700' },
    pink: { bg: 'bg-gradient-card-pink', text: 'text-pink' },
    purple: { bg: 'bg-gradient-card-purple', text: 'text-purple' },
  };
  return (
    <div className={`${map[tone].bg} rounded-2xl p-4 border border-white/60 shadow-card`}>
      <p className={`font-display text-2xl ${map[tone].text} leading-none`}>{value}</p>
      <p className="label-tiny mt-2">{label}</p>
    </div>
  );
};
