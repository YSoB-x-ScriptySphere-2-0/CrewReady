# CrewReady: Beyond Us — Final Plan v9

NASA Space Apps Challenge 2026 · Challenge: **Build a Junior Astronaut Mission Trainer** · Team CrewReady, Bangladesh

This is the plan the whole team follows for the game and the videos. It replaces every earlier plan. If another file disagrees with this one, this one wins.

**How to read it.** Sections 1–3 say what we are building and why it can win. Sections 4–6 are the heart: the story, the rules, and all six levels in full — what happens, what the player can choose, what each choice does, what wins and what fails. Sections 7–9 cover the rest of the app, the data and the sources. Sections 10–13 are the team, the videos, the schedule and the final checklist.

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
| Use NASA DONKI so today's solar weather shifts in-game risk | Live DONKI sets the storm size in levels 2 and 6 and the speed of Quick Run | DONKI card with today's date |
| Real data, attributed, never static shown as live | A source line under every screen; a LIVE / ARCHIVE / GAME ESTIMATE badge on every data card | Bottom of every screen |
| Browser-friendly, no install, no account | A static web app that opens from a link on a phone | The link |
| Replayable; failure teaches | Mission Replay instead of Game Over; storm, dust and crew change between runs | Fail any level |
| "Fun and accurate are the same goal" | The fun part — deciding under pressure — is the accurate part | The whole mission |

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

---

## 4. The story

### 4.1 Review of the proposed asteroid story

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

### 4.2 The story as the player meets it

Shown as three short cards with pictures, after the opening hook (section 7). The whole thing takes about 20 seconds and can be skipped.

1. **"The Near Miss."** "An asteroid flew at Earth. Most of it was pushed away. One piece hit the ocean. Its dust dimmed the Sun for a year."
2. **"The Lesson."** "Earth is healing. But we learned that one planet is not enough."
3. **"Your Mission."** "Mission Control starts the **Mars Continuity Programme**. Fly to Mars and build a base. Keep it going for 500 sols — Mars days. You are the commander."

(Shortened on 12 Nov 2026 so all three cards read aloud in about 25 seconds.)

Under card 1, a **real data card**: "Real asteroids passing Earth this week — NASA is tracking N. None will hit us." (NASA NeoWs, live.) This is the honest bridge between fiction and fact.

**Why the dust detail matters:** the player is told that dust dimmed the Sun on Earth. In level 4 the same thing happens to them on Mars. The story and the hardest level teach the same idea twice.

### 4.3 The honesty note (shown on the Sources page and the project page)

"The asteroid and the Mars Continuity Programme are fiction made for this game. NASA tracks near-Earth asteroids and tests ways to deflect them, and predicts no dangerous impact. Mars is not yet a safe home for people. Our meter numbers are simplified for play and are not engineering values. Everything else — the storms, the dust, the delay, the lettuce — is real, and each screen names its source."

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
- **Living costs.** A crew eats and breathes whether or not anything goes wrong. On entering levels 2–6: Air & Water −5, Food −5. The player watches the meters tick down.
- **Sunlight.** On Mars the panels recharge the batteries. On entering levels 4, 5 and 6: Power +10 — unless the panels are buried in dust.
- **No free choices.** Every option changes at least two things: two meters, or a meter and stars, or a meter now and a consequence later.
- **Consequences come back.** Some choices set a marker that pays or costs in a later level. When it triggers, Twinkle says so: "Remember the panels you left out in the storm?"
- **Real data sets the size of events.** Storm size X (levels 2 and 6) comes from DONKI: small 10, medium 20, large 30. Dust size D (level 4) is one of three real cases: 5, 15 or 25.

### 5.3 Help, failure and success

- **Hints.** Twinkle, the drone guide, names the lowest meter and what each option costs. Never the answer.
- **Failing a level.** If any meter reaches 0 the level stops and **Mission Replay** opens. It shows three things: the choice that drained the meter, why that happens on a real mission (with its source), and a button to try the level again with the meters the player entered it with. Stars are kept. Nobody dies; Mission Control "pauses the mission".
- **Winning the mission.** The player wins by reaching the end of level 6 — Sol 500 — with every meter above 0. Then the **Outpost Check** counts how many of the four systems are healthy (30 or more):

| Result | Needed | What the player is told |
|---|---|---|
| **Outpost Survives** — Cadet | Finished, fewer than 3 healthy systems | "You made it! The base is weak. The next crew has work to do." |
| **Outpost Stable** — Pilot | 3 healthy systems, or 4+ stars | "The base can hold on until the next rocket comes." |
| **Outpost Thriving** — Commander | All 4 healthy **and** 6+ stars | "Earth is cheering. People now have a second home." |

