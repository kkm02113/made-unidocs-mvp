interface LifecycleBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusLabelMap: Record<string, string> = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
  REVOKED: 'REVOKED',
};

const statusColorMap: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  REVIEW: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  PUBLISHED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-purple-100 text-purple-700',
  REVOKED: 'bg-red-100 text-red-700',
};

export default function LifecycleBadge({ status, size = 'md' }: LifecycleBadgeProps) {
  const normalizedStatus = status.toUpperCase();
  const colorClass = statusColorMap[normalizedStatus] ?? 'bg-gray-100 text-gray-700';
  const label = statusLabelMap[normalizedStatus] ?? normalizedStatus;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${colorClass}`}>{label}</span>;
}
