'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface DailyStat {
  date: string;
  query_count: number;
  avg_accuracy: number;
  avg_latency_ms: number;
  error_count: number;
}

interface QualityChartProps {
  data: DailyStat[];
}


export default function QualityChart({ data }: QualityChartProps) {
  const chartData = data.map((item) => ({
    ...item,
    accuracy_percent: Number((item.avg_accuracy * 100).toFixed(2)),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-span-2">
        <h3 className="mb-3 text-base font-semibold text-slate-900">일별 쿼리 수</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="query_count" fill="#3b82f6" name="쿼리 수" radius={[6, 6, 0, 0]} />
              <Bar dataKey="error_count" fill="#ef4444" name="오류 수" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">평균 정확도 추이</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Line type="monotone" dataKey="accuracy_percent" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} name="정확도" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">평균 응답 지연 추이</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="ms" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avg_latency_ms" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="지연 시간(ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
