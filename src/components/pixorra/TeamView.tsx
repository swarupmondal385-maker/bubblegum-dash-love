import { ChevronRight } from 'lucide-react';
import { team, workflow } from '@/lib/pixorra-data';

const toneMap = {
  yellow: { bg: 'bg-gradient-card-yellow', text: 'text-amber-800' },
  pink: { bg: 'bg-gradient-card-pink', text: 'text-pink' },
  mint: { bg: 'bg-gradient-card-mint', text: 'text-emerald-700' },
  purple: { bg: 'bg-gradient-card-purple', text: 'text-purple' },
  blue: { bg: 'bg-blue-soft/70', text: 'text-sky-700' },
};

export const TeamView = () => (
  <div className="space-y-5">
    {/* Hero */}
    <div className="rounded-3xl p-8 bg-gradient-hero text-white shadow-glow relative overflow-hidden text-center">
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
      <div className="relative">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-white/25 grid place-items-center text-3xl backdrop-blur">🦄</div>
        <p className="label-tiny text-white/80 mt-3">Pixorra</p>
        <h2 className="font-display text-3xl mt-1">Team of 5</h2>
        <p className="text-xs text-white/85 mt-2">Kalyani, West Bengal · Est. 2025</p>
      </div>
    </div>

    {/* Members */}
    {team.map((m) => {
      const tone = toneMap[m.tone];
      return (
        <button
          key={m.name}
          className="glass-card w-full p-4 flex items-center gap-4 text-left hover:shadow-soft transition"
        >
          <div className={`h-12 w-12 rounded-2xl ${tone.bg} grid place-items-center text-xl shrink-0`}>
            {m.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display text-base">{m.name}</p>
            <p className={`text-xs font-semibold ${tone.text}`}>{m.role}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{m.tags.join(' · ')}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </button>
      );
    })}

    {/* Workflow */}
    <div className="pt-4">
      <p className="label-tiny mb-4">Lead → Delivery Workflow</p>
      <div className="relative pl-1">
        {workflow.map((w, i) => (
          <div key={w.step} className="flex gap-4 pb-5 relative">
            {i < workflow.length - 1 && (
              <span className="absolute left-3.5 top-9 bottom-0 w-0.5 bg-gradient-to-b from-pink/60 to-purple/60" />
            )}
            <div className="h-7 w-7 rounded-full bg-gradient-cta text-white text-xs font-bold grid place-items-center shrink-0 shadow-soft">
              {w.step}
            </div>
            <div>
              <p className="font-semibold text-sm">{w.title}</p>
              <p className="text-[11px] text-pink font-semibold mt-0.5">{w.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
