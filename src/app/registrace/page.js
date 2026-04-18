'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import { validatePasswordPair } from '@/lib/validators';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '', password: '', passwordConfirm: '',
    firstName: '', lastName: '', birthYear: '',
    phone: '',
    addressCity: '',
    gdprConsent: false, rulesConsent: false,
  });

  // Místní části města Vyšší Brod (oficiální, zdroj: mestovyssibrod.cz)
  const VYSSI_BROD_PARTS = [
    'Vyšší Brod',
    'Dolní Drkolná',
    'Dolní Jílovice',
    'Herbertov',
    'Hrudkov',
    'Lachovice',
    'Studánky',
    'Těchoraz',
  ];
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const citySuggestions = VYSSI_BROD_PARTS.filter(p =>
    form.addressCity && p.toLowerCase().includes(form.addressCity.toLowerCase())
  );

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 18; y >= currentYear - 100; y--) {
    years.push(y);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const pwError = validatePasswordPair(form.password, form.passwordConfirm);
    if (pwError) return setError(pwError);
    if (!form.birthYear) {
      return setError('Vyberte rok narození.');
    }
    if (!form.addressCity.trim()) {
      return setError('Uveďte obec.');
    }

    setLoading(true);
    try {
      await api.register({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: `${form.birthYear}-01-01`,
        phone: form.phone,
        addressCity: form.addressCity.trim(),
        isPermanentResident: true,
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
          <p>Vaše registrace byla přijata.</p>
          <p style={{ marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Vaše registrace bude předána ke schválení administrátorem. O výsledku vás budeme informovat.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Přejít na přihlášení
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="card" style={{ marginTop: '2rem' }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>
          <UserPlus size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Registrace
        </h1>
        <p className="page-subtitle" style={{ textAlign: 'center' }}>
          Registrace je určena pouze pro obyvatele Vyššího Brodu.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">Jméno *</label>
              <input id="firstName" name="firstName" className="form-input" autoComplete="given-name" value={form.firstName} onChange={e => set('firstName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="lastName">Příjmení *</label>
              <input id="lastName" name="lastName" className="form-input" autoComplete="family-name" value={form.lastName} onChange={e => set('lastName', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">E-mail *</label>
            <input id="email" name="email" type="email" className="form-input" autoComplete="email" value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="password">Heslo *</label>
              <input id="password" name="password" type="password" className="form-input" autoComplete="new-password" value={form.password} onChange={e => set('password', e.target.value)} required />
              <span className="form-hint">Alespoň 8 znaků</span>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="passwordConfirm">Heslo znovu *</label>
              <input id="passwordConfirm" name="passwordConfirm" type="password" className="form-input" autoComplete="new-password" value={form.passwordConfirm} onChange={e => set('passwordConfirm', e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="birthYear">Rok narození *</label>
              <select id="birthYear" className="form-input" value={form.birthYear} onChange={e => set('birthYear', e.target.value)} required>
                <option value="">Vyberte...</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Telefon *</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+420..." required />
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" htmlFor="addressCity">Obec *</label>
            <input
              id="addressCity"
              name="addressCity"
              className="form-input"
              autoComplete="off"
              value={form.addressCity}
              onChange={e => { set('addressCity', e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Začněte psát, např. Vyšší Brod"
              required
            />
            {showSuggestions && form.addressCity && citySuggestions.length > 0 && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
                background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto',
              }}>
                {citySuggestions.map(s => (
                  <div key={s}
                    style={{ padding: '0.5rem 0.75rem', cursor: 'pointer' }}
                    onMouseDown={() => { set('addressCity', s); setShowSuggestions(false); }}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input type="checkbox" id="gdpr" checked={form.gdprConsent} onChange={e => set('gdprConsent', e.target.checked)} required />
              <label htmlFor="gdpr">
                Souhlasím se <Link href="/gdpr" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>zpracováním osobních údajů</Link> *
              </label>
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
