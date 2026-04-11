'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { logError } from '@/lib/errors';
import { useAuth } from '@/lib/auth';
import StatusBadge from '@/components/StatusBadge';
import { PROJECT_CATEGORIES, BUDGET_SIZES } from '@/lib/constants';
import { ThumbsUp, ThumbsDown, MessageSquare, MapPin, Calendar, Banknote } from 'lucide-react';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user, isApproved } = useAuth();
  const [project, setProject] = useState(null);
  const [myVote, setMyVote] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voteMsg, setVoteMsg] = useState('');
  const [commentMsg, setCommentMsg] = useState('');

  useEffect(() => {
    api.getPublicProject(id).then(p => {
      setProject(p);
      setComments(p.comments || []);
      setLoading(false);
    }).catch(() => setLoading(false));

    if (user) {
      api.getMyVote(id).then(d => setMyVote(d.vote)).catch(logError('projekt-detail/myVote'));
    }
  }, [id, user]);

  const handleVote = async (value) => {
    try {
      const res = await api.vote({ projectId: id, value });
      setMyVote(res.vote);
      setVoteMsg('Hlas zaznamenán!');
      // Refresh project
      const p = await api.getPublicProject(id);
      setProject(p);
      setTimeout(() => setVoteMsg(''), 3000);
    } catch (err) {
      setVoteMsg(err.error || 'Chyba při hlasování.');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await api.addComment({ projectId: id, content: comment });
      setComments(prev => [res.comment, ...prev]);
      setComment('');
      setCommentMsg('Komentář přidán.');
      setTimeout(() => setCommentMsg(''), 3000);
    } catch (err) {
      setCommentMsg(err.error || 'Chyba.');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" />Načítání...</div>;
  if (!project) return <div className="page-container"><div className="alert alert-error">Projekt nenalezen.</div></div>;

  const total = project.votesFor + project.votesAgainst;
  const canVote = user && isApproved && project.status === 'PUBLISHED_FOR_VOTING';
  const votingActive = project.status === 'PUBLISHED_FOR_VOTING' && (!project.votingEndDate || new Date(project.votingEndDate) > new Date());

  return (
    <div className="page-container">
      <div className="detail-grid">
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <StatusBadge status={project.status} />
            <span className="badge badge-info">{PROJECT_CATEGORIES[project.category]}</span>
            <span className="badge badge-gray">{BUDGET_SIZES[project.budgetSize]} projekt</span>
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            {project.title}
          </h1>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Navrhl/a: {project.author?.firstName} {project.author?.lastName}
          </p>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Shrnutí</h3>
            <p style={{ lineHeight: 1.7 }}>{project.summary}</p>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Podrobný popis</h3>
            <p style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{project.description}</p>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Přínos pro Vyšší Brod</h3>
            <p style={{ lineHeight: 1.7 }}>{project.benefitForCity}</p>
          </div>

          {project.foundationComment && (
            <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>Komentář nadace</h3>
              <p style={{ lineHeight: 1.7 }}>{project.foundationComment}</p>
            </div>
          )}

          {/* Komentáře */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>
              <MessageSquare size={20} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Komentáře ({comments.length})
            </h3>

            {isApproved && (
              <form onSubmit={handleComment} style={{ marginBottom: '1rem' }}>
                <textarea className="form-textarea" value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Napište komentář..." maxLength={2000} style={{ minHeight: 60 }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'right' }}>
                  {comment.length} / 2000
                </div>
                {commentMsg && <div className="alert alert-info" style={{ marginTop: 8 }}>{commentMsg}</div>}
                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>Odeslat komentář</button>
              </form>
            )}

            {comments.length === 0 ? (
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Zatím žádné komentáře.</p>
            ) : (
              comments.map(c => (
                <div key={c.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{c.user?.firstName} {c.user?.lastName}</span>
                    <span className="comment-date">{new Date(c.createdAt).toLocaleDateString('cs-CZ')}</span>
                  </div>
                  <div className="comment-content">{c.content}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="detail-label"><MapPin size={14} style={{ verticalAlign: 'middle' }} /> Město</div>
            <div className="detail-value">{project.location}</div>

            <div className="detail-label"><Banknote size={14} style={{ verticalAlign: 'middle' }} /> Rozpočet</div>
            <div className="detail-value" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
              {project.estimatedBudget?.toLocaleString('cs-CZ')} Kč
            </div>

            <div className="detail-label">Požadovaná podpora</div>
            <div className="detail-value">{project.requestedSupport?.toLocaleString('cs-CZ')} Kč</div>

            <div className="detail-label"><Calendar size={14} style={{ verticalAlign: 'middle' }} /> Termín realizace</div>
            <div className="detail-value">{project.realizationDate}</div>

            <div className="detail-label">Cílová skupina</div>
            <div className="detail-value">{project.targetGroup}</div>

            <div className="detail-label">Realizátor</div>
            <div className="detail-value">{project.implementedBy}</div>

            <div className="detail-label">Charakter</div>
            <div className="detail-value">{project.isLongTerm ? 'Dlouhodobý' : 'Jednorázový'}</div>
          </div>

          {/* Hlasování */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.75rem' }}>Hlasování</h3>

            {total > 0 && (
              <>
                <div className="vote-bar">
                  <div className="vote-bar-yes" style={{ width: `${(project.votesFor / total) * 100}%` }} />
                  <div className="vote-bar-no" style={{ width: `${(project.votesAgainst / total) * 100}%` }} />
                </div>
                <div className="vote-stats" style={{ marginBottom: '1rem' }}>
                  <span className="vote-stats-yes">Pro: {project.votesFor}</span>
                  <span className="vote-stats-no">Proti: {project.votesAgainst}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', marginBottom: '1rem' }}>
                  Celkem hlasů: {total} | Schválení: {total > 0 ? ((project.votesFor / total) * 100).toFixed(0) : 0}%
                </p>
              </>
            )}

            {votingActive && canVote && (
              <div className="vote-buttons">
                <button className={`vote-btn ${myVote?.value === 'YES' ? 'selected-yes' : ''}`} onClick={() => handleVote('YES')}>
                  <ThumbsUp size={20} style={{ marginBottom: 4 }} /><br />Pro
                </button>
                <button className={`vote-btn ${myVote?.value === 'NO' ? 'selected-no' : ''}`} onClick={() => handleVote('NO')}>
                  <ThumbsDown size={20} style={{ marginBottom: 4 }} /><br />Proti
                </button>
              </div>
            )}

            {voteMsg && <div className="alert alert-info">{voteMsg}</div>}

            {!votingActive && project.status === 'PUBLISHED_FOR_VOTING' && (
              <div className="alert alert-warning">Hlasování pro tento projekt skončilo.</div>
            )}

            {!user && <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Pro hlasování se přihlaste.</p>}

            {project.votingStartDate && (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: 8 }}>
                Hlasování: {new Date(project.votingStartDate).toLocaleDateString('cs-CZ')}
                {project.votingEndDate && ` – ${new Date(project.votingEndDate).toLocaleDateString('cs-CZ')}`}
              </p>
            )}
          </div>

          {/* Přílohy */}
          {project.attachments?.length > 0 && (
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>Přílohy</h3>
              {project.attachments.map(a => (
                <div key={a.id} style={{ marginBottom: '0.5rem' }}>
                  <a href={`/uploads/${a.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9rem' }}>
                    {a.originalName}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
