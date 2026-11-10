# Programmatic 30-Second Commercial Pitch Script & Video Specification
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-10-VIDEO-30S-SCRIPT-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/09_VIDEO_240S_SCRIPTS.md -> docs/10_VIDEO_30S_SCRIPT.md
Framerate & Resolution: 900 frames @ 30.0 FPS | 1920x1080 (16:9 widescreen) | Hard stop at Frame 899.
Voiceover Calibration: Exactly 71 spoken words (~2.45 words/second | resolves at 28.5s with a 1.5s audio tail buffer).
Compliance: 100% English burned-in captions, zero minor likenesses, adult synthetic/live narration.

---

## 1. Global Judging Context & Evaluation Mindset (Pass 3 Global Screen)
NASA Space Apps Global Executive Judges review hundreds of 30-second finalists in rapid triage sessions.
- **The 3-Second Rule:** If the team identity, project name, and core visual hook are not established by frame 90, retention drops by 70%.
- **No Conceptual Hand-Waving:** The prototype must be shown active on screen with real NASA data badges clearly visible.
- **The Zero-Cutoff Invariant:** Voiceover and transient music must resolve cleanly by frame 885; frame 900 is complete blackout.
- **Global Evaluation Metrics:** High scores in *Impact*, *Creativity*, *Validity*, and *Use of Data* rely on immediate clarity.

---

## 2. Second-by-Second Beat Sheet Table (900 Frames @ 30 FPS)

| Beat & Frame Range | Timecode | Visual Composition & Remotion Layer (`nasa-saas-video`) | Spoken Voiceover Narration | On-Screen Text & Data Attribution | SFX & Audio Cues |
|---|---|---|---|---|---|
| **Beat 1: The Hook**<br>Frames 0–150 (5.0s) | `00:00.00 – 00:05.00` | 3D dark-mode browser mockup rotates into center view (`perspective: 1200px`). Twinkle companion drone sweeps past collecting Stardust; team roster pill slides into lower left. | *"From Dhaka, Bangladesh, Team CrewReady built CrewReady: Beyond Us to empower next-generation space explorers."* (14 words) | **Team CrewReady • Dhaka, Bangladesh**<br>`CrewReady: Beyond Us`<br>*Roster: Lead · Dev · 3D · Science · Media* | Sub-bass impact kick at F0; crystalline pickup chimes at F60; high-tech whoosh. |
| **Beat 2: The Challenge**<br>Frames 151–360 (7.0s) | `00:05.00 – 00:12.00` | Camera pans into Mission Control HUD. Split comparison card: trivia clicker bar flashes red warning versus 6-resource coupled ledger ($[P, O_2, H_2O, Food, Shield, Time]$). | *"For NASA's Junior Astronaut Trainer challenge, existing games fail because trivia ignores coupled life-support engineering trade-offs."* (17 words) | **NASA Space Apps 2026: Junior Astronaut Trainer**<br>`Coupled Systems Law: ` $\Delta \text{Protection}_A \implies -\Delta \text{Resource}_B$<br>*Trade-Offs > Trivia* | Harsh error buzzer on trivia card; mechanical locking ratchet on coupled ledger. |
| **Beat 3: The Live Build**<br>Frames 361–660 (10.0s) | `00:12.00 – 00:22.00` | Live screen capture of Mars Jezero Mission 2. Simulated mouse cursor executes Sol 4 heating choice; solar generation drops 65%; Black Box forensic timeline replays tipping point. | *"Watch CrewReady process NASA Mars Climate Sounder data live, balancing power, oxygen, and water before live Astronomy Picture of the Day debriefs!"* (23 words) | `[NASA LIVE]` **Mars Climate Sounder DDR V6.2**<br>`Sol 4: Dust Opacity ` $\tau = 1.45 \implies \text{Solar } -65\%$<br>**Live NASA APOD Cosmic Reward** | Klaxon alert chime; mouse click click; electrical surge hum; victorious APOD harmonic chord. |
| **Beat 4: Impact & Close**<br>Frames 661–900 (8.0s) | `00:22.00 – 00:30.00` | Camera zooms out to global impact map. Base Hub upgrades to Level 3; bilingual [EN/বাংলা] badge pops; final end-card displays public GitHub repository URL and QR code. | *"Empowering Gen Alpha students worldwide through our offline-first progressive web app. This is CrewReady: Beyond Us."* (17 words) | **100% Offline-First PWA • COPPA Compliant**<br>`github.com/[REPO_URL]`<br>**CrewReady: Beyond Us** | Deep resonant cinematic boom; rising orchestral synth swell; clean radio comm cutoff at F885. |

---

## 3. Word-by-Word Narration Script (Exact Count: 71 Words)

