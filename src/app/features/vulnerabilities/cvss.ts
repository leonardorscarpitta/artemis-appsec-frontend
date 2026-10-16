import { TranslationKey } from '../../core/i18n';

type Metric = 'AV' | 'AC' | 'PR' | 'UI' | 'S' | 'C' | 'I' | 'A';
type Value = 'network' | 'adjacent' | 'local' | 'physical' | 'none' | 'low' | 'high' | 'required' | 'unchanged' | 'changed';

export interface CvssMetric {
  label: TranslationKey;
  value: TranslationKey;
  // Whether this value makes exploitation easier or the impact larger.
  severe: boolean;
}

const METRICS: Metric[] = ['AV', 'AC', 'PR', 'UI', 'S', 'C', 'I', 'A'];
const IMPACT: Record<string, Value> = { H: 'high', L: 'low', N: 'none' };

const VALUES: Record<Metric, Record<string, Value>> = {
  AV: { N: 'network', A: 'adjacent', L: 'local', P: 'physical' },
  AC: { L: 'low', H: 'high' },
  PR: { N: 'none', L: 'low', H: 'high' },
  UI: { N: 'none', R: 'required' },
  S: { U: 'unchanged', C: 'changed' },
  C: IMPACT,
  I: IMPACT,
  A: IMPACT,
};

const SEVERE: Record<Metric, string[]> = {
  AV: ['N'],
  AC: ['L'],
  PR: ['N'],
  UI: ['N'],
  S: ['C'],
  C: ['H'],
  I: ['H'],
  A: ['H'],
};

export function parseVector(vector: string): CvssMetric[] {
  const parts = new Map(vector.split('/').map((p) => p.split(':') as [string, string]));
  return METRICS.filter((m) => parts.has(m)).map((m) => {
    const code = parts.get(m)!;
    return {
      label: `vuln.metric.${m}`,
      value: `vuln.value.${VALUES[m][code]}`,
      severe: SEVERE[m].includes(code),
    };
  });
}
