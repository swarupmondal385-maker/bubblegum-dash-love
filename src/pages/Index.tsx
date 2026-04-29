import { useState } from 'react';
import { Header } from '@/components/pixorra/Header';
import { BottomNav, type Tab } from '@/components/pixorra/BottomNav';
import { DashView } from '@/components/pixorra/DashView';
import { OpsView } from '@/components/pixorra/OpsView';
import { LeadsView } from '@/components/pixorra/LeadsView';
import { DataView } from '@/components/pixorra/DataView';
import { CoachView } from '@/components/pixorra/CoachView';
import { TeamView } from '@/components/pixorra/TeamView';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [tab, setTab] = useState<Tab>('dash');
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-24">
      <Header tasksDone={done.size} />
      <main className="max-w-2xl mx-auto px-4 py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {tab === 'dash' && <DashView />}
            {tab === 'ops' && <OpsView done={done} onToggle={toggle} />}
            {tab === 'leads' && <LeadsView />}
            {tab === 'data' && <DataView />}
            {tab === 'coach' && <CoachView />}
            {tab === 'team' && <TeamView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
