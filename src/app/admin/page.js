'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';
import { Users, FolderOpen, Vote, MessageSquare } from 'lucide-react';
import { PROJECT_STATUSES } from '@/lib/constants';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(logError('admin/stats'));
  }, []);

  if (!stats) return <div className="loading"><div className="spinner" />Načítání...</div>;

  return (
    <div>
      <h1 className="page-title">Administrace</h1>

      <div className="stats-grid">
        <Link href="/admin/uzivatele" className="card stat-card stat-card-link">
          <Users size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.users.total}</div>
          <div className="stat-label">Uživatelů celkem</div>
        </Link>
        <Link href="/admin/uzivatele?status=PENDING_APPROVAL" className="card stat-card stat-card-link">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.users.pending}</div>
          <div className="stat-label">Čeká na schválení</div>
        </Link>
        <Link href="/admin/uzivatele?status=APPROVED" className="card stat-card stat-card-link">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.users.approved}</div>
          <div className="stat-label">Schválených</div>
        </Link>
        <Link href="/admin/projekty" className="card stat-card stat-card-link">
          <FolderOpen size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.projects.total}</div>
          <div className="stat-label">Projektů</div>
        </Link>
        <Link href="/admin/projekty" className="card stat-card stat-card-link">
          <Vote size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.votes}</div>
          <div className="stat-label">Hlasů</div>
        </Link>
        <Link href="/admin/projekty" className="card stat-card stat-card-link">
          <MessageSquare size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.comments}</div>
          <div className="stat-label">Komentářů</div>
        </Link>
      </div>

      {stats.projects.byStatus.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Projekty dle stavu</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Stav</th><th>Počet</th></tr>
              </thead>
              <tbody>
                {stats.projects.byStatus.map(s => (
                  <tr key={s.status}><td>{PROJECT_STATUSES[s.status] || s.status}</td><td>{s._count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
