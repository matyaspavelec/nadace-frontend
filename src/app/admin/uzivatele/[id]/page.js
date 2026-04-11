'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { REGISTRATION_STATUSES, TRUST_LEVELS, ROLES, INTERVIEW_RESULTS } from '@/lib/constants';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newTrust, setNewTrust] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [showInterview, setShowInterview] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('10:00');
  const [interviewerName, setInterviewerName] = useState('');

  // Editace osobních údajů
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '', lastName: '', email: '', phone: '', birthYear: '',
    addressStreet: '', addressCity: '', addressZip: '', isPermanentResident: false,
  });
  const setProf = (k, v) => setProfile(prev => ({ ...prev, [k]: v }));

  const currentYear = new Date().getFullYear();
  const birthYears = [];
  for (let y = currentYear - 18; y >= currentYear - 100; y--) birthYears.push(y);

  const load = () => {
    api.getUser(id).then(u => {
      setUser(u);
      setNewRole(u.role);
      setNewTrust(u.trustLevel);
      setInternalNote(u.internalNote || '');
      setProfile({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        phone: u.phone || '',
        birthYear: u.dateOfBirth ? String(new Date(u.dateOfBirth).getFullYear()) : '',
        addressStreet: u.addressStreet || '',
        addressCity: u.addressCity || '',
        addressZip: u.addressZip || '',
        isPermanentResident: !!u.isPermanentResident,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const saveProfile = async () => {
    try {
      const { birthYear, ...rest } = profile;
      const payload = { ...rest };
      if (birthYear) payload.dateOfBirth = `${birthYear}-01-01`;
      await api.updateUserProfile(id, payload);
      setMsg('Osobní údaje uloženy.');
      setEditProfile(false);
      load();
    } catch (err) { setMsg(err.error || 'Chyba při ukládání.'); }
  };

  useEffect(() => { load(); }, [id]);

  const changeStatus = async (status) => {
    try {
      await api.updateUserStatus(id, { status, note: statusNote });
      setMsg(`Stav změněn na ${REGISTRATION_STATUSES[status]}.`);
      setStatusNote('');
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  const changeRole = async () => {
    try {
      await api.updateUserRole(id, { role: newRole });
      setMsg('Role změněna.');
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  const changeTrust = async () => {
    try {
      await api.updateUserTrust(id, { trustLevel: newTrust, internalNote });
      setMsg('Hodnocení aktualizováno.');
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  const scheduleInterview = async (e) => {
    e.preventDefault();
    const scheduledDate = `${interviewDate}T${interviewTime}`;
    try {
      await api.createInterview({ userId: id, scheduledDate, interviewerName });
      setMsg('Pohovor naplánován a pozvánka odeslána na e-mail.');
      setShowInterview(false);
      setInterviewDate('');
      setInterviewTime('10:00');
      setInterviewerName('');
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  if (loading) return <div className="loading"><div className="spinner" />Načítání...</div>;
  if (!user) return <div className="alert alert-error">Uživatel nenalezen.</div>;

  return (
    <div>
      <h1 className="page-title">{user.firstName} {user.lastName}</h1>

      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="detail-grid">
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Osobní údaje</h3>
              {!editProfile && (
                <button className="btn btn-sm btn-secondary" onClick={() => setEditProfile(true)}>Upravit</button>
              )}
            </div>

            {!editProfile ? (
              <>
                <div className="detail-label">Jméno</div>
                <div className="detail-value">{user.firstName} {user.lastName}</div>
                <div className="detail-label">E-mail</div>
                <div className="detail-value">{user.email} {user.emailVerified ? '(ověřen)' : '(neověřen)'}</div>
                <div className="detail-label">Telefon</div>
                <div className="detail-value">{user.phone}</div>
                <div className="detail-label">Rok narození</div>
                <div className="detail-value">{user.dateOfBirth ? new Date(user.dateOfBirth).getFullYear() : '-'}</div>
                <div className="detail-label">Adresa</div>
                <div className="detail-value">{user.addressStreet}, {user.addressCity} {user.addressZip}</div>
                <div className="detail-label">Trvalé bydliště ve V. Brodě</div>
                <div className="detail-value">{user.isPermanentResident ? 'Ano' : 'Ne'}</div>
                <div className="detail-label">Registrace</div>
                <div className="detail-value">{new Date(user.createdAt).toLocaleDateString('cs-CZ')}</div>
              </>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Jméno</label>
                    <input className="form-input" value={profile.firstName} onChange={e => setProf('firstName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Příjmení</label>
                    <input className="form-input" value={profile.lastName} onChange={e => setProf('lastName', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input type="email" className="form-input" value={profile.email} onChange={e => setProf('email', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Telefon</label>
                    <input className="form-input" value={profile.phone} onChange={e => setProf('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rok narození</label>
                    <select className="form-input" value={profile.birthYear} onChange={e => setProf('birthYear', e.target.value)}>
                      <option value="">Vyberte...</option>
                      {birthYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Ulice a č.p.</label>
                  <input className="form-input" value={profile.addressStreet} onChange={e => setProf('addressStreet', e.target.value)} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Město</label>
                    <input className="form-input" value={profile.addressCity} onChange={e => setProf('addressCity', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PSČ</label>
                    <input className="form-input" value={profile.addressZip} onChange={e => setProf('addressZip', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" checked={profile.isPermanentResident} onChange={e => setProf('isPermanentResident', e.target.checked)} />
                    Trvalé bydliště ve Vyšším Brodě
                  </label>
                </div>
                <div className="btn-group">
                  <button className="btn btn-primary btn-sm" onClick={saveProfile}>Uložit</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditProfile(false); load(); }}>Zrušit</button>
                </div>
              </>
            )}
            {user.approvedBy && (
              <>
                <div className="detail-label">Schválil</div>
                <div className="detail-value">{user.approvedBy.firstName} {user.approvedBy.lastName}</div>
              </>
            )}
            {user.approvalNote && (
              <>
                <div className="detail-label">Poznámka ke schválení</div>
                <div className="detail-value">{user.approvalNote}</div>
              </>
            )}
            {user.rejectionReason && (
              <>
                <div className="detail-label">Důvod zamítnutí</div>
                <div className="detail-value" style={{ color: 'var(--danger)' }}>{user.rejectionReason}</div>
              </>
            )}
          </div>

          {/* Pohovory */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3>Pohovory</h3>
              <button className="btn btn-sm btn-primary" onClick={() => setShowInterview(!showInterview)}>
                + Naplánovat
              </button>
            </div>

            {showInterview && (
              <form onSubmit={scheduleInterview} style={{ marginBottom: '1rem', padding: '1.25rem', background: '#f9fafb', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Datum pohovoru</label>
                  <input type="date" className="form-input" value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    style={{ maxWidth: 220 }} />
                  {interviewDate && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', marginTop: 4 }}>
                      {new Date(interviewDate + 'T00:00').toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Čas</label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'].map(t => (
                      <button type="button" key={t}
                        className={`btn btn-sm ${interviewTime === t ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setInterviewTime(t)}>{t}</button>
                    ))}
                  </div>
                  <input type="time" className="form-input" value={interviewTime}
                    onChange={e => setInterviewTime(e.target.value)}
                    style={{ maxWidth: 140, marginTop: '0.5rem' }} />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>Pohovorující</label>
                  <input className="form-input" value={interviewerName} onChange={e => setInterviewerName(e.target.value)}
                    placeholder="Jméno pohovorujícího" style={{ maxWidth: 300 }} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-success">Naplánovat a odeslat pozvánku</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowInterview(false)}>Zrušit</button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  Uživateli bude automaticky odeslán e-mail s termínem pohovoru.
                </p>
              </form>
            )}

            {user.interviews?.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Žádné pohovory.</p>
            ) : (
              user.interviews?.map(i => (
                <div key={i.id} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{new Date(i.scheduledDate).toLocaleString('cs-CZ')}</strong>
                    <span className={`badge ${i.result === 'RECOMMENDED' ? 'badge-success' : i.result === 'NOT_RECOMMENDED' ? 'badge-danger' : 'badge-warning'}`}>
                      {INTERVIEW_RESULTS[i.result]}
                    </span>
                  </div>
                  {i.interviewerName && <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Pohovorující: {i.interviewerName}</p>}
                  {i.evaluation && <p style={{ fontSize: '0.85rem', marginTop: 4 }}>{i.evaluation}</p>}
                </div>
              ))
            )}
          </div>

          {/* Projekty */}
          {user.projects?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '1rem' }}>Projekty uživatele</h3>
              {user.projects.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span>{p.title}</span>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - akce */}
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Stav registrace</h3>
            <div style={{ marginBottom: '1rem' }}>
              <StatusBadge status={user.registrationStatus} type="user" />
            </div>

            <div className="form-group">
              <label className="form-label">Poznámka</label>
              <textarea className="form-textarea" value={statusNote} onChange={e => setStatusNote(e.target.value)} style={{ minHeight: 60 }} />
            </div>

            <div className="btn-group" style={{ flexDirection: 'column' }}>
              {user.registrationStatus !== 'APPROVED' && (
                <button className="btn btn-success btn-sm btn-block" onClick={() => changeStatus('APPROVED')}>Schválit</button>
              )}
              {user.registrationStatus !== 'INVITED_FOR_INTERVIEW' && (
                <button className="btn btn-primary btn-sm btn-block" onClick={() => changeStatus('INVITED_FOR_INTERVIEW')}>Pozvat k pohovoru</button>
              )}
              {user.registrationStatus !== 'REJECTED' && (
                <button className="btn btn-warning btn-sm btn-block" onClick={() => changeStatus('REJECTED')}>Zamítnout</button>
              )}
              {user.registrationStatus !== 'BLOCKED' && (
                <button className="btn btn-danger btn-sm btn-block" onClick={() => changeStatus('BLOCKED')}>Zablokovat</button>
              )}
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Role</h3>
            <select className="form-select" value={newRole} onChange={e => setNewRole(e.target.value)} style={{ marginBottom: '0.75rem' }}>
              {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={changeRole}>Uložit roli</button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Důvěryhodnost</h3>
            <select className="form-select" value={newTrust} onChange={e => setNewTrust(e.target.value)} style={{ marginBottom: '0.75rem' }}>
              {Object.entries(TRUST_LEVELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="form-group">
              <label className="form-label">Interní poznámka</label>
              <textarea className="form-textarea" value={internalNote} onChange={e => setInternalNote(e.target.value)} style={{ minHeight: 60 }} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={changeTrust}>Uložit hodnocení</button>
          </div>
        </div>
      </div>
    </div>
  );
}