The success screen then lists the six things the player learned (section 6.8), each with its source, and NASA's picture of the day as the reward.

All numbers in section 6 are starting values. The balance script in hours 16–22 plays every possible path and tunes them so that careful play wins, greedy play fails, and no single option is always best.

---

## 6. The Mars mission — six levels in full

For each level: what it teaches, what happens, every choice and its outcome, how to pass, and how it is lost.

### 6.1 Level 1 — The Last Departure · Earth, launch day

**Teaches:** mass budget — a rocket cannot carry everything.
**Systems:** all four, plus radiation shielding as weight.
**Real data on screen:** today's photo of Earth from NASA's EPIC camera (live).

**What happens.** The launch window closes tomorrow, and the next one is 26 months away. The player sees the cargo bay, four empty bins and eight crates. Twinkle: "Eight crates, four needs. What will you run short of?"

**Step 1 — Pack (hands-on).** Every meter starts at 40. The player drags 8 crates into four bins. Each crate adds 10 to that meter.

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

**What happens.** Seven months of travel. Outside Earth's magnetic field nothing blocks the Sun's storms. An alert arrives — the same kind flight controllers use to send astronauts to shelter.

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
**Real data on screen:** a Perseverance photo of the landing area; real Mars air temperatures from the InSight lander, averaging about −62 °C (archive, 2020).

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

**What happens.** The horizon turns brown. This is the dilemma the challenge author described: fold the panels and lose power now, or leave them out and risk burying them. The story comes full circle — dust dimmed the Sun on Earth, and now it does the same here.

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
**How it is lost:** Power reaches 0 — few panel crates, the 2018-size storm, and folding the panels with no battery to spare. Or Food reaches 0 — giving the greenhouse nothing on the sliders after packing little food. Mission Replay: "Dust on solar panels ended the missions of the Opportunity rover and the InSight lander."
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
| Build a replacement from spare parts and power tools | Air & Water +10 · Power −20 | The Apollo 13 crew did exactly this |
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
| 0 | **Opening hook** | Must | First launch only, about 15 seconds. Alarm, red light: "SOL 214 · JEZERO BASE. Commander — dust storm in 60 seconds. Fold the panels or leave them out?" One tap, two meters jolt. Then: "Every choice costs something. How did we get here?" → the three story cards → Home. It throws the child into the best moment of the game before explaining anything, and it is the same footage that opens both videos |
| 1 | **Missions → Mars** | Must — most important | The six levels. A mission map shows six stops from Earth to the outpost; other worlds appear locked |
| 2 | **Quick Run** | Must — second | A 60-second, three-lane dodge game. Dodge debris, collect stardust. Today's real storm index sets the hazard speed, shown as "Space weather today: Kp 3". It is the fast, easy way in for a child who is not ready to read |
| 3 | **Profile** | Important | Call-sign chosen from a list (no typed personal data), rank, six level badges, a **leaderboard** of the best runs on this device, and settings: sound, reduced motion, replay intro, reset, Sources & credits |
| 4 | **Resources** | Important | The outpost's four systems as cards: one kid sentence on what each does, its source, and two upgrade steps bought with stardust (+5 to that meter's starting value). The rocket carries **only 4 upgrades in total** — no unlimited mode here either |
| 5 | **Training** | Locked — "Coming in the next update" | Three locked cards: **Mind** (mini brain games), **Body** (real astronaut exercise), **Reels** (short NASA clips) |

Twinkle appears on the hook, the home screen, hints and Mission Replay.

---

## 8. Data and sources

### 8.1 What we use

All endpoints were tested with our key on 12 Nov 2026.

| Data | Agency | Endpoint | Key? | Where in the game | Live or archive |
|---|---|---|---|---|---|
| DONKI — CME, SEP, GST, notifications | NASA | `https://api.nasa.gov/DONKI/CME?startDate=…&endDate=…&api_key=KEY` (same for `SEP`, `GST`, `notifications`) | Yes | Levels 2 and 6, Quick Run, home | Live, archive fallback |
| Planetary K index | NOAA SWPC | `https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json` | No | Quick Run, level 2 | Live, archive fallback |
| NeoWs — near-Earth asteroids | NASA | `https://api.nasa.gov/neo/rest/v1/feed?start_date=…&end_date=…&api_key=KEY` | Yes | Story card 1 | Live, archive fallback |
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
3. **Story cards carry a `FICTION` tag,** so nobody mistakes the asteroid for a prediction.
4. **Tapping a source line** opens the Sources page: every dataset, its link, where it is used, the "what we simplified" table and the honesty note (section 4.3).
5. **In the videos,** whenever a fact or dataset is spoken, a small citation sits in the lower-left corner for at least 2 seconds, above the subtitles.
6. No source, no sentence.

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

