'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Link from 'next/link';

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Chybí ověřovací token.'); return; }
    api.verifyEmail(token)
      .then(d => { setStatus('success'); setMessage(d.message); })
      .catch(e => { setStatus('error'); setMessage(e.error || 'Chyba při ověřování.'); });
  }, [token]);

  return (
    <div className="page-container" style={{ maxWidth: 500, margin: '0 auto' }}>
      <div className="card" style={{ marginTop: '3rem', textAlign: 'center' }}>
        {status === 'loading' && <div className="loading"><div className="spinner" />Ověřování...</div>}
        {status === 'success' && (
          <>
            <h2 style={{ color: 'var(--success)', marginBottom: '1rem' }}>E-mail ověřen!</h2>
            <p>{message}</p>
            <Link href="/login" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Přihlásit se</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Chyba</h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return <Suspense fallback={<div className="loading"><div className="spinner" />Načítání...</div>}><VerifyContent /></Suspense>;
}
