import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projRes = await fetch('/api/projects');
      if (projRes.ok) setProjects(await projRes.json());

      const expRes = await fetch('/api/experience');
      if (expRes.ok) setExperience(await expRes.json());
    } catch (err) {
      console.error('Error fetching content:', err);
      // Fallback to local import if server is not running
      import('../../content/projects.json').then(m => setProjects(m.default));
      import('../../content/experience.json').then(m => setExperience(m.default));
    }
  };

  const handleSaveProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projects)
      });
      if (res.ok) {
        setStatusMessage('Projects saved successfully!');
        setTimeout(() => setStatusMessage(''), 3000);
      } else {
        throw new Error('Failed to save projects');
      }
    } catch (err) {
      setError('Admin server not running. Start with `npm run admin` to persist changes.');
      setTimeout(() => setError(''), 5000);
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
      status: 'draft'
    };
    setProjects([newProj, ...projects]);
  };

  const handleDeleteProject = (slug) => {
    setProjects(projects.filter(p => p.slug !== slug));
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-theme-border">
        <div>
          <h1 className="text-3xl font-bold text-theme-text">Local Content Admin Panel</h1>
          <p className="text-sm text-theme-muted mt-1">Manage your portfolio projects, case studies, and experience without editing source code.</p>
        </div>
        <button
          onClick={handleSaveProjects}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-theme-accent text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {statusMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5" /> {statusMessage}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-theme-border">
        <button
          onClick={() => setActiveTab('projects')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'projects'
              ? 'border-theme-accent text-theme-text'
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          Projects ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'experience'
              ? 'border-theme-accent text-theme-text'
              : 'border-transparent text-theme-muted hover:text-theme-text'
          }`}
        >
          Experience ({experience.length})
        </button>
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
                      className="text-red-500 hover:opacity-80 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <label className="block text-xs font-mono text-theme-muted mb-1">Company</label>
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
                    <label className="block text-xs font-mono text-theme-muted mb-1">Client / Project</label>
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
