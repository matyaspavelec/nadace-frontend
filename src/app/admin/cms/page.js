'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function AdminCMSPage() {
  const [tab, setTab] = useState('pages');
  const [pages, setPages] = useState([]);
  const [news, setNews] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [editPage, setEditPage] = useState(null);
  const [editNews, setEditNews] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.getAdminPages().then(setPages).catch(() => {});
    api.getNews('limit=50').then(d => setNews(d.articles || [])).catch(() => {});
    api.getDocuments().then(setDocuments).catch(() => {});
  }, []);

  const savePage = async (e) => {
    e.preventDefault();
    try {
      if (editPage.id) {
        await api.updatePage(editPage.id, editPage);
      } else {
        await api.createPage(editPage);
      }
      setMsg('Stránka uložena.');
      setEditPage(null);
      api.getAdminPages().then(setPages);
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  const saveNews = async (e) => {
    e.preventDefault();
    try {
      if (editNews.id) {
        await api.updateNews(editNews.id, editNews);
      } else {
        await api.createNews(editNews);
      }
      setMsg('Článek uložen.');
      setEditNews(null);
      api.getNews('limit=50').then(d => setNews(d.articles || []));
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  const uploadDoc = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', file.name);
    fd.append('isPublished', 'true');
    try {
      await api.uploadDocument(fd);
      setMsg('Dokument nahrán.');
      api.getDocuments().then(setDocuments);
    } catch (err) { setMsg(err.error || 'Chyba.'); }
  };

  return (
    <div>
      <h1 className="page-title">Správa obsahu</h1>

      {msg && <div className="alert alert-info">{msg}</div>}

      <div className="tabs">
        <button className={`tab ${tab === 'pages' ? 'active' : ''}`} onClick={() => setTab('pages')}>Stránky</button>
        <button className={`tab ${tab === 'news' ? 'active' : ''}`} onClick={() => setTab('news')}>Novinky</button>
        <button className={`tab ${tab === 'docs' ? 'active' : ''}`} onClick={() => setTab('docs')}>Dokumenty</button>
      </div>

      {/* STRÁNKY */}
      {tab === 'pages' && !editPage && (
        <div>
          <button className="btn btn-primary btn-sm" style={{ marginBottom: '1rem' }}
            onClick={() => setEditPage({ slug: '', title: '', content: '', isPublished: true, sortOrder: 0 })}>
            + Nová stránka
          </button>
          <div className="card">
            <div className="table-container">
              <table>
                <thead><tr><th>Název</th><th>Slug</th><th>Publikováno</th><th></th></tr></thead>
                <tbody>
                  {pages.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td>{p.slug}</td>
                      <td>{p.isPublished ? <span className="badge badge-success">Ano</span> : <span className="badge badge-gray">Ne</span>}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditPage(p)}>Upravit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'pages' && editPage && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>{editPage.id ? 'Upravit stránku' : 'Nová stránka'}</h3>
          <form onSubmit={savePage}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Název</label>
                <input className="form-input" value={editPage.title} onChange={e => setEditPage(p => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Slug (URL)</label>
                <input className="form-input" value={editPage.slug} onChange={e => setEditPage(p => ({ ...p, slug: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Obsah</label>
              <textarea className="form-textarea" value={editPage.content} onChange={e => setEditPage(p => ({ ...p, content: e.target.value }))} required style={{ minHeight: 200 }} />
            </div>
            <div className="form-group">
              <div className="checkbox-group">
                <input type="checkbox" checked={editPage.isPublished} onChange={e => setEditPage(p => ({ ...p, isPublished: e.target.checked }))} />
                <label>Publikováno</label>
              </div>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary">Uložit</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditPage(null)}>Zrušit</button>
            </div>
          </form>
        </div>
      )}

      {/* NOVINKY */}
      {tab === 'news' && !editNews && (
        <div>
          <button className="btn btn-primary btn-sm" style={{ marginBottom: '1rem' }}
            onClick={() => setEditNews({ title: '', content: '', excerpt: '', isPublished: true })}>
            + Nová novinka
          </button>
          <div className="card">
            <div className="table-container">
              <table>
                <thead><tr><th>Název</th><th>Datum</th><th>Publikováno</th><th></th></tr></thead>
                <tbody>
                  {news.map(n => (
                    <tr key={n.id}>
                      <td style={{ fontWeight: 600 }}>{n.title}</td>
                      <td style={{ fontSize: '0.85rem' }}>{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString('cs-CZ') : '-'}</td>
                      <td>{n.isPublished ? <span className="badge badge-success">Ano</span> : <span className="badge badge-gray">Ne</span>}</td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => setEditNews(n)}>Upravit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'news' && editNews && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>{editNews.id ? 'Upravit novinku' : 'Nová novinka'}</h3>
          <form onSubmit={saveNews}>
            <div className="form-group">
              <label className="form-label">Název</label>
              <input className="form-input" value={editNews.title} onChange={e => setEditNews(n => ({ ...n, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Stručný popis</label>
              <input className="form-input" value={editNews.excerpt || ''} onChange={e => setEditNews(n => ({ ...n, excerpt: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Obsah</label>
              <textarea className="form-textarea" value={editNews.content} onChange={e => setEditNews(n => ({ ...n, content: e.target.value }))} required style={{ minHeight: 200 }} />
            </div>
            <div className="form-group">
              <div className="checkbox-group">
                <input type="checkbox" checked={editNews.isPublished} onChange={e => setEditNews(n => ({ ...n, isPublished: e.target.checked }))} />
                <label>Publikováno</label>
              </div>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary">Uložit</button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditNews(null)}>Zrušit</button>
            </div>
          </form>
        </div>
      )}

      {/* DOKUMENTY */}
      {tab === 'docs' && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="btn btn-primary btn-sm" style={{ cursor: 'pointer' }}>
              + Nahrát dokument
              <input type="file" style={{ display: 'none' }} onChange={uploadDoc} />
            </label>
          </div>
          <div className="card">
            <div className="table-container">
              <table>
                <thead><tr><th>Název</th><th>Typ</th><th>Velikost</th><th>Datum</th><th></th></tr></thead>
                <tbody>
                  {documents.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>{d.title}</td>
                      <td>{d.mimeType}</td>
                      <td>{(d.size / 1024).toFixed(0)} KB</td>
                      <td style={{ fontSize: '0.85rem' }}>{new Date(d.createdAt).toLocaleDateString('cs-CZ')}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={async () => {
                          await api.deleteDocument(d.id);
                          setDocuments(docs => docs.filter(x => x.id !== d.id));
                          setMsg('Dokument smazán.');
                        }}>Smazat</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
