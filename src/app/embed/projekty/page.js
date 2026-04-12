'use client';
import { useState, useEffect } from 'react';

const STATUS_MAP = {
  PUBLISHED_FOR_VOTING: 'Hlasování',
  VOTING_ENDED: 'Hlasování ukončeno',
  RECOMMENDED_FOR_REALIZATION: 'Doporučeno k realizaci',
  IN_REALIZATION: 'Realizuje se',
  COMPLETED: 'Dokončeno',
  ARCHIVED: 'Archivováno',
};

const STATUS_COLORS = {
  PUBLISHED_FOR_VOTING: '#3b82f6',
  VOTING_ENDED: '#6366f1',
  RECOMMENDED_FOR_REALIZATION: '#059669',
  IN_REALIZATION: '#0891b2',
  COMPLETED: '#16a34a',
  ARCHIVED: '#64748b',
};

export default function EmbedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/projects/public?limit=12')
      .then(r => {
        if (!r.ok) throw new Error('Chyba při načítání');
        return r.json();
      })
      .then(d => {
        setProjects(d.projects || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, fontFamily: "'Inter', -apple-system, sans-serif", color: '#888' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#1a5632', borderRadius: '50%', animation: 'embed-spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Načítání projektů...
        </div>
        <style>{`@keyframes embed-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, fontFamily: "'Inter', -apple-system, sans-serif", color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, fontFamily: "'Inter', -apple-system, sans-serif", color: '#888' }}>
        Zatím nejsou žádné veřejné projekty.
      </div>
    );
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: transparent; }
        .embed-carousel {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 16px;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .embed-carousel::-webkit-scrollbar { height: 6px; }
        .embed-carousel::-webkit-scrollbar-track { background: transparent; }
        .embed-carousel::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        .embed-card {
          flex: 0 0 auto;
          width: 320px;
          min-width: 300px;
          max-width: 340px;
          scroll-snap-align: start;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.25rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s, transform 0.2s;
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .embed-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          transform: translateY(-2px);
        }
        .embed-card-status {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 99px;
          color: #fff;
          align-self: flex-start;
          margin-bottom: 12px;
        }
        .embed-card-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a5632;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .embed-card-summary {
          font-size: 0.87rem;
          color: #555;
          line-height: 1.55;
          margin-bottom: 12px;
          flex: 1;
        }
        .embed-card-budget {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a5632;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
      <div className="embed-carousel">
        {projects.map(p => (
          <a
            key={p.id}
            href={`${appUrl}/projekty/${p.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="embed-card"
          >
            <span
              className="embed-card-status"
              style={{ background: STATUS_COLORS[p.status] || '#6b7280' }}
            >
              {STATUS_MAP[p.status] || p.status}
            </span>
            <div className="embed-card-title">{p.title}</div>
            <div className="embed-card-summary">
              {p.summary?.slice(0, 120)}{p.summary?.length > 120 ? '...' : ''}
            </div>
            <div className="embed-card-budget">
              {p.estimatedBudget?.toLocaleString('cs-CZ')} Kč
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
