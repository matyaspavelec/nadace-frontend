'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="page-container" style={{ maxWidth: 440, margin: '0 auto' }}>
        <div className="card" style={{ marginTop: '3rem' }}>
          <div className="alert alert-error">Neplatný odkaz pro obnovení hesla. Token nebyl nalezen.</div>
          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link href="/forgot-password">Požádat o nový odkaz</Link>
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Hesla se neshodují.');
      return;
    }

    if (password.length < 8) {
      setError('Heslo musí mít alespoň 8 znaků.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ token, newPassword: password });
      setSuccess(true);
    } catch (err) {
      setError(err.error || 'Chyba při obnovení hesla. Odkaz mohl vypršet.');
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: 440, margin: '0 auto' }}>
      <div className="card" style={{ marginTop: '3rem' }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>
          <KeyRound size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Nové heslo
        </h1>

        {success ? (
          <>
            <div className="alert alert-success">
              Heslo bylo úspěšně změněno. Nyní se můžete přihlásit.
            </div>
            <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link href="/login" className="btn btn-primary btn-block" style={{ display: 'block', textDecoration: 'none' }}>
                Přihlásit se
              </Link>
            </p>
          </>
        ) : (
          <>
            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nové heslo</label>
                <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
              </div>
              <div className="form-group">
                <label className="form-label">Potvrzení hesla</label>
                <input type="password" className="form-input" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} required minLength={8} />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Ukládání...' : 'Nastavit nové heslo'}
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
