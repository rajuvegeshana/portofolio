# Project visuals

The portfolio uses inline SVG illustrations from `src/components/ProjectArtwork.jsx` when a verified Figma export is unavailable. Public case studies may use illustrations registered in `src/components/CaseVisuals.jsx` and referenced by the Supabase project record.

Sitara, Fingo, and My4 Score use exported Figma frames hosted in the public Supabase Storage bucket `portfolio-images`. Source frames: [Sitara dashboard](https://www.figma.com/design/3FTzdSoQot8TOAoUfoBo4o/Sitara--2024-?node-id=1436-3110), [Fingo product areas](https://www.figma.com/design/qS1bZJqCW3Kv6EnrTmDXAn/Fingo-final-Designs--Copy-?node-id=194-1731), and [My4 Score ESG topic selection](https://www.figma.com/design/hlZEtw9vcUAb81f2xYIoUq/My4Score?node-id=128-2609). Their `coverImage` and `visuals[].src` fields contain public Supabase image URLs.

Illustrations summarize public narratives; they are not screenshots of shipped products or evidence of measured outcomes. Keep the “Illustrative visual” label and explicit case-study captions. Figma exports are labeled “Figma design” so they are not mistaken for shipped screenshots.

Sitara has a custom visual research-to-interface story using its documented workflow mapping, competitor review, design decisions, Figma frame, and live-user mockup testing. Its audience journey, shared-suite architecture, and small wireframe sketch are explicitly labeled conceptual reconstructions because source persona, journey-map, and wireframe artifacts have not been provided. Interview records, participant counts, and formal persona artifacts remain undocumented and must not be implied by the diagram.

The author confirmed My4 Score is a separate ESG brand-scoring app. Its selected frame shows environmental-topic selection; it does not prove a production launch or scoring outcome. No matching Zenith or Xflow Figma file was found in the accessible account search, so their visuals remain illustrative.

Protected projects use a generic access-controlled illustration. Keep private bodies in the Supabase protected table and avoid publishing confidential product details or images. For new approved image exports, upload to the public `portfolio-images` bucket and paste the public URL into the admin editor, with descriptive alt text.

The richer process stories for other projects use `processStory` fields in Supabase. Each panel links documented inputs to decisions and a conceptual structure map, then states the known review or delivery status. The four protected stories exist only in `portfolio_private_projects`; public stubs contain no process details. When a source Figma frame exists in the public project record, the story can show that image with its existing caption.

The public project editor has an optional Figma file URL field. A valid HTTPS Figma design link appears as an “Open in Figma” button beneath the case-study visuals.
