'use client';
import { REGISTRATION_STATUSES, PROJECT_STATUSES, STATUS_COLORS } from '@/lib/constants';

export default function StatusBadge({ status, type = 'project' }) {
  const labels = type === 'user' ? REGISTRATION_STATUSES : PROJECT_STATUSES;
  const label = labels[status] || status;
  const color = STATUS_COLORS[status] || '#6b7280';

  const isGreen = ['APPROVED', 'COMPLETED', 'RECOMMENDED_FOR_REALIZATION'].includes(status);
  const isRed = ['REJECTED', 'BLOCKED', 'REJECTED_UNSUITABLE'].includes(status);
  const isBlue = ['PUBLISHED_FOR_VOTING', 'INVITED_FOR_INTERVIEW', 'INFO'].includes(status);
  const isYellow = ['PENDING_REVIEW', 'FORMAL_REVIEW', 'WAITING_FOR_COMPLETION', 'SUBMITTED'].includes(status);

  let cls = 'badge-gray';
  if (isGreen) cls = 'badge-success';
  if (isRed) cls = 'badge-danger';
  if (isBlue) cls = 'badge-info';
  if (isYellow) cls = 'badge-warning';

  return <span className={`badge ${cls}`}>{label}</span>;
}
