'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', passwordConfirm: '',
    firstName: '', lastName: '', dateOfBirth: '',
    addressStreet: '', addressCity: 'Vyšší Brod', addressZip: '38273',
    phone: '', isPermanentResident: false, gdprConsent: false, rulesConsent: false,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.passwordConfirm) {
      return setError('Hesla se neshodují.');
    }
    if (form.password.length < 8) {
      return setError('Heslo musí mít alespoň 8 znaků.');
    }

    setLoading(true);
    try {
      await api.register({
        ...form,
        isPermanentResident: String(form.isPermanentResident),
        gdprConsent: String(form.gdprConsent),
        rulesConsent: String(form.rulesConsent),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.error || err.errors?.map(e => e.msg).join(', ') || 'Chyba při registraci.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="page-container" style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="card" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>Registrace úspěšná!</h2>
          <p>Na váš e-mail jsme odeslali ověřovací odkaz. Klikněte na něj pro dokončení registrace.</p>
          <p style={{ marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Po ověření e-mailu bude vaše registrace předána ke schválení administrátorem.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Přejít na přihlášení
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="card" style={{ marginTop: '2rem' }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>
          <UserPlus size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Registrace
        </h1>
        <p className="page-subtitle" style={{ textAlign: 'center' }}>
          Registrace je určena pouze pro obyvatele Vyššího Brodu.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Jméno *</label>
              <input className="form-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Příjmení *</label>
              <input className="form-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">E-mail *</label>
            <input type="email" className="form-input" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Heslo *</label>
              <input type="password" className="form-input" value={form.password} onChange={e => set('password', e.target.value)} required />
              <span className="form-hint">Alespoň 8 znaků</span>
            </div>
            <div className="form-group">
              <label className="form-label">Heslo znovu *</label>
              <input type="password" className="form-input" value={form.passwordConfirm} onChange={e => set('passwordConfirm', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Datum narození *</label>
            <input type="date" className="form-input" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Ulice a číslo *</label>
            <input className="form-input" value={form.addressStreet} onChange={e => set('addressStreet', e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Město *</label>
              <input className="form-input" value={form.addressCity} onChange={e => set('addressCity', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">PSČ *</label>
              <input className="form-input" value={form.addressZip} onChange={e => set('addressZip', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Telefon *</label>
            <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+420..." required />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input type="checkbox" id="resident" checked={form.isPermanentResident} onChange={e => set('isPermanentResident', e.target.checked)} />
              <label htmlFor="resident">Potvrzuji, že mám trvalé bydliště ve Vyšším Brodě</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input type="checkbox" id="gdpr" checked={form.gdprConsent} onChange={e => set('gdprConsent', e.target.checked)} required />
              <label htmlFor="gdpr">Souhlasím se zpracováním osobních údajů *</label>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input type="checkbox" id="rules" checked={form.rulesConsent} onChange={e => set('rulesConsent', e.target.checked)} required />
              <label htmlFor="rules">Souhlasím s pravidly systému *</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registrace...' : 'Zaregistrovat se'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Už máte účet? <Link href="/login">Přihlaste se</Link>
        </p>
      </div>
    </div>
  );
}
