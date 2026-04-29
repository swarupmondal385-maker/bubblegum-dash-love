import { totalTasks } from '@/lib/pixorra-data';
import { Search, Bell } from 'lucide-react';
import logo from '@/assets/pixorra-logo.png';

const today = new Date().toLocaleDateString('en-IN', {
  weekday: 'short', day: 'numeric', month: 'short',
});

export const Header = ({
  revenueToday = 14999,
  tasksDone = 0,
  onCommand,
}: { revenueToday?: number; tasksDone?: number; onCommand?: () => void }) => (
  <header className="sticky top-0 z-30">
    <div className="absolute inset-0 bg-background/80 backdrop-blur-2xl border-b-2 border-hairline" />
    {/* Rainbow stripe */}
    <div className="absolute bottom-0 inset-x-0 h-[3px] rainbow-stripe animate-rainbow-pan opacity-90" />
    <div className="relative max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
      {/* Brand */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="relative h-11 w-11 rounded-2xl bg-white grid place-items-center shadow-pop border-2 border-hairline shrink-0 animate-bounce-soft overflow-hidden">
          <img src={logo} alt="Pixorra logo" className="h-9 w-9 object-contain" style={{ imageRendering: 'pixelated' }} />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-aurora-mint border-2 border-background animate-sparkle" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[17px] font-serif-display font-black tracking-tight leading-none">
              <span className="gradient-text-rainbow">Pixorra</span>
              <span className="text-muted-foreground font-normal text-sm"> / OS</span>
            </h1>
            <span className="pill bg-aurora-violet/15 text-aurora-violet text-[9px] px-1.5 py-0">v1.0</span>
          </div>
          <p className="text-[10.5px] text-muted-foreground mt-1 truncate font-mono font-semibold">{today.toUpperCase()} · KALYANI · IST</p>
        </div>
      </div>

      <button
        onClick={onCommand}
        className="hidden sm:flex h-10 items-center gap-2 px-3 rounded-xl bg-white border-2 border-hairline text-xs text-muted-foreground hover:text-foreground hover:border-aurora-pink/40 hover:shadow-soft transition"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="font-semibold">Search</span>
        <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary">⌘K</kbd>
      </button>

      <div className="flex items-center gap-1.5 shrink-0">
        <div className="hidden xs:flex pill bg-aurora-mint/15 text-aurora-mint border-2 border-aurora-mint/30">
          <span className="font-black tracking-tight">₹{(revenueToday / 1000).toFixed(1)}K</span>
          <span className="opacity-70 text-[9px] tracking-widest">TODAY</span>
        </div>
        <div className="pill bg-aurora-pink/15 text-aurora-pink border-2 border-aurora-pink/30">
          <span className="font-black tracking-tight">{tasksDone}<span className="opacity-50">/{totalTasks}</span></span>
        </div>
        <button className="h-10 w-10 rounded-xl bg-white border-2 border-hairline grid place-items-center hover:border-aurora-pink/40 hover:shadow-soft transition relative">
          <Bell className="h-4 w-4 text-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-aurora-pink animate-pulse" />
        </button>
      </div>
    </div>
  </header>
);
