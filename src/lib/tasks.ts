import db from './db';

export interface Task {
  id?: number;
  content: string;
  start_time?: string;
  end_time?: string;
  tags: string[]; // Application sees array
  created_at?: string;
}

export function getAllTasks(limit = 100): Task[] {
  const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?');
  const rows = stmt.all(limit) as any[];
  return rows.map(row => ({
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : []
  }));
}

export function getTasksByDate(datePrefix: string): Task[] {
  const stmt = db.prepare(`
    SELECT * FROM tasks 
    WHERE start_time LIKE ? 
    ORDER BY start_time ASC
  `);
  const rows = stmt.all(`${datePrefix}%`) as any[];
  return rows.map(row => ({
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : []
  }));
}

export function createTask(task: Task): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (content, start_time, end_time, tags)
    VALUES (?, ?, ?, ?)
  `);
  
  const tagsString = JSON.stringify(task.tags || []);
  const result = stmt.run(task.content, task.start_time, task.end_time, tagsString);
  
  return {
    ...task,
    id: result.lastInsertRowid as number,
    tags: task.tags || []
  };
}

export function createTasks(tasks: Task[]): Task[] {
  const stmt = db.prepare(`
    INSERT INTO tasks (content, start_time, end_time, tags)
    VALUES (?, ?, ?, ?)
  `);

  const insertMany = db.transaction((items: Task[]) => {
    const results: Task[] = [];
    for (const task of items) {
      const tagsString = JSON.stringify(task.tags || []);
      const result = stmt.run(task.content, task.start_time, task.end_time, tagsString);
      results.push({
        ...task,
        id: result.lastInsertRowid as number,
        tags: task.tags || [],
      });
    }
    return results;
  });

  return insertMany(tasks);
}

export function getTasksByRange(startDate: string, endDate: string): Task[] {
  const stmt = db.prepare(`
    SELECT * FROM tasks 
    WHERE start_time >= ? AND start_time <= ?
    ORDER BY start_time ASC
  `);
  const rows = stmt.all(startDate, endDate) as any[];
  return rows.map(row => ({
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : []
  }));
}
