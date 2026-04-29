import { Home, ListChecks, Target, Database, Bot, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tab = 'dash' | 'ops' | 'leads' | 'data' | 'coach' | 'team';

const items: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'dash', label: 'DASH', icon: Home },
  { key: 'ops', label: 'OPS', icon: ListChecks },
  { key: 'leads', label: 'LEADS', icon: Target },
  { key: 'data', label: 'DATA', icon: Database },
  { key: 'coach', label: 'COACH', icon: Bot },
  { key: 'team', label: 'TEAM', icon: Users },
];

export const BottomNav = ({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) => (
  <nav className="fixed bottom-0 inset-x-0 z-40 backdrop-blur-xl bg-background/80 border-t border-white/60">
    <div className="max-w-2xl mx-auto px-2 py-2 grid grid-cols-6">
      {items.map(({ key, label, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative flex flex-col items-center gap-1 py-1.5 group"
          >
            {isActive && <span className="absolute -top-2 h-1 w-8 rounded-full bg-gradient-cta" />}
            <Icon
              className={cn(
                'h-5 w-5 transition-all',
                isActive ? 'text-pink scale-110' : 'text-muted-foreground group-hover:text-foreground'
              )}
              strokeWidth={isActive ? 2.4 : 2}
            />
            <span className={cn(
              'text-[10px] font-bold tracking-wider',
              isActive ? 'text-pink' : 'text-muted-foreground'
            )}>{label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);