Vite + React + TypeScript + Tailwind + Zustand. A static site: no server, no accounts, no personal data. Each level is a JSON file in `src/content/levels/`, so the Science and Story leads can change words and numbers without touching code. The game rules are plain functions with tests, including one that rejects any choice that changes fewer than two things. Code layout and ready-to-paste Claude prompts are in `docs/08_MVP_SCOPE_AND_BUILD_SEQUENCE.md`.

---

## 10. Team and teamwork

Write the real names here once and use them everywhere.

| Role | Name | Owns |
|---|---|---|
| **Captain** | [NAME 1] | Scope, schedule, check-ins, Profile and Resources screens, project page, submission |
| **Engine Dev** | [NAME 2] | Game rules, consequences, NASA service, tests, balance |
| **UI Dev** | [NAME 3] | Hook, story cards, home, mission screens, Quick Run, publishing |
| **Science & Data Lead** | [NAME 4] | NASA data, every number and fact, source lines, Sources page |
| **Story & Video Lead** | [NAME 5] | Story, kid-level text, Twinkle, both videos, subtitles |
| Sixth member | [NAME 6] | Play-testing if available; named in credits |

**Working rules.** One board (To do / Doing / Done). A 10-minute check-in every 6 hours. Each person works in their own folder. Only the Captain merges after the freeze.

**The teamwork log.** At every check-in, write one line in a shared note: who found or decided what, who they talked it through with, and what changed because of it. Grab a 10-second screen recording too. The teamwork part of the video is written from this log, so that it is true and specific — judges score "evidence of genuine collaboration", and a list of job titles is not evidence. Members under 18: check the event's rule on showing minors, and if in doubt use first names, hands and screens only.

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

### 11.2 Voice

The narrator is one of us — a girl on the team, speaking as herself. First person, warm, a little playful, the way you would explain the game to a friend. Short sentences. Contractions. One smile in the voice at the hook and one at the close. No announcer voice and no long technical words; where a NASA name is needed, say it plainly and move on.

### 11.3 The 240-second video (target 215 s, about 470 words)

| Time | Part | What she says | On screen · lower-left citation |
|---|---|---|---|
| 0:00–0:24 | **Hook + solution** | "Okay. You're nine years old, you're in charge of a Mars base, and a dust storm hits in sixty seconds. Fold the solar panels and lose your power — or leave them out and maybe lose them forever? That's CrewReady. It's a free browser game we built where kids run a real Mars mission, and every single choice costs something: power, air and water, food, or protection from radiation." | The game's opening hook, full screen. The choice is tapped; two meters drop. Title at 0:08 · `Dust storms: NASA Opportunity mission` |
| 0:24–0:42 | **The problem** | "Here's why we made it. When kids learn about space, they get the ending — the launch, the landing, the flag. Nobody shows them the hard choices in the middle. NASA's challenge asked for exactly that: not a quiz, not a slideshow, but a living mission where nothing is unlimited." | Challenge title card. Then the four meters ticking down · `NASA Space Apps 2026: Build a Junior Astronaut Mission Trainer` |
| 0:42–0:54 | Story + Level 1 | "So here's the story. An asteroid has shaken Earth, and you command the crew that proves humans can live on Mars. First job: pack the rocket. Eight crates. Every crate of shielding is a crate of food you leave behind." | Story cards with the FICTION tag; asteroid data card; crates dragged · `Asteroids: NASA NeoWs · LIVE` · `Earth: NASA EPIC · LIVE` |
| 0:54–1:08 | Level 2 | "On the way, the Sun throws a storm at you. And it's a real one — we pull it from NASA's space weather database, so if the Sun is angry today, your game is harder today. Do you hide behind the water tanks, or finish your experiment?" | DONKI card with date and badge; the choice; Shield drops · `NASA DONKI + NOAA SWPC · LIVE` |
| 1:08–1:20 | Level 3 | "You land. The cabin starts leaking air. You can call Earth — but the message takes minutes to get there and minutes to come back. Do you wait, or fix it yourself?" | Landing; the message clock; Air & Water draining · `NASA InSight (archive)` |
| 1:20–1:34 | Level 4 + consequence | "Then the dust storm. You saw that one. We left our panels out — and two levels later the game remembered. Choices come back." | Panels left out; later: "Remember the panels?" · `NASA Opportunity and InSight missions` |
| 1:34–1:48 | Levels 5 and 6 | "You grow lettuce, and pay for it in water. And at the end, five specialists arrive and you can only keep three. Whoever you leave behind, that's the system you can't protect." | Farm; lettuce photo; crew pick · `NASA OSDR (Veggie)` · `NASA Perseverance` |
| 1:48–2:02 | Replay + sources | "And if you run out of air? No game over. The game shows you which choice did it, what real astronauts do, and lets you try again. Under every screen there's a little line saying where the fact came from." | Meter hits zero; Mission Replay; a source line is tapped; Sources page | 
| 2:02–2:20 | **Why it fits** | "Life support, radiation, power, food, and the delay to Earth — the five things the challenge asked for, all connected. The data is live from NASA and NOAA, and anything from the archive says so." | Five icons linked; the three badges · `NASA · NOAA` |
| 2:20–2:58 | **Teamwork** | "There are five of us. I'm [NAME 5] — I wrote the story and I'm the voice you're hearing. It started with [NAME 4], who found that NASA lists every solar storm. She took that to [NAME 2], and the two of them turned storm strength into shield damage. I tested the words on a nine-year-old and had to cut every sentence in half — which sent [NAME 3] back to redraw the meters with pictures. And [NAME 1] made the hard call to drop features so all six levels could ship. We used Claude to draft code and text, and a person checked every number." | A role card as each name is said. Then real clips from the teamwork log, in the order told |
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

