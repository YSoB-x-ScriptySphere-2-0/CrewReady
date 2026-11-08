---
name: Orbital Telemetry
colors:
  surface: '#051521'
  surface-dim: '#051521'
  surface-bright: '#2c3b48'
  surface-container-lowest: '#020f1b'
  surface-container-low: '#0e1d29'
  surface-container: '#12212d'
  surface-container-high: '#1d2b38'
  surface-container-highest: '#283644'
  on-surface: '#d5e4f6'
  on-surface-variant: '#bacbb9'
  inverse-surface: '#d5e4f6'
  inverse-on-surface: '#23323f'
  outline: '#849584'
  outline-variant: '#3b4a3d'
  surface-tint: '#00e473'
  primary: '#f5fff2'
  on-primary: '#003918'
  primary-container: '#39ff88'
  on-primary-container: '#007236'
  inverse-primary: '#006d34'
  secondary: '#43e1fd'
  on-secondary: '#00363f'
  secondary-container: '#00c5e0'
  on-secondary-container: '#004d58'
  tertiary: '#fffbff'
  on-tertiary: '#412d00'
  tertiary-container: '#ffdb9a'
  on-tertiary-container: '#805d00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63ff95'
  primary-fixed-dim: '#00e473'
  on-primary-fixed: '#00210b'
  on-primary-fixed-variant: '#005225'
  secondary-fixed: '#a4eeff'
  secondary-fixed-dim: '#35d8f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#ffdea4'
  tertiary-fixed-dim: '#f4be4e'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#051521'
  on-background: '#d5e4f6'
  surface-variant: '#283644'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-nav:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  telemetry-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.02em
  telemetry-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.03em
  telemetry-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system delivers a mission-critical aerospace command interface engineered for orbital operations, flight readiness monitoring, and deep space exploration. It prioritizes functional precision, uncompromising telemetry readability, and rapid situational awareness under zero-failure conditions.

The visual narrative bridges pragmatic NASA/ESA operational cockpits with modern, refined sci-fi aerospace systems. Rather than relying on gratuitous holographic blurs or ornamental neon blooms, the system enforces a disciplined, high-density HUD aesthetic: crisp architectural lines, dark field visibility, and tactical color coding. Visual elements communicate machine-state, hardware integrity, and mission status with zero cognitive drag.

## Colors

The palette simulates the functional environment of a low-illumination mission deck. Contrast ratios strictly adhere to accessibility and operational legibility against near-black aerospace expanses.

### Palette Architecture
- **Canvas Base (`#05080D`)**: Deep space black for global root frames, backdrops, and outermost system viewports.
- **Section Structural Navy (`#0A1220`)**: Structural framing, secondary sidebar docking zones, and shell panels.
- **Surface Panels (`#152235`)**: Functional flight cards, monitoring modules, instrument housings, and table surfaces.
- **Panel Borders (`#233449`)**: Technical 1px seams providing structural delineation across module zones.
- **Primary Action & Success (`#39FF88`)**: Neon Green reserved strictly for affirmative execution ("GO / NO-GO", stage commits), operational lock states, nominal telemetry status, and active system health.
- **Secondary & Telemetry Accent (`#36D9F5`)**: Electric Cyan for guidance vectors, navigational metrics, telemetry secondary links, sensor readings, and focus indices.
- **Caution & Alerts (`#FFC857`)**: Mission Amber designating pre-threshold alerts, sensor divergence, scheduled burns, and advisory holding patterns.
- **Critical / Abort Hazard (`#FF3B30` / Surface `#321F20`)**: High-saturation engine abort / critical failure signals mounted on low-luminance deep danger backgrounds (`#321F20`) with `#5E272B` borders.
- **Text & Reading Layers**: Primary metrics and display copy use Starlight White (`#EAF2F8`); contextual descriptors, indices, and off-state parameters use Muted Grey (`#8B9AAA`).

## Typography

Typography establishes a strict tripartite hierarchy:
1. **Space Grotesk** commands structure: section titles, module IDs, mission stages, and viewport headers. Its geometric structure delivers high-tech authority.
2. **Inter** handles narrative density: flight checklists, mission logs, interactive controls, tooltips, and long-form data descriptors where uninhibited legibility is required.
3. **JetBrains Mono** operates as the mission telemetry instrument: orbital altitudes, velocity metrics, timestamps (UTC/Mission Elapsed Time), coordinate grids, and raw telemetry streams. Tabular figures (`tnum`) must remain permanently active on JetBrains Mono to prevent jitter during real-time value updates.

## Layout & Spacing

The layout model is anchored in a high-density, multi-panel grid reminiscent of operational mission control consoles:
- **Grid Paradigm**: 12-column fluid grid system on desktop (`min-width: 1200px`) scaling smoothly with fixed gutters. Multi-monitor dashboards may scale up to 16 or 24 contextual columns via unified 16px/24px logic.
- **Docking Structure**: Layouts prioritize sticky auxiliary side rails (system telemetry, navigation bar) and a primary modular multi-widget canvas.
- **Reflow Rules**: 
  - **Desktop (1200px+)**: Multi-column telemetry blocks with simultaneous 3-card and 4-card sensor grids.
  - **Tablet (768px – 1199px)**: Reflows to an 8-column layout. Telemetry cards stack into twin 4-column tracks.
  - **Mobile (<768px)**: 4-column compact layout. Telemetry panels collapse into single-column vertical stacks. Tabular navigation replaces side rails.
