import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Lock, Unlock, KeyRound, LogOut, Eye, EyeOff, Upload } from 'lucide-react';
import { apiFetch, getSession, login, logout } from '../lib/api';

const listToText = (items) => (Array.isArray(items) ? items.join('\n') : '');
const textToList = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const decisionsToText = (items) =>
  (Array.isArray(items) ? items : []).map((d) => `${d.title} || ${d.body}`).join('\n');
const textToDecisions = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split('||');
      return { title: title.trim(), body: rest.join('||').trim() };
    });

const visualsToText = (items) =>
  (Array.isArray(items) ? items : []).map((v) => `${v.id} || ${v.label || ''} || ${v.caption || ''} || ${v.src || ''} || ${v.alt || ''}`).join('\n');
const textToVisuals = (items, text) => {
  const previous = new Map((items || []).map((v) => [v.id, v]));
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, ...rest] = line.split('||');
      const [label, caption, source, alt] = rest;
      const key = id.trim();
      const src = (source || '').trim();
      return {
        ...(previous.get(key) || {}),
        id: key,
        label: (label || '').trim(),
        caption: (caption || '').trim(),
        src: src || undefined,
        alt: (alt || '').trim() || undefined,
        type: src ? 'image' : undefined,
      };
    });
};

const field = 'w-full text-sm bg-theme-bg border border-theme-border rounded p-2';
const label = 'block text-xs font-mono text-theme-muted mb-1';

function ProjectContextFields({ project, onChange }) {
  const textFields = [
    ['projectTimeline', 'Project timeline (dates or duration)'],
    ['teamSize', 'Team size'],
    ['teamComposition', 'Team roles and composition'],
    ['roleScope', 'My exact role and ownership'],
    ['designApproach', 'Design approach'],
    ['designSystem', 'Design system or component library used'],
    ['developerCollaboration', 'How I worked with developers'],
    ['stakeholderCollaboration', 'How I worked with stakeholders'],
  ];

  return (
    <div className="space-y-4 border-t border-theme-border pt-4">
      <h5 className="text-sm font-semibold text-theme-text">Project context</h5>
      <p className="text-xs text-theme-muted">Only confirmed details appear on the case study. Leave unknown fields blank.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {textFields.map(([key, title]) => (
          <div key={key} className={key === 'projectTimeline' || key === 'teamSize' ? '' : 'sm:col-span-2'}>
            <label className={label} htmlFor={`${project.slug}-${key}`}>{title}</label>
            {key === 'projectTimeline' || key === 'teamSize' ? (
              <input id={`${project.slug}-${key}`} className={field} value={project[key] || ''} onChange={(e) => onChange(key, e.target.value)} />
            ) : (
              <textarea id={`${project.slug}-${key}`} className={`${field} h-20`} value={project[key] || ''} onChange={(e) => onChange(key, e.target.value)} />
            )}
          </div>
        ))}
        <div>
          <label className={label} htmlFor={`${project.slug}-design-contribution`}>Share of design work (%)</label>
          <input id={`${project.slug}-design-contribution`} type="text" inputMode="decimal" className={field}
            value={project.designContributionPercent ?? ''}
            onChange={(e) => onChange('designContributionPercent', e.target.value)} placeholder="e.g. 75 or 90–100" />
        </div>
        <div>
          <label className={label} htmlFor={`${project.slug}-design-contribution-basis`}>What the percentage covers</label>
          <input id={`${project.slug}-design-contribution-basis`} className={field} value={project.designContributionBasis || ''}
            onChange={(e) => onChange('designContributionBasis', e.target.value)} placeholder="e.g. UX and UI design across the release" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs text-theme-muted">
        <input type="checkbox" checked={!!project.designContributionEstimate}
          onChange={(e) => onChange('designContributionEstimate', e.target.checked)} />
        Mark this percentage as an estimate
      </label>
    </div>
  );
}

