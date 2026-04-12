'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { PROJECT_CATEGORIES, BUDGET_SIZES } from '@/lib/constants';

export default function NewProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', summary: '', description: '', benefitForCity: '',
    realizationDate: '', isLongTerm: false,
    publicInterest: true,
    category: 'OTHER', budgetSize: 'MEDIUM', declaration: false,
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  if (!loading && (!user || user.registrationStatus !== 'APPROVED')) {
    return (
      <div className="page-container">
        <div className="alert alert-warning">Pro podání projektu musíte mít schválený účet.</div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.declaration) return setError('Musíte potvrdit čestné prohlášení.');
    setError('');
    setSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      files.forEach(f => fd.append('attachments', f));
      const res = await api.submitProject(fd);
      router.push(`/projekty/${res.projectId}`);
    } catch (err) {
      setError(err.error || err.errors?.map(e => e.msg).join(', ') || 'Chyba při podávání.');
    }
    setSubmitting(false);
  };

  return (
    <div className="page-container" style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 className="page-title">Podat návrh projektu</h1>
      <p className="page-subtitle">Vyplňte formulář pro podání veřejně prospěšného projektu.</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Základní informace</h3>

          <div className="form-group">
            <label className="form-label">Název projektu *</label>
            <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Stručné shrnutí *</label>
            <textarea className="form-textarea" value={form.summary} onChange={e => set('summary', e.target.value)} required style={{ minHeight: 60 }} />
          </div>

          <div className="form-group">
            <label className="form-label">Podrobný popis *</label>
            <textarea className="form-textarea" value={form.description} onChange={e => set('description', e.target.value)} required style={{ minHeight: 150 }} />
          </div>

          <div className="form-group">
            <label className="form-label">Přínos pro Vyšší Brod *</label>
            <textarea className="form-textarea" value={form.benefitForCity} onChange={e => set('benefitForCity', e.target.value)} required style={{ minHeight: 80 }} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kategorie</label>
              <select className="form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                {Object.entries(PROJECT_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Velikost projektu</label>
              <select className="form-select" value={form.budgetSize} onChange={e => set('budgetSize', e.target.value)}>
                {Object.entries(BUDGET_SIZES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Rozpočet a realizace</h3>

          <div className="form-group">
            <label className="form-label">Termín realizace *</label>
            <input className="form-input" value={form.realizationDate} onChange={e => set('realizationDate', e.target.value)} required placeholder="např. jaro 2027" />
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input type="checkbox" id="longterm" checked={form.isLongTerm} onChange={e => set('isLongTerm', e.target.checked)} />
              <label htmlFor="longterm">Projekt má dlouhodobý charakter</label>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Přílohy</h3>
          <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.gif,.xlsx,.docx"
            onChange={e => setFiles(Array.from(e.target.files))} />
          <span className="form-hint">PDF, obrázky, XLSX, DOCX. Max 10 MB na soubor.</span>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="checkbox-group">
            <input type="checkbox" id="declaration" checked={form.declaration} onChange={e => set('declaration', e.target.checked)} />
            <label htmlFor="declaration" style={{ fontWeight: 600 }}>
              Čestně prohlašuji, že všechny uvedené údaje jsou pravdivé a úplné. *
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Odesílání...' : 'Podat návrh projektu'}
        </button>
      </form>
    </div>
  );
}
