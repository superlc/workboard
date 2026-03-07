'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: number;
  content: string;
  start_time: string | null;
  end_time: string | null;
  tags: string[];
}

interface StatsData {
  dailyHours: { date: string; hours: number }[];
  tagDistribution: { tag: string; count: number }[];
}

// Seeded random for stable layout across re-renders
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const TAG_COLORS = [
  'rgba(255,255,255,0.95)',
  'rgba(255,255,255,0.7)',
  'rgba(255,255,255,0.5)',
  'rgba(180,210,255,0.85)',
  'rgba(200,230,200,0.8)',
  'rgba(255,220,180,0.75)',
];

function TagCloud({ tags }: { tags: { tag: string; count: number }[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [positions, setPositions] = React.useState<
    { left: number; top: number; fontSize: number; color: string; tag: string; count: number }[]
  >([]);

  React.useEffect(() => {
    if (!containerRef.current || tags.length === 0) return;
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const maxCount = Math.max(...tags.map((t) => t.count));
    const rand = seededRandom(42);
    const PAD = 20;
    const GAP = 8;

    // Measure real text sizes using a hidden probe element
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font-weight:600;';
    container.appendChild(probe);

    const measured = tags.map((t, i) => {
      const ratio = t.count / maxCount;
      const fontSize = 12 + ratio * 28;
      const color = TAG_COLORS[i % TAG_COLORS.length];
      probe.style.fontSize = `${fontSize}px`;
      probe.textContent = t.tag;
      const bw = probe.offsetWidth;
      const bh = probe.offsetHeight;
      return { tag: t.tag, count: t.count, fontSize, color, bw, bh };
    });

    container.removeChild(probe);

    // Place tags using spiral from center
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const items = measured.map((m) => {
      const { bw, bh } = m;
      let angle = rand() * Math.PI * 2;
      let left = 0;
      let top = 0;
      let placed_ok = false;

      for (let attempt = 0; attempt < 500; attempt++) {
        const radius = attempt * 0.6;
        const cx = width / 2 + Math.cos(angle) * radius - bw / 2;
        const cy = height / 2 + Math.sin(angle) * radius - bh / 2;

        if (cx >= PAD && cy >= PAD && cx + bw <= width - PAD && cy + bh <= height - PAD) {
          const overlap = placed.some(
            (p) =>
              cx < p.x + p.w + GAP &&
              cx + bw + GAP > p.x &&
              cy < p.y + p.h + GAP &&
              cy + bh + GAP > p.y
          );
          if (!overlap) {
            placed.push({ x: cx, y: cy, w: bw, h: bh });
            left = cx;
            top = cy;
            placed_ok = true;
            break;
          }
        }
        angle += 0.3;
      }

      if (!placed_ok) {
        left = Math.max(PAD, Math.min(width - PAD - bw, width / 2 - bw / 2));
        top = Math.max(PAD, Math.min(height - PAD - bh, height / 2 - bh / 2));
        placed.push({ x: left, y: top, w: bw, h: bh });
      }

      return { left, top, fontSize: m.fontSize, color: m.color, tag: m.tag, count: m.count };
    });

    setPositions(items);
  }, [tags]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-lg overflow-hidden"
      style={{ height: 200, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      {positions.map((item) => (
        <span
          key={item.tag}
          className="absolute select-none cursor-default transition-opacity hover:opacity-100 whitespace-nowrap font-semibold"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.fontSize,
            color: item.color,
            opacity: 0.85,
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
          title={`${item.tag}: ${item.count}`}
        >
          {item.tag}
        </span>
      ))}
      {positions.length === 0 && (
        <div className="flex items-center justify-center h-full text-white/40 text-sm">
          暂无标签数据
        </div>
      )}
    </div>
  );
}

export function TaskStats() {
  const [stats, setStats] = React.useState<StatsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/tasks?limit=1000'); // Fetch enough history
        const data: Task[] = await response.json();
        
        // Process data for last 7 days (use local date, not UTC)
        const today = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const toLocalDate = (d: Date) =>
          `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(today.getDate() - (6 - i));
          return toLocalDate(d);
        });

        const dailyHours = last7Days.map(date => {
          const tasksForDay = data.filter(t => t.start_time?.startsWith(date));
          const hours = tasksForDay.reduce((acc, t) => {
            if (t.start_time && t.end_time) {
              const start = new Date(t.start_time).getTime();
              const end = new Date(t.end_time).getTime();
              return acc + (end - start) / (1000 * 60 * 60);
            }
            return acc + 0.5; // Default 30 mins if no end time
          }, 0);
          return { date, hours };
        });

        const tagCounts: Record<string, number> = {};
        data.forEach(t => {
          t.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        });

        const tagDistribution = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count);

        setStats({ dailyHours, tagDistribution });
      } catch (e) {
        console.error('Failed to load stats', e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>正在加载统计数据...</div>;
  if (!stats) return <div>暂无统计数据</div>;

  const maxHours = Math.max(...stats.dailyHours.map(d => d.hours), 1);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>
            本周工作量 <span className="text-sm font-normal text-muted-foreground">{stats.dailyHours.reduce((sum, d) => sum + d.hours, 0).toFixed(1)}h</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {stats.dailyHours.map((d) => {
              const barHeight = Math.max(d.hours > 0 ? 4 : 0, Math.round((d.hours / maxHours) * 140));
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group">
                  <div className="relative flex-shrink-0 w-full flex justify-center">
                    <span className="absolute -top-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-popover px-1 rounded shadow-sm">
                      {d.hours.toFixed(1)}h
                    </span>
                  </div>
                  <div
                    className="w-full bg-primary/80 rounded-t-md transition-all group-hover:bg-primary flex-shrink-0"
                    style={{ height: `${barHeight}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1 flex-shrink-0">
                    {new Date(d.date + 'T00:00:00').toLocaleDateString('zh-CN', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>标签分布</CardTitle>
        </CardHeader>
        <CardContent>
          <TagCloud tags={stats.tagDistribution} />
        </CardContent>
      </Card>
    </div>
  );
}
