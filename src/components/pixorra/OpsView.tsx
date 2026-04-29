import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ChevronRight, Check } from 'lucide-react';
import { opsBlocks, totalTasks } from '@/lib/pixorra-data';

const toneMap = {
  yellow: { bg: 'bg-gradient-card-yellow', text: 'text-amber-800', pill: 'bg-amber-100 text-amber-800' },
  pink: { bg: 'bg-gradient-card-pink', text: 'text-pink', pill: 'bg-pink-soft text-pink-700' },
  mint: { bg: 'bg-gradient-card-mint', text: 'text-emerald-700', pill: 'bg-mint-soft text-emerald-700' },
  purple: { bg: 'bg-gradient-card-purple', text: 'text-purple', pill: 'bg-purple-soft text-purple' },
  peach: { bg: 'bg-gradient-card-peach', text: 'text-orange-700', pill: 'bg-peach-soft text-orange-700' },
  blue: { bg: 'bg-blue-soft/60', text: 'text-sky-700', pill: 'bg-blue-soft text-sky-700' },
};

export const OpsView = ({ done, onToggle }: { done: Set<string>; onToggle: (id: string) => void }) => {
  const pct = Math.round((done.size / totalTasks) * 100);

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="glass-card p-5 flex items-center gap-5">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--pink-soft))" strokeWidth="10" />
            <motion.circle
              cx="50" cy="50" r="42" fill="none"
              stroke="hsl(var(--pink))" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 264} 264`}
              initial={{ strokeDasharray: '0 264' }} animate={{ strokeDasharray: `${(pct / 100) * 264} 264` }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <p className="font-display text-xl text-pink">{pct}%</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-display text-2xl">{done.size}<span className="text-muted-foreground">/{totalTasks}</span></p>
          <p className="text-sm text-muted-foreground">Tasks completed today</p>
          <div className="pill bg-mint-soft text-emerald-700 mt-2">
            <span className="font-display text-sm">₹0</span>
            <span className="text-[9px]">REVENUE TODAY</span>
          </div>
        </div>
      </div>

      {/* Mental script */}
      <button className="glass-card p-4 w-full flex items-center gap-4 text-left hover:shadow-soft transition">
        <div className="h-11 w-11 rounded-2xl bg-gradient-card-pink grid place-items-center">
          <Brain className="h-5 w-5 text-pink" />
        </div>
        <div className="flex-1">
          <p className="font-display text-base">Mental Script</p>
          <p className="text-xs text-muted-foreground">Read before every calling session</p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </button>

      {/* Manus AI banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-5 bg-gradient-hero text-white shadow-glow flex items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/15 blur-2xl" />
        <div className="relative">
          <p className="label-tiny text-white/80">Manus AI · Auto Leads</p>
          <p className="font-display text-3xl mt-1">100 Leads</p>
          <p className="text-xs text-white/85 mt-1">Delivered at 9:00 AM every day</p>
        </div>
        <div className="text-right relative">
          <p className="label-tiny text-white/80">Spy Call</p>
          <p className="font-display text-base">Optional</p>
        </div>
      </motion.div>

      {/* Blocks */}
      {opsBlocks.map((block) => {
        const tone = toneMap[block.tone];
        const blockDone = block.tasks.filter((_, i) => done.has(`${block.id}-${i}`)).length;
        return (
          <div key={block.id} className="glass-card overflow-hidden">
            <div className={`${tone.bg} p-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{block.emoji}</span>
                <div>
                  <p className={`font-display text-base ${tone.text}`}>{block.title}</p>
                  <p className="text-[11px] text-muted-foreground">{block.time} · {block.owner}</p>
                </div>
              </div>
              <span className={`pill ${tone.pill}`}>{blockDone}/{block.tasks.length}</span>
            </div>
            <ul className="divide-y divide-border/60">
              {block.tasks.map((task, i) => {
                const id = `${block.id}-${i}`;
                const checked = done.has(id);
                return (
                  <li key={id}>
                    <button
                      onClick={() => onToggle(id)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50 transition"
                    >
                      <span className={`h-5 w-5 rounded-full border-2 grid place-items-center shrink-0 transition ${
                        checked ? 'bg-pink border-pink' : 'border-pink/40'
                      }`}>
                        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                      </span>
                      <span className={`text-sm ${checked ? 'line-through text-muted-foreground' : ''}`}>{task}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
