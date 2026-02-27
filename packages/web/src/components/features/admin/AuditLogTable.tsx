'use client';

import { useMemo, useState } from 'react';

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  ip: string;
  detail: string;
}

interface AuditLogTableProps {
  logs: AuditLogItem[];
}

const PAGE_SIZE = 20;

export default function AuditLogTable({ logs }: AuditLogTableProps) {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [actionType, setActionType] = useState('all');

  const actionOptions = useMemo(
    () => ['all', ...Array.from(new Set(logs.map((log) => log.action))).sort()],
    [logs],
  );

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logDate = new Date(log.timestamp);
      const fromValid = !dateFrom || logDate >= new Date(`${dateFrom}T00:00:00`);
      const toValid = !dateTo || logDate <= new Date(`${dateTo}T23:59:59`);
      const actionValid = actionType === 'all' || log.action === actionType;
      return fromValid && toValid && actionValid;
    });
  }, [actionType, dateFrom, dateTo, logs]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredLogs]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <h3 className="text-base font-semibold text-slate-900">감사 로그</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <label className="flex flex-col text-xs text-slate-600">
            시작일
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            종료일
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            />
          </label>
          <label className="flex flex-col text-xs text-slate-600">
            액션
            <select
              value={actionType}
              onChange={(e) => {
                setActionType(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              {actionOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? '전체' : option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-600">
              <th className="px-3 py-2">시간</th>
              <th className="px-3 py-2">사용자</th>
              <th className="px-3 py-2">액션</th>
              <th className="px-3 py-2">대상</th>
              <th className="px-3 py-2">IP</th>
              <th className="px-3 py-2">상세</th>
            </tr>
          </thead>
          <tbody>
            {pageLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  조건에 맞는 로그가 없습니다.
                </td>
              </tr>
            ) : (
              pageLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-100 text-slate-700">
                  <td className="whitespace-nowrap px-3 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-3 py-2">{log.user}</td>
                  <td className="px-3 py-2">{log.action}</td>
                  <td className="px-3 py-2">{log.target}</td>
                  <td className="px-3 py-2">{log.ip}</td>
                  <td className="px-3 py-2">{log.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>
          총 {filteredLogs.length}건 / {currentPage} / {totalPages} 페이지
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            이전
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
}
