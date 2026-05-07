import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MapPin, IndianRupee } from 'lucide-react';
import { sampleClients } from '@/lib/pixorra-data';
import { AnimatedCounter } from './AnimatedCounter';

const tabs = [
  { k: 'all', l: 'All' }, { k: 'active', l: 'Active' }, { k: 'completed', l: 'Completed' },
  { k: 'hold', l: 'On Hold' }, { k: 'cancel', l: 'Cancelled' },
] as const;

export const DataView = () => {
  const [filter, setFilter] = useState<string>('all');
  const [q, setQ] = useState('');

  const counts = useMemo(() => ({
    all: sampleClients.length,
    active: sampleClients.filter((c) => c.status === 'active').length,
    completed: sampleClients.filter((c) => c.status === 'completed').length,
    hold: sampleClients.filter((c) => c.status === 'hold').length,
    cancel: 0,
  }), []);

  const filtered = sampleClients
    .filter((c) => filter === 'all' || c.status === filter)
    .filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.owner.toLowerCase().includes(q.toLowerCase()));

  const totalRev = sampleClients.reduce((s, c) => s + c.paid, 0);
  const pending = sampleClients.reduce((s, c) => s + (c.value - c.paid), 0);
  const active = sampleClients.filter((c) => c.status === 'active').length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Clients" value={sampleClients.length} tint="pink" />
        <Stat label="Active" value={active} tint="amber" />
        <Stat label="Total revenue" value={totalRev} prefix="₹" tint="mint" />
        <Stat label="Pending pay" value={pending} prefix="₹" tint="coral" />
      </div>

      {/* Search */}
      <div className="glass flex items-center gap-3 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search client, business, owner…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-elev text-muted-foreground border border-hairline">⌘K</kbd>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {tabs.map((t) => {
          const isActive = filter === t.k;
          return (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              className={`pill shrink-0 border transition ${
                isActive
                  ? 'bg-gradient-cta text-white border-transparent shadow-soft'
                  : 'bg-surface-1 border-hairline text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.l} <span className="opacity-70 font-mono">({counts[t.k] || 0})</span>
            </button>
          );
        })}
      </div>

      {/* Add */}
      <button className="w-full rounded-2xl bg-gradient-cta py-3.5 text-sm font-bold text-white shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition">
        <Plus className="h-4 w-4" /> Add new client record
      </button>

      {/* Cards */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 glass">
            <p className="text-4xl mb-3">🗂️</p>
            <p className="text-sm text-muted-foreground">No clients match your filters.</p>
          </div>
        )}
        {filtered.map((c, i) => {
          const dayPct = (c.day / 7) * 100;
          const payPct = (c.paid / c.value) * 100;
          const statusTone = {
            active: 'text-aurora-amber bg-aurora-amber/10 border-aurora-amber/25',
            completed: 'text-aurora-mint bg-aurora-mint/10 border-aurora-mint/25',
            hold: 'text-aurora-coral bg-aurora-coral/10 border-aurora-coral/25',
          }[c.status as 'active' | 'completed' | 'hold'];
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass p-4 hover:border-white/10 transition cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-cta-warm grid place-items-center text-sm font-bold text-white shrink-0">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold truncate">{c.name}</p>
                    <span className={`pill text-[10px] py-0.5 border capitalize ${statusTone}`}>{c.status}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate font-mono flex items-center gap-1.5">
                    {c.owner} · <MapPin className="h-2.5 w-2.5" /> {c.city}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] mb-1">
                        <span className="text-muted-foreground font-mono">DAY {c.day}/7</span>
                        <span className="font-mono">{dayPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-surface-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} whileInView={{ width: `${dayPct}%` }} viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                          className="h-full bg-gradient-to-r from-aurora-violet to-aurora-blue"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10.5px] mb-1">
                        <span className="text-muted-foreground font-mono flex items-center gap-1">
                          <IndianRupee className="h-2.5 w-2.5" />{(c.paid / 1000).toFixed(0)}K/{(c.value / 1000).toFixed(0)}K
                        </span>
                        <span className="font-mono">{payPct.toFixed(0)}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-surface-1 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} whileInView={{ width: `${payPct}%` }} viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="h-full bg-gradient-mint"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const tints = {
  pink:  { glow: 'bg-aurora-pink/10', text: 'text-aurora-pink' },
  amber: { glow: 'bg-aurora-amber/10', text: 'text-aurora-amber' },
  mint:  { glow: 'bg-aurora-mint/10', text: 'text-aurora-mint' },
  coral: { glow: 'bg-aurora-coral/10', text: 'text-aurora-coral' },
};
const Stat = ({ label, value, prefix = '', tint }: { label: string; value: number; prefix?: string; tint: keyof typeof tints }) => {
  const t = tints[tint];
  return (
    <div className="glass p-4 relative overflow-hidden">
      <div className={`absolute -top-6 -right-6 h-16 w-16 rounded-full ${t.glow} blur-2xl`} />
      <p className={`font-serif text-2xl ${t.text} leading-none tabular-nums relative`}>
        <AnimatedCounter value={value} prefix={prefix} />
      </p>
      <p className="label-tiny mt-2 relative">{label}</p>
    </div>
  );
};
