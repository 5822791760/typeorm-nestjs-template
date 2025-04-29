export const USERS_JOBS = {
  SAMPLE: 'SAMPLE',
};
export type USERS_JOBS = (typeof USERS_JOBS)[keyof typeof USERS_JOBS];

export interface ProcessSampleData {
  key: string;
}
