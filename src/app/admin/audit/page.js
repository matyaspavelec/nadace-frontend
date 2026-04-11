'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const load = () => {
    const params = new URLSearchParams({ page, limit: 50 });
    if (actionFilter) params.set('action', actionFilter);
    api.getAuditLog(params.toString()).then(d => {
      setLogs(d.logs);
      setTotal(d.total);
      setTotalPages(d.totalPages);
    }).catch(logError('admin-audit/logs'));
  };

  useEffect(() => { load(); }, [page, actionFilter]);

  return (
    <div>
      <h1 className="page-title">Audit log</h1>

      <div className="filter-bar">
        <input className="form-input" placeholder="Filtrovat akci..." value={actionFilter}
          onChange={e => { setActionFilter(e.target.value); setPage(1); }} style={{ maxWidth: 300 }} />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Celkem: {total} záznamů</span>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Čas</th>
                <th>Akce</th>
                <th>Entita</th>
                <th>Uživatel</th>
                <th>Admin</th>
                <th>Detail</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id}>
                  <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(l.createdAt).toLocaleString('cs-CZ')}
                  </td>
                  <td><span className="badge badge-gray">{l.action}</span></td>
                  <td>{l.entity}</td>
                  <td style={{ fontSize: '0.85rem' }}>{l.user ? `${l.user.firstName} ${l.user.lastName}` : '-'}</td>
                  <td style={{ fontSize: '0.85rem' }}>{l.admin ? `${l.admin.firstName} ${l.admin.lastName}` : '-'}</td>
                  <td style={{ fontSize: '0.85rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.details || '-'}</td>
                  <td style={{ fontSize: '0.8rem' }}>{l.ipAddress || '-'}</td>
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
