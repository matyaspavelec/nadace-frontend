'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { PROJECT_STATUSES, PROJECT_CATEGORIES } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (status) params.set('status', status);
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    api.getAdminProjects(params.toString()).then(d => {
      setProjects(d.projects);
      setTotal(d.total);
      setTotalPages(d.totalPages);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, [page, status, category]);

  return (
    <div>
      <h1 className="page-title">Správa projektů</h1>

      <div className="filter-bar">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }} style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-input" placeholder="Hledat..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-sm">Hledat</button>
        </form>
        <select className="form-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Všechny stavy</option>
          {Object.entries(PROJECT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="form-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">Všechny kategorie</option>
          {Object.entries(PROJECT_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Celkem: {total}</span>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Název</th>
                <th>Autor</th>
                <th>Kategorie</th>
                <th>Rozpočet</th>
                <th>Stav</th>
                <th>Hlasy</th>
                <th>Datum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.title}</td>
                  <td>{p.author?.firstName} {p.author?.lastName}</td>
                  <td><span className="badge badge-info">{PROJECT_CATEGORIES[p.category]}</span></td>
                  <td>{p.estimatedBudget?.toLocaleString('cs-CZ')} Kč</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p._count?.votes || 0}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{new Date(p.createdAt).toLocaleDateString('cs-CZ')}</td>
                  <td><Link href={`/admin/projekty/${p.id}`} className="btn btn-sm btn-secondary">Detail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-sm btn-secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Předchozí</button>
          <span>{page} / {totalPages}</span>
          <button className="btn btn-sm btn-secondary" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Další</button>
        </div>
      )}
    </div>
  );
}
