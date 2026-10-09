/**
 * Authentication Mock Data
 */
export const DEFAULT_DEMO_ACCOUNTS = [
  {
    role: 'admin',
    title: 'Administrator Access',
    username: 'admin',
    password: 'Password123!',
    tag: 'Full Access',
    desc: 'Unrestricted cluster topology, model hyperparameters & user role delegation',
  },
  {
    role: 'user',
    title: 'Floor Operator Access',
    username: 'operator',
    password: 'Password123!',
    tag: 'Floor Ops',
    desc: 'Real-time bottleneck alerts, AGV dispatch telemetry & digital twin telemetry',
  },
];
