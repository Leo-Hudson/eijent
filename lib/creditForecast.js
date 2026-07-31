/**
 * Credit usage forecast using a trailing burn rate (default 7 days).
 * projectedRemaining ≈ (trailingUsed / trailingDays) * daysRemaining
 * projectedTotal ≈ usedSoFar + projectedRemaining
 */

const MS_DAY = 24 * 60 * 60 * 1000;
export const FORECAST_TRAILING_DAYS = 7;

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const parseDate = (value) => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const daysBetween = (from, to) => {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / MS_DAY);
};

/** Estimate cycle start from next reset + reset cycle. */
export function estimateCycleStart(nextResetAt, resetCycle) {
  const reset = parseDate(nextResetAt);
  if (!reset) return null;
  const start = new Date(reset);
  const cycle = String(resetCycle || 'monthly').toLowerCase();
  if (cycle.includes('week')) start.setDate(start.getDate() - 7);
  else if (cycle.includes('year') || cycle.includes('annual')) {
    start.setFullYear(start.getFullYear() - 1);
  } else if (cycle.includes('quarter')) {
    start.setMonth(start.getMonth() - 3);
  } else {
    start.setMonth(start.getMonth() - 1);
  }
  return start;
}

/**
 * @param {{
 *   usedSoFar?: number | null,
 *   trailingUsed?: number | null,
 *   trailingWindowDays?: number | null,
 *   balance?: number | null,
 *   allocation?: number | null,
 *   nextResetAt?: string | Date | null,
 *   resetCycle?: string | null,
 *   now?: Date,
 * }} input
 */
export function buildCreditForecast(input = {}) {
  const now = parseDate(input.now) || new Date();
  const usedSoFar = Math.max(0, Number(input.usedSoFar) || 0);
  const trailingWindowDays = Math.max(
    1,
    Number(input.trailingWindowDays) || FORECAST_TRAILING_DAYS,
  );
  const trailingUsedRaw = Number(input.trailingUsed);
  const hasTrailing = Number.isFinite(trailingUsedRaw) && trailingUsedRaw >= 0;
  const trailingUsed = hasTrailing ? trailingUsedRaw : null;

  const balance =
    typeof input.balance === 'number' && !Number.isNaN(input.balance)
      ? input.balance
      : null;
  const allocation =
    typeof input.allocation === 'number' && !Number.isNaN(input.allocation)
      ? input.allocation
      : null;
  const cycleEnd = parseDate(input.nextResetAt);
  const cycleStart = estimateCycleStart(input.nextResetAt, input.resetCycle);

  if (!cycleEnd || !cycleStart || cycleEnd <= cycleStart) {
    return {
      ready: false,
      reason: 'missing_cycle',
      message: 'Forecast needs a known credit reset date for this plan.',
    };
  }

  const daysElapsed = Math.max(1, daysBetween(cycleStart, now) + 1);
  const daysRemaining = Math.max(0, daysBetween(now, cycleEnd));
  const daysInCycle = Math.max(daysElapsed + daysRemaining, daysElapsed);

  // Cap the window to days actually elapsed in the cycle (new cycles / short cycles).
  const effectiveTrailingDays = Math.min(trailingWindowDays, daysElapsed);
  const useTrailing = hasTrailing && effectiveTrailingDays > 0;
  const rateSourceUsed = useTrailing ? trailingUsed : usedSoFar;
  const rateSourceDays = useTrailing ? effectiveTrailingDays : daysElapsed;
  const dailyRate = rateSourceUsed / rateSourceDays;

  const projectedRemainingSpend = Math.round(dailyRate * daysRemaining);
  const projectedTotal = Math.round(usedSoFar + projectedRemainingSpend);

  const thinTrailing = useTrailing && trailingUsed === 0 && usedSoFar > 0;
  const early = daysElapsed < 3 && usedSoFar === 0;

  let status = 'on_track';
  let message = useTrailing
    ? `Based on the last ${effectiveTrailingDays} day${effectiveTrailingDays === 1 ? '' : 's'} of usage.`
    : 'Based on average usage so far this cycle.';

  if (early) {
    status = 'early';
    message = 'Not enough usage yet this cycle for a confident forecast.';
  } else if (usedSoFar === 0) {
    status = 'quiet';
    message = 'No credits used this cycle yet. Forecast stays at zero until activity starts.';
  } else if (thinTrailing) {
    status = 'quiet';
    message = `No usage in the last ${effectiveTrailingDays} days. Projection assumes the recent quiet pace continues.`;
  } else if (balance != null && projectedRemainingSpend > balance) {
    status = 'at_risk';
    message = `At the last-${effectiveTrailingDays}-day pace you may use about ${projectedRemainingSpend.toLocaleString()} more credits before reset, which is above your current balance.`;
  } else if (allocation != null && projectedTotal > allocation) {
    status = 'above_grant';
    message =
      'Projected usage is above the plan grant for this cycle. Top-ups or pack purchases may apply.';
  } else if (daysRemaining === 0) {
    status = 'cycle_end';
    message = 'Credit reset is due. Projection matches usage so far this cycle.';
  }

  return {
    ready: true,
    status,
    message,
    method: useTrailing ? 'trailing' : 'cycle_average',
    trailingWindowDays: effectiveTrailingDays,
    trailingUsed: useTrailing ? trailingUsed : null,
    usedSoFar,
    balance,
    allocation,
    dailyRate,
    projectedTotal,
    projectedRemainingSpend,
    daysElapsed,
    daysRemaining,
    daysInCycle,
    cycleStart: cycleStart.toISOString(),
    cycleEnd: cycleEnd.toISOString(),
    pctOfCycle: Math.min(100, Math.round((daysElapsed / daysInCycle) * 100)),
    pctOfProjection:
      projectedTotal > 0
        ? Math.min(100, Math.round((usedSoFar / projectedTotal) * 100))
        : 0,
  };
}
