import React from 'react';
import { useParams, Link } from 'react-router-dom';
import projectsData from '../../content/projects.json';
import { ArrowLeft, CheckCircle2, Layers, Cpu, Target } from 'lucide-react';

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projectsData.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
        <p className="text-theme-muted mb-8">The case study you are looking for does not exist or has been removed.</p>
        <Link to="/" className="px-6 py-3 bg-theme-accent text-white rounded-full text-sm font-medium">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-theme-muted hover:text-theme-text mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to projects
      </Link>

      {/* Header */}
      <header className="mb-12 border-b border-theme-border pb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-theme-accent/10 text-theme-accent">
            {project.category}
          </span>
          <span className="text-sm text-theme-muted">{project.year}</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-theme-text mb-6">
          {project.title}
        </h1>
        <p className="text-xl text-theme-muted leading-relaxed">
          {project.shortDescription}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-theme-border text-sm">
          <div>
            <span className="block text-theme-muted text-xs uppercase font-mono">Role</span>
            <span className="font-semibold text-theme-text">{project.role}</span>
          </div>
          <div>
            <span className="block text-theme-muted text-xs uppercase font-mono">Client / Context</span>
            <span className="font-semibold text-theme-text">{project.title}</span>
          </div>
          <div>
            <span className="block text-theme-muted text-xs uppercase font-mono">Timeline</span>
            <span className="font-semibold text-theme-text">{project.year}</span>
          </div>
        </div>
      </header>

      {/* Content Sections */}
      <div className="space-y-12">
        <section className="bg-theme-card border border-theme-border p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-theme-accent" /> Project Overview
          </h2>
          <p className="text-theme-muted leading-relaxed text-lg">
            {project.overview}
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-theme-card border border-theme-border p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-red-500">The Problem</h2>
            <p className="text-theme-muted leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div className="bg-theme-card border border-theme-border p-8 rounded-xl">
            <h2 className="text-xl font-bold mb-4 text-emerald-500">The Solution</h2>
            <p className="text-theme-muted leading-relaxed">
              {project.solution}
            </p>
          </div>
        </div>

        <section className="bg-theme-card border border-theme-border p-8 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-theme-accent" /> Impact & Results
          </h2>
          <p className="text-theme-muted leading-relaxed text-lg font-medium text-theme-text">
            {project.impact}
          </p>
        </section>

        <section className="border-t border-theme-border pt-8 flex flex-wrap gap-2">
          {project.tags.map((tag, i) => (
            <span key={i} className="px-3 py-1 rounded-full text-xs font-mono bg-theme-card border border-theme-border text-theme-muted">
              #{tag}
            </span>
          ))}
        </section>
      </div>
    </article>
  );
}
