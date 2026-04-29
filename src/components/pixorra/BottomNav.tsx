import { Home, ListChecks, Target, Database, Bot, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type Tab = 'dash' | 'ops' | 'leads' | 'data' | 'coach' | 'team';

const items: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'dash', label: 'Dash', icon: Home },
  { key: 'ops', label: 'Ops', icon: ListChecks },
  { key: 'leads', label: 'Leads', icon: Target },
  { key: 'data', label: 'Data', icon: Database },
  { key: 'coach', label: 'Coach', icon: Bot },
  { key: 'team', label: 'Team', icon: Users },
];

export const BottomNav = ({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) => (
  <nav className="fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pt-2 pointer-events-none">
    <div className="max-w-2xl mx-auto pointer-events-auto">
      <div className="relative glass-elev rounded-2xl p-1.5 grid grid-cols-6 gap-0.5 shadow-glow">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="relative flex flex-col items-center justify-center py-2 rounded-xl group"
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-gradient-cta shadow-soft"
                />
              )}
              <span className="relative flex flex-col items-center gap-0.5">
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] transition',
                    isActive ? 'text-white' : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                <span className={cn(
                  'text-[10px] font-semibold tracking-wide',
                  isActive ? 'text-white' : 'text-muted-foreground'
                )}>{label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  </nav>
);
