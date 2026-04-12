'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { PROJECT_CATEGORIES, PROJECT_STATUSES } from '@/lib/constants';
import StatusBadge from '@/components/StatusBadge';

export default function EmbedProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPublicProjects('limit=50').then(d => {
      setProjects(d.projects);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Načítání projektů...</div>;

  if (projects.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>Zatím nejsou žádné veřejné projekty.</div>;
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div style={{ padding: '1rem', maxWidth: 900, margin: '0 auto' }}>
      {projects.map(p => (
        <a
          key={p.id}
          href={`${appUrl}/projekty/${p.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '1.25rem',
            marginBottom: '0.75rem',
            transition: 'box-shadow 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{
              fontSize: '0.8rem',
              padding: '2px 8px',
              borderRadius: 4,
              background: '#e0f2fe',
              color: '#0369a1',
            }}>
              {PROJECT_CATEGORIES[p.category] || p.category}
            </span>
            <StatusBadge status={p.status} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 600, color: '#1a5632' }}>{p.title}</h3>
          <p style={{ margin: '0 0 8px', fontSize: '0.9rem', color: '#555', lineHeight: 1.5 }}>
            {p.summary?.slice(0, 150)}{p.summary?.length > 150 ? '...' : ''}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888' }}>
            <span>{p.location}</span>
            <span style={{ fontWeight: 600, color: '#1a5632' }}>{p.estimatedBudget?.toLocaleString('cs-CZ')} Kč</span>
          </div>
          {(p.votesFor > 0 || p.votesAgainst > 0) && (
            <div style={{ marginTop: 8, display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#666' }}>
              <span style={{ color: '#16a34a' }}>Pro: {p.votesFor}</span>
              <span style={{ color: '#dc2626' }}>Proti: {p.votesAgainst}</span>
            </div>
          )}
        </a>
      ))}
    </div>
  );
}
