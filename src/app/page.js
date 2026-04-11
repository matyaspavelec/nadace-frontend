'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';
import { useAuth } from '@/lib/auth';
import { PROJECT_CATEGORIES } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';
import { ArrowRight, Users, Vote, FolderOpen, Newspaper } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [news, setNews] = useState([]);
  const [pages, setPages] = useState([]);

  useEffect(() => {
    api.getPublicProjects('limit=3').then(d => setProjects(d.projects)).catch(logError('home/projects'));
    api.getNews('limit=3').then(d => setNews(d.articles)).catch(logError('home/news'));
    api.getPages().then(setPages).catch(logError('home/pages'));
  }, []);

  return (
    <div className="page-container">
      <div className="hero">
        <h1>Nadace Inge a Miloše Pavelcových</h1>
        <p>
          Společně rozhodujeme o budoucnosti Vyššího Brodu.
          Navrhujte veřejně prospěšné projekty, hlasujte a podílejte se na rozvoji města.
        </p>
        <div className="btn-group" style={{ justifyContent: 'center' }}>
          <Link href="/projekty" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary)' }}>
            Prohlédnout projekty
          </Link>
          {!user && (
            <Link href="/registrace" className="btn btn-primary" style={{ background: 'var(--accent)', color: 'var(--primary-dark)' }}>
              Registrovat se
            </Link>
          )}
        </div>
      </div>

      {/* Jak to funguje */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 className="page-title" style={{ textAlign: 'center' }}>Jak systém funguje</h2>
        <div className="stats-grid" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="card stat-card">
            <Users size={32} style={{ color: 'var(--primary)', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>1. Registrace</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Zaregistrujte se a projděte ověřením včetně osobního pohovoru.
            </div>
          </div>
          <div className="card stat-card">
            <FolderOpen size={32} style={{ color: 'var(--primary)', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>2. Návrh projektu</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Podejte návrh veřejně prospěšného projektu pro Vyšší Brod.
            </div>
          </div>
          <div className="card stat-card">
            <Vote size={32} style={{ color: 'var(--primary)', marginBottom: 8 }} />
            <div style={{ fontWeight: 600, marginBottom: 4 }}>3. Hlasování</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
              Hlasujte o schválených projektech. Výsledky slouží jako doporučení pro správní radu.
            </div>
          </div>
        </div>
      </section>

      {/* Aktuální projekty */}
      {projects.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="page-title" style={{ marginBottom: 0 }}>Aktuální projekty</h2>
            <Link href="/projekty" className="btn btn-secondary btn-sm">
              Všechny projekty <ArrowRight size={14} />
            </Link>
          </div>
          <div className="projects-grid">
            {projects.map(p => (
              <Link key={p.id} href={`/projekty/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card project-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span className="badge badge-info">{PROJECT_CATEGORIES[p.category] || p.category}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3 className="project-card-title">{p.title}</h3>
                  <p className="project-card-summary">{p.summary?.slice(0, 120)}{p.summary?.length > 120 ? '...' : ''}</p>
                  {(p.votesFor > 0 || p.votesAgainst > 0) && (
                    <>
                      <div className="vote-bar">
                        <div className="vote-bar-yes" style={{ width: `${(p.votesFor / (p.votesFor + p.votesAgainst)) * 100}%` }} />
                        <div className="vote-bar-no" style={{ width: `${(p.votesAgainst / (p.votesFor + p.votesAgainst)) * 100}%` }} />
                      </div>
                      <div className="vote-stats">
                        <span className="vote-stats-yes">Pro: {p.votesFor}</span>
                        <span className="vote-stats-no">Proti: {p.votesAgainst}</span>
                      </div>
                    </>
                  )}
                  <div className="project-card-footer">
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {p.estimatedBudget?.toLocaleString('cs-CZ')} Kč
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {p._count?.comments || 0} komentářů
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Novinky */}
      {news.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="page-title">
            <Newspaper size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Novinky
          </h2>
          {news.map(n => (
            <div key={n.id} className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>{n.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: 8 }}>
                {new Date(n.publishedAt).toLocaleDateString('cs-CZ')}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                {n.excerpt || n.content?.slice(0, 200)}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
