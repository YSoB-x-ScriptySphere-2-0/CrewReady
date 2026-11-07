\# CREWREADY: BEYOND US

\# ANTIGRAVITY DEVELOPMENT PROMPT PACK

\### Frontend Direction, UX Implementation \& Quality Control



\*\*Project repository:\*\* https://github.com/YSoB-x-ScriptySphere-2-0/CrewReady



\*\*Primary design reference:\*\* `design.md`



\*\*Development environment:\*\* Antigravity



\*\*Development approach:\*\* One prompt at a time. Inspect, implement, test, review, and approve each stage before moving forward.



\---



\# GLOBAL INSTRUCTIONS — APPLY TO ALL 13 PROMPTS



You are contributing to CrewReady: Beyond Us, an immersive space exploration and astronaut-training experience.



The repository already contains project assets and a design specification.



Before making changes:

1\. Inspect the repository and its current implementation.

2\. Read `design.md`.

3\. Inspect the existing package configuration, framework, routing, and components.

4\. Identify actual available assets and their paths.

5\. Preserve existing working functionality.



Do not assume the project uses a particular framework. Work with the existing technology stack.



\## Design identity



\- Deep space black: #05080D

\- Dark navy: #0A1220

\- Neon green: #39FF88

\- Cyan: #36D9F5

\- Off-white: #EAF2F8

\- Muted grey: #8B9AAA

\- Amber: #FFC857



Typography:

\- Space Grotesk

\- Inter

\- JetBrains Mono



Design characteristics:

\- Cinematic space environment.

\- Premium mission-control interface.

\- Meaningful 3D interactions.

\- Sophisticated typography.

\- Controlled lighting and glow.

\- Clear information hierarchy.

\- Smooth, purposeful transitions.



Avoid:

\- Generic dashboard templates.

\- Excessive glassmorphism.

\- Excessive neon effects.

\- Random gradients.

\- Unnecessary cards.

\- Fake telemetry.

\- Fake scientific data.

\- Nonfunctional buttons.

\- Generic replacement assets when actual project assets exist.



\## Technical rules



\- Preserve the existing project structure where possible.

\- Do not overwrite teammates' work without inspecting it.

\- Do not delete or relocate assets.

\- Do not introduce unnecessary dependencies.

\- Do not invent API endpoints or backend capabilities.

\- Clearly identify frontend integration points.

\- Use efficient rendering techniques.

\- Optimize for laptops with integrated graphics and limited RAM.

\- Respect reduced-motion preferences.

\- Test every implemented feature.

\- Report incomplete functionality honestly.



\*\*IMPORTANT: Execute only the prompt currently assigned. Do not automatically continue to the next stage.\*\*



\---



\# PROMPT 01 — CINEMATIC WELCOME SCREEN



\### Objective

Build the first screen users see when entering CrewReady.



\### Visual direction

Use the attached CrewReady welcome-screen reference image as the composition guide.



Create a cinematic spacecraft hangar with:

\- Panoramic Earth view.

\- Actual astronaut model: `crew\_astronaut.glb`.

\- Actual companion drone model: `companion\_drone.glb`.

\- Spacecraft architecture and environmental depth.

\- CrewReady branding.

\- Tagline: TRAIN • PREPARE • EXPLORE.



\### Main navigation

\- Start Mission

\- Training

\- Settings

\- Credits



Make Start Mission the primary action.



\### Interaction

\- Meaningful hover, focus, and pressed states.

\- Functional settings panel.

\- Audio mute/unmute control.

\- Credits panel.

\- Existing route integration where available.

\- No fake mission-start functionality.



\### Animation

\- Subtle astronaut idle movement if supported.

\- Drone hovering.

\- Controlled environmental animation.

\- Smooth menu entrance.

\- Refined button interactions.



\### Acceptance criteria

The screen must look premium, cinematic, responsive, and functional. Both supplied 3D models must load correctly or display a graceful fallback.



Do not implement other pages yet.



\---



\# PROMPT 02 — APPLICATION SHELL AND NAVIGATION



\### Objective

Establish the consistent application structure that all subsequent pages will use.



\### Requirements

Create a reusable application shell with:

\- Consistent navigation.

\- Page transition behavior.

\- Branding and mission identity.

\- Shared typography and colors.

\- Reusable HUD elements.

\- Reusable buttons, panels, tooltips, and status indicators.

