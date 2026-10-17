/** A series drawn in a chart; {@code color} is a CSS color, usually a `var(--chart-…)` token. */
export interface ChartSeries {
  label: string;
  color: string;
}

/** One x position: {@code values} are aligned with the chart's series. */
export interface ChartPoint {
  key: string;
  axisLabel: string;
  title: string;
  values: number[];
}

/** Rounded maximum and ticks (0 included) for a count axis. */
export function countTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0, 1];
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = Math.max(1, [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw);
  const ticks: number[] = [];
  for (let v = 0; v < max + step; v += step) ticks.push(v);
  return ticks;
}

export function compact(value: number, lang: string): string {
  return new Intl.NumberFormat(lang, { notation: value >= 10_000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value);
}

/** Formats a yyyy-MM-dd day (already in the user's time zone) without shifting it. */
export function formatDay(date: string, lang: string, options: Intl.DateTimeFormatOptions): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Intl.DateTimeFormat(lang, { ...options, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** A bar path from the baseline with 4px rounded data-end (top). */
export function columnPath(x: number, y: number, width: number, height: number, rounded: boolean): string {
  if (height <= 0 || width <= 0) return '';
  const r = rounded ? Math.min(4, width / 2, height) : 0;
  const bottom = y + height;
  return `M${x},${bottom}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${bottom}Z`;
}
