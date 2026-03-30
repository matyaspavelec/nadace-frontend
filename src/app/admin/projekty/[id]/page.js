'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge';
import { PROJECT_STATUSES, PROJECT_CATEGORIES, BUDGET_SIZES } from '@/lib/constants';

export default function AdminProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('detail');

  // Status change
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [foundationComment, setFoundationComment] = useState('');
  const [votingStart, setVotingStart] = useState('');
  const [votingEnd, setVotingEnd] = useState('');

  // Internal admin fields
  const [internal, setInternal] = useState({
    targetGroup: '', location: '', estimatedBudget: '', implementedBy: '',
    operatingCosts: '', maintainedBy: '', mainRisks: '',
    previouslyDiscussed: '', estimatedBeneficiaries: '',
  });
  const setInt = (k, v) => setInternal(prev => ({ ...prev, [k]: v }));

  // Review
  const [review, setReview] = useState({
    statuteCompliance: 3, publicBenefit: 3, feasibility: 3, budgetAdequacy: 3,
    sustainability: 3, technicalFeasibility: 3, noPersonalGain: true, conflictRisk: 3,
    overallRecommendation: 'APPROVE', notes: '',
  });

  const load = () => {
    api.getAdminProject(id).then(p => {
      setProject(p);
      setNewStatus(p.status);
      setFoundationComment(p.foundationComment || '');
      setInternal({
        targetGroup: p.targetGroup || '',
        location: p.location || '',
        estimatedBudget: p.estimatedBudget || '',
        implementedBy: p.implementedBy || '',
        operatingCosts: p.operatingCosts || '',
        maintainedBy: p.maintainedBy || '',
        mainRisks: p.mainRisks || '',
        previouslyDiscussed: p.previouslyDiscussed || '',
        estimatedBeneficiaries: p.estimatedBeneficiaries || '',
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const changeStatus = async () => {
    try {
      await api.updateProjectStatus(id, {
        status: newStatus, note: statusNote, foundationComment,
        votingStartDate: votingStart || undefined, votingEndDate: votingEnd || undefined,
      });
      setMsg('Stav projektu změněn.');
      setStatusNote('');
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.addReview({ ...review, projectId: id });
      setMsg('Recenze uložena.');
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  const saveInternal = async () => {
    try {
      await api.updateProjectInternal(id, internal);
      setMsg('Interní údaje uloženy.');
      load();
    } catch (err) { setMsg(err.error || 'Chyba při ukládání.'); }
  };

  const requestCompletion = async () => {
    try {
      await api.requestCompletion(id, { message: statusNote });
      setMsg('Žádost o doplnění odeslána.');
      setStatusNote('');
      load();
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  if (loading) return <div className="loading"><div className="spinner" />Načítání...</div>;
  if (!project) return <div className="alert alert-error">Projekt nenalezen.</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: 4 }}>{project.title}</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <StatusBadge status={project.status} />
            <span className="badge badge-info">{PROJECT_CATEGORIES[project.category]}</span>
          </div>
        </div>
      </div>

      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="tabs">
        <button className={`tab ${tab === 'detail' ? 'active' : ''}`} onClick={() => setTab('detail')}>Detail</button>
        <button className={`tab ${tab === 'internal' ? 'active' : ''}`} onClick={() => setTab('internal')}>Interní</button>
        <button className={`tab ${tab === 'status' ? 'active' : ''}`} onClick={() => setTab('status')}>Stav</button>
        <button className={`tab ${tab === 'review' ? 'active' : ''}`} onClick={() => setTab('review')}>Recenze ({project.reviews?.length || 0})</button>
        <button className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>Historie</button>
        <button className={`tab ${tab === 'comments' ? 'active' : ''}`} onClick={() => setTab('comments')}>Komentáře ({project.comments?.length || 0})</button>
      </div>

      {tab === 'detail' && (
        <div className="detail-grid">
          <div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <div className="detail-label">Autor</div>
              <div className="detail-value">{project.author?.firstName} {project.author?.lastName} ({project.author?.email})</div>
              <div className="detail-label">Shrnutí</div>
              <div className="detail-value">{project.summary}</div>
              <div className="detail-label">Podrobný popis</div>
              <div className="detail-value" style={{ whiteSpace: 'pre-wrap' }}>{project.description}</div>
              <div className="detail-label">Přínos pro město</div>
              <div className="detail-value">{project.benefitForCity}</div>
              {project.mainRisks && (<><div className="detail-label">Rizika</div><div className="detail-value">{project.mainRisks}</div></>)}
              {project.operatingCosts && (<><div className="detail-label">Provozní náklady</div><div className="detail-value">{project.operatingCosts}</div></>)}
              {project.maintainedBy && (<><div className="detail-label">Údržba</div><div className="detail-value">{project.maintainedBy}</div></>)}
              {project.adminNote && (<><div className="detail-label">Admin poznámka</div><div className="detail-value" style={{ color: 'var(--warning)' }}>{project.adminNote}</div></>)}
            </div>
          </div>
          <div>
            <div className="card">
              <div className="detail-label">Rozpočet</div>
              <div className="detail-value" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{project.estimatedBudget?.toLocaleString('cs-CZ')} Kč</div>
              <div className="detail-label">Požadovaná podpora</div>
              <div className="detail-value">{project.requestedSupport?.toLocaleString('cs-CZ')} Kč</div>
              <div className="detail-label">Lokalita</div>
              <div className="detail-value">{project.location}</div>
              <div className="detail-label">Cílová skupina</div>
              <div className="detail-value">{project.targetGroup}</div>
              <div className="detail-label">Realizátor</div>
              <div className="detail-value">{project.implementedBy}</div>
              <div className="detail-label">Termín</div>
              <div className="detail-value">{project.realizationDate}</div>
              <div className="detail-label">Velikost</div>
              <div className="detail-value">{BUDGET_SIZES[project.budgetSize]}</div>
              <div className="detail-label">Hlasy</div>
              <div className="detail-value">Pro: {project.votesFor} | Proti: {project.votesAgainst}</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'internal' && (
        <div className="card" style={{ maxWidth: 700 }}>
          <h3 style={{ marginBottom: '1rem' }}>Interní údaje projektu</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Tyto údaje vyplňuje administrátor. Nejsou součástí formuláře pro členy.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Cílová skupina</label>
              <input className="form-input" value={internal.targetGroup} onChange={e => setInt('targetGroup', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Místo realizace</label>
              <input className="form-input" value={internal.location} onChange={e => setInt('location', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Předpokládaný rozpočet (Kč)</label>
              <input type="number" className="form-input" value={internal.estimatedBudget} onChange={e => setInt('estimatedBudget', e.target.value)} min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Kdo bude realizovat</label>
              <input className="form-input" value={internal.implementedBy} onChange={e => setInt('implementedBy', e.target.value)} />
            </div>
          </div>

          <hr style={{ margin: '1.5rem 0', borderColor: 'var(--border)' }} />
          <h4 style={{ marginBottom: '1rem' }}>Doplňující informace</h4>

          <div className="form-group">
            <label className="form-label">Odhad provozních nákladů po dokončení</label>
            <input className="form-input" value={internal.operatingCosts} onChange={e => setInt('operatingCosts', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Kdo bude projekt udržovat</label>
            <input className="form-input" value={internal.maintainedBy} onChange={e => setInt('maintainedBy', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Hlavní rizika projektu</label>
            <textarea className="form-textarea" value={internal.mainRisks} onChange={e => setInt('mainRisks', e.target.value)} style={{ minHeight: 60 }} />
          </div>

          <div className="form-group">
            <label className="form-label">Byl projekt někde projednáván?</label>
            <input className="form-input" value={internal.previouslyDiscussed} onChange={e => setInt('previouslyDiscussed', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Odhadovaný počet příjemců</label>
            <input type="number" className="form-input" value={internal.estimatedBeneficiaries} onChange={e => setInt('estimatedBeneficiaries', e.target.value)} min="0" />
          </div>

          <button className="btn btn-primary" onClick={saveInternal} style={{ marginTop: '1rem' }}>Uložit interní údaje</button>
        </div>
      )}

      {tab === 'status' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: '1rem' }}>Změna stavu projektu</h3>
          <div className="form-group">
            <label className="form-label">Nový stav</label>
            <select className="form-select" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {Object.entries(PROJECT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          {newStatus === 'PUBLISHED_FOR_VOTING' && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Začátek hlasování</label>
                <input type="datetime-local" className="form-input" value={votingStart} onChange={e => setVotingStart(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Konec hlasování</label>
                <input type="datetime-local" className="form-input" value={votingEnd} onChange={e => setVotingEnd(e.target.value)} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Komentář nadace (veřejný)</label>
            <textarea className="form-textarea" value={foundationComment} onChange={e => setFoundationComment(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Interní poznámka</label>
            <textarea className="form-textarea" value={statusNote} onChange={e => setStatusNote(e.target.value)} />
          </div>

          <div className="btn-group">
            <button className="btn btn-primary" onClick={changeStatus}>Změnit stav</button>
            <button className="btn btn-warning" onClick={requestCompletion}>Vyžádat doplnění</button>
          </div>
        </div>
      )}

      {tab === 'review' && (
        <div>
          {/* Existující recenze */}
          {project.reviews?.map(r => (
            <div key={r.id} className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>{r.reviewer?.firstName} {r.reviewer?.lastName}</strong>
                <span className={`badge ${r.overallRecommendation === 'APPROVE' ? 'badge-success' : r.overallRecommendation === 'REJECT' ? 'badge-danger' : 'badge-warning'}`}>
                  {r.overallRecommendation}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                {r.statuteCompliance && <div>Soulad se stanovami: {r.statuteCompliance}/5</div>}
                {r.publicBenefit && <div>Veřejný přínos: {r.publicBenefit}/5</div>}
                {r.feasibility && <div>Reálnost: {r.feasibility}/5</div>}
                {r.budgetAdequacy && <div>Přiměřenost rozpočtu: {r.budgetAdequacy}/5</div>}
                {r.sustainability && <div>Udržitelnost: {r.sustainability}/5</div>}
                {r.technicalFeasibility && <div>Technická proveditelnost: {r.technicalFeasibility}/5</div>}
                {r.conflictRisk && <div>Riziko konfliktu: {r.conflictRisk}/5</div>}
              </div>
              {r.notes && <p style={{ marginTop: 8, fontSize: '0.9rem' }}>{r.notes}</p>}
            </div>
          ))}

          {/* Nová recenze */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Nová recenze</h3>
            <form onSubmit={submitReview}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  ['statuteCompliance', 'Soulad se stanovami'],
                  ['publicBenefit', 'Veřejný přínos'],
                  ['feasibility', 'Reálnost'],
                  ['budgetAdequacy', 'Přiměřenost rozpočtu'],
                  ['sustainability', 'Udržitelnost'],
                  ['technicalFeasibility', 'Technická proveditelnost'],
                  ['conflictRisk', 'Riziko konfliktu'],
                ].map(([key, label]) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label} (1-5)</label>
                    <input type="number" className="form-input" min="1" max="5" value={review[key]} onChange={e => setReview(r => ({ ...r, [key]: parseInt(e.target.value) }))} />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Doporučení</label>
                <select className="form-select" value={review.overallRecommendation} onChange={e => setReview(r => ({ ...r, overallRecommendation: e.target.value }))}>
                  <option value="APPROVE">Schválit</option>
                  <option value="REJECT">Zamítnout</option>
                  <option value="NEEDS_MORE_INFO">Potřeba dalších informací</option>
                  <option value="POSTPONE">Odložit</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Poznámky</label>
                <textarea className="form-textarea" value={review.notes} onChange={e => setReview(r => ({ ...r, notes: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary">Uložit recenzi</button>
            </form>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Historie stavů</h3>
          {project.statusHistory?.map(h => (
            <div key={h.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', minWidth: 100 }}>
                {new Date(h.createdAt).toLocaleDateString('cs-CZ')}
              </span>
              {h.fromStatus && <StatusBadge status={h.fromStatus} />}
              {h.fromStatus && <span>→</span>}
              <StatusBadge status={h.toStatus} />
              {h.note && <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>({h.note})</span>}
            </div>
          ))}
        </div>
      )}

      {tab === 'comments' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Komentáře</h3>
          {project.comments?.map(c => (
            <div key={c.id} className={`comment ${c.isHidden ? 'comment-hidden' : ''}`}>
              <div className="comment-header">
                <span className="comment-author">{c.user?.firstName} {c.user?.lastName}</span>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {c.isHidden && <span className="badge badge-danger">Skrytý</span>}
                  <span className="comment-date">{new Date(c.createdAt).toLocaleDateString('cs-CZ')}</span>
                </div>
              </div>
              <div className="comment-content">{c.content}</div>
              <div style={{ marginTop: 8 }}>
                {!c.isHidden ? (
                  <button className="btn btn-sm btn-warning" onClick={async () => {
                    await api.hideComment(c.id, { reason: 'Nevhodný komentář' });
                    load();
                  }}>Skrýt</button>
                ) : (
                  <button className="btn btn-sm btn-secondary" onClick={async () => {
                    await api.unhideComment(c.id);
                    load();
                  }}>Odkrýt</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
