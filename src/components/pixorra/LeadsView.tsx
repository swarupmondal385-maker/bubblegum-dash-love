import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Phone, MessageCircle, Flame, Filter, ArrowUpRight } from 'lucide-react';
import { sampleLeads } from '@/lib/pixorra-data';
import { AnimatedCounter } from './AnimatedCounter';

const stages = [
  { key: 'new', label: 'New Lead', color: 'hsl(var(--aurora-blue))' },
  { key: 'demo', label: 'Demo Sent', color: 'hsl(var(--aurora-amber))' },
  { key: 'neg', label: 'Negotiating', color: 'hsl(var(--aurora-violet))' },
  { key: 'won', label: 'Won', color: 'hsl(var(--aurora-mint))' },
  { key: 'lost', label: 'Lost', color: 'hsl(var(--aurora-coral))' },
] as const;

export const LeadsView = () => {
  const [filter, setFilter] = useState<string>('all');
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const counts = useMemo(() => ({
    all: sampleLeads.length,
    ...stages.reduce((acc, s) => ({ ...acc, [s.key]: sampleLeads.filter((l) => l.stage === s.key).length }), {} as Record<string, number>),
  }), []);

  const filtered = filter === 'all' ? sampleLeads : sampleLeads.filter((l) => l.stage === filter);
  const totalRev = sampleLeads.filter((l) => l.stage === 'won').reduce((s, l) => s + l.value, 0);
  const pipeline = sampleLeads.filter((l) => l.stage === 'demo' || l.stage === 'neg').reduce((s, l) => s + l.value, 0);

  return (
    <div className="space-y-4">
      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total leads" value={sampleLeads.length} tint="pink" />
        <Stat label="Pipeline" value={pipeline} prefix="₹" tint="amber" />
        <Stat label="Won rev" value={totalRev} prefix="₹" tint="mint" />
      </div>

      {/* Stage breakdown */}
      <div className="glass p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="label-tiny">Stage Breakdown</p>
          <span className="text-[11px] text-muted-foreground font-mono">{sampleLeads.length} leads</span>
        </div>
        <div className="space-y-3">
          {stages.map((s) => {
            const count = counts[s.key as string] || 0;
            const pct = (count / Math.max(1, sampleLeads.length)) * 100;
            return (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                    {s.label}
                  </p>
                  <span className="font-mono text-sm tabular-nums" style={{ color: s.color }}>{count}</span>
                </div>
                <div className="h-1 rounded-full bg-surface-1 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="h-full"
                    style={{ background: `linear-gradient(90deg, ${s.color}/60, ${s.color})`, background: s.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View switch */}
      <div className="flex items-center gap-2">
        <div className="glass p-1 inline-flex">
          {(['list', 'kanban'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`relative px-3 py-1.5 text-xs font-semibold rounded-md transition capitalize ${
                view === v ? 'text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {view === v && (
                <motion.span
                  layoutId="lead-view"
                  className="absolute inset-0 rounded-md bg-gradient-cta"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{v}</span>
            </button>
          ))}
        </div>
        <button className="ml-auto pill bg-surface-1 border border-hairline text-muted-foreground hover:border-aurora-pink/30 transition">
          <Filter className="h-3 w-3" /> Filter
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {[{ k: 'all', l: 'All' }, ...stages.map((s) => ({ k: s.key, l: s.label }))].map((t) => {
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
              {t.l} <span className="opacity-70 font-mono">({counts[t.k as string] || 0})</span>
            </button>
          );
        })}
      </div>

      {/* Add lead */}
      <button className="w-full rounded-2xl border border-dashed border-aurora-pink/30 py-3.5 text-sm font-semibold text-aurora-pink hover:bg-aurora-pink/5 hover:border-aurora-pink/50 transition flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Add new lead
      </button>

      {/* List or Kanban */}
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filtered.map((lead, i) => (
              <LeadRow key={lead.id} lead={lead} delay={i * 0.04} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="kanban"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="-mx-4 px-4 overflow-x-auto scrollbar-hide pb-2"
          >
            <div className="flex gap-3 min-w-max">
              {stages.map((s) => {
                const items = sampleLeads.filter((l) => l.stage === s.key);
                return (
                  <div key={s.key} className="w-64 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                        {s.label}
                      </p>
                      <span className="text-[10px] text-muted-foreground font-mono">{items.length}</span>
                    </div>
                    <div className="space-y-2">
                      {items.length === 0 && (
                        <div className="glass p-4 text-center text-[11px] text-muted-foreground border-dashed">empty</div>
                      )}
                      {items.map((lead) => (
                        <div key={lead.id} className="glass p-3 cursor-pointer hover:border-white/10 transition">
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className="text-sm font-semibold truncate">{lead.name}</p>
                            {lead.hot && <Flame className="h-3 w-3 text-aurora-orange shrink-0" />}
                          </div>
                          <p className="text-[10.5px] text-muted-foreground truncate font-mono">{lead.business}</p>
                          <div className="flex items-center justify-between mt-2 text-[11px]">
                            <span className="text-muted-foreground">{lead.city}</span>
                            <span className="font-bold tabular-nums">₹{(lead.value / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LeadRow = ({ lead, delay }: { lead: typeof sampleLeads[number]; delay: number }) => {
  const stage = stages.find((s) => s.key === lead.stage)!;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass p-3.5 flex items-center gap-3 hover:border-white/10 transition cursor-pointer group"
    >
      <div className="h-11 w-11 rounded-xl bg-gradient-cta grid place-items-center text-sm font-bold text-white shrink-0">
        {lead.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold truncate">{lead.name}</p>
          {lead.hot && <Flame className="h-3 w-3 text-aurora-orange shrink-0" />}
        </div>
        <p className="text-[11px] text-muted-foreground truncate font-mono">{lead.business} · {lead.city}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="pill text-[10px] py-0.5" style={{ background: `${stage.color}1A`, color: stage.color, border: `1px solid ${stage.color}33` }}>
            {stage.label}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{lead.when}</span>
        </div>
      </div>
      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
        <p className="text-sm font-bold tabular-nums">₹{(lead.value / 1000).toFixed(0)}K</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button className="h-7 w-7 rounded-lg bg-surface-1 border border-hairline grid place-items-center hover:border-aurora-mint/40 hover:text-aurora-mint transition">
            <Phone className="h-3 w-3" />
          </button>
          <button className="h-7 w-7 rounded-lg bg-surface-1 border border-hairline grid place-items-center hover:border-aurora-blue/40 hover:text-aurora-blue transition">
            <MessageCircle className="h-3 w-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const tints = {
  pink:  { glow: 'bg-aurora-pink/10', text: 'text-aurora-pink' },
  amber: { glow: 'bg-aurora-amber/10', text: 'text-aurora-amber' },
  mint:  { glow: 'bg-aurora-mint/10', text: 'text-aurora-mint' },
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
