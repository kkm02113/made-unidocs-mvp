export interface DailyStat {
  date: string;
  query_count: number;
  avg_accuracy: number;
  avg_latency_ms: number;
  error_count: number;
}

export interface QualityDashboardResponse {
  period_start: string;
  period_end: string;
  department?: string;
  daily_stats: DailyStat[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  detail: string;
}

export interface AuditLogResponse {
  page: number;
  limit: number;
  total: number;
  items: AuditLogItem[];
}

const API_BASE = '/api/v1';

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      query.set(key, String(value));
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchQualityDashboard(params: {
  period_start?: string;
  period_end?: string;
  department?: string;
}): Promise<QualityDashboardResponse> {
  const query = buildQuery(params);
  return request<QualityDashboardResponse>(`${API_BASE}/dashboard/quality${query}`);
}

export async function fetchAuditLogs(params: {
  page?: number;
  limit?: number;
  action_type?: string;
  date_from?: string;
  date_to?: string;
}): Promise<AuditLogResponse> {
  const query = buildQuery(params);
  return request<AuditLogResponse>(`${API_BASE}/admin/audit-logs${query}`);
}
