import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, Mail, MapPin, IndianRupee, Flame, Pencil, Trash2, Calendar } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Header } from '@/components/pixorra/Header';
import { toast } from 'sonner';

const stageMeta: Record<string, { label: string; color: string }> = {
  new: { label: 'New Lead', color: 'hsl(var(--aurora-blue))' },
  demo: { label: 'Demo Sent', color: 'hsl(var(--aurora-amber))' },
  neg: { label: 'Negotiating', color: 'hsl(var(--aurora-violet))' },
  won: { label: 'Won', color: 'hsl(var(--aurora-mint))' },
  lost: { label: 'Lost', color: 'hsl(var(--aurora-coral))' },
};

const LeadDetail = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { leads, updateLead, deleteLead, addReminder } = useStore();
  const lead = leads.find(l => l.id === id);

  if (!lead) {
    return (
      <div className="min-h-screen pb-32">
        <Header tasksDone={0} />
        <main className="max-w-2xl mx-auto px-4 py-10 text-center">
          <p className="text-2xl font-display mb-2">Lead not found</p>
          <Link to="/" className="text-aurora-pink underline">← Back to dashboard</Link>
        </main>
      </div>
    );
  }

  const stage = stageMeta[lead.stage];
  const advance = () => {
    const order = ['new', 'demo', 'neg', 'won'];
    const i = order.indexOf(lead.stage);
    if (i < order.length - 1) {
      updateLead(lead.id, { stage: order[i + 1] as any });
      toast.success(`Moved to ${stageMeta[order[i + 1]].label}`);
    }
  };

  const scheduleFollowUp = () => {
    addReminder({
      title: `Follow-up: ${lead.name} (${lead.business})`,
      date: new Date(Date.now() + 86400_000).toISOString(),
      tag: 'lead',
    });
    toast.success('Reminder set for tomorrow');
  };

  return (
    <div className="min-h-screen pb-32">
      <Header tasksDone={0} />
      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        <button onClick={() => nav(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden candy-card p-6">
          <div className="absolute inset-0 bg-gradient-aurora opacity-40" />
          <div className="relative flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-cta grid place-items-center text-2xl font-display text-white shrink-0 shadow-glow">
              {lead.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl truncate">{lead.name}</h1>
                {lead.hot && <Flame className="h-5 w-5 text-aurora-orange" />}
              </div>
              <p className="text-sm text-muted-foreground">{lead.business}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="pill text-[11px]" style={{ background: `${stage.color}1A`, color: stage.color, border: `1px solid ${stage.color}33` }}>
                  {stage.label}
                </span>
                <span className="pill bg-surface-1 border border-hairline text-muted-foreground text-[11px]">
                  <MapPin className="h-3 w-3" /> {lead.city || '—'}
                </span>
                <span className="pill bg-aurora-mint/10 text-aurora-mint border border-aurora-mint/30 text-[11px]">
                  <IndianRupee className="h-3 w-3" />{lead.value.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <a href={`tel:${lead.phone}`} className="candy-card p-4 flex items-center gap-3 hover:translate-y-[-2px] transition">
            <div className="h-10 w-10 rounded-xl bg-aurora-mint/15 grid place-items-center"><Phone className="h-4 w-4 text-aurora-mint" /></div>
            <div><p className="text-xs label-tiny">Call</p><p className="text-sm font-mono">{lead.phone || '—'}</p></div>
          </a>
          <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="candy-card p-4 flex items-center gap-3 hover:translate-y-[-2px] transition">
            <div className="h-10 w-10 rounded-xl bg-aurora-blue/15 grid place-items-center"><MessageCircle className="h-4 w-4 text-aurora-blue" /></div>
            <div><p className="text-xs label-tiny">WhatsApp</p><p className="text-sm">Open chat</p></div>
          </a>
        </div>

        <div className="glass p-5 space-y-3">
          <p className="label-tiny">Notes</p>
          <p className="text-sm whitespace-pre-wrap">{lead.notes || 'No notes yet. Tap edit to add.'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={advance} disabled={lead.stage === 'won' || lead.stage === 'lost'}
            className="rounded-2xl bg-gradient-cta py-3 text-sm font-bold text-white shadow-glow disabled:opacity-40">
            Advance stage →
          </button>
          <button onClick={scheduleFollowUp}
            className="rounded-2xl candy-card py-3 text-sm font-bold flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" /> Follow up
          </button>
        </div>

        <div className="glass p-5 space-y-3">
          <p className="label-tiny">Activity timeline</p>
          {[
            { icon: '🎯', text: `Lead created in ${stage.label.toLowerCase()}`, when: lead.when },
            { icon: '📞', text: 'Last touchpoint logged', when: '—' },
          ].map((a, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-lg">{a.icon}</span>
              <div className="flex-1">
                <p className="text-sm">{a.text}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{a.when}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => { if (confirm('Delete this lead?')) { deleteLead(lead.id); nav('/'); } }}
          className="w-full rounded-2xl bg-aurora-coral/10 border-2 border-aurora-coral/30 py-3 text-sm font-bold text-aurora-coral flex items-center justify-center gap-2">
          <Trash2 className="h-4 w-4" /> Delete lead
        </button>
      </main>
    </div>
  );
};

export default LeadDetail;
