import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { team, workflow } from '@/lib/pixorra-data';

const toneMap = {
  amber: { bg: 'bg-gradient-to-br from-aurora-amber to-aurora-orange', text: 'text-aurora-amber', dot: 'bg-aurora-amber' },
  pink: { bg: 'bg-gradient-to-br from-aurora-pink to-aurora-magenta', text: 'text-aurora-pink', dot: 'bg-aurora-pink' },
  mint: { bg: 'bg-gradient-to-br from-aurora-mint to-aurora-cyan', text: 'text-aurora-mint', dot: 'bg-aurora-mint' },
  violet: { bg: 'bg-gradient-to-br from-aurora-violet to-aurora-blue', text: 'text-aurora-violet', dot: 'bg-aurora-violet' },
  blue: { bg: 'bg-gradient-to-br from-aurora-blue to-aurora-cyan', text: 'text-aurora-blue', dot: 'bg-aurora-blue' },
};

export const TeamView = () => (
  <div className="space-y-4">
    {/* Hero */}
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-8 text-center border border-hairline"
    >
      <div className="absolute inset-0 bg-gradient-aurora opacity-90 animate-aurora-pulse" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-white/20 backdrop-blur grid place-items-center text-3xl border border-white/30 animate-float">
          🦄
        </div>
        <p className="label-tiny text-white/80 mt-3">Pixorra · Kalyani</p>
        <h2 className="font-serif text-4xl text-white mt-1">Team of 5</h2>
        <p className="text-xs text-white/85 mt-2 font-mono tracking-wider">EST. 2025 · WEST BENGAL</p>
        <div className="flex justify-center gap-4 mt-5 text-center">
          <div>
            <p className="font-serif text-2xl text-white">28</p>
            <p className="text-[10px] text-white/70 font-mono tracking-wider">DAILY TASKS</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="font-serif text-2xl text-white">100</p>
            <p className="text-[10px] text-white/70 font-mono tracking-wider">LEADS/DAY</p>
          </div>
          <div className="w-px bg-white/20" />
          <div>
            <p className="font-serif text-2xl text-white">₹2L</p>
            <p className="text-[10px] text-white/70 font-mono tracking-wider">MONTHLY GOAL</p>
          </div>
        </div>
      </div>
    </motion.div>

    {/* Members */}
    <div className="space-y-2.5">
      {team.map((m, i) => {
        const tone = toneMap[m.tone];
        return (
          <motion.button
            key={m.name}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass w-full p-4 flex items-center gap-3.5 text-left hover:border-white/10 transition group"
          >
            <div className={`h-12 w-12 rounded-xl ${tone.bg} grid place-items-center text-xl shrink-0 shadow-soft`}>
              {m.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{m.name}</p>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <span className={`h-1.5 w-1.5 rounded-full ${tone.dot} animate-pulse`} />
                  {m.status.toUpperCase()}
                </span>
              </div>
              <p className={`text-[11px] font-semibold ${tone.text}`}>{m.role}</p>
              <p className="text-[10.5px] text-muted-foreground mt-0.5 font-mono truncate">
                {m.tags.join(' · ')}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition" />
          </motion.button>
        );
      })}
    </div>

    {/* Workflow */}
    <div className="glass p-5 mt-5">
      <p className="label-tiny mb-5">Lead → Delivery Workflow</p>
      <div className="relative">
        {workflow.map((w, i) => (
          <motion.div
            key={w.step}
            initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-3.5 pb-5 last:pb-0 relative"
          >
            {i < workflow.length - 1 && (
              <span className="absolute left-[15px] top-9 bottom-0 w-px bg-gradient-to-b from-aurora-pink/60 to-aurora-violet/30" />
            )}
            <div className="h-8 w-8 rounded-xl bg-gradient-cta text-white text-[11px] font-bold grid place-items-center shrink-0 shadow-soft z-10 font-mono">
              0{w.step}
            </div>
            <div className="pt-0.5">
              <p className="font-semibold text-sm flex items-center gap-2">
                <span>{w.icon}</span>{w.title}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{w.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    {/* Settings hint */}
    <div className="glass p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-surface-elev grid place-items-center text-base">🛠️</div>
      <div className="flex-1">
        <p className="text-sm font-semibold">Workspace settings</p>
        <p className="text-[11px] text-muted-foreground">Roles · Permissions · Integrations</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </div>
  </div>
);
