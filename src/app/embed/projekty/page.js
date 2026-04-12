'use client';
import { useState, useEffect } from 'react';

const STATUS_MAP = {
  PUBLISHED_FOR_VOTING: 'Hlasování',
  VOTING_ENDED: 'Hlasování ukončeno',
  RECOMMENDED_FOR_REALIZATION: 'Doporučeno',
  IN_REALIZATION: 'Realizuje se',
  COMPLETED: 'Dokončeno',
  ARCHIVED: 'Archivováno',
};

const STATUS_COLORS = {
  PUBLISHED_FOR_VOTING: { bg: 'rgba(201,168,76,0.15)', text: '#d4b85a' },
  VOTING_ENDED: { bg: 'rgba(139,122,61,0.15)', text: '#a89550' },
  RECOMMENDED_FOR_REALIZATION: { bg: 'rgba(74,157,110,0.15)', text: '#5cb88a' },
  IN_REALIZATION: { bg: 'rgba(201,168,76,0.15)', text: '#d4b85a' },
  COMPLETED: { bg: 'rgba(74,157,110,0.15)', text: '#5cb88a' },
  ARCHIVED: { bg: 'rgba(100,100,100,0.15)', text: '#888' },
};

const FALLBACK_STATUS = { bg: 'rgba(100,100,100,0.15)', text: '#888' };

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
      <>
        <style>{embedStyles}</style>
        <div className="embed-center">
          <div className="embed-spinner" />
          <span className="embed-loading-text">Načítání projektů...</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{embedStyles}</style>
        <div className="embed-center">
          <span style={{ color: '#c9a84c' }}>{error}</span>
        </div>
      </>
    );
  }

  if (projects.length === 0) {
    return (
      <>
        <style>{embedStyles}</style>
        <div className="embed-center">
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Zatím nejsou žádné veřejné projekty.</span>
        </div>
      </>
    );
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <>
      <style>{embedStyles}</style>
      <div className="embed-track">
        {projects.map(p => {
          const sc = STATUS_COLORS[p.status] || FALLBACK_STATUS;
          return (
            <a
              key={p.id}
              href={`${appUrl}/projekty/${p.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="embed-card"
            >
              <div className="embed-card-header">
                <span className="embed-status" style={{ background: sc.bg, color: sc.text }}>
                  {STATUS_MAP[p.status] || p.status}
                </span>
              </div>
              <h3 className="embed-title">{p.title}</h3>
              <p className="embed-summary">
                {p.summary?.slice(0, 120)}{p.summary?.length > 120 ? '…' : ''}
              </p>
              <div className="embed-footer">
                <div className="embed-budget">
                  {p.estimatedBudget?.toLocaleString('cs-CZ')}&nbsp;Kč
                </div>
                <span className="embed-arrow">→</span>
              </div>
            </a>
          );
        })}
      </div>
    </>
  );
}

const embedStyles = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: transparent; overflow-x: hidden; }

.embed-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  font-family: 'Inter', -apple-system, sans-serif;
  color: rgba(255,255,255,0.5);
  gap: 16px;
}

.embed-spinner {
  width: 28px; height: 28px;
  border: 2px solid rgba(201,168,76,0.2);
  border-top-color: #c9a84c;
  border-radius: 50%;
  animation: espin 0.7s linear infinite;
}
@keyframes espin { to { transform: rotate(360deg); } }

.embed-loading-text {
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(201,168,76,0.5);
}

.embed-track {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 24px 20px 28px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.embed-track::-webkit-scrollbar { display: none; }

.embed-card {
  flex: 0 0 310px;
  min-width: 290px;
  max-width: 340px;
  scroll-snap-align: start;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px 24px 24px;
  background: linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(201,168,76,0.12);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.embed-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(160deg, rgba(201,168,76,0.25), transparent 50%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.35s;
  pointer-events: none;
}

.embed-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(165deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 100%);
  border-color: rgba(201,168,76,0.3);
  box-shadow:
    0 12px 40px rgba(0,0,0,0.3),
    0 0 30px rgba(201,168,76,0.06);
}

.embed-card:hover::before {
  opacity: 1;
}

.embed-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.embed-status {
  font-family: 'Inter', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 6px;
}

.embed-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.35;
  color: #f0e8d4;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.embed-summary {
  font-family: 'Inter', sans-serif;
  font-size: 0.84rem;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(255,255,255,0.4);
  margin-bottom: 20px;
  flex: 1;
}

.embed-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(201,168,76,0.1);
  margin-top: auto;
}

.embed-budget {
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  background: linear-gradient(135deg, #c9a84c 0%, #e2cc7a 50%, #c9a84c 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.embed-arrow {
  font-size: 1.1rem;
  color: rgba(201,168,76,0.3);
  transition: all 0.3s;
}

.embed-card:hover .embed-arrow {
  color: #c9a84c;
  transform: translateX(4px);
}
`;
