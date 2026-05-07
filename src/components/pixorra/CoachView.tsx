import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { coachPrompts } from '@/lib/pixorra-data';
import { toast } from 'sonner';

type Msg = { role: 'assistant' | 'user'; content: string };

const WELCOME =
  "Namaste! Main hoon aapka **Pixorra Sales Coach** ✨\n\nKoi bhi objection, opening line, ya closing script — bas poochho. Hinglish me exact word-for-word scripts milenge.\n\n_Quick prompts neeche try karo — ya khud kuch likho._";

export const CoachView = () => {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'assistant', content: WELCOME }]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, streaming]);

  const send = async (text: string) => {
    if (!text.trim() || streaming) return;
    const userMsg: Msg = { role: 'user', content: text };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput('');
    setStreaming(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coach-chat`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMsgs.filter((_, i) => i > 0).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error('Rate limit hit — 1 min ruko.');
        else if (resp.status === 402) toast.error('AI credits khatam — top up karo.');
        else toast.error('AI error');
        setStreaming(false);
        return;
      }
      if (!resp.body) throw new Error('No stream');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantSoFar = '';
      let started = false;

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMsgs(prev => {
          if (!started) {
            started = true;
            return [...prev, { role: 'assistant', content: assistantSoFar }];
          }
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        });
      };

      let done = false;
      while (!done) {
        const { done: rDone, value } = await reader.read();
        if (rDone) break;
        textBuffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, idx);
          textBuffer = textBuffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Connection issue. Try again.');
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="space-y-4 pb-32">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 border-2 border-hairline shadow-pop">
        <div className="absolute inset-0 bg-gradient-aurora opacity-90 animate-aurora-pulse" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/30 backdrop-blur grid place-items-center border border-white/50">
              <Sparkles className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="font-display text-xl">Pixorra AI Coach</p>
              <p className="text-[10px] font-mono tracking-widest mt-0.5 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-aurora-mint animate-pulse" />
                LIVE · GEMINI · HINGLISH
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {coachPrompts.map(p => (
              <button key={p.label} onClick={() => send(p.label)} disabled={streaming}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold bg-white/40 hover:bg-white/60 backdrop-blur border border-white/50 transition flex items-center gap-1.5 disabled:opacity-50">
                <span>{p.icon}</span> {p.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="space-y-4 min-h-[40vh]">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'assistant' && (
                <div className="h-7 w-7 rounded-full bg-gradient-cta grid place-items-center shrink-0 self-end shadow-soft">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${m.role === 'assistant'
                ? 'glass rounded-bl-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-strong:text-aurora-pink'
                : 'bg-gradient-cta text-white rounded-br-sm shadow-soft'}`}>
                {m.role === 'assistant'
                  ? <ReactMarkdown>{m.content}</ReactMarkdown>
                  : <p>{m.content}</p>}
              </div>
            </motion.div>
          ))}
          {streaming && msgs[msgs.length - 1]?.role === 'user' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-cta grid place-items-center shrink-0 self-end shadow-soft">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="glass rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                {[0, 1, 2].map(i => (
                  <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-aurora-pink"
                    animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="fixed bottom-[88px] left-3 right-3 z-30 max-w-2xl mx-auto">
        <div className="glass-elev flex items-center gap-2 px-3 py-2 shadow-glow border-2">
          <Bot className="h-4 w-4 text-muted-foreground ml-1" />
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Koi bhi sales question poochho…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground py-2" />
          <button type="submit" disabled={!input.trim() || streaming}
            className="h-9 w-9 rounded-full bg-gradient-cta grid place-items-center shadow-soft hover:opacity-90 transition disabled:opacity-40">
            <Send className="h-3.5 w-3.5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};
