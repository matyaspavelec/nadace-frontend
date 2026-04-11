'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';
import { INTERVIEW_RESULTS } from '@/lib/constants';
import Link from 'next/link';

export default function AdminInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ attended: false, evaluation: '', result: 'PENDING', notes: '' });
  const [msg, setMsg] = useState('');

  const load = () => {
    const params = showUpcoming ? 'upcoming=true' : '';
    api.getInterviews(params).then(setInterviews).catch(logError('admin-pohovory/list'));
  };

  useEffect(() => { load(); }, [showUpcoming]);

  const startEdit = (i) => {
    setEditId(i.id);
    setEditForm({ attended: i.attended, evaluation: i.evaluation || '', result: i.result, notes: i.notes || '' });
  };

  const saveEdit = async () => {
    try {
      await api.updateInterview(editId, editForm);
      setMsg('Pohovor aktualizován.');
      setEditId(null);
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  return (
    <div>
      <h1 className="page-title">Osobní pohovory</h1>

      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="filter-bar">
        <button className={`btn btn-sm ${showUpcoming ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowUpcoming(true)}>
          Nadcházející
        </button>
        <button className={`btn btn-sm ${!showUpcoming ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowUpcoming(false)}>
          Všechny
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Uživatel</th>
                <th>Dostavil se</th>
                <th>Výsledek</th>
                <th>Pohovorující</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {interviews.map(i => (
                <tr key={i.id}>
                  <td>{new Date(i.scheduledDate).toLocaleString('cs-CZ')}</td>
                  <td>
                    <Link href={`/admin/uzivatele/${i.userId}`}>
                      {i.user?.firstName} {i.user?.lastName}
                    </Link>
                  </td>
                  <td>{i.attended ? 'Ano' : 'Ne'}</td>
                  <td>
                    <span className={`badge ${i.result === 'RECOMMENDED' ? 'badge-success' : i.result === 'NOT_RECOMMENDED' ? 'badge-danger' : 'badge-warning'}`}>
                      {INTERVIEW_RESULTS[i.result]}
                    </span>
                  </td>
                  <td>{i.interviewerName || '-'}</td>
                  <td><button className="btn btn-sm btn-secondary" onClick={() => startEdit(i)}>Upravit</button></td>
                </tr>
              ))}
              {interviews.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-light)' }}>Žádné pohovory.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editId && (
        <div className="modal-overlay" onClick={() => setEditId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Upravit pohovor</h3>
            <div className="form-group">
              <div className="checkbox-group">
                <input type="checkbox" checked={editForm.attended} onChange={e => setEditForm(f => ({ ...f, attended: e.target.checked }))} />
                <label>Dostavil se</label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Výsledek</label>
              <select className="form-select" value={editForm.result} onChange={e => setEditForm(f => ({ ...f, result: e.target.value }))}>
                {Object.entries(INTERVIEW_RESULTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Hodnocení</label>
              <textarea className="form-textarea" value={editForm.evaluation} onChange={e => setEditForm(f => ({ ...f, evaluation: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Poznámky</label>
              <textarea className="form-textarea" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="btn-group">
              <button className="btn btn-primary" onClick={saveEdit}>Uložit</button>
              <button className="btn btn-secondary" onClick={() => setEditId(null)}>Zrušit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
