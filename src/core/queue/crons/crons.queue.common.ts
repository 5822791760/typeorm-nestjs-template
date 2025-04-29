export const CRONS_JOBS = {
  SAMPLE: 'SAMPLE',
} as const;
export type CRONS_JOBS = (typeof CRONS_JOBS)[keyof typeof CRONS_JOBS];
