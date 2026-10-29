import React, { useEffect, useState } from 'react';
import aboutData from '../../content/about.json';
import experienceData from '../../content/experience.json';
import { getAbout, getExperience } from '../lib/api';
import { Briefcase, GraduationCap, Award, MapPin } from 'lucide-react';

export default function About() {
  const [aboutContent, setAboutContent] = useState(aboutData);
  const [experience, setExperience] = useState(experienceData);
  const { about } = aboutContent;

  useEffect(() => {
    let active = true;
    getAbout().then((data) => { if (active && data?.about) setAboutContent(data); }).catch(() => {});
    getExperience().then((data) => { if (active && Array.isArray(data)) setExperience(data); }).catch(() => {});
    return () => { active = false; };
  }, []);

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
        <div className="flex items-center gap-2 mt-4 text-sm text-theme-muted font-mono">
          <MapPin className="w-4 h-4 text-theme-accent" /> {about.location}
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
                <ul className="space-y-2 mt-4">
                  {(exp.highlights || []).map((highlight, hIdx) => (
                    <li key={hIdx} className="text-sm text-theme-muted flex items-start gap-2">
                      <span className="text-theme-accent mt-1">▸</span> {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentorship & Leadership */}
      <section className="bg-theme-card border border-theme-border p-8 rounded-xl">
        <h2 className="text-xl font-bold text-theme-text mb-4 flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-theme-accent" /> Teaching & Mentorship
        </h2>
        <p className="text-theme-muted leading-relaxed">
          Committed to giving back to the design community. Over the past several years, I have mentored {aboutContent.hero.studentsMentored} students and junior designers across UI/UX fundamentals, design systems and agile product design, conducted portfolio reviews, and led workshops.
        </p>
      </section>
    </div>
  );
}
