# Project visuals

The portfolio uses inline SVG illustrations from `src/components/ProjectArtwork.jsx` for project-card covers when a verified Figma export is unavailable. Public case studies can also include those illustrations through IDs registered in `src/components/CaseVisuals.jsx` and listed in `content/projects.json`.

Sitara, Fingo, and My4 Score use exported Figma frames in `public/images/` for their cards and case studies. The source frames are [Sitara dashboard](https://www.figma.com/design/3FTzdSoQot8TOAoUfoBo4o/Sitara--2024-?node-id=1436-3110), [Fingo product areas](https://www.figma.com/design/qS1bZJqCW3Kv6EnrTmDXAn/Fingo-final-Designs--Copy-?node-id=194-1731), and [My4 Score ESG topic selection](https://www.figma.com/design/hlZEtw9vcUAb81f2xYIoUq/My4Score?node-id=128-2609). `coverImage` and `visuals[].src` are paths relative to the Vite base, such as `images/sitara-dashboard-figma.png`.

The illustrations summarize the public narrative. They are not screenshots of shipped products or evidence of measured outcomes. Keep the “Illustrative visual” label on those cards and an explicit caption on case-study figures. The Figma exports are labeled “Figma design” so they are not mistaken for shipped product screenshots.

The author confirmed My4 Score is a separate ESG brand-scoring app, not the credit-health product previously described. The selected Figma frame shows environmental-topic selection; it does not prove a production launch or scoring outcome. No matching Zenith or Xflow Figma file was found in the accessible account search; keep their illustrative visuals until source links are supplied.

Protected projects use one generic access-controlled illustration. Do not put confidential product details into this public component or into `content/projects.json`. Their private case-study bodies remain in the server's ignored data directory.

The admin editor exposes card image paths and alt text, plus each case-study visual's ID, label, caption, image path, and alt text. A visual with an image path renders the file; an ID without an image path uses a registered illustration. Store exports in `public/images/` and check confidentiality before publishing. Protected projects keep the generic cover and no public Figma export.
