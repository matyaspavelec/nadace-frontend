'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/profil?welcome=1');
    } catch (err) {
      setError(err.error || 'Chyba při přihlášení.');
    }
    setLoading(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: 440, margin: '0 auto' }}>
      <div className="card" style={{ marginTop: '3rem' }}>
        <h1 className="page-title" style={{ textAlign: 'center' }}>
          <LogIn size={28} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Přihlášení
        </h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="form-label">Heslo</label>
            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Přihlašování...' : 'Přihlásit se'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Nemáte účet? <Link href="/registrace">Zaregistrujte se</Link>
        </p>
      </div>
    </div>
  );
}
