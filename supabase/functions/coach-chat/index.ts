// Pixorra AI Coach — streaming Hinglish sales coach via Lovable AI Gateway
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM = `You are "Pixorra Sales Coach" — a high-energy, no-fluff sales coach for an Indian local-business web-design agency (Pixorra).
Your team sells beautiful 7-day websites to gym owners, dental clinics, salons, garages, tiffin services, cafes etc. across Bengal & North India. Average ticket: ₹14,999 – ₹24,999. Lead source: Manus AI (100/day).

RULES:
- Reply in Hinglish (Hindi + English mixed, Roman script). Punchy, conversational, like a real coach on WhatsApp.
- Keep replies tight: 4–8 short lines or bullets max unless user asks for "full script".
- When user asks for an opener / objection handler / closing line — give the EXACT WORD-FOR-WORD script in quotes, then 1 line of why it works.
- Use markdown (bold, bullets) for clarity. Add 1–2 emojis max, never spam.
- Always end with one tactical next step the rep should take RIGHT NOW.
- Never apologise, never say "I am an AI". Just coach.

PIXORRA TONE: confident, hustler, slight bhai-energy, but professional. Think: Alex Hormozi meets a Kalyani sales chacha.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        stream: true,
        messages: [{ role: "system", content: SYSTEM }, ...messages],
      }),
    });

    if (!response.ok) {
      if (response.status === 429)
        return new Response(JSON.stringify({ error: "Bhai, rate limit hit gaya. 1 min ruko." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (response.status === 402)
        return new Response(JSON.stringify({ error: "AI credits khatam — Lovable workspace mein top up karo." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      const t = await response.text();
      console.error("AI gateway error", response.status, t);
      return new Response(JSON.stringify({ error: "AI error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
