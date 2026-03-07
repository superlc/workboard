import { NextRequest, NextResponse } from 'next/server';
import { query } from '@tencent-ai/agent-sdk';

// Force dynamic rendering as this API interacts with external AI service
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { text, timezone } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text input is required' },
        { status: 400 }
      );
    }

    // Construct the prompt for structured extraction
    // Use local time so the returned times match the user's timezone
    const now = new Date();
    const localNow = new Intl.DateTimeFormat('sv-SE', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: timezone || 'Asia/Shanghai',
    }).format(now);

    const systemPrompt = `
      You are a precise task parser.
      The user's current local time is: ${localNow} (timezone: ${timezone || 'Asia/Shanghai'}).

      Extract the following from the user's input:
      - content: The main task description.
      - start_time: LOCAL time in format "YYYY-MM-DDTHH:mm:ss" (NO timezone suffix, NO "Z"). If time is relative (e.g. "10am"), use today's date. If ambiguous, leave null.
      - end_time: LOCAL time in format "YYYY-MM-DDTHH:mm:ss" (NO timezone suffix, NO "Z"). If duration is mentioned, calculate it. If not, leave null.
      - tags: Array of strings (e.g. "Dev", "Meeting", "Design"). Infer from content.

      IMPORTANT: All times must be in the user's LOCAL timezone. Do NOT use UTC. Do NOT append "Z" or any timezone offset.

      Return ONLY a valid JSON object. Do not wrap in markdown code blocks.
      Example:
      {
        "content": "Fix login bug",
        "start_time": "2023-10-27T10:00:00",
        "end_time": null,
        "tags": ["Dev"]
      }
    `;

    const fullPrompt = `${systemPrompt}\n\nUser Input: "${text}"`;

    // Using the query API as per documentation found earlier
    const q = query({
      prompt: fullPrompt,
      options: {
        model: 'gemini-3.0-pro', // Or another available model
        // If API Key is needed, it's typically picked up from env vars or config file.
        // The user provided CODEBUDDY_API_KEY in .env.
      }
    });

    let resultText = '';
    for await (const message of q) {
      if (message.type === 'result') {
        // result message contains the final complete response — use it directly
        const msg = message as any;
        if (msg.result && typeof msg.result === 'string') {
          resultText = msg.result;
        }
      }
    }

    if (!resultText.trim()) {
      return NextResponse.json(
        { error: 'AI returned empty response. The model may not be available or the API key may be invalid.' },
        { status: 502 }
      );
    }

    // Attempt to parse JSON
    try {
      // Clean up potential markdown formatting (```json ... ```)
      const jsonString = resultText.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(jsonString);
      
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error('Failed to parse AI response:', resultText);
      return NextResponse.json(
        { error: 'Failed to parse AI response', raw: resultText },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('AI Parsing error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
