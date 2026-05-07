import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, IndianRupee, Pencil, Trash2, X, Download } from 'lucide-react';
import { useStore, Client } from '@/lib/store';
import { AnimatedCounter } from './AnimatedCounter';
import { toast } from 'sonner';

const tabs = [
  { k: 'all', l: 'All' }, { k: 'active', l: 'Active' }, { k: 'completed', l: 'Completed' },
  { k: 'hold', l: 'On Hold' },
] as const;

const empty: Omit<Client, 'id'> = {
  name: '', owner: '', city: '', value: 14999, paid: 0, status: 'active', day: 1,
};

export const DataView = () => {
  const { clients, addClient, updateClient, deleteClient } = useStore();
  const [filter, setFilter] = useState<string>('all');
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<Omit<Client, 'id'>>(empty);

  const counts = {
    all: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    completed: clients.filter(c => c.status === 'completed').length,
    hold: clients.filter(c => c.status === 'hold').length,
  };
  const filtered = clients
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.owner.toLowerCase().includes(q.toLowerCase()));

  const totalRev = clients.reduce((s, c) => s + c.paid, 0);
  const pending = clients.reduce((s, c) => s + (c.value - c.paid), 0);
  const active = clients.filter(c => c.status === 'active').length;

  const openAdd = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (c: Client) => { setForm(c); setEditing(c); setShowForm(true); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Business name required');
    if (editing) { updateClient(editing.id, form); toast.success('Client updated'); }
    else { addClient(form); toast.success('Client added'); }
    setShowForm(false);
  };

  const remove = (c: Client) => {
    if (!confirm(`Delete client "${c.name}"?`)) return;
    deleteClient(c.id);
    toast.success('Client deleted');
  };

  const exportCSV = () => {
    const rows = [['ID', 'Business', 'Owner', 'City', 'Value', 'Paid', 'Status', 'Day']];
    clients.forEach(c => rows.push([c.id, c.name, c.owner, c.city, String(c.value), String(c.paid), c.status, String(c.day)]));
    const csv = rows.map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `pixorra-clients-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Clients" value={clients.length} tint="pink" />
        <Stat label="Active" value={active} tint="amber" />
        <Stat label="Total revenue" value={totalRev} prefix="₹" tint="mint" />
        <Stat label="Pending pay" value={pending} prefix="₹" tint="coral" />
      </div>

      <div className="glass flex items-center gap-3 px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search client, owner…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {tabs.map(t => {
          const isActive = filter === t.k;
          return (
            <button key={t.k} onClick={() => setFilter(t.k)}
              className={`pill shrink-0 border transition ${isActive
                ? 'bg-gradient-cta text-white border-transparent shadow-soft'
                : 'bg-surface-1 border-hairline text-muted-foreground hover:text-foreground'}`}>
              {t.l} <span className="opacity-70 font-mono">({counts[t.k] || 0})</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={openAdd} className="rounded-2xl bg-gradient-cta py-3.5 text-sm font-bold text-white shadow-glow flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> Add client
        </button>
        <button onClick={exportCSV} className="rounded-2xl candy-card py-3.5 text-sm font-bold flex items-center justify-center gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 glass">
            <p className="text-4xl mb-3">🗂️</p>
            <p className="text-sm text-muted-foreground">No clients yet.</p>
          </div>
        )}
        {filtered.map((c, i) => {
          const dayPct = (c.day / 7) * 100;
          const payPct = c.value > 0 ? (c.paid / c.value) * 100 : 0;
          const statusTone = {
            active: 'text-aurora-amber bg-aurora-amber/10 border-aurora-amber/25',
            completed: 'text-aurora-mint bg-aurora-mint/10 border-aurora-mint/25',
            hold: 'text-aurora-coral bg-aurora-coral/10 border-aurora-coral/25',
          }[c.status];
          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }} className="glass p-4 group">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-cta-warm grid place-items-center text-sm font-bold text-white shrink-0">
                  {c.name[0] || '?'}
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
                        <motion.div initial={{ width: 0 }} animate={{ width: `${dayPct}%` }}
                          transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-aurora-violet to-aurora-blue" />
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
                        <motion.div initial={{ width: 0 }} animate={{ width: `${payPct}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }} className="h-full bg-gradient-mint" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => openEdit(c)} className="pill bg-surface-1 border border-hairline text-[10px] hover:border-aurora-violet/40">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button onClick={() => remove(c)} className="pill bg-surface-1 border border-hairline text-[10px] text-aurora-coral hover:border-aurora-coral/40">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
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
                <h3 className="text-lg font-display">{editing ? 'Edit client' : 'Add client'}</h3>
                <button type="button" onClick={() => setShowForm(false)} className="h-8 w-8 rounded-lg grid place-items-center bg-surface-1"><X className="h-4 w-4" /></button>
              </div>
              <Field label="Business name *"><input className={inp} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Owner"><input className={inp} value={form.owner} onChange={e => setForm({ ...form, owner: e.target.value })} /></Field>
                <Field label="City"><input className={inp} value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Value ₹"><input type="number" className={inp} value={form.value} onChange={e => setForm({ ...form, value: +e.target.value })} /></Field>
                <Field label="Paid ₹"><input type="number" className={inp} value={form.paid} onChange={e => setForm({ ...form, paid: +e.target.value })} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Status">
                  <select className={inp} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Client['status'] })}>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="hold">On Hold</option>
                  </select>
                </Field>
                <Field label="Day (1–7)"><input type="number" min={1} max={7} className={inp} value={form.day} onChange={e => setForm({ ...form, day: +e.target.value })} /></Field>
              </div>
              <button type="submit" className="w-full rounded-xl bg-gradient-cta py-3 text-sm font-bold text-white shadow-glow">
                {editing ? 'Save changes' : 'Add client'}
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
