'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { REGISTRATION_STATUSES, ROLES } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    const params = new URLSearchParams({ page, limit: 20 });
    if (status) params.set('status', status);
    if (search) params.set('search', search);
    api.getUsers(params.toString()).then(d => {
      setUsers(d.users);
      setTotal(d.total);
      setTotalPages(d.totalPages);
    }).catch(() => {});
  };

  useEffect(() => { load(); }, [page, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  return (
    <div>
      <h1 className="page-title">Správa uživatelů</h1>

      <div className="filter-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <input className="form-input" placeholder="Hledat..." value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-sm">Hledat</button>
        </form>
        <select className="form-select" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
          <option value="">Všechny stavy</option>
          {Object.entries(REGISTRATION_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Celkem: {total}</span>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Jméno</th>
                <th>E-mail</th>
                <th>Město</th>
                <th>Stav</th>
                <th>Role</th>
                <th>Registrace</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.addressCity}</td>
                  <td><StatusBadge status={u.registrationStatus} type="user" /></td>
                  <td><span className="badge badge-gray">{ROLES[u.role]}</span></td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{new Date(u.createdAt).toLocaleDateString('cs-CZ')}</td>
                  <td><Link href={`/admin/uzivatele/${u.id}`} className="btn btn-sm btn-secondary">Detail</Link></td>
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
