import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { createTasks, type Task } from '@/lib/tasks';

// Force dynamic rendering as this API interacts with the database
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = searchParams.get('limit');

    let tasks;
    if (startDate && endDate) {
      const query = db.prepare(`
        SELECT * FROM tasks 
        WHERE start_time >= ? AND start_time <= ?
        ORDER BY start_time ASC
      `);
      tasks = query.all(startDate, endDate + 'T23:59:59');
    } else if (date) {
      const query = db.prepare(`
        SELECT * FROM tasks 
        WHERE start_time LIKE ? 
        ORDER BY start_time ASC
      `);
      tasks = query.all(`${date}%`);
    } else {
      const l = limit ? parseInt(limit, 10) : 100;
      const query = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?');
      tasks = query.all(l);
    }

    // Parse tags from JSON string to array
    const parsedTasks = tasks.map((task: any) => ({
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : [],
    }));

    return NextResponse.json(parsedTasks);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Batch mode: { tasks: [...] }
    if (body.tasks && Array.isArray(body.tasks)) {
      const validTasks = body.tasks.filter((t: any) => t.content);
      if (validTasks.length === 0) {
        return NextResponse.json(
          { error: '至少需要一条有效任务' },
          { status: 400 }
        );
      }

      const created = createTasks(validTasks as Task[]);
      return NextResponse.json({ tasks: created }, { status: 201 });
    }

    // Single task mode (backward compatible)
    const { content, start_time, end_time, tags } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const insert = db.prepare(`
      INSERT INTO tasks (content, start_time, end_time, tags)
      VALUES (?, ?, ?, ?)
    `);

    const tagsString = tags ? JSON.stringify(tags) : '[]';
    const result = insert.run(content, start_time, end_time, tagsString);

    return NextResponse.json({
      id: result.lastInsertRowid,
      content,
      start_time,
      end_time,
      tags: tags || [],
    }, { status: 201 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}
