import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { coachPrompts } from '@/lib/pixorra-data';

type Msg = { from: 'ai' | 'me'; text: React.ReactNode };

export const CoachView = () => {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'ai',
      text: (
        <>
          <p>Namaste! Main hoon aapka <span className="font-bold gradient-text">Pixorra Sales Coach</span> 🤖</p>
          <p className="mt-2">Koi bhi objection, opening line, ya closing script — bas poochho. Live AI se exact Hinglish scripts milenge.</p>
          <p className="mt-2">Neeche quick prompts try karo, ya khud kuch bhi poochho. Let's go!</p>
        </>
      ),
    },
  ]);
  const [input, setInput] = useState('');

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTimeout(() => {
      setMsgs((m) => [...m, {
        from: 'ai',
        text: <p>Bhai, AI gateway connect karne par live Hinglish scripts milenge. Abhi prompt save: <i>"{text}"</i></p>,
      }]);
    }, 700);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      {/* Hero */}
      <div className="rounded-3xl p-5 bg-gradient-hero text-white shadow-glow relative overflow-hidden">
        <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
        <div className="flex items-center gap-3 relative">
          <div className="h-11 w-11 rounded-2xl bg-white/20 grid place-items-center backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-xl">Pixorra AI Coach</p>
            <p className="text-[11px] tracking-widest opacity-90">● LIVE · GEMINI 2.5 · HINGLISH</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 relative">
          {coachPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold bg-white/25 hover:bg-white/35 backdrop-blur transition"
            >{p}</button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-5 space-y-4">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${m.from === 'me' ? 'justify-end' : ''}`}
            >
              {m.from === 'ai' && (
                <div className="h-8 w-8 rounded-full bg-gradient-cta grid place-items-center shrink-0 self-end">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${
                m.from === 'ai' ? 'bg-card border border-border shadow-card rounded-bl-md' : 'bg-gradient-cta text-white rounded-br-md shadow-soft'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="sticky bottom-0 flex items-center gap-2 glass-card px-4 py-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Koi bhi sales question poochho…"
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground py-2"
        />
        <button type="submit" className="h-10 w-10 rounded-full bg-gradient-cta grid place-items-center shadow-soft hover:opacity-90 transition">
          <Send className="h-4 w-4 text-white" />
        </button>
      </form>
    </div>
  );
};
