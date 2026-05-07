import { useState, useEffect } from 'react';
import { Header } from '@/components/pixorra/Header';
import { BottomNav, type Tab } from '@/components/pixorra/BottomNav';
import { DashView } from '@/components/pixorra/DashView';
import { LeadsView } from '@/components/pixorra/LeadsView';
import { DataView } from '@/components/pixorra/DataView';
import { CoachView } from '@/components/pixorra/CoachView';
import { RemindersView } from '@/components/pixorra/RemindersView';
import { ReportsView } from '@/components/pixorra/ReportsView';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [tab, setTab] = useState<Tab>('dash');

  useEffect(() => {
    document.title = 'Pixorra OS — Sales CRM';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tab]);

  return (
    <div className="min-h-screen pb-32">
      <Header tasksDone={0} />
      <main className="max-w-2xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {tab === 'dash' && <DashView />}
            {tab === 'leads' && <LeadsView />}
            {tab === 'data' && <DataView />}
            {tab === 'coach' && <CoachView />}
            {tab === 'reminders' && <RemindersView />}
            {tab === 'reports' && <ReportsView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
