import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Phone, MessageCircle, Flame, Filter, Trash2, Pencil, X, Search } from 'lucide-react';
import { useStore, Lead } from '@/lib/store';
import { AnimatedCounter } from './AnimatedCounter';
import { toast } from 'sonner';

const stages = [
  { key: 'new', label: 'New Lead', color: 'hsl(var(--aurora-blue))' },
  { key: 'demo', label: 'Demo Sent', color: 'hsl(var(--aurora-amber))' },
  { key: 'neg', label: 'Negotiating', color: 'hsl(var(--aurora-violet))' },
  { key: 'won', label: 'Won', color: 'hsl(var(--aurora-mint))' },
  { key: 'lost', label: 'Lost', color: 'hsl(var(--aurora-coral))' },
] as const;

const empty: Omit<Lead, 'id' | 'when'> = {
  name: '', business: '', city: '', stage: 'new', value: 14999, hot: false, phone: '', notes: '',
};

export const LeadsView = () => {
  const { leads, addLead, updateLead, deleteLead } = useStore();
  const nav = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Lead | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Lead, 'id' | 'when'>>(empty);

  const counts = {
    all: leads.length,
    ...stages.reduce((a, s) => ({ ...a, [s.key]: leads.filter(l => l.stage === s.key).length }), {} as Record<string, number>),
  };
  const filtered = leads
    .filter(l => filter === 'all' || l.stage === filter)
    .filter(l => !q || l.name.toLowerCase().includes(q.toLowerCase()) || l.business.toLowerCase().includes(q.toLowerCase()));
  const totalRev = leads.filter(l => l.stage === 'won').reduce((s, l) => s + l.value, 0);
  const pipeline = leads.filter(l => l.stage === 'demo' || l.stage === 'neg').reduce((s, l) => s + l.value, 0);

  const openAdd = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (l: Lead) => { setForm(l); setEditing(l); setShowForm(true); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name required');
    if (editing) {
      updateLead(editing.id, form);
      toast.success('Lead updated');
    } else {
      addLead(form);
      toast.success('Lead added');
    }
    setShowForm(false);
  };

  const remove = (l: Lead) => {
    if (!confirm(`Delete lead "${l.name}"?`)) return;
    deleteLead(l.id);
    toast.success('Lead deleted');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Total leads" value={leads.length} tint="pink" />
        <Stat label="Pipeline" value={pipeline} prefix="₹" tint="amber" />
        <Stat label="Won rev" value={totalRev} prefix="₹" tint="mint" />
      </div>

      <div className="glass flex items-center gap-3 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search lead, business…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {[{ k: 'all', l: 'All' }, ...stages.map(s => ({ k: s.key, l: s.label }))].map(t => {
          const isActive = filter === t.k;
          return (
            <button key={t.k} onClick={() => setFilter(t.k)}
              className={`pill shrink-0 border transition ${isActive
                ? 'bg-gradient-cta text-white border-transparent shadow-soft'
                : 'bg-surface-1 border-hairline text-muted-foreground hover:text-foreground'}`}>
              {t.l} <span className="opacity-70 font-mono">({counts[t.k as string] || 0})</span>
            </button>
          );
        })}
      </div>

      <button onClick={openAdd}
        className="w-full rounded-2xl bg-gradient-cta py-3.5 text-sm font-bold text-white shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition">
        <Plus className="h-4 w-4" /> Add new lead
      </button>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 glass">
            <p className="text-4xl mb-3">🎯</p>
            <p className="text-sm text-muted-foreground">No leads. Add your first one above.</p>
          </div>
        )}
        {filtered.map((lead, i) => {
          const stage = stages.find(s => s.key === lead.stage)!;
          return (
            <motion.div key={lead.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass p-3.5 flex items-center gap-3 hover:border-aurora-pink/30 transition group">
              <button onClick={() => nav(`/leads/${lead.id}`)}
                className="h-11 w-11 rounded-xl bg-gradient-cta grid place-items-center text-sm font-bold text-white shrink-0">
                {lead.name[0] || '?'}
              </button>
              <button onClick={() => nav(`/leads/${lead.id}`)} className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate">{lead.name}</p>
                  {lead.hot && <Flame className="h-3 w-3 text-aurora-orange shrink-0" />}
                </div>
                <p className="text-[11px] text-muted-foreground truncate font-mono">{lead.business} · {lead.city}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="pill text-[10px] py-0.5"
                    style={{ background: `${stage.color}1A`, color: stage.color, border: `1px solid ${stage.color}33` }}>
                    {stage.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">{lead.when}</span>
                </div>
              </button>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <p className="text-sm font-bold tabular-nums">₹{(lead.value / 1000).toFixed(0)}K</p>
                <div className="flex gap-1">
                  <a href={`tel:${lead.phone}`} className="h-7 w-7 rounded-lg bg-surface-1 border border-hairline grid place-items-center hover:border-aurora-mint/40 hover:text-aurora-mint transition"><Phone className="h-3 w-3" /></a>
                  <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="h-7 w-7 rounded-lg bg-surface-1 border border-hairline grid place-items-center hover:border-aurora-blue/40 hover:text-aurora-blue transition"><MessageCircle className="h-3 w-3" /></a>
                  <button onClick={() => openEdit(lead)} className="h-7 w-7 rounded-lg bg-surface-1 border border-hairline grid place-items-center hover:border-aurora-violet/40 hover:text-aurora-violet transition"><Pencil className="h-3 w-3" /></button>
                  <button onClick={() => remove(lead)} className="h-7 w-7 rounded-lg bg-surface-1 border border-hairline grid place-items-center hover:border-aurora-coral/40 hover:text-aurora-coral transition"><Trash2 className="h-3 w-3" /></button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm grid place-items-end sm:place-items-center p-3">
            <motion.form onClick={e => e.stopPropagation()} onSubmit={submit}
              initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
              className="w-full max-w-md candy-card p-5 space-y-3 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display">{editing ? 'Edit lead' : 'Add new lead'}</h3>
                <button type="button" onClick={() => setShowForm(false)} className="h-8 w-8 rounded-lg grid place-items-center bg-surface-1 hover:bg-surface-2"><X className="h-4 w-4" /></button>
              </div>
              <Field label="Name *"><input className={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Business"><input className={inp} value={form.business} onChange={e => setForm({ ...form, business: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City"><input className={inp} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
                <Field label="Phone"><input className={inp} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Value ₹"><input type="number" className={inp} value={form.value} onChange={e => setForm({ ...form, value: +e.target.value })} /></Field>
                <Field label="Stage">
                  <select className={inp} value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value as Lead['stage'] })}>
                    {stages.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Notes"><textarea className={inp + ' min-h-[70px]'} value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.hot} onChange={e => setForm({ ...form, hot: e.target.checked })} />
                🔥 Mark as hot lead
              </label>
              <button type="submit" className="w-full rounded-xl bg-gradient-cta py-3 text-sm font-bold text-white shadow-glow">
                {editing ? 'Save changes' : 'Add lead'}
              </button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const inp = 'w-full rounded-xl border-2 border-hairline bg-surface-1 px-3 py-2 text-sm outline-none focus:border-aurora-pink/50 transition';
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="label-tiny block mb-1">{label}</span>
    {children}
  </label>
);

const tints = {
  pink: { glow: 'bg-aurora-pink/10', text: 'text-aurora-pink' },
  amber: { glow: 'bg-aurora-amber/10', text: 'text-aurora-amber' },
  mint: { glow: 'bg-aurora-mint/10', text: 'text-aurora-mint' },
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