- **Spatial Rhythm**: Padding and element separation use the 4px baseline. Interior module elements favor compact densities (`space-xs` and `space-sm`) to maximize visible data above the fold.

## Elevation & Depth

This system intentionally rejects dramatic drop shadows and heavy blur filters in favor of structured architectural depth:
- **Tonal Stepping**: Depth is communicated via surface luminance steps. Base universe canvas (`#05080D`) sits behind docked frame containers (`#0A1220`), which support foreground cards and monitors (`#152235`). Floating flyouts or active overlays step up to `#1C2D44`.
- **Low-Contrast Technical Seams**: Every card and container is outlined by a sharp 1px border (`#233449`). This preserves perimeter definition without optical glare.
- **Targeted Functional Glow**: Ambient glows are restricted to active focal operations. Primary active indicators use an ultra-tight, sharp halo: `0 0 10px rgba(57, 255, 136, 0.25)`. Telemetry cyan accents use `0 0 10px rgba(54, 217, 245, 0.25)`. Defuse glows exceeding 16px blur are prohibited to preserve display clarity.
- **Modal Overlays**: Overlays utilize `#05080D` tinted at 85% opacity with an ultra-subtle backdrop blur (`4px`), retaining environmental telemetry context in the background.

## Shapes

The interface embraces a low-radius, instrument-panel profile:
- **Global Corner Treatment**: Interactive components, data cards, and telemetry chips adhere strictly to `roundedness: 1` (`0.25rem` / 4px). This soft-cornered geometry reflects precision flight equipment without the brutalist fatigue of pure 0px edges.
- **Modals and Command Panels**: Containers and major flight panels scale to `rounded-lg` (`0.5rem` / 8px).
- **HUD Notches (Stylistic Cue)**: Specific tactical containers (e.g., flight readiness status banners) may incorporate subtle 45-degree chamfers (6px) on top-right edges via CSS clip-path to emphasize aerospace identity, while maintaining unified inner bounding boxes.
- **Pills**: Barred from generic components. Oval or pill radiuses (`rounded-full`) are reserved solely for toggle switches and miniature status dot indicators.

## Components

### Buttons & Trigger Elements
- **Primary Action (Command Commit / GO)**: Solid `#39FF88` background with `#05080D` Space Grotesk 600 typography. Hover invokes `0 0 12px rgba(57, 255, 136, 0.4)` and a slight luminance shift. Active press scales to 0.98.
- **Secondary Action (Telemetry Query / Vector Shift)**: Transparent base, 1px border in `#36D9F5`, text in `#36D9F5`. Hover fills with `rgba(54, 217, 245, 0.12)`.
- **Ghost / Utility**: `#8B9AAA` text, no border. Hover applies surface fill `#152235` with `#EAF2F8` text.
- **Abort / Hazard Trigger**: Solid `#321F20` with 1px border in `#FF3B30` and Starlight White or alert red typography.

### Chips & Telemetry Badges
- **Structure**: JetBrains Mono 11px uppercase with `0.06em` letter spacing. Padding: `2px 8px`.
- **Nominal Badge**: Background `rgba(57, 255, 136, 0.1)`, text `#39FF88`, border `1px solid rgba(57, 255, 136, 0.3)`. Prefixed with a static or pulsating 6px circular LED dot.
- **Advisory / Warning Badge**: Background `rgba(255, 200, 87, 0.1)`, text `#FFC857`, border `1px solid rgba(255, 200, 87, 0.3)`.
- **System Offline / Muted**: Background `rgba(139, 154, 170, 0.1)`, text `#8B9AAA`, border `1px solid #233449`.

### Telemetry Cards & Panels
- **Container Structure**: Background `#152235`, border `1px solid #233449`, 4px border radius.
- **Card Header**: Border-bottom `1px solid #233449`, padding `8px 16px`. Left side: Space Grotesk subheader with technical hex-identifier (e.g., `SYS.ORBIT // 04`). Right side: JetBrains Mono status badge.
- **Card Content**: Padding `16px`. Numerical metrics displayed via JetBrains Mono (`telemetry-lg`) with Muted Grey uppercase units pinned adjacent or below.

### Inputs & Sensor Sliders
- **Field Base**: Background `#0A1220`, border `1px solid #233449`, text `#EAF2F8`, placeholder `#8B9AAA`. Height: 36px (compact density).
- **Focus State**: Border shifts to `#36D9F5`, box-shadow `0 0 0 1px #36D9F5`.
- **Telemetry Readout Attachment**: Inputs often house fixed right-side unit adornments (e.g., `KM/S`, `PSI`, `DEG`) set in JetBrains Mono (`#8B9AAA`).

### Checkboxes, Radios & Switches
- **Checkboxes**: 16x16px, background `#0A1220`, border `1px solid #233449`, corner radius 2px. Checked state: `#39FF88` background with deep black micro-check icon.
- **Radios**: Concentric circular rings. Active state displays an interior `#36D9F5` point surrounded by an electric cyan ring.
- **Toggles**: Track dimensions 36x18px in `#0A1220` with `#233449` border. Switch thumb moves to `#39FF88` upon activation.

### Tables & Data Streams
- **Format**: Dense tabular layouts with `#0A1220` alternate-row zebra striping. Header row fixed at 32px height, uppercase JetBrains Mono 11px with bottom separator `#233449`.
- **Row Interactivity**: Hovering highlights row in `#1C2D44`. Real-time telemetry modifications pulse text color briefly before settling.