```text
[00:00 - 00:05 | 14 words]
From Dhaka, Bangladesh, Team CrewReady built CrewReady: Beyond Us to empower next-generation space explorers.

[00:05 - 00:12 | 17 words]
For NASA's Junior Astronaut Trainer challenge, existing games fail because trivia ignores coupled life-support engineering trade-offs.

[00:12 - 00:22 | 23 words]
Watch CrewReady process NASA Mars Climate Sounder data live, balancing power, oxygen, and water before live Astronomy Picture of the Day debriefs!

[00:22 - 00:28.5 | 17 words]
Empowering Gen Alpha students worldwide through our offline-first progressive web app. This is CrewReady: Beyond Us.
```

- **Pacing Metrics:** 71 words / 28.5 seconds $= 2.49\text{ words/second}$ ($149\text{ WPM}$).
- **Outro Buffer:** Frame 855 to Frame 900 ($1.5\text{s}$) dedicated to clean orchestral decay and logo hold.

---

## 4. Remotion Programmatic Architecture (`nasa-saas-video`)

### 4.1 Composition Setup & Frame Configuration
- **Composition Identifier:** `CrewReady30sPromo`
- **DurationInFrames:** `900`
- **Fps:** `30`
- **Width:** `1920` | **Height:** `1080`
- **Frame Partitioning:**
  - `<Sequence from={0} durationInFrames={150}>` ──> `HookScene.tsx`
  - `<Sequence from={150} durationInFrames={210}>` ──> `ChallengeScene.tsx`
  - `<Sequence from={360} durationInFrames={300}>` ──> `LiveBuildScene.tsx`
  - `<Sequence from={660} durationInFrames={240}>` ──> `ImpactOutroScene.tsx`

### 4.2 Motion Mechanics & Spring Physics
- **3D Device Mockup Tilt:** Interpolated using Remotion `spring({ frame, fps, config: { damping: 12, stiffness: 150 } })`.
- **Initial Angle:** `rotateX(6deg) rotateY(-8deg) scale(0.94)`.
- **Nominal Angle:** `rotateX(0deg) rotateY(0deg) scale(1.0)`.
- **Cursor Physics:** Programmatic cursor glide along cubic Bézier path `(0.25, 1, 0.5, 1)` with an 8-frame `scale(0.82)` tap depression on the Sol 4 trade-off button.

---

## 5. Visual Layout & Motion Design Specifications (`motion-video-30s`)

### 5.1 Typography & Color Architecture
- **Primary Display Font:** `Space Grotesk` (Bold, tracking-tight).
- **HUD & Telemetry Font:** `JetBrains Mono` (Tabular numbers for live resource meters).
- **Subtitles & Body:** `Inter` (Medium, 38px on 1080p canvas).
- **Core Palette:** Space Void Black (`#05080D`), Apollo Cyan HUD (`#36D9F5`), Solar Flare Gold (`#FFC857`), Warning Crimson (`#FF5252`).

### 5.2 Subtitle Specifications (`subtitles_30s.srt`)
Burned-in synchronized bottom-third captions formatted with 2-line maximum and 40% translucent black pill backing:
```srt
1
00:00:00,200 --> 00:00:04,800
From Dhaka, Bangladesh, Team CrewReady built CrewReady: Beyond Us
to empower next-generation space explorers.

2
00:00:05,000 --> 00:00:11,800
For NASA's Junior Astronaut Trainer, existing games fail
because trivia ignores coupled life-support trade-offs.

3
00:00:12,000 --> 00:00:17,200
Watch CrewReady process NASA Mars Climate Sounder data live,
balancing power, oxygen, and water

4
00:00:17,400 --> 00:00:21,800
before live Astronomy Picture of the Day debriefs!

5
00:00:22,000 --> 00:00:28,500
Empowering Gen Alpha students worldwide through our offline PWA.
This is CrewReady: Beyond Us.
```

---

## 6. Audio & Sound FX Mixing Notes
- **Loudness Standards:** Broadcast normalized at -14.0 LUFS (-1.0 dB True Peak).
- **Voiceover Processing:** High-pass filter at 85 Hz, gentle 3 kHz presence boost, clean de-esser.
- **Music Ducking:** Background synthwave pulse ducks to -22 dB beneath speech, swelling to -14 dB at the opening downbeat (F0–F30) and final outro cadence (F855–F895).
- **Zero Trail Invariant:** All audio output drops to $-\infty\text{ dB}$ by Frame 895. Zero sound bleed into Frame 900.

---

## 7. Global Judging Rubric Alignment Checklist
- [ ] **Hard Duration Gate:** Exact length $\le 30.0$ seconds (900 frames @ 30 FPS).
- [ ] **Speech Rate Compliance:** Narration strictly capped at 71 words (~2.45 words/second).
- [ ] **Challenge Named:** Official challenge title explicitly cited on screen and in voiceover.
- [ ] **NASA Datasets Cited:** Mars Climate Sounder DDR V6.2 and live APOD explicitly named aloud.
- [ ] **Team & Location:** Team CrewReady and Dhaka, Bangladesh prominently displayed in Beat 1.
- [ ] **Public Repo Callout:** Open-source GitHub repository URL clearly visible in Beat 4.
- [ ] **Child Safety Compliance:** Zero minor faces, voices, or identifiable information present.
