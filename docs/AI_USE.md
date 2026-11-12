# AI Use & Authorship Transparency

NASA Space Apps Challenge 2026 · Team CrewReady (Bangladesh)

In full compliance with the NASA Space Apps Challenge Universal Rules and Bangladeshi regional submission guidelines, this document provides an honest, comprehensive account of how Artificial Intelligence tools were utilized during the conception, development, and refinement of **CrewReady: Beyond Us**.

---

## 1. Summary of AI Tools Used

| Tool | Category | What the AI Did | What the Human Team Did |
|---|---|---|---|
| **Claude (Anthropic)** | Large Language Model / Coding Agent | Drafted TypeScript boilerplate, test scaffolding, state logic, and initial English/Bangla text keys. | Architected system requirements, vetted scientific formulas against NASA documentation, designed the educational pedagogy, reviewed and corrected every line of code. |
| **Antigravity (Google DeepMind)** | Autonomous Agent / Assistant | Implemented pure simulation modules (`stormSize`, NASA snapshot pipelines, PWA service worker, runner physics, and resource upgrades). | Defined build sequences, enforced non-functional constraints (no `backdrop-blur`, zero key leakage), verified unit test validity. |
| **ChatGPT image generation (OpenAI)** | Image generation | Made the crew pictures (Orbit, Nova, Twinkle) and the welcome scenes. | Chose the poses, removed mock-up text and logos, cut out the backgrounds (`public/art/`), and kept the look the same across screens. |

---

## 2. Artwork & Character Credits

- **Orbit & Nova 3D Characters:** Concept art generated using generative image tools by the human team. Poses, alpha cropping, cutouts, expressions, and color grading were edited and formatted by the team.
- **Cinematic Welcome Art:** Conceptualized by the team to portray young astronauts stepping into mission command; synthesized using AI image models and color-balanced to match deep space tones.
- **Agency Logos:** Strict compliance has been maintained: **No official NASA insignia or agency logos** appear on any character suit, tool, or vehicle in the artwork or UI.

---

## 3. Code, Science & Fact Integrity

- **Facts.** On 13 Nov 2026 every on-screen fact was checked against the NASA or NOAA page named for it, using Claude for web research and a second, independent AI review that tried to disprove each one. The results, with links, are in `docs/06_SCIENCE_AND_NASA_DATA.md` §4. Facts that could not be confirmed were removed from the game. A team member (Tasfia Zaman Totiny, Researcher) opens each link once before judging.
- **Sources on screen.** Every fact in the game carries a source line, and the Sources page lists every dataset.
- **Bangla.** Bangla text was drafted with AI. A Bangla-speaking team member checks every line before it ships; lines not yet checked are marked "needs a check" in `src/content/strings.bn.ts`.
- **Team:** Ahnaf Nabil, Barkat Ullah Shah Riyad, Jawad Hossain Rian, Tasfia Zaman Totiny, Wasima Haque Syeda, Imtiaj Mahmud Ormi · Cumilla, Bangladesh.
