'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const load = () => {
    const params = new URLSearchParams({ page, limit: 12 });
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    api.getPublicProjects(params.toString()).then(d => {
      setProjects(d.projects);
      setTotal(d.total);
      setTotalPages(d.totalPages);
    }).catch(logError('projekty/list'));
  };

  useEffect(() => { load(); }, [page, category, status]);

  return (
    <div className="page-container">
      <h1 className="page-title">Projekty</h1>
      <p className="page-subtitle">Veřejně prospěšné projekty navržené obyvateli Vyššího Brodu.</p>

      <div className="filter-bar">
        <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">Všechny kategorie</option>
          {Object.entries(PROJECT_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="form-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Všechny stavy</option>
          <option value="PUBLISHED_FOR_VOTING">K hlasování</option>
          <option value="VOTING_ENDED">Hlasování ukončeno</option>
          <option value="RECOMMENDED_FOR_REALIZATION">Doporučeno k realizaci</option>
          <option value="IN_REALIZATION">Realizuje se</option>
          <option value="COMPLETED">Dokončeno</option>
        </select>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Celkem: {total} projektů</span>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          Zatím nejsou žádné veřejné projekty.
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(p => (
            <Link key={p.id} href={`/projekty/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card project-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span className="badge badge-info">{PROJECT_CATEGORIES[p.category] || p.category}</span>
                  <StatusBadge status={p.status} />
                </div>
                <h3 className="project-card-title">{p.title}</h3>
                <p className="project-card-summary">{p.summary?.slice(0, 150)}{p.summary?.length > 150 ? '...' : ''}</p>

                <div className="project-card-meta">
                  <span>{p.location}</span>
                  <span>{p.estimatedBudget?.toLocaleString('cs-CZ')} Kč</span>
                </div>

                {(p.votesFor > 0 || p.votesAgainst > 0) && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div className="vote-bar">
                      <div className="vote-bar-yes" style={{ width: `${(p.votesFor / Math.max(p.votesFor + p.votesAgainst, 1)) * 100}%` }} />
                      <div className="vote-bar-no" style={{ width: `${(p.votesAgainst / Math.max(p.votesFor + p.votesAgainst, 1)) * 100}%` }} />
                    </div>
                    <div className="vote-stats">
                      <span className="vote-stats-yes">Pro: {p.votesFor}</span>
                      <span className="vote-stats-no">Proti: {p.votesAgainst}</span>
                    </div>
                  </div>
                )}

                <div className="project-card-footer">
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    {p.author?.firstName} {p.author?.lastName}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    {p._count?.comments || 0} komentářů
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-sm btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Předchozí</button>
          <span style={{ fontSize: '0.9rem' }}>Strana {page} z {totalPages}</span>
          <button className="btn btn-sm btn-secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Další</button>
        </div>
      )}
    </div>
  );
}
