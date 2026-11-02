import React, { useEffect, useState } from 'react';
import { getAbout, getExperience } from '../lib/api';
import { Briefcase, GraduationCap, Blocks, MapPin, Download } from 'lucide-react';

export default function About() {
  const [aboutContent, setAboutContent] = useState(null);
  const [experience, setExperience] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [expandedExperience, setExpandedExperience] = useState({});
  const [expandedSkills, setExpandedSkills] = useState({});

  useEffect(() => {
    let active = true;
    Promise.all([getAbout(), getExperience()])
      .then(([aboutData, experienceData]) => {
        if (!active) return;
        if (!aboutData?.about || !aboutData?.hero || !Array.isArray(experienceData)) throw new Error('Invalid portfolio content');
        setAboutContent(aboutData);
        setExperience(experienceData);
      })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, []);

  if (loadError) return <div role="alert" className="max-w-4xl mx-auto px-6 py-24 text-center text-theme-muted">About content is temporarily unavailable. Please try again shortly.</div>;
  if (!aboutContent || !experience) return <div className="max-w-4xl mx-auto px-6 py-24 text-center text-theme-muted">Loading About…</div>;
  const { about } = aboutContent;
  const resumeUrl = (() => {
    try {
      const url = new URL(about.resumeUrl);
      return url.protocol === 'https:' ? url.href : '';
    } catch {
      return '';
    }
  })();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-theme-text mb-6">
          About Me & Experience
        </h1>
        <p className="text-xl text-theme-muted leading-relaxed">
          {about.summary}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-theme-muted font-mono">
            <MapPin className="w-4 h-4 text-theme-accent" aria-hidden="true" /> {about.location}
          </div>
          {resumeUrl && (
            <a href={resumeUrl} download="Harikrishna-Raju-Resume.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 bg-theme-accent text-white rounded-full text-sm font-medium hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent">
              <Download className="w-4 h-4" aria-hidden="true" /> Download résumé (PDF)
            </a>
          )}
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-theme-text mb-8 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-theme-accent" /> Professional Experience
        </h2>

        <div className="space-y-8 border-l-2 border-theme-border pl-6 ml-3">
          {experience.filter((exp) => exp.status !== 'draft').map((exp, index) => (
            <div key={index} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-theme-accent border-4 border-theme-bg" />
              <div className="bg-theme-card border border-theme-border p-6 rounded-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-theme-text">{exp.role}</h3>
                    <p className="text-theme-accent font-medium text-sm">{exp.company} {exp.client ? `(Client: ${exp.client})` : ''}</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded bg-theme-border/50 text-theme-muted">
                    {exp.period}
                  </span>
                </div>
                <ul id={`experience-points-${index}`} className="space-y-2 mt-4">
                  {(exp.highlights || []).slice(0, expandedExperience[index] ? exp.highlights.length : 2).map((highlight, hIdx) => (
                    <li key={hIdx} className="text-sm text-theme-muted flex items-start gap-2">
                      <span className="text-theme-accent mt-1" aria-hidden="true">▸</span> {highlight}
                    </li>
                  ))}
                </ul>
                {(exp.highlights || []).length > 2 && (
                  <button type="button" aria-controls={`experience-points-${index}`} aria-expanded={!!expandedExperience[index]}
                    onClick={() => setExpandedExperience((current) => ({ ...current, [index]: !current[index] }))}
                    className="mt-4 text-sm font-semibold text-theme-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent">
                    {expandedExperience[index] ? 'View less' : `View more (${exp.highlights.length - 2})`}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {Array.isArray(about.skills) && about.skills.some((group) => group.title && group.items?.length > 0) && (
        <section className="mb-20" aria-labelledby="skills-and-tools">
          <h2 id="skills-and-tools" className="text-2xl font-bold text-theme-text mb-8 flex items-center gap-2">
            <Blocks className="w-6 h-6 text-theme-accent" aria-hidden="true" /> Skills & tools
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {about.skills.filter((group) => group.title && group.items?.length > 0).map((group, index) => (
              <div key={`${group.title}-${index}`} className="bg-theme-card border border-theme-border p-6 rounded-xl">
                <h3 className="font-semibold text-theme-text mb-4">{group.title}</h3>
                <ul id={`skill-items-${index}`} className="flex flex-wrap gap-2">
                  {group.items.slice(0, expandedSkills[index] ? group.items.length : 4).map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`} className="text-xs text-theme-muted border border-theme-border rounded-full px-3 py-1.5">{item}</li>
                  ))}
                </ul>
                {group.items.length > 4 && (
                  <button type="button" aria-controls={`skill-items-${index}`} aria-expanded={!!expandedSkills[index]}
                    onClick={() => setExpandedSkills((current) => ({ ...current, [index]: !current[index] }))}
                    className="mt-4 text-sm font-semibold text-theme-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent">
                    {expandedSkills[index] ? 'View less' : `View more (${group.items.length - 4})`}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mentorship & Leadership */}
      <section className="bg-theme-card border border-theme-border p-8 rounded-xl">
        <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-theme-accent" /> Teaching & Mentorship
        </h2>
        <p className="text-theme-muted leading-relaxed">
          I have mentored {aboutContent.hero.studentsMentored} students and junior designers in UI/UX fundamentals and design systems. This teaching work is separate from my roles at the companies above.
        </p>
      </section>
    </div>
  );
}
