'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, hasRole } = useAuth();
  const [open, setOpen] = useState(false);

  const showAdmin = user && (isAdmin || hasRole('REGISTRATION_MANAGER', 'PROJECT_REVIEWER', 'CONTENT_EDITOR', 'COMMENT_MODERATOR'));

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          Nadace Pavelcových
        </Link>

        <button className="mobile-toggle" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`navbar-links ${open ? 'open' : ''}`}>
          <Link href="/" className="navbar-link" onClick={() => setOpen(false)}>Úvod</Link>
          <Link href="/projekty" className="navbar-link" onClick={() => setOpen(false)}>Projekty</Link>

          {!user ? (
            <>
              <Link href="/login" className="navbar-link" onClick={() => setOpen(false)}>Přihlásit se</Link>
              <Link href="/registrace" className="navbar-link" onClick={() => setOpen(false)}>Registrace</Link>
            </>
          ) : (
            <>
              <Link href="/profil" className="navbar-link" onClick={() => setOpen(false)}>
                <User size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Profil
              </Link>
              {showAdmin && (
                <Link href="/admin" className="navbar-link" onClick={() => setOpen(false)}>
                  <Shield size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  Admin
                </Link>
              )}
              <button
                className="navbar-link"
                onClick={() => { logout(); setOpen(false); window.location.href = '/'; }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
              >
                <LogOut size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Odhlásit
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