\- Consistent loading and error states.



\### UX direction

Navigation should feel like operating a spacecraft system, not browsing an ordinary website.



Users must always understand:

\- Where they are.

\- What they can do.

\- How to return.

\- Whether an action is loading or completed.



Avoid cluttering the screen with permanent navigation panels.



\### Technical requirements

\- Use the existing router if available.

\- Preserve Prompt 01.

\- Make shared components reusable.

\- Do not duplicate components unnecessarily.



\### Acceptance criteria

All implemented pages must be able to use the same visual system and navigation without inconsistent styling.



\---



\# PROMPT 03 — PLANETARY MISSION HUB



\### Objective

Create the main exploration dashboard users enter after selecting Start Mission.



\### Main experience

Present three destinations:

\- Earth

\- Moon

\- Mars



Use an immersive planetary selection environment.



\### Visual requirements

\- Large, visually distinct planetary presentations.

\- Earth should look recognizable with atmospheric depth.

\- Moon should have a lunar surface appearance.

\- Mars should have recognizable reddish terrain.

\- Use available planetary textures and actual project assets.

\- Provide clear destination labels and mission information.



\### UX requirements

Each destination must communicate:

\- Planetary body.

\- Exploration purpose.

\- Mission availability or status.

\- A clear action to enter the destination.



Do not invent real mission availability or live telemetry.



\### Interaction

\- Select a planetary destination.

\- Show a clear selected state.

\- Provide a transition into its corresponding experience.

\- Provide a return-to-hub option.



\### Acceptance criteria

The user can understand the three destinations immediately and navigate between them.



\---



\# PROMPT 04 — EARTH CLOCK AND EARTH EXPERIENCE



\### Objective

Implement an accurate Earth clock and an introductory Earth exploration experience.



\### Earth clock requirements

Display:

\- Current local date.

\- Current local time.

\- Browser-detected timezone.

\- Readable timezone identifier or offset.



The clock must:

\- Update every second.

\- Use the user's browser-local time.

\- Correctly handle date changes.

\- Avoid drifting through manually incrementing displayed time.

\- Handle browser tab visibility changes.

\- Resume correctly when the user returns to the tab.



Use the browser's actual date/time APIs.



\### Earth experience

Present:

\- Earth visualization.

\- Atmospheric and surface details.

\- Basic introductory information.

\- A clear connection to the mission environment.



Do not present fabricated live satellite or environmental telemetry.



\### UX requirements

Keep the clock readable and prominent without dominating the planetary visualization.



\### Acceptance criteria

Verify the time against the browser's system clock, including timezone and date rollover.



\---



\# PROMPT 05 — MOON CLOCK AND LUNAR EXPERIENCE



\### Objective

Implement the Moon experience and mission elapsed-time display.



\### Moon clock requirements

Display elapsed time from a clearly defined lunar landing reference.



Requirements:

\- Identify the selected lunar mission.

\- Define its landing date and time with a documented source and timezone.

\- Calculate elapsed time from the reference timestamp.

\- Update the display appropriately.

\- Clearly label the reference mission.

\- Distinguish historical mission time from current live time.



Do not invent a landing timestamp.



If the selected mission reference is not verified, create a clearly marked configurable data entry rather than displaying fabricated precision.



\### Moon environment

Include:

\- Lunar surface presentation.

\- Earth as viewed from the Moon where appropriate.

\- Lunar exploration information.

\- Available Apollo Lunar Module asset where suitable.



\### Interaction

Allow users to explore the Moon environment and return to the planetary hub.



\### Acceptance criteria

The elapsed-time calculation must be based on an explicit, documented timestamp.



\---



\# PROMPT 06 — MARS CLOCK AND MARS EXPERIENCE



\### Objective

Build a scientifically informed simulated Martian clock and Mars exploration experience.



\### Mars clock requirements

Mars has a mean solar day, or sol, of approximately 24 hours, 39 minutes, and 35 seconds.



Implement:

\- Simulated Mars sol counter.

\- Simulated Mars local time.

\- Clear simulation label.

\- Configurable reference epoch.

\- Consistent time calculations.

\- A visible distinction between Earth time and simulated Mars time.



Do not describe this as live NASA telemetry.



Do not present invented current Mars mission data.



\### Mars environment

Include:

\- Mars planetary visualization.

