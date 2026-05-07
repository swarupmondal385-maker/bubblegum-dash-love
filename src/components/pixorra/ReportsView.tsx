import { motion } from 'framer-motion';
import { Download, FileText, TrendingUp, Users, IndianRupee } from 'lucide-react';
import { useStore } from '@/lib/store';
import { AnimatedCounter } from './AnimatedCounter';
import { toast } from 'sonner';

const downloadCSV = (filename: string, rows: (string | number)[][]) => {
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const downloadJSON = (filename: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export const ReportsView = () => {
  const { leads, clients, reminders } = useStore();

  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === 'won');
  const winRate = totalLeads ? (wonLeads.length / totalLeads) * 100 : 0;
  const totalRevenue = clients.reduce((s, c) => s + c.paid, 0);
  const pipelineValue = leads.filter(l => ['demo', 'neg'].includes(l.stage)).reduce((s, l) => s + l.value, 0);
  const avgTicket = clients.length ? totalRevenue / clients.length : 0;
  const activeProjects = clients.filter(c => c.status === 'active').length;

  const cityBreakdown = leads.reduce((acc, l) => {
    if (!l.city) return acc;
    acc[l.city] = (acc[l.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCities = Object.entries(cityBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const exportLeads = () => {
    const rows: (string | number)[][] = [['ID', 'Name', 'Business', 'City', 'Stage', 'Value', 'Hot', 'Phone', 'When']];
    leads.forEach(l => rows.push([l.id, l.name, l.business, l.city, l.stage, l.value, l.hot ? 'yes' : 'no', l.phone, l.when]));
    downloadCSV(`pixorra-leads-${Date.now()}.csv`, rows);
    toast.success('Leads exported');
  };
  const exportClients = () => {
    const rows: (string | number)[][] = [['ID', 'Business', 'Owner', 'City', 'Value', 'Paid', 'Status', 'Day']];
    clients.forEach(c => rows.push([c.id, c.name, c.owner, c.city, c.value, c.paid, c.status, c.day]));
    downloadCSV(`pixorra-clients-${Date.now()}.csv`, rows);
    toast.success('Clients exported');
  };
  const exportFull = () => {
    downloadJSON(`pixorra-full-export-${Date.now()}.json`, { leads, clients, reminders, generatedAt: new Date().toISOString() });
    toast.success('Full backup downloaded');
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden candy-card p-5">
        <div className="absolute inset-0 bg-gradient-aurora opacity-30" />
        <div className="relative flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white/40 backdrop-blur grid place-items-center border border-white/60">
            <FileText className="h-5 w-5 text-aurora-violet" />
          </div>
          <div className="flex-1">
            <p className="font-display text-xl">Reports & Export</p>
            <p className="text-xs text-muted-foreground font-mono">Snapshot · {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <Kpi icon={<IndianRupee className="h-3.5 w-3.5" />} label="Revenue" value={totalRevenue} prefix="₹" tint="mint" />
        <Kpi icon={<TrendingUp className="h-3.5 w-3.5" />} label="Pipeline" value={pipelineValue} prefix="₹" tint="amber" />
        <Kpi icon={<Users className="h-3.5 w-3.5" />} label="Total leads" value={totalLeads} tint="pink" />
        <Kpi icon={<TrendingUp className="h-3.5 w-3.5" />} label="Win rate" value={Math.round(winRate)} suffix="%" tint="violet" />
        <Kpi icon={<IndianRupee className="h-3.5 w-3.5" />} label="Avg ticket" value={Math.round(avgTicket)} prefix="₹" tint="amber" />
        <Kpi icon={<Users className="h-3.5 w-3.5" />} label="Active projects" value={activeProjects} tint="mint" />
      </div>

      <div className="glass p-5 space-y-3">
        <p className="label-tiny">Top cities</p>
        {topCities.length === 0 && <p className="text-sm text-muted-foreground">No city data yet.</p>}
        {topCities.map(([city, count], i) => {
          const pct = (count / totalLeads) * 100;
          return (
            <div key={city}>
              <div className="flex items-center justify-between mb-1.5 text-sm">
                <span className="font-medium">{city}</span>
                <span className="font-mono text-aurora-pink">{count} leads</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-1 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="h-full bg-gradient-cta" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass p-5 space-y-3">
        <p className="label-tiny">Export data</p>
        <div className="grid grid-cols-1 gap-2">
          <ExportBtn onClick={exportLeads} label="Export leads (CSV)" sub={`${leads.length} records`} />
          <ExportBtn onClick={exportClients} label="Export clients (CSV)" sub={`${clients.length} records`} />
          <ExportBtn onClick={exportFull} label="Full backup (JSON)" sub="Leads + clients + reminders" primary />
        </div>
      </div>
    </div>
  );
};

const Kpi = ({ icon, label, value, prefix = '', suffix = '', tint }: {
  icon: React.ReactNode; label: string; value: number; prefix?: string; suffix?: string;
  tint: 'pink' | 'amber' | 'mint' | 'violet';
}) => {
  const map = {
    pink: 'text-aurora-pink bg-aurora-pink/10',
    amber: 'text-aurora-amber bg-aurora-amber/10',
    mint: 'text-aurora-mint bg-aurora-mint/10',
    violet: 'text-aurora-violet bg-aurora-violet/10',
  } as const;
  return (
    <div className="glass p-4 relative overflow-hidden">
      <div className={`absolute -top-6 -right-6 h-16 w-16 rounded-full ${map[tint]} blur-2xl`} />
      <div className={`inline-flex items-center gap-1 pill text-[10px] ${map[tint]} relative`}>{icon} {label}</div>
      <p className={`font-serif-display text-2xl mt-2 ${map[tint].split(' ')[0]} tabular-nums relative`}>
        <AnimatedCounter value={value} prefix={prefix} />{suffix}
      </p>
    </div>
  );
};

const ExportBtn = ({ onClick, label, sub, primary }: { onClick: () => void; label: string; sub: string; primary?: boolean }) => (
  <button onClick={onClick}
    className={`w-full rounded-xl py-3 px-4 flex items-center gap-3 transition ${primary
      ? 'bg-gradient-cta text-white shadow-glow hover:opacity-95'
      : 'candy-card hover:translate-y-[-1px]'}`}>
    <Download className="h-4 w-4" />
    <div className="flex-1 text-left">
      <p className="text-sm font-bold">{label}</p>
      <p className={`text-[11px] ${primary ? 'text-white/80' : 'text-muted-foreground'} font-mono`}>{sub}</p>
    </div>
  </button>
);
