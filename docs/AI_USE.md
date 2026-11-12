# AI Use & Authorship Transparency

NASA Space Apps Challenge 2026 · Team CrewReady (Bangladesh)

In full compliance with the NASA Space Apps Challenge Universal Rules and Bangladeshi regional submission guidelines, this document provides an honest, comprehensive account of how Artificial Intelligence tools were utilized during the conception, development, and refinement of **CrewReady: Beyond Us**.

---

## 1. Summary of AI Tools Used

| Tool | Category | What the AI Did | What the Human Team Did |
|---|---|---|---|
| **Claude (Anthropic)** | Large Language Model / Coding Agent | Drafted TypeScript boilerplate, test scaffolding, state logic, and initial English/Bangla text keys. | Architected system requirements, vetted scientific formulas against NASA documentation, designed the educational pedagogy, reviewed and corrected every line of code. |
| **Antigravity (Google DeepMind)** | Autonomous Agent / Assistant | Implemented pure simulation modules (`stormSize`, NASA snapshot pipelines, PWA service worker, runner physics, and resource upgrades). | Defined build sequences, enforced non-functional constraints (no `backdrop-blur`, zero key leakage), verified unit test validity. |
| **Midjourney & Google Imagen** | Generative AI Image Synthesis | Generated preliminary 3D concept renders for the astronaut crew (Orbit & Nova) and the welcome cinematic backdrop. | Prompt-engineered specific astronaut poses, removed fictional/unauthorized agency patches, manually cut out alpha transparency sheets (`public/art/`), and ensured visual consistency across landscape viewports. |

---

## 2. Artwork & Character Credits

- **Orbit & Nova 3D Characters:** Concept art generated using generative image tools by the human team. Poses, alpha cropping, cutouts, expressions, and color grading were edited and formatted by the team.
- **Cinematic Welcome Art:** Conceptualized by the team to portray young astronauts stepping into mission command; synthesized using AI image models and color-balanced to match deep space tones.
- **Agency Logos:** Strict compliance has been maintained: **No official NASA insignia or agency logos** appear on any character suit, tool, or vehicle in the artwork or UI.

---

## 3. Code, Science & Fact Integrity

- **NASA Data Integrity:** All formulas, thresholds (e.g. NOAA Kp storm scale, InSight temperature ranges, MOXIE production rates, OSDR Veggie study dates) were verified by the team against published NASA technical papers and APIs before integration.
- **Human Verification:** No AI model had unchecked authority over science facts. Every fact displayed on screen has an explicit source attribution and is verified in `docs/06_SCIENCE_AND_NASA_DATA.md`.
- **Bangla Translations:** All drafted Bengali strings have been curated and reviewed by native Bangla speakers to ensure appropriate syntax, natural tone for children, and accurate terminology.
