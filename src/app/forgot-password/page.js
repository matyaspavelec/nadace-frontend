'use client';
import { useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.error || 'Chyba při odesílání. Zkuste to znovu.');
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: 440, margin: '0 auto' }}>
      <div className="card" style={{ marginTop: '3rem' }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>
          <Mail size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Obnovení hesla
        </h1>

        {sent ? (
          <>
            <div className="alert alert-success">
              Pokud účet s tímto e-mailem existuje, odeslali jsme vám odkaz pro obnovení hesla. Zkontrolujte svou e-mailovou schránku.
            </div>
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <Link href="/login">Zpět na přihlášení</Link>
            </p>
          </>
        ) : (
          <>
            <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Zadejte svůj e-mail a my vám pošleme odkaz pro nastavení nového hesla.
            </p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">E-mail</label>
                <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Odesílání...' : 'Odeslat odkaz'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
              <Link href="/login">Zpět na přihlášení</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