function LockedEditor({ project, onSave, onClose, saving }) {
  const [draft, setDraft] = useState(project);

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  return (
    <div className="bg-theme-bg border border-theme-border rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-bold text-theme-text">Editing protected case study: {project.slug}</h4>
        <button onClick={onClose} className="text-xs font-mono text-theme-muted hover:text-theme-text">
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>Title (visible after unlock)</label>
          <input className={field} value={draft.title || ''} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div>
          <label className={label}>Client</label>
          <input className={field} value={draft.client || ''} onChange={(e) => set('client', e.target.value)} />
        </div>
        <div>
          <label className={label}>Category</label>
          <input className={field} value={draft.category || ''} onChange={(e) => set('category', e.target.value)} />
        </div>
        <div>
          <label className={label}>Role</label>
          <input className={field} value={draft.role || ''} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div>
          <label className={label}>Year</label>
          <input className={field} value={draft.year || ''} onChange={(e) => set('year', e.target.value)} />
        </div>
        <div>
          <label className={label}>Tags (comma separated)</label>
          <input
            className={field}
            value={(draft.tags || []).join(', ')}
            onChange={(e) => set('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
          />
        </div>
      </div>

      <div>
        <label className={label}>Short description</label>
        <textarea className={`${field} h-20`} value={draft.shortDescription || ''} onChange={(e) => set('shortDescription', e.target.value)} />
      </div>

      {[
        ['overview', 'Overview'],
        ['problem', 'The problem'],
        ['solution', 'What I designed'],
        ['impact', 'Outcome'],
        ['systemsWork', 'Systems thinking'],
        ['explainShort', 'How I explain this'],
      ].map(([key, text]) => (
        <div key={key}>
          <label className={label}>{text}</label>
          <textarea className={`${field} h-24`} value={draft[key] || ''} onChange={(e) => set(key, e.target.value)} />
        </div>
      ))}

      <ProjectContextFields project={draft} onChange={set} />

      <div>
        <label className={label}>Visuals section heading</label>
        <input
          className={field}
          value={draft.visualsTitle || ''}
          onChange={(e) => set('visualsTitle', e.target.value)}
          placeholder="The work, drawn"
        />
      </div>

      <div>
        <label className={label}>Visuals — one per line, as "id || label || caption"</label>
        <textarea
          className={`${field} h-28 font-mono`}
          value={visualsToText(draft.visuals)}
          onChange={(e) => set('visuals', textToVisuals(draft.visuals, e.target.value))}
        />
        <p className="text-xs text-theme-muted mt-1 leading-relaxed">
          The id must match a visual registered in the case study visuals file. Leaving this empty removes the
          visuals section.
        </p>
      </div>

      <div>
        <label className={label}>My role — one point per line</label>
        <textarea
          className={`${field} h-32`}
          value={listToText(draft.contributions)}
          onChange={(e) => set('contributions', textToList(e.target.value))}
        />
      </div>

      <div>
        <label className={label}>Key design decisions — one per line, as "Title || Body"</label>
        <textarea
          className={`${field} h-32`}
          value={decisionsToText(draft.decisions)}
          onChange={(e) => set('decisions', textToDecisions(e.target.value))}
        />
      </div>

      <div>
        <label className={label}>Outcome points — one per line</label>
        <textarea
          className={`${field} h-24`}
          value={listToText(draft.outcomes)}
          onChange={(e) => set('outcomes', textToList(e.target.value))}
        />
      </div>

      <button
        onClick={() => onSave(draft)}
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60"
      >
        <Save className="w-4 h-4" /> Save protected case study
      </button>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [serverError, setServerError] = useState('');

  const [activeTab, setActiveTab] = useState(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    return ['projects', 'experience', 'about', 'access'].includes(tab) ? tab : 'projects';
  });
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [aboutContent, setAboutContent] = useState(null);
  const [lockedProjects, setLockedProjects] = useState([]);
  const [lockStatus, setLockStatus] = useState({ hasKey: false, updatedAt: null, lockedSlugs: [] });
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [newKey, setNewKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [importText, setImportText] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');

  useEffect(() => {
    getSession()
      .then((s) => setSession(!!s.admin))
      .catch((err) => {
        setSession(false);
        setServerError(err.message);
      });
  }, []);

  const loadData = async () => {
    try {
      const [proj, exp, about, locked, status] = await Promise.all([
        apiFetch('/projects'),
        apiFetch('/experience'),
        apiFetch('/about'),
        apiFetch('/private/projects'),
        apiFetch('/lock/status'),
      ]);
      setProjects(proj);
      setExperience(exp);
      setAboutContent(about);
      setLockedProjects(locked);
      setLockStatus(status);
      setServerError('');
    } catch (err) {
      setServerError(err.message);
    }
  };

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  const flash = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const fail = (err) => {
    setError(err.message);
    setTimeout(() => setError(''), 5000);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSigningIn(true);
    setAuthError('');
    try {
      await login(password);
      setPassword('');
      setSession(true);
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch {
      /* the local session is dropped either way */
    }
    setSession(false);
    setActiveTab('projects');
  };

  const saveProjects = async () => {
    setSaving(true);
    try {
      await apiFetch('/projects', { method: 'POST', body: JSON.stringify(projects) });
      flash('Projects saved.');
      loadData();
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const saveExperience = async () => {
    setSaving(true);
    try {
      await apiFetch('/experience', { method: 'POST', body: JSON.stringify(experience) });
      flash('Experience saved.');
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    setSaving(true);
    try {
      await apiFetch('/about', { method: 'POST', body: JSON.stringify(aboutContent) });
      flash('About content saved.');
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const setLock = async (slug, locked) => {
    try {
      await apiFetch(`/private/projects/${slug}/lock`, { method: locked ? 'POST' : 'DELETE' });
      flash(locked ? `${slug} is now protected.` : `${slug} is now public.`);
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const saveLockedProject = async (draft) => {
    setSaving(true);
    try {
      await apiFetch(`/private/projects/${draft.slug}`, { method: 'PUT', body: JSON.stringify(draft) });
      flash('Protected case study saved.');
      setEditingSlug(null);
      loadData();
    } catch (err) {
      fail(err);
    } finally {
      setSaving(false);
    }
  };

  const saveKey = async () => {
    try {
      await apiFetch('/lock/key', { method: 'POST', body: JSON.stringify({ key: newKey }) });
      setNewKey('');
      flash('Access key updated.');
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const clearKey = async () => {
    try {
      await apiFetch('/lock/key', { method: 'DELETE' });
      flash('Access key cleared. Protected case studies are unreachable until a new key is set.');
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const importPrivate = async () => {
    try {
      const parsed = JSON.parse(importText);
      await apiFetch('/private/projects/import', { method: 'POST', body: JSON.stringify(parsed) });
      setImportText('');
      flash('Protected case studies imported.');
      loadData();
    } catch (err) {
      fail(err);
    }
  };

  const exportPrivate = async () => {
    try {
      const data = await apiFetch('/private/projects');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'protected-case-studies.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      fail(err);
    }
  };

  const changePassword = async () => {
    try {
      await apiFetch('/admin/password', {
        method: 'POST',
        body: JSON.stringify({ current: currentPassword, next: nextPassword }),
      });
      setCurrentPassword('');
      setNextPassword('');
      flash('Admin password changed.');
    } catch (err) {
      fail(err);
    }
  };

  const handleAddProject = () => {
    const newProj = {
      slug: `project-${Date.now()}`,
      title: 'New Project',
      category: 'SaaS',
      role: 'Lead Designer',
      year: '2026',
      shortDescription: 'Project short description goes here.',
      overview: 'Project overview...',
      problem: 'Problem statement...',
      solution: 'Solution details...',
      impact: 'Quantifiable impact...',
      tags: ['SaaS', 'UI/UX'],
      status: 'draft',
    };
    setProjects([newProj, ...projects]);
  };

  const handleDeleteProject = (slug) => {
    setProjects(projects.filter(p => p.slug !== slug));
  };

  if (session === null) {
    return <div className="max-w-5xl mx-auto px-6 py-12 text-sm font-mono text-theme-muted">Checking session…</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-theme-text mb-2">Admin dashboard</h1>
        <p className="text-theme-muted text-sm mb-8">Sign in to manage portfolio content, the access key, and protected case studies.</p>

        {serverError && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm leading-relaxed">
            The content server is not reachable: {serverError}
            <br />
            <span className="text-xs">Start it with `npm run admin`, or point public/api-config.json at the hosted server.</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4 bg-theme-card border border-theme-border rounded-xl p-6">
          <div>
            <label className={label} htmlFor="admin-login-password">Admin password</label>
            <input
              id="admin-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className={field}
            />
          </div>
          {authError && <p role="alert" className="text-sm text-red-500">{authError}</p>}
          <button
            type="submit"
            disabled={signingIn || !password}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60"
          >
            <KeyRound className="w-4 h-4" /> {signingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-theme-border">
        <div>
          <h1 className="text-3xl font-bold text-theme-text">Content Admin Panel</h1>
          <p className="text-sm text-theme-muted mt-1">Manage projects, experience, and access control for protected case studies.</p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'projects' && (
            <button
              onClick={saveProjects}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60 transition-opacity shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          )}
          {activeTab === 'experience' && (
            <button
              onClick={saveExperience}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60 transition-opacity shadow-sm"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          )}
          {activeTab === 'about' && (
            <button onClick={saveAbout} disabled={saving || !aboutContent} className="inline-flex items-center gap-2 px-6 py-2.5 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          )}
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-theme-border rounded-full text-sm font-medium hover:border-theme-accent transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {statusMessage && (
        <div role="status" className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5" /> {statusMessage}
        </div>
      )}

      {error && (
        <div role="alert" className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-theme-border overflow-x-auto" role="tablist" aria-label="Admin sections">
        {[
          ['projects', `Projects (${projects.length})`],
          ['experience', `Experience (${experience.length})`],
          ['about', 'About'],
          ['access', 'Access Control'],
        ].map(([key, text]) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => {
              setActiveTab(key);
              window.history.replaceState(null, '', `?tab=${key}`);
            }}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === key
                ? 'border-theme-accent text-theme-text'
                : 'border-transparent text-theme-muted hover:text-theme-text'
            }`}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Projects Editor Tab */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-theme-text">Portfolio Projects</h2>
            <button
              onClick={handleAddProject}
              className="inline-flex items-center gap-2 px-4 py-2 border border-theme-border rounded-full text-xs font-medium hover:border-theme-accent transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          <div className="space-y-6">
            {projects.map((proj, idx) => (
              <div key={proj.slug || idx} className="bg-theme-card border border-theme-border p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].title = e.target.value;
                      setProjects(updated);
                    }}
                    className="text-lg font-bold bg-transparent border-b border-theme-border focus:border-theme-accent outline-none pb-1 w-full"
                    placeholder="Project Title"
                  />
                  <div className="flex items-center gap-3">
                    {proj.locked && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-theme-border text-theme-muted text-xs font-mono">
                        <Lock className="w-3 h-3" /> Protected
                      </span>
                    )}
                    <select
                      value={proj.status}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].status = e.target.value;
                        setProjects(updated);
                      }}
                      className="text-xs font-mono bg-theme-bg border border-theme-border rounded px-2 py-1"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                    <button
                      onClick={() => handleDeleteProject(proj.slug)}
                      aria-label={`Delete ${proj.title}`}
                      className="text-red-500 hover:opacity-80 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {proj.locked && (
                  <p className="text-xs text-theme-muted leading-relaxed">
                    This is the public listing only. The case study body lives in Access Control, and the title above is
                    what the public sees.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={proj.category}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].category = e.target.value;
                      setProjects(updated);
                    }}
                    className="text-xs bg-theme-bg border border-theme-border rounded p-2"
                    placeholder="Category"
                  />
                  <input
                    type="text"
                    value={proj.role}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].role = e.target.value;
                      setProjects(updated);
                    }}
                    className="text-xs bg-theme-bg border border-theme-border rounded p-2"
                    placeholder="Role"
                  />
                  <input
                    type="text"
                    value={proj.year}
                    onChange={(e) => {
                      const updated = [...projects];
                      updated[idx].year = e.target.value;
                      setProjects(updated);
                    }}
                    className="text-xs bg-theme-bg border border-theme-border rounded p-2"
                    placeholder="Year"
                  />
                  <label className="flex items-center gap-2 text-xs text-theme-muted">
                    <input
                      type="checkbox"
                      checked={!!proj.isFeatured}
                      onChange={(e) => {
                        const updated = [...projects];
                        updated[idx].isFeatured = e.target.checked;
                        setProjects(updated);
                      }}
                      className="accent-current"
                    />
                    Featured
                  </label>
                </div>

                <textarea
                  value={proj.shortDescription}
                  onChange={(e) => {
                    const updated = [...projects];
                    updated[idx].shortDescription = e.target.value;
                    setProjects(updated);
                  }}
                  className="w-full text-sm bg-theme-bg border border-theme-border rounded p-2 h-20"
                  placeholder="Short description..."
                />

                {!proj.locked && (
                  <details className="border-t border-theme-border pt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-theme-text">Edit case study</summary>
                    <div className="space-y-4 mt-4">
                      {[
                        ['overview', 'Overview'], ['problem', 'The problem'],
                        ['solution', 'What I designed'], ['impact', 'Outcome'],
                        ['systemsWork', 'Systems thinking'], ['explainShort', 'How I explain this'],
                      ].map(([key, name]) => (
                        <div key={key}>
                          <label className={label} htmlFor={`${proj.slug}-${key}`}>{name}</label>
                          <textarea id={`${proj.slug}-${key}`} className={`${field} h-28`}
                            value={proj[key] || ''}
                            onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, [key]: e.target.value } : item))} />
                        </div>
                      ))}
                      <ProjectContextFields project={proj} onChange={(key, value) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, [key]: value } : item))} />
                      <div>
                        <label className={label} htmlFor={`${proj.slug}-contributions`}>My role — one point per line</label>
                        <textarea id={`${proj.slug}-contributions`} className={`${field} h-28`}
                          value={listToText(proj.contributions)}
                          onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, contributions: textToList(e.target.value) } : item))} />
                      </div>
                      <div>
                        <label className={label} htmlFor={`${proj.slug}-decisions`}>Design decisions — Title || Body per line</label>
                        <textarea id={`${proj.slug}-decisions`} className={`${field} h-28`}
                          value={decisionsToText(proj.decisions)}
                          onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, decisions: textToDecisions(e.target.value) } : item))} />
                      </div>
                      <div>
                        <label className={label} htmlFor={`${proj.slug}-outcomes`}>Outcome points — one per line</label>
                        <textarea id={`${proj.slug}-outcomes`} className={`${field} h-28`}
                          value={listToText(proj.outcomes)}
                          onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, outcomes: textToList(e.target.value) } : item))} />
                      </div>
                      <div>
                        <label className={label} htmlFor={`${proj.slug}-visuals-title`}>Visuals section heading</label>
                        <input id={`${proj.slug}-visuals-title`} className={field} value={proj.visualsTitle || ''}
                          onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, visualsTitle: e.target.value } : item))} />
                      </div>
                      <div>
                        <label className={label} htmlFor={`${proj.slug}-cover-image`}>Card image path</label>
                        <input id={`${proj.slug}-cover-image`} className={field} value={proj.coverImage || ''}
                          onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, coverImage: e.target.value } : item))} />
                      </div>
                      <div>
                        <label className={label} htmlFor={`${proj.slug}-cover-alt`}>Card image alt text</label>
                        <input id={`${proj.slug}-cover-alt`} className={field} value={proj.coverAlt || ''}
                          onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, coverAlt: e.target.value } : item))} />
                      </div>
                      <div>
                        <label className={label} htmlFor={`${proj.slug}-visuals`}>Visuals — id || label || caption || image path || alt text per line</label>
                        <textarea id={`${proj.slug}-visuals`} className={`${field} h-28 font-mono`}
                          value={visualsToText(proj.visuals)}
                          onChange={(e) => setProjects((items) => items.map((item, i) => i === idx ? { ...item, visuals: textToVisuals(item.visuals, e.target.value) } : item))} />
                        <p className="text-xs text-theme-muted mt-1">For Figma exports, use an image path such as images/sitara-dashboard-figma.png and describe the screen in alt text. Leave the image path blank for registered illustrations.</p>
                      </div>
                    </div>
                  </details>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setLock(proj.slug, !proj.locked)}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-theme-border rounded-full text-xs font-medium hover:border-theme-accent transition-colors"
                  >
                    {proj.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {proj.locked ? 'Make public' : 'Protect with key'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Editor Tab */}
      {activeTab === 'experience' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-theme-text">Professional Experience Entries</h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="bg-theme-card border border-theme-border p-6 rounded-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].company = e.target.value;
                        setExperience(updated);
                      }}
                      className="w-full text-sm bg-theme-bg border border-theme-border rounded p-2"
                    />
                  </div>
                  <div>
                    <label className={label}>Client / Project</label>
                    <input
                      type="text"
                      value={exp.client || ''}
                      onChange={(e) => {
                        const updated = [...experience];
                        updated[idx].client = e.target.value;
                        setExperience(updated);
                      }}
                      className="w-full text-sm bg-theme-bg border border-theme-border rounded p-2"
                    />
                  </div>
                </div>
                {[
                  ['role', 'Role'], ['period', 'Period'], ['location', 'Location'],
                ].map(([key, name]) => (
                  <div key={key}>
                    <label className={label} htmlFor={`experience-${idx}-${key}`}>{name}</label>
                    <input id={`experience-${idx}-${key}`} className={field} value={exp[key] || ''}
                      onChange={(e) => setExperience((items) => items.map((item, i) => i === idx ? { ...item, [key]: e.target.value } : item))} />
                  </div>
                ))}
                <div>
                  <label className={label} htmlFor={`experience-${idx}-highlights`}>Highlights — one per line</label>
                  <textarea id={`experience-${idx}-highlights`} className={`${field} h-28`}
                    value={listToText(exp.highlights)}
                    onChange={(e) => setExperience((items) => items.map((item, i) => i === idx ? { ...item, highlights: textToList(e.target.value) } : item))} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'about' && aboutContent && (
        <div className="space-y-5 bg-theme-card border border-theme-border p-6 rounded-xl">
          <h2 className="text-xl font-bold text-theme-text">Homepage and About</h2>
          {[
            ['hero', 'greeting', 'Greeting'], ['hero', 'title', 'Title'],
            ['hero', 'subtitle', 'Subtitle'], ['hero', 'experienceYears', 'Years of experience'],
            ['hero', 'studentsMentored', 'Students mentored'],
            ['about', 'summary', 'About summary'], ['about', 'location', 'Location'],
          ].map(([group, key, name]) => (
            <div key={`${group}-${key}`}>
              <label className={label} htmlFor={`about-${group}-${key}`}>{name}</label>
              {key === 'summary' || key === 'subtitle' ? (
                <textarea id={`about-${group}-${key}`} className={`${field} h-28`} value={aboutContent[group]?.[key] || ''}
                  onChange={(e) => setAboutContent((data) => ({ ...data, [group]: { ...data[group], [key]: e.target.value } }))} />
              ) : (
                <input id={`about-${group}-${key}`} className={field} value={aboutContent[group]?.[key] || ''}
                  onChange={(e) => setAboutContent((data) => ({ ...data, [group]: { ...data[group], [key]: e.target.value } }))} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Access Control Tab */}
      {activeTab === 'access' && (
        <div className="space-y-10">
          <section className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-theme-text">Access key</h2>
            <p className="text-sm text-theme-muted leading-relaxed">
              One key unlocks every protected case study. It is stored hashed on the server — the plain key is never
              written to disk after you save it.
            </p>
            <p className="text-sm text-theme-muted">
              Status:{' '}
              <span className="font-mono text-theme-text">
                {lockStatus.hasKey ? 'key set' : 'no key set — protected case studies are unreachable'}
              </span>
              {lockStatus.updatedAt && <span className="text-xs"> · last changed {new Date(lockStatus.updatedAt).toLocaleString()}</span>}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  aria-label="New access key"
                  type={showKey ? 'text' : 'password'}
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="New access key (16+ characters)"
                  className={field}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  aria-label={showKey ? 'Hide access key' : 'Show access key'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={saveKey}
                disabled={newKey.length < 16}
                className="px-5 py-2 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60"
              >
                Save key
              </button>
              {lockStatus.hasKey && (
                <button
                  onClick={clearKey}
                  className="px-5 py-2 border border-theme-border rounded-full text-sm font-medium hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  Clear key
                </button>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-theme-text">Protected case studies</h2>
              {lockedProjects.length > 0 && (
                <button
                  onClick={exportPrivate}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-theme-border rounded-full text-xs font-medium hover:border-theme-accent transition-colors"
                >
                  <Save className="w-3.5 h-3.5" /> Export a backup
                </button>
              )}
            </div>
            {lockedProjects.length === 0 && (
              <p className="text-sm text-theme-muted">
                Nothing is protected yet. Use “Protect with key” in the Projects tab, or import an existing set below.
              </p>
            )}
            {lockedProjects.map((project) => (
              <div key={project.slug} className="bg-theme-card border border-theme-border p-6 rounded-xl space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-theme-text">{project.title}</h3>
                    <span className="text-xs font-mono text-theme-muted">{project.slug}</span>
                  </div>
                  <button
                    onClick={() => setEditingSlug(editingSlug === project.slug ? null : project.slug)}
                    className="px-4 py-2 border border-theme-border rounded-full text-xs font-medium hover:border-theme-accent transition-colors"
                  >
                    {editingSlug === project.slug ? 'Close editor' : 'Edit content'}
                  </button>
                </div>
                {editingSlug === project.slug && (
                  <LockedEditor
                    project={project}
                    saving={saving}
                    onSave={saveLockedProject}
                    onClose={() => setEditingSlug(null)}
                  />
                )}
              </div>
            ))}
          </section>

          <section className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-theme-text">Import protected case studies</h2>
            <p className="text-sm text-theme-muted leading-relaxed">
              Paste a JSON array of full case studies to replace the protected set on this server. Use this to seed a
              freshly hosted server with the content it does not have yet, or to restore a server whose disk was
              reset. “Export a backup” above produces the same JSON.
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='[{"slug":"…","title":"…","overview":"…"}]'
              className="w-full font-mono text-xs bg-theme-bg border border-theme-border rounded p-3 h-32"
            />
            <button
              onClick={importPrivate}
              disabled={!importText.trim()}
              className="inline-flex items-center gap-2 px-5 py-2 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60"
            >
              <Upload className="w-4 h-4" /> Import
            </button>
          </section>

          <section className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-theme-text">Admin password</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={field}
                />
              </div>
              <div>
                <label className={label}>New password (8+ characters)</label>
                <input
                  type="password"
                  value={nextPassword}
                  onChange={(e) => setNextPassword(e.target.value)}
                  className={field}
                />
              </div>
            </div>
            <button
              onClick={changePassword}
              disabled={!currentPassword || nextPassword.length < 8}
              className="px-5 py-2 bg-theme-accent text-white rounded-full text-sm font-medium disabled:opacity-60"
            >
              Change password
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
