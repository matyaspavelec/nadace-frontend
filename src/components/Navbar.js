'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, User, Shield, Bell } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin, hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);

  const showAdmin = user && (isAdmin || hasRole('REGISTRATION_MANAGER', 'PROJECT_REVIEWER', 'CONTENT_EDITOR', 'COMMENT_MODERATOR'));
  const unreadCount = notifs.filter(n => !n.isRead).length;

  // Poll notifikací každou minutu pro přihlášené uživatele
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = () => {
      api.getNotifications().then(data => {
        if (!cancelled) setNotifs(Array.isArray(data) ? data : []);
      }).catch(logError('navbar/notifications'));
    };
    load();
    const id = setInterval(load, 60 * 1000);
    return () => { cancelled = true; clearInterval(id); };
  }, [user]);

  // Zavři dropdown po kliknutí mimo
  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const markRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      logError('navbar/markRead')(err);
    }
  };

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
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  className="navbar-link"
                  onClick={() => setNotifOpen(o => !o)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', fontFamily: 'inherit', fontSize: 'inherit' }}
                  aria-label="Notifikace"
                >
                  <Bell size={18} style={{ verticalAlign: 'middle' }} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: 0,
                      right: -4,
                      background: '#dc2626',
                      color: '#fff',
                      borderRadius: '999px',
                      minWidth: 18,
                      height: 18,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 5px',
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: 8,
                    width: 340,
                    maxHeight: 420,
                    overflowY: 'auto',
                    background: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    zIndex: 1000,
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>
                      Notifikace
                    </div>
                    {notifs.length === 0 ? (
                      <div style={{ padding: '1rem', color: 'var(--text-light)', fontSize: '0.9rem', textAlign: 'center' }}>
                        Žádné notifikace.
                      </div>
                    ) : notifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => { if (!n.isRead) markRead(n.id); if (n.link) { setNotifOpen(false); window.location.href = n.link; } }}
                        style={{
                          padding: '0.75rem 1rem',
                          borderBottom: '1px solid var(--border)',
                          cursor: n.link ? 'pointer' : 'default',
                          background: n.isRead ? '#fff' : '#f0f9ff',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{n.message}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: 4 }}>
                          {new Date(n.createdAt).toLocaleString('cs-CZ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
