import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function DesignProcessDiagram({ steps }) {
  if (!Array.isArray(steps) || steps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-theme-border bg-theme-card p-5 sm:p-7">
      <p className="mb-6 text-xs font-mono uppercase tracking-widest text-theme-muted">
        Documented project steps
      </p>
      <ol className="space-y-0" aria-label="Design process steps">
        {steps.map((step, index) => (
          <li key={`${index}-${step.title}`} className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6">
            <div className="flex flex-col items-center" aria-hidden="true">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-theme-accent bg-theme-bg font-mono text-sm font-bold text-theme-accent">
                {String(index + 1).padStart(2, '0')}
              </span>
              {index < steps.length - 1 && (
                <span className="flex min-h-10 flex-1 flex-col items-center py-2 text-theme-accent/60">
                  <span className="w-px flex-1 bg-theme-accent/40" />
                  <ArrowDown className="h-4 w-4 shrink-0" />
                </span>
              )}
            </div>
            <div className={`min-w-0 ${index < steps.length - 1 ? 'pb-7' : ''}`}>
              <h3 className="pt-1.5 text-base font-semibold leading-snug text-theme-text">{step.title}</h3>
              {step.body && <p className="mt-2 text-sm leading-relaxed text-theme-muted">{step.body}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
