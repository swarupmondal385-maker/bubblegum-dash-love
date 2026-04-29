import { totalTasks } from '@/lib/pixorra-data';
import { Search, Bell, Sparkles } from 'lucide-react';

const today = new Date().toLocaleDateString('en-IN', {
  weekday: 'short', day: 'numeric', month: 'short',
});

export const Header = ({
  revenueToday = 14999,
  tasksDone = 0,
  onCommand,
}: { revenueToday?: number; tasksDone?: number; onCommand?: () => void }) => (
  <header className="sticky top-0 z-30">
    <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl border-b border-hairline/60" />
    <div className="relative max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
      {/* Brand */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="relative h-9 w-9 rounded-xl bg-gradient-cta grid place-items-center shadow-glow shrink-0">
          <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-aurora-mint border-2 border-background" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[15px] font-bold tracking-tight leading-none">
              Pixorra <span className="text-muted-foreground font-normal">/ OS</span>
            </h1>
            <span className="pill bg-aurora-violet/15 text-aurora-violet text-[9px] px-1.5 py-0">v1.0</span>
          </div>
          <p className="text-[10.5px] text-muted-foreground mt-1 truncate font-mono">{today.toUpperCase()} · KALYANI · IST</p>
        </div>
      </div>

      {/* Pills */}
      <button
        onClick={onCommand}
        className="hidden sm:flex h-9 items-center gap-2 px-3 rounded-lg bg-surface-1 border border-hairline text-xs text-muted-foreground hover:text-foreground hover:border-aurora-pink/30 transition"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search</span>
        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-elev">⌘K</kbd>
      </button>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="hidden xs:flex pill bg-aurora-mint/12 text-aurora-mint border border-aurora-mint/20">
          <span className="font-bold tracking-tight">₹{(revenueToday / 1000).toFixed(1)}K</span>
          <span className="opacity-60 text-[9px] tracking-widest">TODAY</span>
        </div>
        <div className="pill bg-aurora-pink/12 text-aurora-pink border border-aurora-pink/20">
          <span className="font-bold tracking-tight">{tasksDone}<span className="opacity-50">/{totalTasks}</span></span>
        </div>
        <button className="h-9 w-9 rounded-lg bg-surface-1 border border-hairline grid place-items-center hover:border-aurora-pink/30 transition relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-aurora-pink animate-pulse" />
        </button>
      </div>
    </div>
  </header>
);
