import { totalTasks } from '@/lib/pixorra-data';

const today = new Date().toLocaleDateString('en-IN', {
  weekday: 'short', day: 'numeric', month: 'short',
});

export const Header = ({ revenueToday = 0, tasksDone = 0 }: { revenueToday?: number; tasksDone?: number }) => (
  <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/60 border-b border-white/40">
    <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-11 w-11 rounded-2xl bg-gradient-hero shadow-glow grid place-items-center text-xl shrink-0">
          <span>🦄</span>
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-mint border-2 border-background" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-display gradient-text leading-none">Pixorra</h1>
            <span className="text-lg font-display text-foreground/80 leading-none">OS</span>
            <span className="pill bg-purple-soft text-purple-foreground text-[9px] px-1.5 py-0.5">v1</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{today} · Kalyani</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="pill bg-mint-soft text-emerald-800">
          <span className="font-display text-sm">₹{revenueToday}</span>
          <span className="text-[9px] opacity-70">TODAY</span>
        </div>
        <div className="pill bg-pink-soft text-pink-700">
          <span className="font-display text-sm">{tasksDone}<span className="opacity-60">/{totalTasks}</span></span>
          <span className="text-[9px] opacity-70">TASKS</span>
        </div>
      </div>
    </div>
  </header>
);