\- Surface and terrain presentation.

\- Curiosity rover model: `24584\_Curiosity\_static.glb`, if appropriate.

\- Relevant available textures.

\- Introductory exploration information.



\### Acceptance criteria

The Mars clock must use a consistent simulation model and clearly communicate its reference and assumptions.



\---



\# PROMPT 07 — ASTRONAUT AVATAR AND AI GUIDE



\### Objective

Introduce the astronaut and AI guide as recurring companions throughout the experience.



\### Astronaut

Use the actual `crew\_astronaut.glb`.



Preserve:

\- Model proportions.

\- Original appearance.

\- Materials and recognizable details.



Use the model in appropriate interface locations.



\### AI guide UX

Create a friendly guide interface that can:

\- Welcome the user.

\- Explain the current section.

\- Introduce objectives.

\- Offer contextual guidance.

\- Display helpful hints.

\- Respond to user interaction.



If no AI service or backend exists, implement a clearly defined frontend interaction layer with sample scripted guidance. Do not claim a real AI conversation is happening.



\### Phase-based behavior

The guide should adapt its presentation to:

1\. Welcome.

2\. Mission selection.

3\. Exploration.

4\. Training.

5\. Mission completion.



\### Acceptance criteria

The guide must feel like part of the product, not a permanently open generic chatbot.



\---



\# PROMPT 08 — COMPANION DRONE



\### Objective

Make the drone a meaningful visual companion.



Use the actual `companion\_drone.glb`.



\### Requirements

\- Correct scale and proportions.

\- Smooth hovering behavior.

\- Subtle rotation and orientation changes.

\- Contextual positioning.

\- Appropriate lighting.

\- Non-intrusive presence.

\- Responsive behavior across screen sizes.



\### UX behavior

The drone may provide visual cues for:

\- Navigation.

\- Mission progress.

\- Discovery.

\- Interaction availability.

\- Loading or system status.



Do not invent complex autonomous intelligence.



If the drone has no actual animation rig, implement lightweight external movement without distorting its model.



\### Acceptance criteria

The drone must appear consistent with the supplied model and the overall visual identity.



\---



\# PROMPT 09 — MISSION OBJECTIVES AND TRAINING HUB



\### Objective

Create the mission and training experience.



\### Mission interface

Provide:

\- Mission overview.

\- Objectives.

\- Progress indicators.

\- Task completion states.

\- Relevant learning information.

\- Clear navigation.



\### Training hub

Create a structured training interface that can accommodate different learning modules.



Each module should communicate:

\- Learning objective.

\- Required activity.

\- Progress.

\- Completion status.



\### UX principles

\- Keep tasks understandable.

\- Avoid information overload.

\- Make progress visible.

\- Provide meaningful feedback.

\- Use clear completion and warning states.



\### Data integrity

Use existing backend data if supplied by teammates.



If backend integration is unavailable, use clearly identified demonstration data. Never present demonstration data as a real user record.



\### Acceptance criteria

Users must understand what they are expected to do and how their progress is represented.



\---



\# PROMPT 10 — 3D PLANETARY ENVIRONMENT AND SPACE ASSETS



\### Objective

Improve the 3D environment and integrate the remaining supplied models where they add meaningful value.



\### Available assets

Inspect and use suitable models from:

\- `public/assets/models/`

\- `public/assets/textures/`



Potential models include:

\- Apollo Lunar Module.

\- ISS stationary model.

\- Curiosity rover.

\- Space Exploration Vehicle.

\- OSTM Jason-2.



\### Requirements

\- Inspect models before integration.

\- Confirm model dimensions and orientation.

\- Correct scale and camera placement.

\- Use appropriate lighting.

\- Preserve materials where possible.

\- Optimize texture and geometry loading.

\- Avoid loading every model at once.



\### UX direction

3D assets must support exploration and understanding. Do not place objects merely to fill empty space.



\### Acceptance criteria

Each model must have a clear purpose, correct presentation, and acceptable performance.



\---



\# PROMPT 11 — ANIMATION, PARTICLE EFFECTS AND AUDIO DESIGN



\### Objective

Create a consistent interaction and motion language.



\### Animation requirements

Implement appropriate:

\- Page transitions.

\- Panel transitions.

\- Planetary motion.

\- Drone hovering.

\- Astronaut idle movement.

\- Mission progress animation.

\- Loading effects.

