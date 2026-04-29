import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Phone, Users, IndianRupee, Target, Activity, Zap, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { week7, monthlyTarget, activityFeed, sampleLeads, rejectionLaws } from '@/lib/pixorra-data';
import { AnimatedCounter } from './AnimatedCounter';

const todayRevenue = 14999;
const weekRev = week7.reduce((s, d) => s + d.rev, 0);
const weekCalls = week7.reduce((s, d) => s + d.calls, 0);
const monthlyPct = Math.min(100, (weekRev / monthlyTarget) * 100);

const funnel = [
  { label: 'Leads', value: 100, max: 100, color: 'var(--aurora-amber)', icon: '🤖' },
  { label: 'Calls Made', value: 24, max: 100, color: 'var(--aurora-pink)', icon: '📞' },
  { label: 'Conversations', value: 12, max: 100, color: 'var(--aurora-magenta)', icon: '💬' },
  { label: 'Demos Sent', value: 6, max: 100, color: 'var(--aurora-violet)', icon: '🖥️' },
  { label: 'Follow-ups', value: 4, max: 100, color: 'var(--aurora-blue)', icon: '📲' },
  { label: 'Deals Closed', value: 1, max: 100, color: 'var(--aurora-mint)', icon: '💎' },
];

export const DashView = () => {
  const law = rejectionLaws[3];
  const hotLeads = sampleLeads.filter((l) => l.hot).slice(0, 3);

  return (
    <div className="space-y-4">
      {/* HERO — premium aurora card */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl p-6 border-2 border-white/40 shadow-glow"
      >
        <div className="absolute inset-0 bg-gradient-cta" />
        <div className="absolute inset-0 bg-gradient-aurora opacity-60 animate-aurora-pulse mix-blend-overlay" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/15" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="pill bg-white/15 backdrop-blur text-white border border-white/25">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-mint animate-pulse" />
              <span className="font-mono text-[9px] tracking-widest">LIVE</span>
            </span>
            <span className="text-[10px] text-white/70 font-mono tracking-wider">SYNCED 2 MIN AGO</span>
          </div>

          <p className="label-tiny text-white/70">Today's Revenue</p>
          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="font-serif text-6xl text-white leading-none tracking-tight">
              <AnimatedCounter value={todayRevenue} prefix="₹" />
            </h2>
            <span className="pill bg-aurora-mint/25 text-white border border-aurora-mint/40">
              <TrendingUp className="h-3 w-3" />
              +18%
            </span>
          </div>
          <p className="text-xs text-white/70 mt-2 font-mono">1 deal closed · ₹14,999 avg ticket</p>

          {/* Monthly progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-[11px] text-white/80 mb-2 font-mono">
              <span>Monthly target</span>
              <span>{monthlyPct.toFixed(0)}% · ₹{(weekRev / 1000).toFixed(0)}K of ₹{(monthlyTarget / 1000).toFixed(0)}K</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/15 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${monthlyPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatTile icon={Phone} label="Calls today" value={24} delta="+8" tone="pink" sparkData={week7.map((w) => w.calls)} />
        <StatTile icon={IndianRupee} label="Week revenue" value={weekRev} prefix="₹" tone="mint" delta="+22%" sparkData={week7.map((w) => w.rev)} />
        <StatTile icon={Target} label="Demos sent" value={6} tone="violet" delta="+2" sparkData={[1, 2, 3, 1, 4, 2, 6]} />
        <StatTile icon={Users} label="Pipeline" value={32} tone="blue" delta="+5" sparkData={[10, 14, 18, 22, 24, 28, 32]} />
      </div>

      {/* Revenue chart */}
      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="label-tiny">7-Day Revenue</p>
            <p className="font-serif text-3xl mt-1">₹<AnimatedCounter value={weekRev} /></p>
          </div>
          <span className="pill bg-aurora-mint/12 text-aurora-mint border border-aurora-mint/20">
            <TrendingUp className="h-3 w-3" /> +24% WoW
          </span>
        </div>
        <div className="h-44 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={week7} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--aurora-pink))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--aurora-pink))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 6" stroke="hsl(var(--hairline))" vertical={false} />
              <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--surface-elev))', borderRadius: 12,
                  border: '1px solid hsl(var(--hairline))', fontSize: 12,
                }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Area type="monotone" dataKey="rev" stroke="hsl(var(--aurora-pink))" strokeWidth={2.5} fill="url(#rev-grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Calls chart + conversion */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="label-tiny">Calls This Week</p>
              <p className="font-serif text-3xl mt-1"><AnimatedCounter value={weekCalls} /></p>
            </div>
            <Phone className="h-4 w-4 text-aurora-violet" />
          </div>
          <div className="h-32 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={week7} margin={{ top: 5, right: 5, bottom: 0, left: -30 }}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--surface-elev))', borderRadius: 12, border: '1px solid hsl(var(--hairline))', fontSize: 12 }}
                  cursor={{ fill: 'hsl(var(--surface-1))' }}
                />
                <Bar dataKey="calls" fill="hsl(var(--aurora-violet))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="label-tiny mb-4">Conversion Engine</p>
          <ConversionRing />
        </Card>
      </div>

      {/* Funnel */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="label-tiny">Today's Funnel</p>
          <span className="text-[11px] text-muted-foreground font-mono">100 → 1</span>
        </div>
        <div className="space-y-3.5">
          {funnel.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium flex items-center gap-2">
                  <span>{f.icon}</span> {f.label}
                </p>
                <span className="font-mono text-sm tabular-nums" style={{ color: `hsl(${f.color})` }}>{f.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(f.value / f.max) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, hsl(${f.color}/0.6), hsl(${f.color}))` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Hot leads */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <p className="label-tiny">Hot Leads</p>
            <span className="pill bg-aurora-orange/15 text-aurora-orange border border-aurora-orange/25">
              <Zap className="h-3 w-3" /> {hotLeads.length}
            </span>
          </div>
          <button className="text-[11px] text-aurora-pink font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
            All <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {hotLeads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface-1 border border-hairline hover:border-aurora-pink/30 transition cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-cta-warm grid place-items-center text-sm font-bold text-white shrink-0">
                {lead.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate">{lead.name}</p>
                  <span className="text-aurora-orange text-xs">🔥</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate font-mono">{lead.business} · {lead.city}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold tabular-nums">₹{(lead.value / 1000).toFixed(0)}K</p>
                <p className="text-[10px] text-muted-foreground">{lead.when}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Activity feed */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="label-tiny">Live Activity</p>
          <Activity className="h-3.5 w-3.5 text-aurora-mint animate-pulse" />
        </div>
        <div className="space-y-3 relative">
          <div className="absolute left-[15px] top-1 bottom-1 w-px bg-gradient-to-b from-aurora-pink/40 via-aurora-violet/30 to-transparent" />
          {activityFeed.slice(0, 5).map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 relative"
            >
              <div className="h-8 w-8 rounded-full bg-surface-elev border border-hairline grid place-items-center text-sm shrink-0 z-10">
                {a.icon}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-[13px] leading-snug">
                  <span className="font-semibold">{a.who}</span>{' '}
                  <span className="text-muted-foreground">{a.text}</span>
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{a.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Rejection law */}
      <motion.div
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-6 border border-hairline"
      >
        <div className="absolute inset-0 bg-gradient-mint opacity-15" />
        <div className="absolute -top-12 -right-8 text-[140px] leading-none opacity-5 font-serif">"</div>
        <div className="relative">
          <p className="label-tiny text-aurora-mint">Rejection Law · #{law.n}</p>
          <p className="font-serif italic text-xl mt-2 leading-snug">"{law.text}"</p>
          <p className="text-[10px] text-muted-foreground mt-3 font-mono">— PIXORRA SALES PHILOSOPHY</p>
        </div>
      </motion.div>
    </div>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass p-5 ${className}`}>{children}</div>
);

