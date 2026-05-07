import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Bell, Check, Trash2, X } from 'lucide-react';
import { useStore, Reminder } from '@/lib/store';
import { toast } from 'sonner';

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const groupBy = (rems: Reminder[]) => {
  const today: Reminder[] = [];
  const tomorrow: Reminder[] = [];
  const upcoming: Reminder[] = [];
  const past: Reminder[] = [];
  const now = new Date();
  const tStart = new Date(now); tStart.setHours(0, 0, 0, 0);
  const tEnd = new Date(tStart); tEnd.setDate(tEnd.getDate() + 1);
  const tomEnd = new Date(tEnd); tomEnd.setDate(tomEnd.getDate() + 1);
  rems.forEach(r => {
    const d = new Date(r.date);
    if (d < tStart) past.push(r);
    else if (d < tEnd) today.push(r);
    else if (d < tomEnd) tomorrow.push(r);
    else upcoming.push(r);
  });
  return { today, tomorrow, upcoming, past };
};

export const RemindersView = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useStore();
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date(Date.now() + 3600_000);
    return d.toISOString().slice(0, 16);
  });
  const [tag, setTag] = useState('call');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Title required');
    addReminder({ title, date: new Date(date).toISOString(), tag });
    toast.success('Reminder added');
    setTitle(''); setShow(false);
  };

  const { today, tomorrow, upcoming, past } = groupBy(reminders);
  const pending = reminders.filter(r => !r.done).length;

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden candy-card p-5">
        <div className="absolute inset-0 bg-gradient-aurora opacity-30" />
        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/40 backdrop-blur grid place-items-center border border-white/60">
            <Bell className="h-5 w-5 text-aurora-pink" />
          </div>
          <div className="flex-1">
            <p className="font-display text-xl">Reminders</p>
            <p className="text-xs text-muted-foreground font-mono">{pending} pending · {reminders.length} total</p>
          </div>
          <button onClick={() => setShow(true)} className="h-10 w-10 rounded-xl bg-gradient-cta grid place-items-center shadow-glow text-white">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      <Section label="Today" items={today} toggle={toggleReminder} remove={deleteReminder} />
      <Section label="Tomorrow" items={tomorrow} toggle={toggleReminder} remove={deleteReminder} />
      <Section label="Upcoming" items={upcoming} toggle={toggleReminder} remove={deleteReminder} />
      <Section label="Past" items={past} toggle={toggleReminder} remove={deleteReminder} dim />

      {reminders.length === 0 && (
        <div className="text-center py-16 glass">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-sm text-muted-foreground">No reminders. Add one to stay on track.</p>
        </div>
      )}

      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm grid place-items-end sm:place-items-center p-3">
            <motion.form onClick={e => e.stopPropagation()} onSubmit={submit}
              initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
              className="w-full max-w-md candy-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display">New reminder</h3>
                <button type="button" onClick={() => setShow(false)} className="h-8 w-8 rounded-lg grid place-items-center bg-surface-1"><X className="h-4 w-4" /></button>
              </div>
              <label className="block">
                <span className="label-tiny block mb-1">Title *</span>
                <input className={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Call back Rajat at 4pm" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label-tiny block mb-1">When</span>
                  <input type="datetime-local" className={inp} value={date} onChange={e => setDate(e.target.value)} />
                </label>
                <label className="block">
                  <span className="label-tiny block mb-1">Tag</span>
                  <select className={inp} value={tag} onChange={e => setTag(e.target.value)}>
                    <option value="call">📞 Call</option>
                    <option value="demo">🖥️ Demo</option>
                    <option value="payment">💸 Payment</option>
                    <option value="meeting">🤝 Meeting</option>
                    <option value="lead">🎯 Lead</option>
                  </select>
                </label>
              </div>
              <button type="submit" className="w-full rounded-xl bg-gradient-cta py-3 text-sm font-bold text-white shadow-glow">Add reminder</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Section = ({ label, items, toggle, remove, dim }: {
  label: string; items: Reminder[]; toggle: (id: string) => void; remove: (id: string) => void; dim?: boolean;
}) => {
  if (items.length === 0) return null;
  return (
    <div className={`space-y-2 ${dim ? 'opacity-70' : ''}`}>
      <p className="label-tiny px-1">{label}</p>
      {items.map((r, i) => (
        <motion.div key={r.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
          className={`glass p-3 flex items-center gap-3 ${r.done ? 'opacity-50' : ''}`}>
          <button onClick={() => toggle(r.id)}
            className={`h-7 w-7 rounded-lg grid place-items-center border-2 transition ${r.done
              ? 'bg-aurora-mint border-aurora-mint text-white'
              : 'border-hairline hover:border-aurora-pink'}`}>
            {r.done && <Check className="h-3.5 w-3.5" />}
          </button>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${r.done ? 'line-through' : ''}`}>{r.title}</p>
            <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-2.5 w-2.5" /> {fmtDate(r.date)} {r.tag && `· ${r.tag}`}
            </p>
          </div>
          <button onClick={() => remove(r.id)} className="h-7 w-7 rounded-lg bg-surface-1 grid place-items-center text-aurora-coral hover:bg-aurora-coral/10"><Trash2 className="h-3 w-3" /></button>
        </motion.div>
      ))}
    </div>
  );
};

const inp = 'w-full rounded-xl border-2 border-hairline bg-surface-1 px-3 py-2 text-sm outline-none focus:border-aurora-pink/50 transition';
