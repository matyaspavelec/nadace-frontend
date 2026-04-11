'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import { REGISTRATION_STATUSES, TRUST_LEVELS, ROLES } from '@/lib/constants';
import { User, FolderOpen, Bell, Key, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, loadUser } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [myProjects, setMyProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState('profile');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState({ error: '', success: '' });
  const [showWelcome, setShowWelcome] = useState(false);

  // Editace profilu
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    phone: '', addressStreet: '', addressCity: '', addressZip: '',
    isPermanentResident: false, dateOfBirth: '',
  });
  const [profileMsg, setProfileMsg] = useState({ error: '', success: '' });
  const setPf = (k, v) => setProfileForm(prev => ({ ...prev, [k]: v }));

  const openProfileEdit = () => {
    if (!profile) return;
    setProfileForm({
      phone: profile.phone || '',
      addressStreet: profile.addressStreet || '',
      addressCity: profile.addressCity || '',
      addressZip: profile.addressZip || '',
      isPermanentResident: !!profile.isPermanentResident,
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
    });
    setProfileMsg({ error: '', success: '' });
    setEditProfile(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg({ error: '', success: '' });
    try {
      const payload = {
        phone: profileForm.phone,
        addressStreet: profileForm.addressStreet,
        addressCity: profileForm.addressCity,
        addressZip: profileForm.addressZip,
        isPermanentResident: profileForm.isPermanentResident,
      };
      // Pokud ještě nebyl DOB měněn a hodnota se liší → pošli
      const origDob = profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '';
      if (!profile.dateOfBirthChanged && profileForm.dateOfBirth && profileForm.dateOfBirth !== origDob) {
        payload.dateOfBirth = profileForm.dateOfBirth;
      }
      await api.updateMyProfile(payload);
      const fresh = await api.getProfile();
      setProfile(fresh);
      setEditProfile(false);
      setProfileMsg({ error: '', success: 'Profil uložen.' });
    } catch (err) {
      setProfileMsg({ error: err.error || 'Chyba při ukládání.', success: '' });
    }
  };

  const maxDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().split('T')[0];
  })();

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (user) {
      api.getProfile().then(setProfile).catch(() => {});
      api.getMyProjects().then(setMyProjects).catch(() => {});
      api.getNotifications().then(setNotifications).catch(() => {});
    }
  }, [user, loading, router]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('welcome') === '1') {
      setShowWelcome(true);
      window.history.replaceState({}, '', '/profil');
      const t = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(t);
    }
  }, []);

  if (loading || !user) return <div className="loading"><div className="spinner" />Načítání...</div>;

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg({ error: '', success: '' });
    if (pwForm.newPassword !== pwForm.confirm) return setPwMsg({ error: 'Hesla se neshodují.', success: '' });
    try {
      await api.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg({ error: '', success: 'Heslo bylo změněno.' });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setPwMsg({ error: err.error || 'Chyba.', success: '' });
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Můj profil</h1>

      {showWelcome && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <CheckCircle size={22} />
          <div>
            <strong>Přihlášení úspěšné!</strong>
            <span style={{ marginLeft: 8 }}>Vítejte, {user.firstName}.</span>
          </div>
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
          <User size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Profil
        </button>
        <button className={`tab ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>
          <FolderOpen size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Moje projekty ({myProjects.length})
        </button>
        <button className={`tab ${tab === 'notifications' ? 'active' : ''}`} onClick={() => setTab('notifications')}>
          <Bell size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Notifikace ({notifications.filter(n => !n.isRead).length})
        </button>
        <button className={`tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
          <Key size={16} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Heslo
        </button>
      </div>

      {tab === 'profile' && profile && (
        <div className="card">
          {profileMsg.error && <div className="alert alert-error">{profileMsg.error}</div>}
          {profileMsg.success && <div className="alert alert-success">{profileMsg.success}</div>}

          {!editProfile ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
                <button className="btn btn-sm btn-secondary" onClick={openProfileEdit}>Upravit údaje</button>
              </div>
              <div className="detail-grid">
                <div>
                  <div className="detail-label">Jméno</div>
                  <div className="detail-value">{profile.firstName} {profile.lastName}</div>
                  <div className="detail-label">E-mail</div>
                  <div className="detail-value">{profile.email}</div>
                  <div className="detail-label">Telefon</div>
                  <div className="detail-value">{profile.phone}</div>
                  <div className="detail-label">Adresa</div>
                  <div className="detail-value">{profile.addressStreet}, {profile.addressCity} {profile.addressZip}</div>
                  <div className="detail-label">Datum narození</div>
                  <div className="detail-value">
                    {new Date(profile.dateOfBirth).toLocaleDateString('cs-CZ')}
                    {profile.dateOfBirthChanged && <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginLeft: 8 }}>(již změněno)</span>}
                  </div>
                </div>
                <div>
                  <div className="detail-label">Stav registrace</div>
                  <div className="detail-value"><StatusBadge status={profile.registrationStatus} type="user" /></div>
                  <div className="detail-label">Role</div>
                  <div className="detail-value">{ROLES[profile.role] || profile.role}</div>
                  <div className="detail-label">Člen od</div>
                  <div className="detail-value">{profile.memberSince ? new Date(profile.memberSince).toLocaleDateString('cs-CZ') : 'Čeká na schválení'}</div>
                  <div className="detail-label">Trvalé bydliště ve V. Brodě</div>
                  <div className="detail-value">{profile.isPermanentResident ? 'Ano' : 'Ne'}</div>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleProfileSave} style={{ maxWidth: 600 }}>
              <h3 style={{ marginBottom: '0.5rem' }}>Úprava osobních údajů</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                Jméno, příjmení a e-mail může změnit pouze administrátor. Adresu a telefon můžete upravovat volně.
                {!profile.dateOfBirthChanged
                  ? ' Datum narození můžete opravit pouze jednou – pak už jen přes administrátora.'
                  : ' Datum narození jste již jednou změnili, další úpravu provede administrátor.'}
              </p>

              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input type="tel" className="form-input" value={profileForm.phone} onChange={e => setPf('phone', e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Ulice a č.p.</label>
                <input className="form-input" value={profileForm.addressStreet} onChange={e => setPf('addressStreet', e.target.value)} required />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Město</label>
                  <input className="form-input" value={profileForm.addressCity} onChange={e => setPf('addressCity', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">PSČ</label>
                  <input className="form-input" value={profileForm.addressZip} onChange={e => setPf('addressZip', e.target.value)} required />
                </div>
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <input type="checkbox" id="permResident" checked={profileForm.isPermanentResident} onChange={e => setPf('isPermanentResident', e.target.checked)} />
                  <label htmlFor="permResident">Mám trvalé bydliště ve Vyšším Brodě</label>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Datum narození</label>
                <input
                  type="date"
                  className="form-input"
                  value={profileForm.dateOfBirth}
                  max={maxDob}
                  onChange={e => setPf('dateOfBirth', e.target.value)}
                  disabled={profile.dateOfBirthChanged}
                />
                {profile.dateOfBirthChanged && (
                  <span className="form-hint" style={{ color: 'var(--text-light)' }}>
                    Datum narození už bylo jednou změněno – další úpravu může provést pouze administrátor.
                  </span>
                )}
                {!profile.dateOfBirthChanged && (
                  <span className="form-hint" style={{ color: 'var(--warning)' }}>
                    Změna data narození je možná pouze jednou.
                  </span>
                )}
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary">Uložit</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditProfile(false)}>Zrušit</button>
              </div>
            </form>
          )}

          {profile.registrationStatus !== 'APPROVED' && (
            <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
              {profile.registrationStatus === 'NEW' && 'Ověřte prosím svůj e-mail.'}
              {profile.registrationStatus === 'PENDING_REVIEW' && 'Vaše registrace čeká na kontrolu administrátorem.'}
              {profile.registrationStatus === 'INVITED_FOR_INTERVIEW' && 'Byli jste pozváni k osobnímu pohovoru. Budeme vás kontaktovat.'}
              {profile.registrationStatus === 'REJECTED' && 'Vaše registrace byla zamítnuta.'}
              {profile.registrationStatus === 'BLOCKED' && 'Váš účet byl zablokován.'}
            </div>
          )}
        </div>
      )}

      {tab === 'projects' && (
        <div>
          {(user.registrationStatus === 'APPROVED' || user.role === 'ADMIN') && (
            <Link href="/projekty/novy" className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>
              + Podat nový projekt
            </Link>
          )}
          {myProjects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)' }}>
              Zatím nemáte žádné projekty.
            </div>
          ) : (
            <div className="projects-grid">
              {myProjects.map(p => (
                <Link key={p.id} href={`/projekty/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card project-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <StatusBadge status={p.status} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                        {new Date(p.createdAt).toLocaleDateString('cs-CZ')}
                      </span>
                    </div>
                    <h3 className="project-card-title">{p.title}</h3>
                    <p className="project-card-summary">{p.summary?.slice(0, 100)}</p>
                    {p.adminNote && (
                      <div className="alert alert-warning" style={{ marginTop: 8, fontSize: '0.85rem' }}>
                        Poznámka: {p.adminNote}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'notifications' && (
        <div>
          {notifications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--text-light)' }}>Žádné notifikace.</div>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="card" style={{ marginBottom: '0.75rem', opacity: n.isRead ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: '0.9rem' }}>{n.title}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {new Date(n.createdAt).toLocaleDateString('cs-CZ')}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{n.message}</p>
                {!n.isRead && (
                  <button className="btn btn-sm btn-secondary" style={{ marginTop: 8 }}
                    onClick={() => { api.markNotificationRead(n.id); setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, isRead: true } : x)); }}>
                    Označit jako přečtené
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'password' && (
        <div className="card" style={{ maxWidth: 400 }}>
          <h3 style={{ marginBottom: '1rem' }}>Změna hesla</h3>
          {pwMsg.error && <div className="alert alert-error">{pwMsg.error}</div>}
          {pwMsg.success && <div className="alert alert-success">{pwMsg.success}</div>}
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label className="form-label">Současné heslo</label>
              <input type="password" className="form-input" value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Nové heslo</label>
              <input type="password" className="form-input" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Nové heslo znovu</label>
              <input type="password" className="form-input" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary">Změnit heslo</button>
          </form>
        </div>
      )}
    </div>
  );
}
