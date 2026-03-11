'use client';

import * as React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  totalHours: number;
}

// --- Helpers ---
const pad = (n: number) => String(n).padStart(2, '0');
const toLocalDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function getPresetRange(preset: string): [Date, Date] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  switch (preset) {
    case 'week': {
      const day = today.getDay();
      const start = new Date(today);
      start.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
      return [start, today];
    }
    case 'month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return [start, today];
    }
    case 'last7': {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      return [start, today];
    }
    case 'last30': {
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      return [start, today];
    }
    default:
      return [today, today];
  }
}

function getDaysBetween(start: Date, end: Date): string[] {
  const days: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    days.push(toLocalDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

// --- Seeded random for stable layout ---
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

function TagCloud({ tags, noDataText }: { tags: { tag: string; count: number }[]; noDataText: string }) {
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
          {noDataText}
        </div>
      )}
    </div>
  );
}

// --- Date Range Picker ---
function DateRangePicker({
  value,
  onChange,
  presetLabels,
  toLabel,
}: {
  value: { startDate: string; endDate: string; preset: string };
  onChange: (v: { startDate: string; endDate: string; preset: string }) => void;
  presetLabels: { key: string; label: string }[];
  toLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {presetLabels.map((p) => (
        <Button
          key={p.key}
          variant={value.preset === p.key ? 'default' : 'outline'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            if (p.key === 'custom') {
              onChange({ ...value, preset: 'custom' });
            } else {
              const [s, e] = getPresetRange(p.key);
              onChange({ startDate: toLocalDate(s), endDate: toLocalDate(e), preset: p.key });
            }
          }}
        >
          {p.label}
        </Button>
      ))}
      {value.preset === 'custom' && (
        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={value.startDate}
            onChange={(e) => onChange({ ...value, startDate: e.target.value })}
            className="h-7 text-xs border rounded-md px-2 bg-background"
          />
          <span className="text-xs text-muted-foreground">{toLabel}</span>
          <input
            type="date"
            value={value.endDate}
            onChange={(e) => onChange({ ...value, endDate: e.target.value })}
            className="h-7 text-xs border rounded-md px-2 bg-background"
          />
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export function TaskStats() {
  const t = useTranslations('Stats');
  const locale = useLocale();
  const [stats, setStats] = React.useState<StatsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [weekStart, weekEnd] = getPresetRange('week');
  const [range, setRange] = React.useState({
    startDate: toLocalDate(weekStart),
    endDate: toLocalDate(weekEnd),
    preset: 'week',
  });

  const presetLabels = [
    { key: 'week', label: t('presetWeek') },
    { key: 'month', label: t('presetMonth') },
    { key: 'last7', label: t('presetLast7') },
    { key: 'last30', label: t('presetLast30') },
    { key: 'custom', label: t('presetCustom') },
  ];

  const fetchStats = React.useCallback(async (startDate: string, endDate: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tasks?startDate=${startDate}&endDate=${endDate}`);
      const data: Task[] = await response.json();

      const days = getDaysBetween(new Date(startDate + 'T00:00:00'), new Date(endDate + 'T00:00:00'));

      const dailyHours = days.map((date) => {
        const tasksForDay = data.filter((t) => t.start_time?.startsWith(date));
        const hours = tasksForDay.reduce((acc, t) => {
          if (t.start_time && t.end_time) {
            const start = new Date(t.start_time).getTime();
            const end = new Date(t.end_time).getTime();
            return acc + (end - start) / (1000 * 60 * 60);
          }
          return acc + 0.5;
        }, 0);
        return { date, hours };
      });

      const totalHours = dailyHours.reduce((sum, d) => sum + d.hours, 0);

      const tagCounts: Record<string, number> = {};
      data.forEach((t) => {
        t.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const tagDistribution = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);

      setStats({ dailyHours, tagDistribution, totalHours });
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStats(range.startDate, range.endDate);
  }, [range.startDate, range.endDate, fetchStats]);

  const handleRangeChange = (v: { startDate: string; endDate: string; preset: string }) => {
    setRange(v);
  };

  const maxHours = stats ? Math.max(...stats.dailyHours.map((d) => d.hours), 1) : 1;

  const dayCount = stats?.dailyHours.length ?? 0;
  const dateLocale = locale === 'zh' ? 'zh-CN' : 'en-US';
  const formatLabel = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    if (dayCount <= 7) {
      return d.toLocaleDateString(dateLocale, { weekday: 'short' });
    }
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const labelStep = dayCount > 15 ? Math.ceil(dayCount / 10) : 1;

  return (
    <div className="space-y-4">
      <DateRangePicker value={range} onChange={handleRangeChange} presetLabels={presetLabels} toLabel={t('to')} />

      {loading ? (
        <div className="text-sm text-muted-foreground">{t('loading')}</div>
      ) : !stats ? (
        <div className="text-sm text-muted-foreground">{t('noData')}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('workload')}{' '}
                <span className="text-sm font-normal text-muted-foreground">
                  {stats.totalHours.toFixed(1)}h
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-[2px]" style={{ height: 160 }}>
                {stats.dailyHours.map((d, i) => {
                  const barHeight = Math.max(d.hours > 0 ? 4 : 0, Math.round((d.hours / maxHours) * 140));
                  const showLabel = i % labelStep === 0 || i === dayCount - 1;
                  return (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center justify-end h-full group"
                      style={{ minWidth: 0 }}
                    >
                      <div className="relative flex-shrink-0 w-full flex justify-center">
                        <span className="absolute -top-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-popover px-1 rounded shadow-sm z-10">
                          {d.date} {d.hours.toFixed(1)}h
                        </span>
                      </div>
                      <div
                        className="w-full bg-primary/80 rounded-t-sm transition-all group-hover:bg-primary flex-shrink-0"
                        style={{ height: `${barHeight}px` }}
                      />
                      {showLabel ? (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1 flex-shrink-0 truncate max-w-full">
                          {formatLabel(d.date)}
                        </span>
                      ) : (
                        <span className="mt-1 h-[14px] flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('tagDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TagCloud tags={stats.tagDistribution} noDataText={t('noTagData')} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
