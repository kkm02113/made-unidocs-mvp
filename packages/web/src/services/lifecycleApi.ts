export interface LifecycleTransitionResponse {
  document_id: string;
  previous_status: string;
  current_status: string;
  action: string;
  comment?: string;
  transitioned_at: string;
}

export interface LifecycleHistoryItem {
  id: string;
  document_id: string;
  from_status: string;
  to_status: string;
  action: string;
  actor: string;
  comment?: string;
  created_at: string;
}

export interface LifecycleHistoryResponse {
  document_id: string;
  history: LifecycleHistoryItem[];
}

const API_BASE = '/api/v1';

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function transitionDocument(params: {
  document_id: string;
  action: 'submit_review' | 'approve' | 'reject' | 'publish' | 'archive' | 'revoke';
  comment?: string;
}): Promise<LifecycleTransitionResponse> {
  const response = await fetch(`${API_BASE}/documents/${params.document_id}/lifecycle/transition`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: params.action, comment: params.comment }),
  });

  return parseResponse<LifecycleTransitionResponse>(response);
}

export async function fetchLifecycleHistory(document_id: string): Promise<LifecycleHistoryResponse> {
  const response = await fetch(`${API_BASE}/documents/${document_id}/lifecycle/history`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  return parseResponse<LifecycleHistoryResponse>(response);
}
