import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { coachPrompts } from '@/lib/pixorra-data';

type Msg = { from: 'ai' | 'me'; text: React.ReactNode };

export const CoachView = () => {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'ai',
      text: (
        <>
          <p>Namaste! Main hoon aapka <span className="font-bold gradient-text-aurora">Pixorra Sales Coach</span> ✨</p>
          <p className="mt-2">Koi bhi objection, opening line, ya closing script — bas poochho. Live AI se exact Hinglish scripts milenge.</p>
          <p className="mt-2 text-muted-foreground text-[13px]">Quick prompts neeche try karo, ya khud kuch likho. Let's go!</p>
        </>
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: 'me', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, {
        from: 'ai',
        text: (
          <>
            <p>Bhai, AI gateway connect karne par live Hinglish scripts milenge.</p>
            <p className="mt-2 text-muted-foreground text-[13px]">Saved prompt: <span className="italic">"{text}"</span></p>
          </>
        ),
      }]);
    }, 900);
  };

  return (
    <div className="space-y-4 pb-32">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 border border-hairline"
      >
        <div className="absolute inset-0 bg-gradient-aurora opacity-90 animate-aurora-pulse" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur grid place-items-center border border-white/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-serif text-xl text-white">Pixorra AI Coach</p>
              <p className="text-[10px] text-white/85 font-mono tracking-widest mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-mint animate-pulse" />
                LIVE · GEMINI 2.5 · HINGLISH
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {coachPrompts.map((p) => (
              <button
                key={p.label}
                onClick={() => send(p.label)}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold bg-white/15 text-white hover:bg-white/25 backdrop-blur border border-white/20 transition flex items-center gap-1.5"
              >
                <span>{p.icon}</span> {p.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="space-y-4 min-h-[40vh]">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${m.from === 'me' ? 'justify-end' : ''}`}
            >
              {m.from === 'ai' && (
                <div className="h-7 w-7 rounded-full bg-gradient-cta grid place-items-center shrink-0 self-end shadow-soft">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                m.from === 'ai'
                  ? 'glass rounded-bl-sm'
                  : 'bg-gradient-cta text-white rounded-br-sm shadow-soft'
              }`}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {typing && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex gap-2"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-cta grid place-items-center shrink-0 self-end shadow-soft">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-aurora-pink"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Input — fixed above bottom nav */}
      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="fixed bottom-[88px] left-3 right-3 z-30 max-w-2xl mx-auto"
      >
        <div className="glass-elev flex items-center gap-2 px-3 py-2 shadow-glow">
          <Bot className="h-4 w-4 text-muted-foreground ml-1" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Koi bhi sales question poochho…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground py-2"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="h-9 w-9 rounded-full bg-gradient-cta grid place-items-center shadow-soft hover:opacity-90 transition disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};
