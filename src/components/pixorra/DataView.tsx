import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export const DataView = () => {
  const [filter, setFilter] = useState('all');
  const tabs = [
    { k: 'all', l: 'All' }, { k: 'active', l: 'Active' }, { k: 'completed', l: 'Completed' },
    { k: 'hold', l: 'On Hold' }, { k: 'cancel', l: 'Cancelled' },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Clients" value="0" tone="text-pink" bg="bg-gradient-card-pink" />
        <Stat label="Active" value="0" tone="text-amber-700" bg="bg-gradient-card-yellow" />
        <Stat label="Total Rev" value="₹0K" tone="text-emerald-700" bg="bg-gradient-card-mint" />
        <Stat label="Pending Pay" value="0" tone="text-rose-600" bg="bg-gradient-card-peach" />
      </div>

      <div className="glass-card flex items-center gap-3 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search client, business, phone…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {tabs.map((t) => (
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

      <button className="w-full rounded-3xl bg-gradient-cta py-4 text-sm font-bold text-white shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition">
        <Plus className="h-4 w-4" /> Add new client record
      </button>

      <div className="text-center py-12">
        <p className="text-5xl mb-3">🗂️</p>
        <p className="text-sm text-muted-foreground">Add your first client above</p>
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
