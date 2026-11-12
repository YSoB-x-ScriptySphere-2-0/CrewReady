# CrewReady: Beyond Us — Final Plan v11

NASA Space Apps Challenge 2026 · Challenge: **Build a Junior Astronaut Mission Trainer** · Team CrewReady, Cumilla, Bangladesh

This is the plan the whole team follows for the game and the videos. It replaces every earlier plan (v10.1 included). If another file disagrees with this one, this one wins.

**How to read it.** Sections 1–3 say what we are building and why it can win. Sections 4–6 are the heart: the story, the rules, and all six levels in full — what happens, what the player can choose, what each choice does, what wins and what fails. Sections 7–9 cover the rest of the app, the data and the sources. Sections 10–13 are the team, the videos, the schedule and the final checklist.

### What changed in v11 (13 Nov 2026)

Why: a child play-test said the game is **still a bit hard for a child to understand**, and the fact check found lines that were not true as written. The six levels, the four meters and the decision numbers are unchanged. What changed:

| # | Change | Where |
|---|---|---|
| 1 | **Every fact checked.** All 33 facts were checked on NASA and NOAA pages, and checked again by a second reviewer. Wrong or unsourced lines are out of the game (e.g. "5 to 20 minutes" is now "3 to 22", Apollo 13's filters "didn't fit" rather than "failed", real missions never folded panels) | `docs/06` §4 |
| 2 | **New opening: "Earth is too full".** A 3D cinematic: Earth's city lights spread until the planet glows, Mission Control asks for a second base on Mars, and the child suits up as the hero (Orbit) or heroine (Nova). Replaces the asteroid story | §4 |
| 3 | **Simple words everywhere.** Words a Bangladeshi class 3–5 child already knows; a hard word stays only with an explain card | §5.5 |
| 4 | **Explain cards and Hint, two different buttons.** **?** explains an idea in full, simple sentences. The **bulb** gives a hint. Twinkle's tour in mission 1 shows both and says the goal: *don't let any bar reach zero* | §5.3, §5.5 |
| 5 | **A bonus mini-game in every level**: countdown timing, space-rock zapping, leak whacking, panel wiping, plant matching, rock sorting. They earn stardust only | §5.6 |
| 6 | **One points story.** Stars measure science and set your rank. Stardust comes from Fly, bonus games and finishing levels, and is spent on rocket upgrades that are packed into the **next** mission | §5.7 |
| 7 | **Bugs from the 13 Nov audit** go first (upgrades only applied from one button, wrong prices, star farming on retry, Reset not resetting, Fly HUD frozen, and more) | `docs/BUILD_SEQUENCE.md` phase B |
| 8 | **Real team names, Cumilla, and the art tool (ChatGPT image generation)** | §10, §8.3 |

### What changed in v10 (12 Nov 2026)

The story, the four meters, the six levels and every number are **unchanged**. What changed is how the game is shown, taught and shipped.

| # | Change | Where |
|---|---|---|
| 1 | **Landscape everywhere.** One wide stage on phones, tablets and laptops. A phone held upright shows the same stage turned sideways, so nobody is blocked | §7.1 |
| 2 | **Welcome screen on every launch.** While the game loads, the real-looking crew turns into the game crew. Then Play and How to Play | §7, part 0 |
| 3 | **See it, don't read it.** Every decision opens with the danger happening in the scene; choices are pictures with 2–5 words; results are acted out, then drawn as a chain. A word budget per screen. Text only labels | `docs/BUILD_SEQUENCE.md` §4.1a |
| 3b | **New look: deep space, cinematic.** Dark navy scenes, the 3D crew large in the frame, a cyan main button. The paper-card look is retired | `docs/BUILD_SEQUENCE.md` §4 |
| 4 | **Nova wears pink.** Orbit is teal, Nova is pink, Twinkle is cyan | §7, done |
| 5 | **A learning layer.** See what a choice touches before you pick, watch the chain reaction after, try one small toy per idea, collect Space Words, have any text read aloud | §5.4 |
| 6 | **English and Bangla.** A switch on the welcome screen | §7.2 |
| 7 | **Works offline after the first visit** (installable web app) | §9 |
| 8 | **Rules from the Bangladesh guides we had missed:** nobody under 18 seen, heard or named in a video; AI-made art credited; real deadlines; a judge playing within 15 seconds | §3.3, §10, §11, §12 |

---

## 1. The solution in one sentence

> **CrewReady is a free browser game where kids aged 7–12 command a Mars mission across six levels, and every choice trades power, air and water, food, or radiation protection — driven by real NASA data.**

Why this exact sentence: it names the audience the challenge names (7–12), the format the challenge asks for (browser, free), the thing the player does (commands a mission), the lesson (every choice is a trade), and the proof (real NASA data). A judge who hears only this sentence already knows we answered the challenge. It opens both videos, the project page and the README.

---

## 2. What the challenge asks, and how we answer it

These points come from the written challenge and from the briefing by its author, Mike Givens. Each row is something a judge can check in under a minute.

| The challenge says | Our answer | Where a judge sees it |
|---|---|---|
| Kids aged 7–12 run a lunar or Martian outpost | One Mars mission in six levels, written for a 7-year-old reader | Levels 3–6 are the outpost |
| "Not a quiz, not a slideshow" — a living simulation | Meters drain every sol; the player packs crates, stows cargo, orders a landing checklist, sets power sliders, picks a crew | Every level has a hands-on step |
| "There is no unlimited resource mode in space" | Every option changes at least two things. The game refuses to load a level that breaks this rule | Any choice, any level |
| Five systems: life support, radiation shielding, power budgeting, food production, communication delay | Each is the main subject of one level and all five return in level 6 | Section 6 |
| Coupled systems: a decision in one must visibly hit another | A reason line after every choice, and choices that come back in later levels | "Remember the panels you left out?" |
| Use NASA DONKI so today's solar weather shifts in-game risk | Live DONKI sets the storm size in levels 2 and 6 and the speed of Fly | DONKI card with today's date |
| Real data, attributed, never static shown as live | A source line under every screen; a LIVE / ARCHIVE / GAME ESTIMATE badge on every data card | Bottom of every screen |
| Browser-friendly, no install, no account | A static web app that opens from a link on a phone | The link |
| Replayable; failure teaches | Mission Replay instead of Game Over; storm, dust and crew change between runs | Fail any level |
| "Fun and accurate are the same goal" | The fun part — deciding under pressure — is the accurate part | The whole mission |
| "Teaches by doing rather than by telling" (challenge summary) | One touch toy per idea, a preview of what each choice touches, a picture chain after it | §5.4 |

---

## 3. How we are judged

### 3.1 The score sheet (118 points, Participants Guide)

Judges score five main criteria out of 20 each. A 20 means "I could not have imagined this"; a 10 means "unique, but I have heard of something similar". So for each criterion we need one thing a judge has not seen before.

| Criterion | Points | The judge asks | What earns it | Our "not seen before" |
|---|---|---|---|---|
| Impact | 20 | Who benefits, how many, is it measurable? | Free, phone browser, no login; six stated learning outcomes; a real play-test quoted | A child can state six true mission constraints after 15 minutes |
| Creativity | 20 | Fresh, or routine? | Story, hook, cascades, crew finale | Today's real Sun changes today's game |
| Validity | 20 | Would it work tomorrow? Is it trustworthy? | Working public build; every fact sourced; a "what we simplified" page; tested with a child | A source line under every single screen |
| Relevance | 20 | NASA-data-first, or NASA-data-added? | All five systems; DONKI drives a mechanic | Remove the data and level 2 does not work |
| Presentation | 20 | Understood and remembered in 240 s? | Hook, solution first, real gameplay, subtitles | The video opens inside the game's own hook |
| Teamwork | 5 | Real collaboration? | Named roles and a "who did what because of whom" story | — |
| User experience | 5 | Can anyone use it? | A first-timer finishes level 1 in 3 minutes, unaided | — |
| NASA data usage | 5 | Top mark needs NASA data **plus** another agency's | NASA DONKI, NeoWs, EPIC, InSight, OSDR, Images, APOD **plus NOAA** | — |
| Named challenge · open repo · complete page | 3 | Yes / no | Section 13 | — |
| Bonus | +5% | A woman on the team | List every member on the NASA team page | — |

To be eligible at all: answer one official challenge and name it; link a public repository; use NASA open data; keep the code open source; register every member with a role. **Every member must be named in both videos.**

### 3.2 Global awards we aim at

Local judges tick which global category they nominate a project for, and global judges decide from the **project page** — so the page must stay complete and current.

| Award | Given for | Why we fit | What we must show |
|---|---|---|---|
| **Best Use of Data** — first target | Making space data accessible, or applying it uniquely | A 7-year-old feels today's real solar storm as a decision | DONKI live on screen with its date and source |
| **Best Storytelling** — second target | Communicating the potential of open data through storytelling | One story, Earth to Mars, in which NASA data is the plot | The six-level arc, told clearly |
| Most Inspirational | Capturing hearts | A child commanding a crew; the Nazrul line | A real play-test moment (hands only) |
| Local Impact | Greatest potential for local impact | Low-end phones, no login, Bangla planned | Say it in the Impact section |
| Best Mission Concept | Most plausible concept and design | Decisions follow real mission logic | Sources and the "what we simplified" page |

### 3.3 What the Bangladesh build guide says about this challenge

From the event's own build guide (`nasa guidelines/space-apps-2026-bangladesh-build-guide.md`, challenge 03). Each line is a risk it names, and our answer.

| The guide says | Our answer |
|---|---|
| **Killer demo:** hand a judge a phone; within 15 seconds they are playing, failing, then succeeding, with no explanation | Welcome → Play → the Sol 214 hook. One tap and two meters drop. Target: first choice made within 15 seconds of the link opening |
| **The trap:** education projects score low on Relevance because NASA data ends up as decoration. Make one mission depend on real data, and name the dataset on camera | Level 2's storm size comes from DONKI. The video says "NASA DONKI" and "NOAA" out loud |
| Points sit in **User experience and Presentation** | Landscape stage, big crew, one main button per screen, footage that fills a 16:9 video |
| "Game design on the night is what kills these projects" | The design is frozen in this plan. On the night we only build and film |
| Works with the wifi off; assets cached by a service worker | §9 |
| English and Bangla strings | §7.2 |
| Touch targets 44 px or more, keyboard playable, reduced motion respected, **colour never the only signal** | Every meter has an icon and a name as well as a colour. Build sequence §3 |
| Saved progress must never crash the game | Every read and write of saved data is guarded; an empty save starts a fresh game |
| Credit every NASA image with its source link | Sources page |
| **No recognisable name, voice or face of anyone under 18** in a video or the submission | §10 and §11.2 |
| Open source; with no licence named, NASA applies Apache 2.0 | We name **Apache-2.0** ourselves |
| `docs/AI_USE.md`: every AI tool, what it was used for, and what we did ourselves | Written in the publish step |

---

## 4. The story

### 4.0 v11 decision: "Earth is too full" replaces the asteroid

The team asked for a start where the child *sees* that Earth could stop being a good home, through crowding or a sudden pandemic, and then steps up as a hero. We use **crowding only**:

| Idea | Decision | Why |
|---|---|---|
| Earth gets too full: too many people, not enough food, water and room | **Use**, as a "what if" future, tagged FICTION | Easy to *see* (city lights spreading across a 3D Earth), not scary, and it leads straight into the game's lesson: supplies are limited |
| A sudden pandemic | **Do not use** | Our players are 7. After COVID-19 a pandemic story can frighten children and parents, and it has nothing to do with the five systems the challenge asks for |
| The asteroid | **Retire from the story.** NASA asteroid tracking (NeoWs) moves to the Fly screen | One reason is easier for a child than two. The real data is still shown |
| "The kid becomes the hero" | **Keep and make it the climax** of the opening: pick Orbit or Nova, watch them suit up | A child plays better when the game says "you" |

The old link between the story's dust and level 4 is dropped. Level 4 now opens with real Mars dust (F17, F21) instead.

### 4.1 Review of the proposed asteroid story (v10, kept for history)

The other draft proposed: an asteroid hits Earth, humanity fails to stop it, millions crowd into one surviving region, and a crew leaves for Mars. Here is what we keep, what we change, and why.

| Element | Decision | Reason |
|---|---|---|
| An asteroid as the reason for the mission | **Keep** | It gives the mission stakes in one sentence, and it lets us show real NASA asteroid tracking |
| "Mars Continuity Programme" and Mission Control | **Keep** | A good name; it makes the player part of something |
| "The Last Departure", "The Dangerous Journey" level names | **Keep** | Stronger than our old names |
| Stowing supplies in compartments, with life-support and emergency gear within reach | **Keep** — new step in level 1 | A real practice, and it creates choices that come back later |
| Landing-zone inspection and landing checklist | **Keep** — moved to the end of level 2 | Hands-on, and landing is the moment kids know from real rover videos |
| Exploration and rock-sample collection | **Keep** — the science goal of level 6 | Ties to Perseverance and Mars Sample Return |
| Humanity fails; widespread destruction; millions displaced and overcrowded; shortages of medicine and shelter | **Soften** | Our players are 7. A hopeless Earth is frightening, and it spends video seconds on things that are not the challenge. In our version the asteroid is small, the damage is real but Earth is recovering, and nobody is described as dying |
| Mars as humanity's new home | **Change** to "a second foothold" | NASA is clear that Mars is not a safe, self-sustaining home today. Our crew builds an outpost and proves it can be done |
| Long backstory before play | **Cut to three sentences** | The challenge is about running the outpost. The story is a doorway, not a room |

### 4.2 The opening as the player meets it (v11)

A 3D cinematic of about 25 seconds, shown after the Sol 214 hook on the first Play (section 7), skippable with one tap. Three beats, each a picture first with at most 20 words. Every beat carries the `FICTION` tag.

1. **"Too Full"** — a slowly turning 3D Earth. On its night side, city lights spread and join until the whole side glows; cars and crowds hum quietly. Text: *"What if Earth gets too full? Too many people. Not enough food, water or room."*
2. **"A Second Home"** — the camera pulls back; Mars appears, a dotted line to it. Mission Control's badge lights up. Text: *"Mission Control has a plan: build a base on Mars. A second home, just in case."*
3. **"You!"** — the launch pad. The child taps **Orbit** or **Nova**. The chosen kid steps forward, the helmet clicks shut, a **Junior Astronaut** badge stamps on. Twinkle flies in. Text: *"They need a junior astronaut. Brave. Careful. Smart. That's you!"*

Then Twinkle's tour starts mission 1 (§5.3).

**How it is built.** In the game it is real-time 3D with three.js (`CrisisEarth3D` and `HeroCadetRocket3D` already exist, so no new library, and it works offline). With reduced motion or no WebGL it shows three still pictures. The same three beats are a Remotion composition in `crewready-video/` so both videos open with exactly the game's own scene.

**Real data in the opening:** none needed. The level 1 card still shows today's EPIC photo of Earth (F3). NeoWs moves to Fly: *"Real space rocks passing Earth this week: N. NASA knows of no big asteroid hitting Earth in the next 100 years."* (F4).

### 4.3 The honesty note (shown on the Sources page and the project page)

"The crowded-Earth future and the Mars Continuity Programme are fiction made for this game. Mars is not yet a safe home for people. Our meter numbers are simplified for play and are not engineering values. Folding the panels is a choice for our made-up base; real rovers rode out dust by switching things off. Everything else — the storms, the dust, the delay, the lettuce — is real, and each screen names its source."

---

## 5. Mission rules

These rules make the game a simulation. They apply to every level.

### 5.1 The four meters

| Meter | What it stands for | Why a child cares | If it reaches 0 |
|---|---|---|---|
| **Power** | Electricity from solar panels and batteries | "Lights, heaters and machines" | The outpost goes dark and cold |
| **Air & Water** | Oxygen to breathe, clean water to drink (life support) | "What we breathe and drink" | The crew cannot stay |
| **Food** | Packed meals plus what the greenhouse grows | "What we eat" | The crew is too hungry to work |
| **Shield** | Protection from space radiation | "Our armour against the Sun's storms" | The crew has had too much radiation |

Each runs from 0 to 100 and shows an icon, a name and a number. **Science Stars** are the score: they measure what the mission discovered, and they tempt the player to take risks.

Why four and not six: the challenge says two or three core resources work better than five or six for this age. Four is the smallest number that still covers every system the brief names.

### 5.2 How time and supplies work

- **Sols.** A sol is a Mars day. Each level covers a stretch of the mission, and a sol counter runs on screen.
- **Living costs.** A crew eats and breathes whether or not anything goes wrong. On entering levels 2–6: Air & Water −2, Food −2. The player watches the meters tick down.
- **Sunlight.** On Mars the panels recharge the batteries. On entering levels 4, 5 and 6: Power +15 — unless the panels are buried in dust.
- **No free choices.** Every option changes at least two things: two meters, or a meter and stars, or a meter now and a consequence later.
- **Consequences come back.** Some choices set a marker that pays or costs in a later level. When it triggers, Twinkle says so: "Remember the panels you left out in the storm?"
- **Real data sets the size of events.** Storm size X (levels 2 and 6) comes from DONKI: small 10, medium 20, large 30. Dust size D (level 4) is one of three real cases: 5, 15 or 25.

### 5.3 Help, failure and success

- **Twinkle's tour (mission 1, new in v11).** Before the first crate is packed, Twinkle points at five things, one tap each: (1) the four bars — *"These keep your crew alive. If one reaches zero, the mission stops."* (2) the **?** button — *"Don't know a word? Tap ?"* (3) the **bulb** — *"Stuck? Tap the bulb for a hint."* (4) a choice card — *"Tap to look. Tap GO to pick."* (5) the star and stardust counters — *"Stars for science. Stardust for upgrades."* It can be replayed from Profile and never shows again unless asked.
- **Hints (the bulb).** Twinkle names the lowest meter and what each option costs. Never the answer.
- **Explain cards (the ?).** A full, simple explanation of the idea on this screen (see §5.5). Hints help you choose; explain cards help you understand.
- **Failing a level.** If any meter reaches 0 the level stops and **Mission Replay** opens. It shows three things: the choice that drained the meter, why that happens on a real mission (with its source), and a button to try the level again with the meters the player entered it with. Stars are kept. Nobody dies; Mission Control "pauses the mission".
- **Winning the mission.** The player wins by reaching the end of level 6 — Sol 500 — with every meter above 0. Then the **Outpost Check** counts how many of the four systems are healthy (30 or more):

| Result | Needed | What the player is told |
|---|---|---|
| **Outpost Survives** — Cadet | Finished, fewer than 3 healthy systems | "You made it! The base is weak. The next crew has work to do." |
| **Outpost Stable** — Pilot | 3 healthy systems, or 4+ stars | "The base can hold on until the next rocket comes." |
| **Outpost Thriving** — Commander | All 4 healthy **and** 6+ stars | "Earth is cheering. People now have a second home." |

The success screen then lists the six things the player learned (section 6.8), each with its source, and NASA's picture of the day as the reward.

### 5.4 How the game teaches (new in v10)

A 7-year-old does not learn "coupled systems" from a sentence. They learn it by touching one thing and seeing another thing move. Six tools do that. None of them changes a meter or adds a fact: each one shows what sections 5 and 6 already say.

| Tool | What the child does | The idea it makes easy | Where |
|---|---|---|---|
| **Event moment** | Watches the danger happen before choosing: a wave of storm light, a dust wall, air hissing out (2–3 s, no reading) | Space hazards are real things you can see coming | Every decision |
| **Look first** | Taps a choice once. The meters it will touch wiggle and show an up or down arrow, with no numbers. A second tap on **GO** confirms | Every choice touches more than one system | Every decision |
| **Chain reaction** | Watches three pictures link up after a choice: lights dim → plants slow → Food −5 | Why one system hits another | Every result |
| **Try it** | Plays a 10-second toy before the level's first decision. No score, no cost, can be skipped | The level's one big idea, felt by hand | Levels 2–5 (below) |
| **Space Words** | Taps an underlined word and gets a picture and one short sentence. The word goes into the Space Book | Hard words: sol, radiation, recycler, carbon dioxide | Wherever the word first appears |
| **Read to me** | Taps the speaker on any speech bubble to hear it | Reading is not a barrier | Every bubble (hidden if the device has no voice for the language) |
| **I learned** | Flips six badges at the end, one true sentence each | Something to say to a parent | Success screen |

**The four Try-it toys.** Each uses only a fact already in section 6.

| Level | Toy | What the hand feels |
|---|---|---|
| 2 | Drag water bags between the Sun's rays and the crew | The rays stop at the water. Thick things are armour |
| 3 | Tap **Send**. A dot crawls to Earth and back while the cabin clock runs | Help from Earth arrives late |
| 4 | Dust falls on a solar panel and the power bar sinks. Wipe it and the bar climbs | Solar power depends on a clear panel and a clear sky |
| 5 | Tap to water a plant. The water bar drops as the plant grows | Food costs water |

Levels 1 and 6 need no toy: packing crates and picking a crew are the lesson.

**For grown-ups.** The Sources page ends with a short "Use it in class" note: 15 minutes, six things a child can say afterwards (§6.8), no login, no data collected.

### 5.5 Simple words and explain cards (new in v11)

**The rule.** Every player-facing line uses words a child in Bangladesh meets in class 3–5 English and science books. Sentences stay under 12 words. If a real space word has no easy swap, keep it, underline it and give it an explain card.

| Hard word | Use instead | Explain card? |
|---|---|---|
| habitat, outpost | base, Mars home | — |
| meter | bar | — |
| resources, supplies, cargo | things you need, what you pack | — |
| radiation | space rays | **Yes** — "Radiation" |
| shelter | safe room | — |
| sol | Mars day (show "Day 214 on Mars") | **Yes** — "Sol" |
| recycler | water cleaner | **Yes** — "Water cleaner" |
| CO₂ scrubber, filter | air cleaner | **Yes** — "Air cleaner" |
| carbon dioxide | the air we breathe out | **Yes** |
| oxygen | oxygen (in the class 3–5 science book) | **Yes** |
| solar panel | solar panel | **Yes** |
| regolith | Mars soil | — |
| delta | old river bed | — |
| specialist | expert | — |
| experiment | science test | — |
| landing zone | landing spot | — |
| Mission Replay | Try again | — |
| consequence | "comes back later" | — |
| trajectory, telemetry, geomagnetic | (do not use) | — |

**Explain cards.** One component, opened by the **?** on any screen or by tapping an underlined word. Each card: a big picture, a title, then 2–4 short sentences (at most 40 words), a Read-to-me speaker, and the source line. Facts only from `docs/06` §4 kid wording. Cards for: the four bars, the goal ("keep every bar above zero"), stars, stardust, sol, space rays, Sun storms and Kp, safe room, message delay, oxygen maker, solar power and dust, battery sharing, greenhouse, water cleaner, air cleaner, experts in a crew. They replace and extend the Space Words; each one opened goes into the Space Book.

Example — **Space rays (radiation):** *"The Sun sends out invisible rays. Too many can make people sick. Thick things like water stop them. So astronauts hide behind water bags in a Sun storm."* Source: F8.

### 5.6 Bonus rounds — one mini-game per level (new in v11)

After a level's last decision and before the reward crate, a **Bonus round** card offers one 20–30 second mini-game of a kind children already play. One tap starts it, **Skip** is always there. Bonus rounds **earn stardust only** (0 to 30 per round); they never change the four bars or the Science Stars, so the mission stays a fair test of choices.

| Level | Bonus round | How you play | The space idea it shows |
|---|---|---|---|
| 1 | **Countdown** (timing) | A needle swings; tap when it is in the green zone, three times: 3, 2, 1, lift-off | Rockets leave at the right moment (launch window, F1) |
| 2 | **Space Rock Zapper** (shooting) | Tap the rocks and junk flying at the ship before they hit the shield | Thick things protect the ship |
| 3 | **Leak Patrol** (whack-a-mole) | Cracks pop up in the base wall; tap each before the air puffs out | Fix it yourself, fast (message delay, F11) |
| 4 | **Panel Wipe** (swipe) | Swipe dust off four solar panels as it falls; the power bar rises | Clean panels give power (F22) |
| 5 | **Seed Match** (memory and colour match) | Flip cards to match each seed with its plant; matched plants grow | Farms take care and time |
| 6 | **Rock Sorter** (sorting by colour **and** shape) | Drag rocks into the matching sample tube | Scientists sort samples (F30) |

Every bonus round: one thumb or the keyboard, 44 px targets, no reading needed (one picture and at most 5 words), reduced motion keeps the game playable, colour is never the only clue.

### 5.7 How points work — one story (new in v11)

Two kinds of points, each with one clear job. The Home screen shows both; tapping either opens the "How points work" explain card, which draws this loop:

```
 Play a level ──► ⭐ Science Stars ──► your RANK (Cadet → Pilot → Commander → Mars Pioneer)
      │                                 and the Outpost Check at the end
      ▼
 Bonus round, Fly, finish a level ──► ✦ Stardust ──► Resources: pack an upgrade
                                                              │
                     a stronger start for the NEXT mission ◄──┘
```

| | ⭐ Science Stars | ✦ Stardust |
|---|---|---|
| What it means | What your mission discovered | Fuel for upgrades |
| Earned by | Science choices in levels (as in §6). Each level's stars count **once**, even after Try again | Fly (1 per dust, 2 with Boost) · Bonus round (up to 30) · finishing a level for the first time (+10) · first time you open a new explain card (+2) |
| Spent on | Nothing — stars are kept | Resources upgrades: 15 ✦ for the first step, 30 ✦ for the second |
| Used for | Rank and badges (kept forever, across missions) · the Outpost Check (this mission) · the leaderboard | A +5 starting bar for the next mission. The rocket fits **4 upgrades**, and they are **used up** when that mission launches — no unlimited mode |
| Shown | Top bar in levels, Home, Profile | Home, Fly, Resources, the end of each bonus round |

Why this shape: the challenge says "there is no unlimited resource mode", so stardust must be spent and upgrades must run out. Stars stay a pure measure of the mission, so bonus games and Fly can never buy a better Outpost result.

All numbers in section 6 are starting values. The balance script in hours 16–22 plays every possible path and tunes them so that careful play wins, greedy play fails, and no single option is always best.

---

## 6. The Mars mission — six levels in full

For each level: what it teaches, what happens, every choice and its outcome, how to pass, and how it is lost.

### 6.1 Level 1 — The Last Departure · Earth, launch day

**Teaches:** mass budget — a rocket cannot carry everything.
**Systems:** all four, plus radiation shielding as weight.
**Real data on screen:** today's photo of Earth from NASA's EPIC camera (live).

**What happens.** The launch window closes tomorrow, and the next one is 26 months away. The player sees the cargo bay, four empty bins and eight crates. Twinkle: "Eight crates, four needs. What will you run short of?"

**Step 1 — Pack (hands-on).** Every meter starts at 40. The player drags 8 crates into four bins. Each crate adds 15 to that meter.

| Bin | Adds to | What is in the crate |
|---|---|---|
| Solar panels and batteries | Power | Fold-out panels |
| Oxygen and water tanks | Air & Water | Tanks and recycler parts |
| Food packs | Food | Dried meals |
| Shield panels | Shield | Heavy plates for the storm shelter |

There is no perfect packing. Two crates each gives 60 everywhere and no strength. Four crates of food leaves another system at 40, and that system will fail in the level that tests it.

**Step 2 — The last seat (decision).** One cargo seat is left.

| Option | Right away | Comes back later |
|---|---|---|
| Science lab kit | ⭐ +2 · Food −5 (it takes the snack locker) | Level 6: rock samples are worth +1 ⭐ |
| Spare parts box | Power +10 · Shield −5 (it sits where a shield plate was) | Level 4: buried panels are repaired at no cost |
| Seeds and soil | Food +5 · Air & Water −5 (seeds need water from day one) | Level 5: the farm grows +10 more food |

**Step 3 — Stow the ship (hands-on).** Four items, but only **two** fit within arm's reach of the crew seats. The rest go deep in the hold. What is within reach is free to use later; what is in the hold costs time to dig out.

| Item | If within reach | If in the hold |
|---|---|---|
| Water bags (for the storm shelter) | Level 2: the shelter is built in time | Level 2: the shelter is late, Shield −5 more |
| Spare water filter | Level 2: the filter swap costs nothing extra | Level 2: the swap opens the shield wall, Shield −10 |
| Medical kit | Level 2: a rough landing costs nothing | Level 2: a rough landing costs Air & Water −5 more |
| Tool kit | Level 3: patching the leak costs no Power | Level 3: patching costs Power −5 |

**Pass:** launch with every meter above 0 (always true here — this level cannot be lost).
**The real lesson of failure comes later:** whatever was packed thin is the meter that reaches 0 in levels 2–5. Mission Replay will point back to this bay.
**Source line:** `Earth: NASA EPIC · LIVE · Launch windows: NASA Mars missions`

### 6.2 Level 2 — The Dangerous Journey · deep space, then Mars arrival

**Teaches:** radiation shielding — the Sun has storms, and mass is armour.
**Systems:** radiation shielding, life support.
**Real data on screen:** a solar storm from NASA DONKI with NOAA's storm index (live). If the Sun is quiet this month, the card says so and loads the real storm of May 2024 from the archive.

**What happens.** About seven months of travel (F2). Outside Earth's magnetic field nothing blocks the Sun's storms. An alert arrives — the same kind flight controllers use to send astronauts to shelter.

**Decision 1 — Storm alert. The blast arrives in one hour.** (X is the storm size from real data.)

| Option | Outcome | Why |
|---|---|---|
| Build a shelter from water bags and food boxes and wait inside | Shield −(X−10) · Food −5 · Power −5 | Water is a good radiation shield, but nobody can work, and the shelter is cramped |
| Keep working on the experiment | ⭐ +2 · Shield −(X+5) | The science is finished; the crew took the full dose |
| Turn the ship so the fuel tanks face the Sun, and power down | Shield −(X−5) · Power −15 | The tanks block part of the storm, but the solar panels now face away |

**Decision 2 — The water recycler filter is clogged.**

| Option | Outcome | Why |
|---|---|---|
| Run the cleaning cycle now | Power −15 · Air & Water +10 | Cleaning takes a lot of electricity |
| Drink less until Mars | Air & Water −15 · Food −5 | Dried food cannot be eaten without water |
| Swap in the spare filter | Air & Water +5 (and Shield −10 if the filter was stowed in the hold) | A fresh filter works at once — if you can reach it |

**Decision 3 — Choose the landing zone.** Mars fills the window. Three zones are marked on a real photo of Jezero Crater.

| Zone | Right away | Comes back later |
|---|---|---|
| The flat plain — smooth and sunny | Power +10 · Shield −10 (open ground, nothing to hide behind) | — |
| Beside the crater cliff — sheltered | Shield +10 · Power −10 (shade for part of each day) | Level 4: the cliff blocks some dust, D is 5 lower |
| The old river delta — best science, rocky | ⭐ +2 · Air & Water −10 (a hard bounce cracks a tank) | Level 6: rock samples are worth +1 ⭐ |

**Step 4 — Landing checklist (hands-on).** Put four steps in order: heat shield → parachute → landing engines → touchdown. Right order: ⭐ +1, soft landing. Wrong order: a rough landing, Power −5 and Shield −5 (and Air & Water −5 if the medical kit is in the hold), then try again.

**Pass:** touch down on Mars with every meter above 0.
**How it is lost:** Shield reaches 0 — too few shield crates, a large storm, and the choice to keep working. Mission Replay: "On a real mission, the crew stops work and shelters as soon as the alert comes."
**Source line:** `Storm: NASA DONKI + NOAA SWPC · LIVE · Radiation in deep space: NASA Human Research Program`

### 6.3 Level 3 — First Breath · Mars, Sol 1 to Sol 30

**Teaches:** communication delay — Earth cannot help in time — and life support.
**Systems:** life support, communication delay, radiation shielding.
**Real data on screen:** a Perseverance photo of the landing area; real Mars air temperatures from the InSight lander (archive, 2020: the archived API record for sol 675 averages −62.3 °C). Spoken or written facts use F13: one Mars day went from about −95 °C to −17 °C.

**What happens.** The crew steps out. The air is almost all carbon dioxide and far too thin to breathe. Earth is a dot in the sky, and a radio message takes minutes to reach it.

**Decision 1 — Protect the habitat.**

| Option | Right away | Comes back later |
|---|---|---|
| Leave it as it landed and start exploring | ⭐ +1 · Shield −10 (radiation adds up every sol) | — |
| Pile bags of Mars soil over the sleeping room | Shield +15 · Power −10 · Food −5 (digging is hungry work) | — |
| Bury the whole habitat | Shield +25 · Power −15 · Food −10 | Level 6: storm damage is 10 less |

**Decision 2 — Alarm: the cabin is leaking air.** A clock on screen shows a message travelling to Earth and the reply travelling back.

| Option | Outcome | Why |
|---|---|---|
| Ask Mission Control what to do | Air & Water −15 while the message travels, then +5 | A perfect answer — but it arrives late, and air leaked the whole time |
| Patch it yourself, now | Air & Water −5 (and Power −5 if the tool kit is in the hold) | Fast, and good enough |
| Seal off the leaking room | Food −15 · Air & Water −2 | The leak stops at once, but the food store is in that room |

**Decision 3 — The oxygen maker.** A machine like NASA's MOXIE can pull oxygen out of Mars air, but it is power-hungry.

| Option | Outcome | Why |
|---|---|---|
| Run it day and night | Air & Water +20 · Power −20 | Plenty of oxygen; the batteries never rest |
| Run it only in sunlight | Air & Water +10 · Power −10 | Slower, gentler |
| Leave it off and live on the tanks | Power +5 · Air & Water −10 | Saves power today; the tanks will not last |

**Pass:** reach Sol 30 with every meter above 0.
**How it is lost:** Air & Water reaches 0 — waiting for Earth during the leak after packing few tanks. Or Power reaches 0 — burying the habitat **and** running the oxygen maker non-stop. Mission Replay: "Messages to Mars take minutes each way, so crews are trained to fix emergencies themselves."
**Source line:** `Signal delay: NASA Mars communications · Weather: NASA InSight (archive) · Oxygen: NASA MOXIE`

### 6.4 Level 4 — The Dust Storm · Mars, Sol 214

**Teaches:** power budgeting — solar power depends on the sky, and when power is short you choose what stays on.
**Systems:** power, coupled to food, life support and shielding.
**Real data on screen:** one of three real dust cases, chosen at random — a clear season (D = 5), the 2007 storm that stopped the Opportunity rover for weeks (D = 15), or the 2018 storm that circled the planet and ended Opportunity's mission (D = 25).

**What happens.** The horizon turns brown. This is the dilemma the challenge author described: fold the panels and lose power now, or leave them out and risk burying them. (Folding panels is a choice for our made-up base. Real rovers rode out dust storms by switching machines off to save battery — F20, F21.)

**Decision 1 — The storm arrives in minutes. What about the panels?**

| Option | Right away | Comes back later |
|---|---|---|
| Fold them away and run on battery | Power −(D+10) · Food −5 (greenhouse lights dimmed) | — |
| Leave them out to catch the last light | Power −D | Panels are buried: no sunlight recharge in levels 5 and 6 (unless you packed spare parts) |
| Fold half, in the rising wind | Power −(D+5) · Shield −5 (a longer spacewalk outside the shield) | — |

**Step 2 — Share the battery (hands-on).** The battery holds **7 units**. Three systems each want 3: heaters and air machines, greenhouse lights, storm alarm and shield systems. The player drags sliders. Every missing unit costs −5 on that system's meter (Air & Water, Food or Shield). There is no setting that keeps everything.

**Decision 3 — The storm has passed and the panels are grey with dust.**

| Option | Outcome | Why |
|---|---|---|
| Go outside and brush them | Power +25 · Shield −15 | Clean panels at once, but outside there is no shield |
| Wait for the wind to clean them | Power +10 · Air & Water −5 | Safe, slow; the heaters run on thin power meanwhile |
| Send the little robot | Power +15 · ⭐ −1 | The robot was meant for science |

**Pass:** reach the end of the storm with every meter above 0.
**How it is lost:** Power reaches 0 — few panel crates, the 2018-size storm, and folding the panels with no battery to spare. Or Food reaches 0 — giving the greenhouse nothing on the sliders after packing little food. Mission Replay: "Mars dust stopped two NASA robots. A dust storm stopped Opportunity. Dusty panels stopped InSight." (F33)
**Source line:** `Dust storms: NASA Opportunity and InSight missions · Sunlight on Mars: NASA`

### 6.5 Level 5 — Grow or Go Hungry · Mars, Sol 300

**Teaches:** food production — growing food costs water, power and time, but a farm pays back later.
**Systems:** food, coupled to life support (water) and power.
**Real data on screen:** a plant-growth study from NASA's Open Science Data Repository (Veggie, archive) and a NASA photo of lettuce grown on the Space Station.

**What happens.** The packed food will not last until the next rocket. Astronauts have grown and eaten lettuce in space — now the player must.

**Decision 1 — How big is the farm?**

| Option | Outcome | Why |
|---|---|---|
| A big farm | Food +30 · Air & Water −15 · Power −15 | More plants, more water, more lamps |
| A small garden | Food +10 · Air & Water −5 · Power −5 | Fresh food, small cost |
| No farm — eat packed food | Food −20 · Power +5 | Nothing to water, nothing to harvest |

If seeds were packed in level 1, either farm grows +10 more.

**Decision 2 — Water is running low. The recycler can turn used water back into clean water.**

| Option | Outcome | Why |
|---|---|---|
| Run the recycler at full power | Air & Water +15 · Power −10 | The Space Station recycles almost all its water this way |
| Drill for buried ice | Air & Water +25 · Power −15 · Shield −10 | A lot of water, but a long day outside |
| Give the plants less water | Air & Water +5 · Food −15 | The crew drinks; the crop shrinks |

**Decision 3 — The lettuce is nearly ready when a pump fails.**

| Option | Outcome | Why |
|---|---|---|
| Carry the crew's drinking water to the plants by hand | Food +10 · Air & Water −10 | The harvest is saved with your own water |
| Harvest early | Food +5 · ⭐ −1 | Small leaves, and the plant experiment is cut short |
| Fix the pump first | Food −10 · Power −5 | The pump works again, but some plants were lost |

**Pass:** reach Sol 400 with every meter above 0.
**How it is lost:** Food reaches 0 — no farm after a hungry level 4. Or Air & Water reaches 0 — a big farm with the plants watered from the crew's supply. Mission Replay: "Water is so heavy to launch that the Space Station recycles nearly every drop."
**Source line:** `Plants in space: NASA OSDR (Veggie) · Water recycling: NASA ISS life support`

### 6.6 Level 6 — Crew Up · Mars, Sol 400 to Sol 500

**Teaches:** coupled systems and teamwork — nobody survives Mars alone.
**Systems:** all five at once.
**Real data on screen:** the strongest DONKI storm loaded; a Perseverance sample photo; NASA's picture of the day as the reward.

**What happens.** A second ship arrives with five specialists, but the habitat has air and food for only three more. Then a hard final stretch: a storm, a breakdown, and the mission's main science goal.

**Step 1 — Choose your crew (hands-on).** Pick **3 of 5**. Each one protects a system: every loss to that meter in this level is halved. Each one also eats and breathes: Air & Water −3 and Food −3 per person.

| Specialist | Protects | The catch |
|---|---|---|
| Engineer | Power | — |
| Life-Support Technician | Air & Water | — |
| Botanist | Food | — |
| Medic | Shield | — |
| Scientist | Nothing — doubles the stars earned in this level | Leaves one more system unprotected |

There are 10 possible crews. The right one depends on which meters the player arrived with — which depends on every earlier choice.

**Decision 2 — A solar storm and a dust front arrive together.** (X from DONKI; 10 less if the habitat was buried.)

| Option | Outcome | Why |
|---|---|---|
| Everyone into the shelter | Shield −(X−10) · Power −20 | Safe from the storm; nobody cleans the panels |
| Two shelter, one keeps the panels clean | Shield −(X+5) · Power −5 | The panels stay clear; one person takes the dose |
| Finish the experiment first | ⭐ +2 · Shield −(X+15) | The data is saved; the crew is not |

**Decision 3 — The air scrubber that removes carbon dioxide has failed.**

| Option | Outcome | Why |
|---|---|---|
| Build a replacement from spare parts and power tools | Air & Water +10 · Power −20 | Apollo 13's crew built an air-filter fix from bags, card and tape (F28) |
| Close the greenhouse and use its air for the crew | Air & Water +15 · Food −25 | Air today, no harvest tomorrow |
| Everyone rests to breathe less | Air & Water −15 · ⭐ −1 | No work gets done |

**Decision 4 — The science goal: collect Mars rocks for Earth.**

| Option | Outcome | Why |
|---|---|---|
| The whole crew drives to the delta | ⭐ +3 · Air & Water −15 · Shield −10 | The best samples; spacesuit air and a day without shelter |
| Send the rover | ⭐ +1 · Power −15 | Safe, slower, fewer samples |
| Collect near the habitat | ⭐ +1 · Food −5 | Ordinary rocks; a short walk and a long lunch |

Samples earn +1 ⭐ more for each of: the lab kit packed in level 1, and the delta landing in level 2.

**Pass — and win the mission:** reach Sol 500 with every meter above 0. The Outpost Check (section 5.3) then gives the result.
**How it is lost:** any meter — whichever system the player left without a specialist and without reserves. Mission Replay: "Real crews are built from different specialists so that every system has someone who knows it."
**After success, two locked cards:** "**Crew Mode** — next time, you and your friends each take one of these roles. Coming soon." and "**More worlds** — new missions beyond Mars. Coming soon."
**Source line:** `Storm: NASA DONKI · Samples: NASA Perseverance / Mars Sample Return · Picture: NASA APOD`

### 6.7 What success and failure come down to

**The mission succeeds when the player:**
1. Packs with a plan — no system left at 40.
2. Shelters when the alert comes, instead of finishing the experiment.
3. Acts alone in the emergency, instead of waiting on Earth.
4. Protects the panels and shares the battery, instead of keeping everything on.
5. Plants a farm early and recycles water.
6. Picks the crew that covers the weakest systems, not the favourite.

**The mission fails most often because:**

| Reason | Level where it bites | Real-world truth behind it |
|---|---|---|
| Chasing stars — choosing science over safety every time | 2 and 6 (Shield) | Science is why we go; staying alive is how we stay |
| Packing for one need | Whichever level tests the thin meter | Mass budgets force balance |
| Waiting for Earth | 3 (Air & Water) | Minutes of delay are too long in an emergency |
| Trying to keep everything powered | 4 (Power) | A power budget means something is switched off |
| Skipping the farm | 5 (Food) | Packed food runs out; resupply is 26 months away |
| Picking a crew without looking at the meters | 6 (any) | Crews are chosen for the mission's needs |

### 6.8 What a child can say afterwards

Shown on the success screen, each with its source.

| Level | "I learned…" |
|---|---|
| 1 | "A rocket can't carry everything. More shielding means less food." |
| 2 | "The Sun has storms. Astronauts watch the alerts and hide behind thick things like water." |
| 3 | "Mars is so far that a radio message takes minutes. The crew has to decide alone." |
| 4 | "Solar power depends on the sky. When power is short, you choose what stays on." |
| 5 | "Growing food costs water, power and time — but a farm pays you back." |
| 6 | "Nobody survives Mars alone. Different skills protect different systems." |

The wider topics the mission touches, for the project page: planetary defence, spacecraft preparation, space radiation, Mars landing, life support, using local resources, power, space farming, planetary geology and sample collection, and decision-making under pressure.

---

## 7. The app around the mission

Build order is top to bottom. If time runs short, cut from the bottom (section 12.2).

| # | Part | Priority | What it is, and why |
|---|---|---|---|
| W | **Welcome** | Must | **Every time the game opens.** While it loads, the picture of two real-looking young astronauts turns into Orbit, Nova and Twinkle, in step with the loading bar. Then the bar becomes **Play**, with **How to Play** under it and the **EN / বাংলা** switch top right. It says "you become the astronaut" without a word, and it gives the videos their title shot. Play goes to the hook the first time and to Home after that |
| 0 | **Opening hook** | Must | First Play only, about 15 seconds. Alarm, red light: "DAY 214 ON MARS. Dust storm in 60 seconds! Fold the panels or leave them out?" One tap, two bars jolt. Then: "Every choice costs something. How did we get here?" → the 3D "Earth is too full" cinematic (§4.2) → Twinkle's tour in mission 1. It throws the child into the best moment of the game before explaining anything, and it is the same footage that opens both videos |
| 1 | **Missions → Mars** | Must — most important | The six levels. A mission map shows six stops from Earth to the outpost; other worlds appear locked |
| 2 | **Fly** | Must — second | An **endless** three-lane runner in space, in the spirit of Subway Surfers but with our own look. Orbit or Nova flies on and on: **tap the left or right half of the screen** to change lane, **swipe up** (or tap the Hop button) to hop low rocks. Dodge rocks and debris, grab stardust. Three **powers** appear as glowing pickups and switch on by themselves for about 6 seconds, one at a time: **Shield** (takes one hit), **Magnet** (pulls stardust in), **Boost** (fast and can't be hit). Three hull pips; a hit costs one and the run ends at zero, with distance and stardust counted. It speeds up the further you fly. Today's real storm index sets the starting speed and how fast it speeds up, shown as "Space weather today: Kp 3". Best distance and stardust are saved on the device. **v11:** the start card shows NeoWs ("Real space rocks passing Earth this week: N", F4), and the end card says what stardust is for ("Spend it in Resources") with a button there. It is the fast, easy way in for a child who is not ready to read |
| 3 | **Profile** | Important | Pick your astronaut — **Orbit (teal suit) or Nova (pink suit)**. Call-sign chosen from a list (no typed personal data), rank, six level badges, the **Space Book** of collected words, a **leaderboard** of the best runs on this device, and settings: sound, reduced motion, replay intro, reset, Sources & credits |
| 4 | **Resources** | Important | The outpost's four systems as cards: one kid sentence on what each does, its source, and two upgrade steps bought with stardust (15 ✦ then 30 ✦, each +5 to that bar's starting value). The rocket carries **only 4 upgrades in total**, and they are **used up** by the next mission, whichever button starts it — no unlimited mode here either (§5.7) |
| 5 | **Training** | Locked — "Coming in the next update" | Three locked cards: **Mind** (mini brain games), **Body** (real astronaut exercise), **Reels** (short NASA clips) |

Twinkle appears on the welcome screen, the hook, the home screen, hints and Mission Replay.

### 7.1 One wide screen (landscape)

**Decision: the whole game is landscape, on every device.** Reasons:

- **It looks like a game.** The games kids call "real games" are wide: a place you look into, the crew on one side, the action on the other. Our upright layout stacked text over buttons, and that is what a quiz looks like.
- **Short height forces short text.** There is no room for a paragraph, so there is one idea per screen.
- **One layout, not two.** Phone, tablet, laptop and projector show the same stage at different sizes. Half the layout work, half the bugs.
- **It films well.** Game footage fills a 16:9 video with no black bars. Presentation is 20 points.
- **Two thumbs.** Crew and meters stay visible while both thumbs reach the choices.

**What it costs, and the fix.** A website cannot force a phone to turn (iPhones never allow it). So:

1. Phone held sideways: the stage fills the screen.
2. Phone held upright: the same stage is drawn turned a quarter-turn, filling the screen, with a 2-second "Turn your phone" hint from Twinkle. The child turns the phone and carries on. Nobody meets a blocking screen, even with rotation lock on.
3. On Android, tapping Play also asks for full screen and a landscape lock. If the phone says no, nothing breaks.
4. Installed as an app, it opens in landscape by itself.

**Stage rules.** Smallest stage 640 × 360. Everything scales with the stage height. Every level screen has the same three zones: meters across the top, the crew and their speech on the left, the thing you touch on the right.

### 7.2 English and Bangla

The switch sits on the welcome screen and in Profile. All text a player sees lives in one strings file per language. A line with no Bangla yet shows in English, so the switch can ship early and fill up. Order of translation: welcome and buttons → the hook and story → Twinkle's lines → level text. **A Bangla speaker on the team checks every line**; AI drafts are not shipped unread. Baloo Da 2, our display font, already draws Bangla.

---

## 8. Data and sources

### 8.1 What we use

All endpoints were tested with our key on 12 Nov 2026.

| Data | Agency | Endpoint | Key? | Where in the game | Live or archive |
|---|---|---|---|---|---|
| DONKI — CME, SEP, GST, notifications | NASA | `https://api.nasa.gov/DONKI/CME?startDate=…&endDate=…&api_key=KEY` (same for `SEP`, `GST`, `notifications`) | Yes | Levels 2 and 6, Fly, home | Live, archive fallback |
| Planetary K index | NOAA SWPC | `https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json` | No | Fly, level 2 | Live, archive fallback |
| NeoWs — near-Earth asteroids | NASA | `https://api.nasa.gov/neo/rest/v1/feed?start_date=…&end_date=…&api_key=KEY` | Yes | Fly start card (v11; was story card 1) | Live, archive fallback |
| EPIC Earth photo | NASA | `https://epic.gsfc.nasa.gov/api/natural` | No | Level 1 | Live, archive fallback |
| InSight Mars weather | NASA | `https://api.nasa.gov/insight_weather/?api_key=KEY&feedtype=json&ver=1.0` | Yes | Level 3 | Archive only (2020) |
| OSDR plant studies | NASA | `https://osdr.nasa.gov/osdr/data/search?term=veggie&type=cgene` | No | Level 5 | Archive |
| Image and Video Library | NASA | `https://images-api.nasa.gov/search?q=…&media_type=image` | No | Levels 2, 3, 5, 6 | Curated |
| APOD | NASA | `https://api.nasa.gov/planetary/apod?api_key=KEY` | Yes | Success screen | Live, archive fallback |

Test notes: DONKI ranges must be 60 days or less. `DONKI/FLR` returned 404 — do not depend on it. APOD returned a server error once, so its fallback is mandatory. The Mars Rover Photos API is offline and not used. `DEMO_KEY` was rate-limited — never demo on it.

### 8.2 Reading list for the team

Each person reads the pages for their levels before writing a word of level text.

| Topic | Page | For |
|---|---|---|
| Planetary defence | `science.nasa.gov/planetary-defense-overview/` | Story |
| What if an asteroid were going to hit Earth? | `nasa.gov/solar-system/what-if-an-asteroid-were-going-to-hit-earth-we-asked-a-nasa-scientist-episode-11/` | Story |
| Climate effects of an asteroid impact (research paper) | `pmc.ncbi.nlm.nih.gov/articles/PMC11797562/` | Story — the dust detail |
| Space radiation | `nasa.gov/hrp/hazard-space-radiation/` | Level 2 |
| Humans to Mars | `nasa.gov/humans-in-space/humans-to-mars/` | Levels 3–6 |
| MOXIE oxygen on Mars | `nasa.gov/space-technology-mission-directorate/tdm/mars-oxygen-in-situ-resource-utilization-experiment-moxie/` | Level 3 |
| Perseverance science | `jpl.nasa.gov/news/press_kits/mars_2020/launch/mission/science/` | Levels 2, 6 |
| Mars Sample Return science | `science.nasa.gov/mission/mars-sample-return/science/` | Level 6 |

The full fact sheet, with a source and a "confirmed" mark for every sentence a player sees, is `docs/06_SCIENCE_AND_NASA_DATA.md` §4.

### 8.3 Citation rules

1. **Every screen that states a fact ends with one source line**, about 60 characters at most: `Source: NASA DONKI · LIVE · 12 Nov 2026`.
2. **Every data card has a badge:** `NASA LIVE` (fetched now), `NASA ARCHIVE` (real, saved earlier, with its date), or `GAME ESTIMATE` (our simplified number).
3. **Story screens carry a `FICTION` tag,** so nobody mistakes the "too full" Earth for a prediction.
4. **Tapping a source line** opens the Sources page: every dataset, its link, where it is used, the "what we simplified" table and the honesty note (section 4.3).
5. **In the videos,** whenever a fact or dataset is spoken, a small citation sits in the lower-left corner for at least 2 seconds, above the subtitles.
6. No source, no sentence.
7. **Generated and third-party content is credited** on the Sources page and both end cards: the character and welcome art (made by the team with **ChatGPT image generation**, OpenAI), fonts, icons. Sounds are made in code by the game, so no sound files need credits.
8. **No NASA logo anywhere**, including on suits in any artwork. Some early mock-ups show one on a backpack; that art is not used.

### 8.4 The NASA API key — when and how

- **When it is needed:** only for DONKI, NeoWs, InSight and APOD. Nothing else needs it.
- **Where it lives:** the file `.env` in the project root, as `VITE_NASA_API_KEY=…`. It is already there and already excluded from the repository. Add a `.env.example` containing `VITE_NASA_API_KEY=DEMO_KEY` so anyone can run the project.
- **Where the code reads it:** one file only, `src/services/nasa.ts`: `const KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'`.
- **Hours 2–4:** the Science lead runs `npm run nasa:snapshot`. It calls every endpoint once and saves the answers, without the key, to `public/data/*.json` with the date. These files are the `NASA ARCHIVE` fallback.
- **While playing:** at most four live calls per player, each with a 3-second limit and remembered for the session. If any fails, the saved answer is used and the badge changes to `NASA ARCHIVE`.
- **When publishing:** put `VITE_NASA_API_KEY` in the hosting site's environment settings, then build. Never upload `.env`.
- **Before filming:** open the game once with internet on, so `NASA LIVE` is on screen.
- **Know this:** a `VITE_` value can be found inside the published code. For a free NASA key the only risk is someone using up the hourly quota, and the saved answers cover that. Never show the key in a video, a document or a chat.

---

## 9. Technology

Vite + React + TypeScript + Tailwind + Zustand. A static site: no server, no accounts, no personal data. Each level is a JSON file in `src/content/levels/`, so the Science and Story leads can change words and numbers without touching code. The game rules are plain functions with tests, including one that rejects any choice that changes fewer than two things.

New in v10:
- **One stage.** A single landscape stage component wraps every screen (§7.1).
- **Offline.** A service worker caches the built game, the art and the saved NASA answers, so after one visit it opens with no connection. A web-app manifest sets landscape and the icon.
- **Safe saving.** Every read and write of saved progress is wrapped so a blocked or broken store starts a fresh game instead of a blank page.
- **Strings.** `src/content/strings.en.ts` and `strings.bn.ts`; missing Bangla falls back to English.
- **Licence.** Apache-2.0. `docs/AI_USE.md` lists each AI tool, what it did and what we did. Code layout and ready-to-paste Claude prompts are in `docs/08_MVP_SCOPE_AND_BUILD_SEQUENCE.md`.

---

## 10. Team and teamwork

Write the real names here once and use them everywhere.

Team CrewReady, **Cumilla, Bangladesh**. These names are used everywhere (Sources page, videos, project page).

| Name | Role | Owns in this plan |
|---|---|---|
| **Ahnaf Nabil** | Team Leader & Researcher (Captain) | Scope, schedule, check-ins, research sign-off, project page, submission |
| **Barkat Ullah Shah Riyad** | UI/UX Designer & Developer | Look, landscape stage, the 3D opening, Twinkle's tour, explain cards |
| **Jawad Hossain Rian** | Back-End Developer & Debugger | Game rules, points flow, NASA service, saved data, tests, phase B bug fixes |
| **Tasfia Zaman Totiny** | Researcher & Script Writer | Facts and sources (`docs/06` §4), simple-word pass, explain card text, video script |
| **Wasima Haque Syeda** | Video Editor & Script Writer | Both videos, subtitles, citations, the Remotion opening for video, teamwork log |
| **Imtiaj Mahmud Ormi** | Front-End Developer & Designer | Bonus rounds, Fly, Resources, Profile, home and map screens |

Still to confirm: who is under 18 (see the rule below) and who narrates (18 or older).

**Working rules.** One board (To do / Doing / Done). A 10-minute check-in every 6 hours. Each person works in their own folder. Only the Captain merges after the freeze.

**The teamwork log.** At every check-in, write one line in a shared note: who found or decided what, who they talked it through with, and what changed because of it. Grab a 10-second screen recording too. The teamwork part of the video is written from this log, so that it is true and specific — judges score "evidence of genuine collaboration", and a list of job titles is not evidence. **The under-18 rule (Participants Guide §08, build guide).** "No recognisable names, voices, or faces of anyone under 18" in any video or submission. For us that means:
- The narrator is 18 or older.
- Play-test footage shows hands and the screen only. The child is never named; "a nine-year-old" is fine.
- Orbit and Nova are drawn characters, not real children, so they are fine.
- **Ask the Local Lead on Friday morning:** the same guide says every member must be named in both videos. If a member is under 18, which rule wins, and how should they be listed?

---

## 11. The videos

### 11.1 What both videos must do

- **Open with a hook** — the game's own Sol 214 alarm — and state the solution in the first sentence.
- **Show the solution to the key problem:** kids see mission outcomes, never the decisions.
- **Show only the real game.** No mock-ups.
- **Tell teamwork as a chain:** introduce everyone, then who found what, who they took it to, and what changed.
- **Cite sources** as small lower-left text whenever a fact or dataset is mentioned.
- **Name the future:** Crew Mode after level 6, more worlds, and the Training tab.
- **Carry burned-in English subtitles** and name every team member.
- **Say the NASA data out loud** ("NASA DONKI", "NOAA") and show the team name and the challenge name. The guide lists these as required content.
- **Open on the welcome screen's change** (real crew → game crew, 2 seconds), then cut to the Sol 214 alarm.
- **Credit generated content** on the end card: the art tool, and Claude for code and text drafts.

**Deadlines (Participants Guide).** The 240-second local-judging video: **Friday 13 Nov, 6:30 PM** — YouTube link in the form, and the file in the Drive folder. The 30-second global video: **Saturday 14 Nov, 12:00 noon** — YouTube or Vimeo, link in the form and on the NASA project page, with the page finished. All game footage is now landscape, full frame.

### 11.2 Voice

The narrator is one of us — a woman on the team, **aged 18 or older**, speaking as herself. If nobody fits, an adult member narrates and the script's "I" lines move to them. First person, warm, a little playful, the way you would explain the game to a friend. Short sentences. Contractions. One smile in the voice at the hook and one at the close. No announcer voice and no long technical words; where a NASA name is needed, say it plainly and move on.

### 11.3 The 240-second video (target 215 s, about 470 words)

| Time | Part | What she says | On screen · lower-left citation |
|---|---|---|---|
| 0:00–0:24 | **Hook + solution** | "Okay. You're nine years old, you're in charge of a Mars base, and a dust storm hits in sixty seconds. Fold the solar panels and lose your power — or leave them out and maybe lose them forever? That's CrewReady. It's a free browser game we built where kids run a real Mars mission, and every single choice costs something: power, air and water, food, or protection from radiation." | The game's opening hook, full screen. The choice is tapped; two meters drop. Title at 0:08 · `Dust storms: NASA Opportunity mission` |
| 0:24–0:42 | **The problem** | "Here's why we made it. When kids learn about space, they get the ending — the launch, the landing, the flag. Nobody shows them the hard choices in the middle. NASA's challenge asked for exactly that: not a quiz, not a slideshow, but a living mission where nothing is unlimited." | Challenge title card. Then the four meters ticking down · `NASA Space Apps 2026: Build a Junior Astronaut Mission Trainer` |
| 0:42–0:54 | Story + Level 1 | "So here's the story. What if Earth gets too full? Mission Control needs a second base on Mars — and a junior astronaut. You. First job: pack the rocket. Eight crates. Every crate of shielding is a crate of food you leave behind." | The 3D "too full" Earth with the FICTION tag; the suit-up; crates dragged · `Earth: NASA EPIC · LIVE` |
| 0:54–1:08 | Level 2 | "On the way, the Sun throws a storm at you. And it's a real one — we pull it from NASA's space weather database, so if the Sun is angry today, your game is harder today. Do you hide behind the water tanks, or finish your experiment?" | DONKI card with date and badge; the choice; Shield drops · `NASA DONKI + NOAA SWPC · LIVE` |
| 1:08–1:20 | Level 3 | "You land. The cabin starts leaking air. You can call Earth — but the message takes minutes to get there and minutes to come back. Do you wait, or fix it yourself?" | Landing; the message clock; Air & Water draining · `NASA InSight (archive)` |
| 1:20–1:34 | Level 4 + consequence | "Then the dust storm. You saw that one. We left our panels out — and two levels later the game remembered. Choices come back." | Panels left out; later: "Remember the panels?" · `NASA Opportunity and InSight missions` |
| 1:34–1:48 | Levels 5 and 6 | "You grow lettuce, and pay for it in water. And at the end, five specialists arrive and you can only keep three. Whoever you leave behind, that's the system you can't protect." | Farm; lettuce photo; crew pick · `NASA OSDR (Veggie)` · `NASA Perseverance` |
| 1:48–2:02 | Replay + sources | "And if you run out of air? No game over. The game shows you which choice did it, what real astronauts do, and lets you try again. Under every screen there's a little line saying where the fact came from." | Meter hits zero; Mission Replay; a source line is tapped; Sources page | 
| 2:02–2:20 | **Why it fits** | "Life support, radiation, power, food, and the delay to Earth — the five things the challenge asked for, all connected. The data is live from NASA and NOAA, and anything from the archive says so." | Five icons linked; the three badges · `NASA · NOAA` |
| 2:20–2:58 | **Teamwork** | "There are six of us, from Cumilla. [Narrator's name] here. Ahnaf leads us and checked our research. Tasfia found that NASA lists every solar storm and took it to Jawad, who turned storm size into shield damage. A nine-year-old tester told us it was still too hard, so Tasfia rewrote every line in simple words and Barkat added Twinkle's explain cards. Imtiaj built a bonus game for every level, and Wasima cut this video. We used Claude to draft code and text and ChatGPT to make our art, and a person checked every fact." | A role card as each name is said. Then real clips from the teamwork log, in the order told |
| 2:58–3:14 | **Impact** | "It opens in any phone browser. No download, no account. So a classroom in Dhaka can play it as easily as one in Houston — and every kid walks away knowing six true things about living off Earth." | The game on a phone; the six "I learned" lines; play-test hands |
| 3:14–3:36 | **Future + close** | "Next up: Crew Mode, where you and your friends each take a role. New worlds after Mars. And a Training deck for your mind, your body, and NASA reels. Our poet Nazrul wrote, 'I will not stay in a closed room — I will see the world.' We made CrewReady so kids can start. Come play." | The locked cards from the app; the Nazrul line in Bangla; end card with all names, links and the challenge name · `Kazi Nazrul Islam, "Shonkolpo"` |

**The teamwork paragraph is a template.** Before the final recording, rewrite it from the teamwork log so every line really happened, and fix "she/he" for each person. Keep the shape: everyone introduced → one person's find → who they took it to → what it changed → who made the hard call → one honest line about AI.

### 11.4 The 30-second video (target 28 s, about 64 words)

| Time | What she says | On screen · citation |
|---|---|---|
| 0:00–0:10 | "You're nine. You run a Mars base. A dust storm hits in sixty seconds — fold the panels, or risk them? That's CrewReady." | The hook; title · `NASA Opportunity mission` |
| 0:10–0:18 | "It's a free browser game where every choice costs power, air, food or shielding." | The choice; meters drop; reason line |
| 0:18–0:25 | "Six levels. Real NASA space weather, live. And when you fail, you get a replay, not a game over." | Level map; DONKI card; Mission Replay · `NASA DONKI · NOAA · EPIC · InSight · OSDR` |
| 0:25–0:28 | "We're Team CrewReady, from Bangladesh. Come play." | End card: five names with roles, links, challenge name, "Next: Crew Mode · More worlds · Training" |
| 0:28–0:30 | (music tail) | End card holds |

### 11.5 Checklist for both

- [ ] Hook in the first 3 seconds; the solution in the first 25 seconds of the long video and the first 10 of the short one
- [ ] Challenge named, spoken and shown
- [ ] Only real game footage
- [ ] Every member named (spoken in the 240 s; on screen in the 30 s)
- [ ] A lower-left citation for each dataset, at least 2 seconds
- [ ] The FICTION tag visible on the story cards
- [ ] Burned-in English subtitles, readable on a phone
- [ ] Future plans: Crew Mode, more worlds, Training
- [ ] Under 235 s and under 30.0 s on the exported files
- [ ] The API key never visible
- [ ] Team name shown; NASA data named out loud
- [ ] No name, voice or face of anyone under 18
- [ ] Generated art and AI use credited on the end card
- [ ] Each link opened in a private window

---

## 12. The schedule

### 12.1 The real clock

v9 planned 40 free hours. The event's run of show (Participants Guide §02, §08) is tighter: **the 240-second video is due at 6:30 PM on day one.** So the game shown in that video has to exist before we walk in. Step names (R1, D1…) are from `docs/BUILD_SEQUENCE.md`.

| When | Build | Video and page | Must be true at the end |
|---|---|---|---|
| **Thu 12 Nov, today** | R0–R5: landscape stage, welcome, every built screen in the new look, event moments and chain reactions. F1: publish. D1–D2: real storm data. S1: Sources | Lock both scripts. Narrator chosen (18+). Scratch narration | **The film line:** a public link plays welcome → hook → six levels → Replay → Sources, with a real DONKI card |
| **Fri 13, 07:00–11:30** | Bug fixes only. Register every member and role on the NASA site (08:30) | Record all game footage: 1080p, landscape, internet on, LIVE badge showing. Ask the Local Lead the §10 question | Footage in hand |
| **Fri 13, 11:30–15:00** | L1: the learning layer, if the footage is done | Edit the 240 s: subtitles, citations, names. Rough cut ready for the 15:00 mentor round | A full rough cut |
| **Fri 13, 15:00–18:30** | Fixes from mentor feedback | Apply feedback at the 18:00 round. Export. **Upload by 18:30:** YouTube link in the form, file in Drive | **240 s submitted** |
| **Fri 13, evening** | L2, S2 (Fly), S3–S4, F2 (Bangla), in that order, as far as time allows | NASA project page, `docs/AI_USE.md`, README. Draft the 30 s for the 22:00 mentor round | Project page complete |
| **Sat 14, to 09:00** | F3–F5: balance, play-test fixes, final pass. **Freeze at 09:00** | Re-record any shot the new build improves | The published build is the judged build |
| **Sat 14, 09:00–12:00** | Nothing but emergencies | Finish the 30 s. **Upload by 12:00**; link in the form and on the project page. Open every link in a private window | **30 s and page submitted** |

Confirm with the Local Lead: when the local event closes on Saturday, and that code written before Friday is accepted.

### 12.1a v11 work, Friday 13 Nov evening to Saturday 09:00

The 240-second video (due **18:30 today**) uses the build as it stands, after the fact fixes of 13 Nov; nothing it shows is false. The v11 work below is for the judged build and the 30-second video:

| Order | Step (`docs/BUILD_SEQUENCE.md`) | Owner | About |
|---|---|---|---|
| 1 | **B1–B3** bug fixes | Jawad, Imtiaj | 3 h |
| 2 | **K1** simple words + **K2** Twinkle's tour, explain cards, Hint | Tasfia, Barkat | 3 h |
| 3 | **K3** points flow | Jawad | 2 h |
| 4 | **K4** the 3D opening | Barkat (game), Wasima (Remotion for video) | 3 h |
| 5 | **K5** bonus rounds (L2, L3, L4 first, then L1, L5, L6) | Imtiaj | 4 h |
| 6 | A second child play-test, then F4 fixes | Ahnaf | 1 h |

If time runs out, cut from the bottom of K5 first (keep three bonus rounds), then K4 down to three still pictures. **Never cut** the simple-word pass, the Hint/? buttons, the tour's goal line, or the bug fixes.

### 12.2 If we fall behind

Three checkpoints decide cuts, so nobody argues at 3 a.m.

- **Thursday midnight, the film line not reached:** stop restyling. Film what works on Friday morning; side screens wait.
- **Friday 11:30, footage not recorded:** nobody builds until it is.
- **Saturday 09:00:** freeze, no exceptions.

Cut in this order: sound → Bangla level text (keep the switch and the buttons) → Resources upgrades → Space Words → Try-it toys → leaderboard (keep badges) → Fly → the welcome picture change (keep the screen).
**Never cut:** the six levels, the four meters, landscape, the hook, Look first, Mission Replay, source lines, live DONKI in level 2, the Sources page.

---

## 13. Finished means

- [ ] The public link opens with no login on a phone and a laptop
- [ ] The hook and the three story cards play on the first Play, with the FICTION tag
- [ ] A new player can finish all six levels; losing always offers a replay
- [ ] Every option changes at least two things and shows a reason
- [ ] At least four choices come back in a later level
- [ ] Level 2 shows real DONKI data with a correct LIVE or ARCHIVE badge
- [ ] The Outpost Check gives one of three results, and the six "I learned" lines appear
- [ ] Every screen with a fact has a source line; the Sources page lists every dataset and the honesty note
- [ ] Fly, Profile and Resources work; Training shows as locked
- [ ] The game still works with the internet off
- [ ] `.env` is not in the repository; `.env.example` is
- [ ] Both videos uploaded: hook, solution first, all members named, subtitles, citations, future plans
- [ ] Project page complete: challenge named, datasets with links, AI use disclosed, every member with a role
- [ ] The repository opens in a private window
- [ ] The welcome screen plays on every launch, and its switch changes the language
- [ ] The game is landscape on a phone held either way, with no blocking screen
- [ ] A new player makes their first choice within 15 seconds of opening the link
- [ ] Every decision shows what it touches before the player confirms
- [ ] Every decision opens with an event moment; with the sound off and the words covered, a player can still tell what happened and what it cost
- [ ] Nova wears pink everywhere; no NASA logo in any artwork
- [ ] After one visit the game opens with the internet off
- [ ] `LICENSE` (Apache-2.0) and `docs/AI_USE.md` exist; generated art is credited
- [ ] No name, voice or face of anyone under 18 in any video or on the project page
- [ ] Every fact on screen matches `docs/06` §4 kid wording; no ✗ fact appears anywhere
- [ ] The opening shows the 3D "too full" Earth, the FICTION tag and the suit-up as Orbit or Nova
- [ ] Twinkle's tour in mission 1 shows the four bars and the goal, the **?** and the **bulb**
- [ ] Every screen has a **?** explain card; no player sentence is over 12 words; the §5.5 hard words are gone or explained
- [ ] Every level offers a bonus round; it gives stardust only and can be skipped
- [ ] Upgrades apply whichever button starts a mission, cost what the button says, and are used up
- [ ] Stars cannot be earned twice by retrying; badges and rank survive a new mission; Reset really resets
- [ ] All six team members are named with roles, with "Cumilla, Bangladesh", on the Sources page and both videos
