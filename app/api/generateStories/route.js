import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request) {
  console.log(
    '🔑 OPENAI_API_KEY:',
    process.env.OPENAI_API_KEY
      ? process.env.OPENAI_API_KEY.slice(0, 6) + '…'
      : 'undefined'
  );

  const { topic, numSummaries = 4, lengthMinutes = 10 } = await request.json();
  if (!topic) {
    return NextResponse.json({ error: 'Missing topic' }, { status: 400 });
  }

  try {
    const prompt = `
You are an adult bedtime storyteller.
Generate ${numSummaries} story summaries about "${topic}", each suitable for a ${lengthMinutes}-minute narrated sleep story.

**OUTPUT STRICTLY AND ONLY** a JSON array in this exact form:
[
  { "title": "…", "summary": "…" },
  …
]
No markdown or extra text—only the JSON array.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 400
    });

    const raw = completion.choices[0].message.content;
    console.log('🤖 Raw AI response:', raw);

    // Use regex to robustly extract the first […] block
    const match = raw.match(/\[.*\]/s);
    if (!match) {
      console.error('No JSON array found in AI response');
      return NextResponse.json({ error: 'AI returned no JSON array' }, { status: 500 });
    }

    let stories;
    try {
      stories = JSON.parse(match[0]);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr);
      console.error('Attempted JSON was:', match[0]);
      return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 500 });
    }

    return NextResponse.json({ stories });
  } catch (err) {
    console.error('Generation error:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