\- Particle-based dissolve effects.



\### Atomic disappearance effect

When a specific UI element needs to disappear after an action:

\- Break the element into small particles.

\- Animate them dispersing.

\- Fade out the original element.

\- Ensure the interaction remains accessible.

\- Do not make essential navigation disappear permanently.



Use performant techniques appropriate for integrated graphics.



\### Audio inventory

Use:

\- `public/assets/audio/ui/`

\- `public/assets/audio/nasa/`

\- `public/assets/audio/ambience/`



Inspect audio before assigning effects.



Use UI audio for appropriate interactions, NASA audio only where its actual content and permitted usage make sense, and ambience as an optional background layer.



\### Audio UX

\- User-controlled mute.

\- Volume control where supported.

\- No unexpected loud autoplay.

\- No unnecessary overlapping effects.

\- Respect browser autoplay restrictions.



\### Acceptance criteria

Animation and audio should enhance the experience without interfering with usability or performance.



\---



\# PROMPT 12 — RESPONSIVE DESIGN, ACCESSIBILITY AND PERFORMANCE



\### Objective

Ensure the experience works on ordinary hardware and different screen sizes.



\### Responsive requirements

Test:

\- Desktop.

\- Laptop.

\- Tablet-width layouts.

\- Mobile-width layouts.



Prevent:

\- Horizontal overflow.

\- Overlapping navigation.

\- Unreadable text.

\- Cropped essential controls.

\- Broken 3D canvases.



\### Performance requirements

\- Lazy-load large models.

\- Optimize textures.

\- Avoid unnecessary post-processing.

\- Limit expensive particle effects.

\- Reduce animation when appropriate.

\- Pause unnecessary rendering when hidden.

\- Clean up rendering resources.

\- Provide graceful fallbacks.



\### Accessibility requirements

\- Keyboard navigation.

\- Visible focus indicators.

\- Readable contrast.

\- Semantic controls.

\- Accessible labels.

\- Reduced-motion support.

\- No color-only status communication.



\### Acceptance criteria

The core experience must remain usable without a high-end graphics card.



\---



\# PROMPT 13 — FINAL INTEGRATION, QUALITY ASSURANCE AND HANDOFF



\### Objective

Review the complete CrewReady frontend and prepare it for team demonstration and integration.



\### Review checklist



VISUAL:

\- Consistent design system.

\- Correct typography.

\- Correct color usage.

\- Consistent spacing.

\- Premium visual hierarchy.

\- No generic placeholder screens.

\- Correct supplied assets.



FUNCTIONAL:

\- Navigation works.

\- Buttons work.

\- Panels open and close.

\- Clock systems calculate correctly.

\- Audio controls work.

\- Model loading and fallbacks work.

\- Mission interactions have meaningful responses.



TECHNICAL:

\- No avoidable console errors.

\- No broken asset paths.

\- No unnecessary duplicate components.

\- No broken routes.

\- No accidental destructive changes.

\- Build succeeds.

\- Existing project functionality remains intact.



PERFORMANCE:

\- Test on modest hardware assumptions.

\- Check large asset loading.

\- Check unnecessary animation.

\- Check rendering and memory behavior.



\### Backend integration

Inspect the backend integration points supplied by teammates.



Do not invent API contracts.



Document:

\- Required API endpoints.

\- Expected data structures.

\- Authentication dependencies, if any.

\- Loading and error states.

\- Features awaiting backend integration.



\### Final handoff report

Provide:

1\. Implemented features.

2\. Files created or modified.

3\. Assets integrated.

4\. Verified interactions.

5\. Build and test results.

6\. Known issues.

7\. Remaining backend dependencies.

8\. Recommended next improvements.



\### Final acceptance criterion



CrewReady must feel like one coherent, immersive, scientifically responsible space exploration experience.



It should not feel like thirteen unrelated pages assembled together.



\---



\# DEVELOPMENT CONTROL RULES



1\. Execute prompts sequentially.

2\. Do not skip inspection.

3\. Do not automatically execute the next prompt.

4\. Do not rewrite the entire project for a small feature.

5\. Do not replace supplied assets with generic alternatives.

6\. Do not invent scientific facts or live telemetry.

7\. Do not claim tests passed unless they were run.

8\. Report all modified files.

9\. Preserve existing working features.

10\. Wait for approval before proceeding.


