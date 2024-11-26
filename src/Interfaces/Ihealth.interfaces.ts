interface IHealth {
  CheckHealth(): Promise<HealthResponse>;
}

export type HealthResponse = {
  service: string;
  status: 'up' | 'down' | 'unknown';
  message: string;
  duration: number;
};
export default IHealth;
