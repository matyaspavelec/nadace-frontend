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
  PUBLISHED_FOR_VOTING: '#c9a84c',
  VOTING_ENDED: '#8b7a3d',
  RECOMMENDED_FOR_REALIZATION: '#4a9d6e',
  IN_REALIZATION: '#c9a84c',
  COMPLETED: '#4a9d6e',
  ARCHIVED: '#555',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, fontFamily: "'Inter', -apple-system, sans-serif", color: '#c9a84c' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #2a2a2a', borderTopColor: '#c9a84c', borderRadius: '50%', animation: 'embed-spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Načítání projektů...
        </div>
        <style>{`@keyframes embed-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 200, fontFamily: "'Inter', -apple-system, sans-serif", color: '#ef4444' }}>
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
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          padding: 16px;
          scrollbar-width: none;
        }
        .embed-carousel::-webkit-scrollbar { display: none; }
        .embed-card {
          flex: 0 0 auto;
          width: 320px;
          min-width: 300px;
          max-width: 340px;
          scroll-snap-align: start;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: border-color 0.3s, background 0.3s, transform 0.2s;
          font-family: 'Inter', -apple-system, sans-serif;
          backdrop-filter: blur(8px);
        }
        .embed-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(201, 168, 76, 0.5);
          transform: translateY(-3px);
        }
        .embed-card-status {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 99px;
          color: #fff;
          align-self: flex-start;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .embed-card-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f0e6ce;
          margin-bottom: 10px;
          line-height: 1.35;
        }
        .embed-card-summary {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.6;
          margin-bottom: 16px;
          flex: 1;
        }
        .embed-card-budget {
          font-size: 1.15rem;
          font-weight: 700;
          background: linear-gradient(135deg, #c9a84c, #e8d48b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(201, 168, 76, 0.15);
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
              style={{ background: STATUS_COLORS[p.status] || '#555' }}
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
