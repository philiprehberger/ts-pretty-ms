import type { PrettyMsOptions } from './types';

interface TimeComponents {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

function decompose(ms: number): TimeComponents {
  const abs = Math.abs(ms);
  const days = Math.floor(abs / 86_400_000);
  const hours = Math.floor((abs % 86_400_000) / 3_600_000);
  const minutes = Math.floor((abs % 3_600_000) / 60_000);
  const seconds = Math.floor((abs % 60_000) / 1_000);
  const milliseconds = abs % 1_000;
  return { days, hours, minutes, seconds, milliseconds };
}

const VERBOSE_LABELS: Record<string, [string, string]> = {
  days: ['day', 'days'],
  hours: ['hour', 'hours'],
  minutes: ['minute', 'minutes'],
  seconds: ['second', 'seconds'],
  milliseconds: ['millisecond', 'milliseconds'],
};

const SHORT_LABELS: Record<string, string> = {
  days: 'd',
  hours: 'h',
  minutes: 'm',
  seconds: 's',
  milliseconds: 'ms',
};

export function prettyMs(ms: number, options: PrettyMsOptions = {}): string {
  const { compact = false, verbose = false, colonNotation = false, unitCount } = options;
  const negative = ms < 0;
  const prefix = negative ? '-' : '';
  const parts = decompose(ms);

  if (colonNotation) {
    const { days, hours, minutes, seconds } = parts;
    const totalHours = days * 24 + hours;
    const pad = (n: number): string => String(n).padStart(2, '0');

    let result: string;
    if (totalHours > 0) {
      result = `${totalHours}:${pad(minutes)}:${pad(seconds)}`;
    } else if (minutes > 0) {
      result = `${minutes}:${pad(seconds)}`;
    } else {
      result = `0:${pad(seconds)}`;
    }
    return prefix + result;
  }

  const entries: Array<[string, number]> = [
    ['days', parts.days],
    ['hours', parts.hours],
    ['minutes', parts.minutes],
    ['seconds', parts.seconds],
    ['milliseconds', parts.milliseconds],
  ];

  let significantParts = entries.filter(([, value]) => value > 0);

  if (significantParts.length === 0) {
    significantParts = [['milliseconds', 0]];
  }

  if (compact) {
    significantParts = [significantParts[0]];
  } else if (unitCount !== undefined && unitCount > 0) {
    significantParts = significantParts.slice(0, unitCount);
  }

  const formatted = significantParts.map(([unit, value]) => {
    if (verbose) {
      const [singular, plural] = VERBOSE_LABELS[unit];
      return `${value} ${value === 1 ? singular : plural}`;
    }
    return `${value}${SHORT_LABELS[unit]}`;
  });

  return prefix + formatted.join(' ');
}

const UNIT_TO_MS: Record<string, number> = {
  d: 86_400_000,
  day: 86_400_000,
  days: 86_400_000,
  h: 3_600_000,
  hour: 3_600_000,
  hours: 3_600_000,
  m: 60_000,
  min: 60_000,
  minute: 60_000,
  minutes: 60_000,
  s: 1_000,
  sec: 1_000,
  second: 1_000,
  seconds: 1_000,
  ms: 1,
  millisecond: 1,
  milliseconds: 1,
};

export function parseMs(str: string): number {
  const trimmed = str.trim();

  // Colon notation: H:MM:SS or M:SS
  const colonMatch = trimmed.match(/^(-?)(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
  if (colonMatch) {
    const negative = colonMatch[1] === '-';
    const parts = [colonMatch[2], colonMatch[3], colonMatch[4]].filter(Boolean).map(Number);
    let total: number;
    if (parts.length === 3) {
      total = parts[0] * 3_600_000 + parts[1] * 60_000 + parts[2] * 1_000;
    } else {
      total = parts[0] * 60_000 + parts[1] * 1_000;
    }
    return negative ? -total : total;
  }

  // Unit notation: "2h 30m 15s 100ms"
  const negative = trimmed.startsWith('-');
  const cleaned = negative ? trimmed.slice(1) : trimmed;
  const unitPattern = /(\d+(?:\.\d+)?)\s*(milliseconds?|seconds?|minutes?|hours?|days?|ms|s|m|h|d)\b/gi;
  let total = 0;
  let match: RegExpExecArray | null;
  let found = false;

  while ((match = unitPattern.exec(cleaned)) !== null) {
    found = true;
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    const multiplier = UNIT_TO_MS[unit];
    if (multiplier !== undefined) {
      total += value * multiplier;
    }
  }

  if (!found) {
    return NaN;
  }

  return negative ? -total : total;
}
