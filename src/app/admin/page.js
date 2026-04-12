'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';
import Link from 'next/link';
import { Users, FolderOpen, Vote, MessageSquare } from 'lucide-react';

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
        <Link href="/admin/uzivatele" className="card stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Users size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.users.total}</div>
          <div className="stat-label">Uživatelů celkem</div>
        </Link>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.users.pending}</div>
          <div className="stat-label">Čeká na schválení</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.users.approved}</div>
          <div className="stat-label">Schválených</div>
        </div>
        <div className="card stat-card">
          <FolderOpen size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.projects.total}</div>
          <div className="stat-label">Projektů</div>
        </div>
        <div className="card stat-card">
          <Vote size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.votes}</div>
          <div className="stat-label">Hlasů</div>
        </div>
        <div className="card stat-card">
          <MessageSquare size={28} style={{ color: 'var(--primary)', marginBottom: 4 }} />
          <div className="stat-value">{stats.comments}</div>
          <div className="stat-label">Komentářů</div>
        </div>
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
                  <tr key={s.status}><td>{s.status}</td><td>{s._count}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