const toneMap = {
  pink: { text: 'text-aurora-pink', stroke: 'hsl(var(--aurora-pink))', glow: 'bg-aurora-pink/10' },
  mint: { text: 'text-aurora-mint', stroke: 'hsl(var(--aurora-mint))', glow: 'bg-aurora-mint/10' },
  violet: { text: 'text-aurora-violet', stroke: 'hsl(var(--aurora-violet))', glow: 'bg-aurora-violet/10' },
  blue: { text: 'text-aurora-blue', stroke: 'hsl(var(--aurora-blue))', glow: 'bg-aurora-blue/10' },
};

const StatTile = ({
  icon: Icon, label, value, prefix = '', delta, tone, sparkData,
}: {
  icon: React.ElementType; label: string; value: number; prefix?: string;
  delta?: string; tone: keyof typeof toneMap; sparkData: number[];
}) => {
  const t = toneMap[tone];
  const data = sparkData.map((v, i) => ({ i, v }));
  const positive = delta?.startsWith('+');
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass p-4 relative overflow-hidden group hover:border-white/10 transition"
    >
      <div className={`absolute -top-8 -right-8 h-20 w-20 rounded-full ${t.glow} blur-2xl group-hover:scale-150 transition-transform duration-700`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <Icon className={`h-3.5 w-3.5 ${t.text}`} />
          {delta && (
            <span className={`text-[10px] font-mono font-semibold ${positive ? 'text-aurora-mint' : 'text-aurora-coral'}`}>
              {delta}
            </span>
          )}
        </div>
        <p className="font-serif text-2xl leading-none tabular-nums">
          <AnimatedCounter value={value} prefix={prefix} />
        </p>
        <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider font-semibold">{label}</p>
        <div className="h-8 mt-2 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

const ConversionRing = () => {
  const segments = [
    { label: 'Call → Convo', value: 50, color: 'hsl(var(--aurora-pink))' },
    { label: 'Convo → Demo', value: 50, color: 'hsl(var(--aurora-violet))' },
    { label: 'Demo → Deal', value: 17, color: 'hsl(var(--aurora-mint))' },
  ];
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-24 w-24 shrink-0">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--surface-elev))" strokeWidth="10" />
          {segments.map((s, i) => {
            const offset = i * 90;
            return (
              <motion.circle
                key={s.label}
                cx="50" cy="50" r="40" fill="none" stroke={s.color}
                strokeWidth="10" strokeLinecap="round"
                initial={{ strokeDasharray: '0 251' }}
                animate={{ strokeDasharray: `${(s.value / 100) * 80} 251` }}
                transition={{ duration: 1, delay: i * 0.15 }}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <p className="font-serif text-2xl leading-none">1</p>
            <p className="text-[9px] text-muted-foreground tracking-wider">DEAL</p>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
              <span className="text-muted-foreground">{s.label}</span>
            </span>
            <span className="font-mono font-semibold tabular-nums">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