---

## 12. The 40-hour schedule

### 12.1 Build and video in parallel

Working hours from the start. Plan two sleep breaks between blocks. The video track starts at hour 0, because teamwork footage cannot be made afterwards.

| Hours | Build track | Video track | Must be true at the end |
|---|---|---|---|
| **0–2** | Captain: repo, board, names, scope frozen. Engine Dev: project set up and an empty app published. UI Dev: home layout. Science: reading list, facts to confirm | Story lead: lock both scripts, start the teamwork log, choose subtitle and citation styles | A public link shows a home screen |
| **2–8** | Game rules and tests; packing, stowing and decision screens; level 1; NASA snapshot run | Scratch narration; title, role and end cards; first teamwork clips | **Level 1 playable on the public link** |
| **8–16** | Levels 2–6; consequences; NASA service and badges; landing checklist; message clock; power sliders; crew pick; Mission Replay; Outpost Check | Storyboard every shot; film the Science lead and Engine Dev on the storm data; draft the problem section | **All six levels playable** |
| **16–22** | Hook and story cards; Quick Run; Profile; Resources; balance script; play-test with a child; rewrite hard sentences; source lines everywhere | Film the play-test (hands only); rough-cut the parts that need no final footage: problem, teamwork, future | A first-timer finishes level 1 in 3 minutes unaided |
| **22–26** | Training locked cards; Sources page; phone layout; bug fixes. **Freeze at hour 26** | Final narration; teamwork paragraph rewritten from the log | **Freeze — the published build is the filmed build** |
| **26–32** | Bug fixes only. Captain: project page, AI-use note, README | Record all game footage (1080p, internet on, LIVE badge showing); edit the 240 s | Rough cut watched by all five |
| **32–36** | Science lead checks every claim and citation in the video against `docs/06` | Finish the 240 s: subtitles, citations, sound; export | **240 s final** |
| **36–38** | Captain: submission form; every link tested in a private window | Cut the 30 s from the same footage; subtitles; export | **30 s final** |
| **38–40** | Submit; re-open everything in a private window | Upload both videos | **Submitted with time to spare** |

### 12.2 If we fall behind

Three checkpoints decide cuts, so nobody argues at 3 a.m.

- **Hour 8, level 1 not playable:** Resources upgrades are cut (the info cards stay).
- **Hour 16, fewer than six levels:** Quick Run and Profile get their simplest versions; levels 5 and 6 lose one decision each.
- **Hour 26:** freeze, no exceptions.

Cut in this order: Bangla text → sound → Resources upgrades → leaderboard (keep badges) → the landing checklist → the third decision of level 5.
**Never cut:** the six levels, the four meters, the hook, Mission Replay, source lines, live DONKI in level 2.

---

## 13. Finished means

- [ ] The public link opens with no login on a phone and a laptop
- [ ] The hook and the three story cards play on first launch, with the FICTION tag
- [ ] A new player can finish all six levels; losing always offers a replay
- [ ] Every option changes at least two things and shows a reason
- [ ] At least four choices come back in a later level
- [ ] Level 2 shows real DONKI data with a correct LIVE or ARCHIVE badge
- [ ] The Outpost Check gives one of three results, and the six "I learned" lines appear
- [ ] Every screen with a fact has a source line; the Sources page lists every dataset and the honesty note
- [ ] Quick Run, Profile and Resources work; Training shows as locked
- [ ] The game still works with the internet off
- [ ] `.env` is not in the repository; `.env.example` is
- [ ] Both videos uploaded: hook, solution first, all members named, subtitles, citations, future plans
- [ ] Project page complete: challenge named, datasets with links, AI use disclosed, every member with a role
- [ ] The repository opens in a private window
