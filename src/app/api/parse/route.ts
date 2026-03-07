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
      You are a precise task parser. The user may describe one or multiple tasks in a single input.
      The user's current local time is: ${localNow} (timezone: ${timezone || 'Asia/Shanghai'}).

      Extract ALL tasks from the user's input. For each task extract:
      - content: The main task description.
      - start_time: LOCAL time in format "YYYY-MM-DDTHH:mm:ss" (NO timezone suffix, NO "Z"). If time is relative (e.g. "10am"), use today's date. If no explicit start time but a duration is given (e.g. "2个小时"), assume the task just ended and calculate start_time = current time - duration. If truly no time info at all, use current time as start_time. NEVER leave start_time as null.
      - end_time: LOCAL time in format "YYYY-MM-DDTHH:mm:ss" (NO timezone suffix, NO "Z"). If duration is mentioned, calculate from start_time. If no duration or end time mentioned, assume 1 hour duration and set end_time = start_time + 1 hour. NEVER leave end_time as null.
      - tags: Array of strings (e.g. "开发", "会议", "设计"). Infer from content.

      IMPORTANT: All times must be in the user's LOCAL timezone. Do NOT use UTC. Do NOT append "Z" or any timezone offset.

      ALWAYS return a JSON object with a "tasks" array, even if there is only one task.
      Do not wrap in markdown code blocks.

      Example (single task, user said "修复登录Bug 2小时", current time is 2023-10-27T12:00:00):
      {
        "tasks": [
          { "content": "修复登录Bug", "start_time": "2023-10-27T10:00:00", "end_time": "2023-10-27T12:00:00", "tags": ["开发"] }
        ]
      }

      Example (multiple tasks):
      {
        "tasks": [
          { "content": "修复登录Bug", "start_time": "2023-10-27T10:00:00", "end_time": "2023-10-27T12:00:00", "tags": ["开发"] },
          { "content": "需求评审会议", "start_time": "2023-10-27T14:00:00", "end_time": "2023-10-27T15:00:00", "tags": ["会议"] }
        ]
      }

      Example (no time mentioned, user said "写周报", current time is 2023-10-27T16:30:00):
      {
        "tasks": [
          { "content": "写周报", "start_time": "2023-10-27T16:30:00", "end_time": "2023-10-27T17:30:00", "tags": ["工作"] }
        ]
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
      const jsonString = resultText.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(jsonString);
      
      // Normalize response to always return { tasks: [...] }
      let normalized: { tasks: any[] };
      if (parsedData.tasks && Array.isArray(parsedData.tasks)) {
        normalized = parsedData;
      } else if (Array.isArray(parsedData)) {
        normalized = { tasks: parsedData };
      } else if (parsedData.content) {
        normalized = { tasks: [parsedData] };
      } else {
        normalized = { tasks: [parsedData] };
      }

      return NextResponse.json(normalized);
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
