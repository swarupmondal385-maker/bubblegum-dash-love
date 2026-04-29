import { useState } from 'react';
import { Plus } from 'lucide-react';

const stages = [
  { key: 'new', label: 'New Lead', color: 'hsl(210 90% 60%)' },
  { key: 'demo', label: 'Demo Sent', color: 'hsl(45 100% 60%)' },
  { key: 'neg', label: 'Negotiating', color: 'hsl(280 80% 65%)' },
  { key: 'won', label: 'Won', color: 'hsl(150 60% 55%)' },
  { key: 'lost', label: 'Lost', color: 'hsl(0 80% 60%)' },
];

export const LeadsView = () => {
  const [filter, setFilter] = useState('all');
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total" value="0" tone="text-pink" bg="bg-gradient-card-pink" />
        <Stat label="In Pipeline" value="0" tone="text-amber-700" bg="bg-gradient-card-yellow" />
        <Stat label="Won Rev" value="₹0K" tone="text-emerald-700" bg="bg-gradient-card-mint" />
      </div>

      <div className="glass-card p-5">
        <p className="label-tiny mb-4">Stage Breakdown</p>
        <div className="space-y-4">
          {stages.map((s) => (
            <div key={s.key}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </p>
                <span className="font-display text-base" style={{ color: s.color }}>0</span>
              </div>
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full" style={{ background: s.color, width: '0%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {[{ k: 'all', l: 'All' }, ...stages.map((s) => ({ k: s.key, l: s.label }))].map((t) => (
          <button
            key={t.k}
            onClick={() => setFilter(t.k)}
            className={`pill shrink-0 border ${
              filter === t.k
                ? 'bg-pink-soft text-pink border-pink/40'
                : 'bg-card border-border text-muted-foreground'
            }`}
          >
            {t.l} (0)
          </button>
        ))}
      </div>

      <button className="w-full rounded-3xl border-2 border-dashed border-pink/40 py-4 text-sm font-semibold text-pink hover:bg-pink-soft/40 transition flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Add new lead
      </button>

      <div className="text-center py-12">
        <p className="text-5xl mb-3">📬</p>
        <p className="text-sm text-muted-foreground">No leads here yet.</p>
      </div>
    </div>
  );
};

const Stat = ({ label, value, tone, bg }: { label: string; value: string; tone: string; bg: string }) => (
  <div className={`${bg} rounded-2xl p-4 border border-white/60 shadow-card`}>
    <p className={`font-display text-2xl ${tone} leading-none`}>{value}</p>
    <p className="label-tiny mt-2">{label}</p>
  </div>
);
