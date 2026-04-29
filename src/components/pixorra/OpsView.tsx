import { motion } from 'framer-motion';
import { Brain, ChevronRight, Check, Sparkles, Clock } from 'lucide-react';
import { opsBlocks, totalTasks } from '@/lib/pixorra-data';

const toneMap = {
  amber:  { bar: 'from-aurora-amber to-aurora-orange', text: 'text-aurora-amber', dot: 'bg-aurora-amber', glow: 'bg-aurora-amber/10' },
  pink:   { bar: 'from-aurora-pink to-aurora-magenta', text: 'text-aurora-pink', dot: 'bg-aurora-pink', glow: 'bg-aurora-pink/10' },
  mint:   { bar: 'from-aurora-mint to-aurora-cyan', text: 'text-aurora-mint', dot: 'bg-aurora-mint', glow: 'bg-aurora-mint/10' },
  violet: { bar: 'from-aurora-violet to-aurora-blue', text: 'text-aurora-violet', dot: 'bg-aurora-violet', glow: 'bg-aurora-violet/10' },
  orange: { bar: 'from-aurora-orange to-aurora-coral', text: 'text-aurora-orange', dot: 'bg-aurora-orange', glow: 'bg-aurora-orange/10' },
  blue:   { bar: 'from-aurora-blue to-aurora-cyan', text: 'text-aurora-blue', dot: 'bg-aurora-blue', glow: 'bg-aurora-blue/10' },
};

export const OpsView = ({ done, onToggle }: { done: Set<string>; onToggle: (id: string) => void }) => {
  const pct = Math.round((done.size / totalTasks) * 100);

  return (
    <div className="space-y-4">
      {/* Progress hero */}
      <div className="glass p-5 flex items-center gap-5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-aurora-pink/15 blur-3xl" />
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--surface-elev))" strokeWidth="8" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke="url(#ops-grad)" strokeWidth="8" strokeLinecap="round"
              initial={{ strokeDasharray: '0 264' }}
              animate={{ strokeDasharray: `${(pct / 100) * 264} 264` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="ops-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--aurora-pink))" />
                <stop offset="100%" stopColor="hsl(var(--aurora-violet))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <p className="font-serif text-xl gradient-text-aurora">{pct}%</p>
          </div>
        </div>
        <div className="flex-1 relative">
          <p className="label-tiny">Today's Operations</p>
          <p className="font-serif text-3xl mt-1">{done.size}<span className="text-muted-foreground">/{totalTasks}</span></p>
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="pill bg-aurora-mint/12 text-aurora-mint border border-aurora-mint/20">
              <span className="font-mono text-[10px]">₹14.9K REVENUE</span>
            </span>
            <span className="pill bg-aurora-violet/12 text-aurora-violet border border-aurora-violet/20">
              <Clock className="h-3 w-3" /><span className="font-mono text-[10px]">5 BLOCKS</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mental script */}
      <button className="glass p-4 w-full flex items-center gap-3 text-left hover:border-aurora-pink/30 transition group">
        <div className="h-11 w-11 rounded-xl bg-gradient-cta grid place-items-center shadow-soft shrink-0">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">Mental Script</p>
          <p className="text-[11px] text-muted-foreground">Read before every calling session</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-aurora-pink group-hover:translate-x-0.5 transition" />
      </button>

      {/* Manus AI banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-5 border border-hairline"
      >
        <div className="absolute inset-0 bg-gradient-aurora opacity-80 animate-aurora-pulse" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="label-tiny text-white/70 flex items-center gap-1.5">
              <Sparkles className="h-2.5 w-2.5" /> Manus AI · Auto Leads
            </p>
            <p className="font-serif text-3xl text-white mt-1">100 Leads</p>
            <p className="text-[11px] text-white/80 mt-1 font-mono">DELIVERED 9:00 AM · DAILY</p>
          </div>
          <div className="text-right">
            <p className="label-tiny text-white/70">Spy Call</p>
            <p className="text-sm font-semibold text-white">Optional</p>
          </div>
        </div>
      </motion.div>

      {/* Blocks */}
      {opsBlocks.map((block, bi) => {
        const tone = toneMap[block.tone];
        const blockDone = block.tasks.filter((_, i) => done.has(`${block.id}-${i}`)).length;
        const blockPct = (blockDone / block.tasks.length) * 100;
        return (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: bi * 0.06 }}
            className="glass overflow-hidden"
          >
            <div className="p-4 relative overflow-hidden">
              <div className={`absolute -top-10 -right-10 h-28 w-28 rounded-full ${tone.glow} blur-3xl`} />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${tone.bar} grid place-items-center text-lg shadow-soft shrink-0`}>
                    {block.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm ${tone.text}`}>{block.title}</p>
                    <p className="text-[10.5px] text-muted-foreground truncate font-mono">{block.time} · {block.owner}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-xs tabular-nums">{blockDone}/{block.tasks.length}</p>
                  <div className="h-1 w-12 mt-1 rounded-full bg-surface-elev overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${blockPct}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full bg-gradient-to-r ${tone.bar}`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <ul className="divide-y divide-hairline/60">
              {block.tasks.map((task, i) => {
                const id = `${block.id}-${i}`;
                const checked = done.has(id);
                return (
                  <li key={id}>
                    <button
                      onClick={() => onToggle(id)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-1/50 transition"
                    >
                      <span className={`mt-0.5 h-4.5 w-4.5 h-[18px] w-[18px] rounded-md border grid place-items-center shrink-0 transition ${
                        checked
                          ? 'bg-gradient-cta border-transparent shadow-soft'
                          : 'border-hairline group-hover:border-aurora-pink/40'
                      }`}>
                        {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                      </span>
                      <span className={`text-[13px] leading-snug ${checked ? 'line-through text-muted-foreground' : ''}`}>
                        {task}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        );
      })}
    </div>
  );
};
