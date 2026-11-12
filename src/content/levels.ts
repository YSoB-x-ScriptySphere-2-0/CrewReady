// The six levels of the Mars mission. Source of truth: plan.md §6.
// Science and Story leads: edit words and numbers here. `npm test` rejects any
// option that changes fewer than two things.
// Words are for a 7-year-old: sentences under 15 words, one idea each, and a short
// explanation the first time a science word appears (simplified 12 Nov 2026).
import type { Extra, Level } from '../engine/types';

const LIVING: Extra = {
  effects: { L: -5, F: -5 },
  reason: 'Time passes. The crew eats, drinks and breathes.',
};
const SUNLIGHT: Extra[] = [
  { unless: ['panelsBuried'], effects: { P: 10 }, reason: 'Sunlight charged the batteries.' },
  { if: ['panelsBuried'], reason: 'Remember the panels you left out in the storm? Dust buried them. No charge today.' },
];

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'The Last Departure',
    place: 'Earth · launch day',
    teaches: 'A rocket cannot carry everything.',
    story: 'The rocket leaves in the morning. The next one leaves in 26 months. What you forget, you live without.',
    source: 'Earth: NASA EPIC · Launch windows: NASA Mars missions',
    onEnter: [],
    steps: [
      {
        kind: 'crates',
        task: 'Pack the rocket',
        prompt: 'Pack the rocket. You have 8 crates for 4 needs.',
        hint: 'Every meter starts at 40. Each crate adds 10. What will run out first?',
        crates: 8,
        perCrate: 10,
        bins: [
          { meter: 'P', label: 'Solar panels and batteries' },
          { meter: 'L', label: 'Air and water tanks' },
          { meter: 'F', label: 'Food packs' },
          { meter: 'S', label: 'Shield plates' },
        ],
      },
      {
        kind: 'choice',
        task: 'Fill the last seat',
        prompt: 'One seat is left on the rocket. What gets it?',
        hint: 'Each one costs a little now. Each one helps you later.',
        options: [
          {
            label: 'Science lab kit',
            stars: 2,
            effects: { F: -5 },
            reason: 'The kit took the snack space. Your rocks will be worth more later.',
            setFlag: 'labKit',
          },
          {
            label: 'Box of spare parts',
            effects: { P: 10, S: -5 },
            reason: 'The box took a shield plate’s place. It can fix broken panels later.',
            setFlag: 'spareParts',
          },
          {
            label: 'Seeds and soil',
            effects: { F: 5, L: -5 },
            reason: 'Seeds need water from day one. Your farm will grow more later.',
            setFlag: 'seeds',
          },
        ],
      },
      {
        kind: 'stow',
        task: 'Stow your gear',
        prompt: 'Only two things fit next to your seat. Pick them.',
        hint: 'Things by your seat are quick to grab. The rest is deep in the hold.',
        pick: 2,
        items: [
          { flag: 'reachWater', label: 'Water bags', inReach: 'You can build a storm shelter fast', inHold: 'The storm shelter will be late' },
          { flag: 'reachFilter', label: 'Spare water filter', inReach: 'Quick to swap', inHold: 'You must open the shield wall to get it' },
          { flag: 'reachMedkit', label: 'First-aid kit', inReach: 'Ready for a bumpy landing', inHold: 'A bumpy landing hurts more' },
          { flag: 'reachTools', label: 'Tool kit', inReach: 'Quick fixes', inHold: 'Fixes cost power' },
        ],
      },
    ],
    replay: { default: 'Real mission planners weigh every kilogram. Try packing a bit of everything.' },
    learned: "A rocket can't carry everything. More shield means less food.",
  },
  {
    id: 2,
    title: 'The Dangerous Journey',
    place: 'Deep space · 7 months',
    teaches: 'The Sun has storms, and thick things protect you.',
    story:
      'It takes seven months to reach Mars. Out here, nothing blocks storms from the Sun. A storm alert comes in. Real astronauts get these alerts too.',
    source: 'Storm: NASA DONKI + NOAA SWPC · Radiation: NASA Human Research Program',
    onEnter: [LIVING],
    steps: [
      {
        kind: 'choice',
        task: 'Storm alert',
        prompt: 'Storm alert! Harmful rays from the Sun arrive in one hour.',
        hint: 'Water blocks the rays well. Science earns stars. Check your Shield meter first.',
        options: [
          {
            label: 'Build a shelter from water bags and food boxes',
            effects: { S: '-(X-10)', F: -5, P: -5 },
            reason: 'The water blocked most of the storm. Nobody could work.',
            extras: [{ unless: ['reachWater'], effects: { S: -5 }, reason: 'The water bags were deep in the hold. The shelter was late.' }],
          },
          {
            label: 'Keep working on the experiment',
            stars: 2,
            effects: { S: '-(X+5)' },
            reason: 'The science is done. The crew took the whole storm.',
          },
          {
            label: 'Turn the fuel tanks to the Sun and power down',
            effects: { S: '-(X-5)', P: -15 },
            reason: 'The tanks blocked part of the storm. The solar panels faced away.',
          },
        ],
      },
      {
        kind: 'choice',
        task: 'Fix the water filter',
        prompt: 'The filter that cleans your water is blocked.',
        hint: 'Cleaning uses power. Waiting uses water. Where did you pack the spare filter?',
        options: [
          { label: 'Run the cleaning machine now', effects: { P: -15, L: 10 }, reason: 'It took lots of power. The water is flowing again.' },
          { label: 'Drink less until Mars', effects: { L: -15, F: -5 }, reason: 'Dried food needs water. You can’t eat it dry.' },
          {
            label: 'Put in the spare filter',
            effects: { L: 5 },
            reason: 'A new filter works right away.',
            extras: [{ unless: ['reachFilter'], effects: { S: -10 }, reason: 'It was inside the shield wall. Taking it out left a gap.' }],
          },
        ],
      },
      {
        kind: 'choice',
        task: 'Pick a landing spot',
        prompt: 'Mars is in the window! Where in Jezero Crater will you land?',
        hint: 'Sun means power. A cliff means cover. The old river bed has the best rocks.',
        options: [
          {
            label: 'The flat plain — smooth and sunny',
            effects: { P: 10, S: -10 },
            reason: 'Sun all day. Nothing to hide behind.',
          },
          {
            label: 'Next to the crater cliff — sheltered',
            effects: { S: 10, P: -10 },
            reason: 'The cliff protects you but shades your panels. It will block some dust later.',
            setFlag: 'cliff',
          },
          {
            label: 'The old river bed — best rocks, bumpy',
            stars: 2,
            effects: { L: -10 },
            reason: 'A hard bump cracked a water tank. The rocks here are worth it.',
            setFlag: 'delta',
          },
        ],
      },
      {
        kind: 'order',
        task: 'Land on Mars',
        prompt: 'Landing steps! Tap the four steps in the right order.',
        hint: 'Slow down in the air first. Then slow down more. Then land softly.',
        sequence: ['Heat shield', 'Parachute', 'Landing engines', 'Touchdown'],
        rightStars: 1,
        rightReason: 'Soft landing. Welcome to Mars, Commander!',
        wrong: { P: -5, S: -5 },
        wrongReason: 'A bumpy landing shook the ship. Check the order and try again.',
        wrongExtras: [{ unless: ['reachMedkit'], effects: { L: -5 }, reason: 'The first-aid kit was deep in the hold.' }],
      },
    ],
    replay: {
      S: 'On a real mission, a storm alert means: stop work and hide.',
      default: 'In deep space, every supply counts. Hide first, then fix one thing at a time.',
    },
    learned: 'The Sun has storms. Astronauts watch for alerts and hide behind thick things like water.',
  },
  {
    id: 3,
    title: 'First Breath',
    place: 'Mars · Sol 1 to Sol 30',
    teaches: 'Earth is too far away to help in time.',
    story:
      'You step outside. The air is mostly carbon dioxide — a gas we can’t breathe. It is far too thin, too. Earth is a dot in the sky. A radio message takes minutes to get there.',
    source: 'Signal delay: NASA Mars communications · Weather: NASA InSight (archive) · Oxygen: NASA MOXIE',
    onEnter: [LIVING],
    steps: [
      {
        kind: 'choice',
        task: 'Protect the base',
        prompt: 'Space rays hit Mars every day. Protect your base?',
        hint: 'Mars soil is free armour. Moving it takes power and makes you hungry.',
        options: [
          { label: 'Leave it and start exploring', stars: 1, effects: { S: -10 }, reason: 'You explored early. Space rays add up every sol.' },
          {
            label: 'Pile bags of Mars soil over the bedroom',
            effects: { S: 15, P: -10, F: -5 },
            reason: 'The crew sleeps under armour now. Digging is hungry work.',
          },
          {
            label: 'Bury the whole base',
            effects: { S: 25, P: -15, F: -10 },
            reason: 'Your whole home is under soil. A big storm will hurt less later.',
            setFlag: 'buried',
          },
        ],
      },
      {
        kind: 'choice',
        task: 'Stop the air leak',
        prompt: 'Alarm! Air is leaking out of the base!',
        hint: 'Mission Control knows the best fix. How long does a message take?',
        options: [
          {
            label: 'Ask Mission Control what to do',
            effects: { L: -10, P: -3 },
            reason: 'A great answer — but it came late. Air leaked the whole time.',
            clock: true,
          },
          {
            label: 'Patch it yourself, right now',
            effects: { L: -5 },
            reason: 'Fast, and good enough.',
            extras: [{ unless: ['reachTools'], effects: { P: -5 }, reason: 'The tool kit was deep in the hold.' }],
          },
          { label: 'Close off the leaking room', effects: { F: -15, L: -2 }, reason: 'The leak stopped. But the food was in that room.' },
        ],
      },
      {
        kind: 'choice',
        task: 'Make oxygen',
        prompt: 'A machine can make oxygen from Mars air. It uses lots of power.',
        hint: 'More oxygen costs more power. A dust storm will come one day.',
        options: [
          { label: 'Run it day and night', effects: { L: 20, P: -20 }, reason: 'Lots of oxygen. The batteries never rest.' },
          { label: 'Run it only in sunlight', effects: { L: 10, P: -10 }, reason: 'Slower, and easier on power.' },
          { label: 'Turn it off and use the tanks', effects: { P: 5, L: -10 }, reason: 'Power saved today. The tanks won’t last.' },
        ],
      },
    ],
    replay: {
      L: 'Messages to Mars take minutes each way. Crews learn to fix emergencies themselves.',
      P: 'Every machine needs power. Real crews never run everything at once.',
      default: 'On Mars, air, power and shelter all pull on each other.',
    },
    learned: 'Mars is so far away that a radio message takes minutes. The crew must decide alone.',
  },
  {
    id: 4,
    title: 'The Dust Storm',
    place: 'Mars · Sol 214',
    teaches: 'Solar power needs a clear sky.',
    story:
      'The sky turns brown. Dust dimmed the Sun on Earth. Now it is happening here. Solar panels need sunlight, and dust blocks it.',
    source: 'Dust storms: NASA Opportunity and InSight missions · Sunlight on Mars: NASA',
    onEnter: [LIVING, ...SUNLIGHT],
    adjust: [{ var: 'D', if: ['cliff'], add: -5, reason: 'The crater cliff blocks some of the dust.' }],
    steps: [
      {
        kind: 'choice',
        task: 'Save the panels',
        prompt: 'The storm arrives in minutes. What about the solar panels?',
        hint: 'Folded panels are safe but make no power. Open panels catch light — and dust.',
        options: [
          {
            label: 'Fold them away and use the battery',
            effects: { P: '-(D+10)', F: -5 },
            reason: 'The panels are safe. The greenhouse lights were dimmed to save power.',
          },
          {
            label: 'Leave them out to catch the last light',
            effects: { P: '-D' },
            reason: 'You caught a bit more light. Dust is piling up on the panels.',
            setFlag: 'panelsBuried',
            setFlagCond: { unless: ['spareParts'] },
            extras: [{ if: ['spareParts'], reason: 'Dust buried the panels — but your spare parts fixed them.' }],
          },
          {
            label: 'Fold half of them, in the rising wind',
            effects: { P: '-(D+5)', S: -5 },
            reason: 'Half the panels kept working. Folding them meant a long time outside.',
          },
        ],
      },
      {
        kind: 'sliders',
        task: 'Share the battery',
        prompt: 'Share the battery. There is not enough for everything.',
        hint: 'Each system wants 3 blocks. You have 7. What can wait?',
        units: 7,
        want: 3,
        costPerMissing: 5,
        systems: [
          { meter: 'L', label: 'Heaters and air machines' },
          { meter: 'F', label: 'Greenhouse lights' },
          { meter: 'S', label: 'Storm alarm and shields' },
        ],
      },
      {
        kind: 'choice',
        task: 'Clean the panels',
        prompt: 'The storm is over. The panels are grey with dust.',
        hint: 'Fast and risky? Slow and safe? Or use the little robot?',
        options: [
          { label: 'Go outside and brush them', effects: { P: 25, S: -15 }, reason: 'Clean panels right away. Outside, there is no shield.' },
          { label: 'Wait for the wind to clean them', effects: { P: 10, L: -5 }, reason: 'Safe and slow. The heaters ran low on power.' },
          { label: 'Send the little robot', effects: { P: 15 }, stars: -1, reason: 'The panels are clean. But the robot was meant for science.' },
        ],
      },
    ],
    replay: {
      P: 'Dusty solar panels ended two NASA missions: the Opportunity rover and the InSight lander.',
      F: 'Plants need light. When power is short, something must switch off. You choose what.',
      default: 'When power is short, you choose what stays on.',
    },
    learned: 'Solar power needs a clear sky. When power is short, you choose what stays on.',
  },
  {
    id: 5,
    title: 'Grow or Go Hungry',
    place: 'Mars · Sol 300',
    teaches: 'Growing food costs water, power and time.',
    story:
      'The packed food won’t last until the next rocket. Astronauts have grown lettuce in space and eaten it. Now it is your turn.',
    source: 'Plants in space: NASA OSDR (Veggie) · Water recycling: NASA ISS life support',
    onEnter: [LIVING, ...SUNLIGHT],
    steps: [
      {
        kind: 'choice',
        task: 'Plan the farm',
        prompt: 'How big will your farm be?',
        hint: 'More plants need more water and more lamps.',
        options: [
          {
            label: 'A big farm',
            effects: { F: 30, L: -15, P: -15 },
            reason: 'Lots of plants. Lots of water. Lots of lamps.',
            extras: [{ if: ['seeds'], effects: { F: 10 }, reason: 'The seeds you packed grew extra food.' }],
          },
          {
            label: 'A small garden',
            effects: { F: 10, L: -5, P: -5 },
            reason: 'Fresh food for a small cost.',
            extras: [{ if: ['seeds'], effects: { F: 10 }, reason: 'The seeds you packed grew extra food.' }],
          },
          { label: 'No farm — eat packed food', effects: { F: -20, P: 5 }, reason: 'Nothing to water. Nothing to pick.' },
        ],
      },
      {
        kind: 'choice',
        task: 'Find water',
        prompt: 'Water is running low.',
        hint: 'Cleaning old water uses power. Drilling means a day outside. Plants drink too.',
        options: [
          { label: 'Clean used water at full power', effects: { L: 15, P: -10 }, reason: 'Used water became clean water again.' },
          { label: 'Drill for ice under the ground', effects: { L: 25, P: -15, S: -10 }, reason: 'Lots of water. A long day outside the shield.' },
          { label: 'Give the plants less water', effects: { L: 5, F: -15 }, reason: 'The crew drinks. The plants shrink.' },
        ],
      },
      {
        kind: 'choice',
        task: 'Save the lettuce',
        prompt: 'The lettuce is nearly ready. Then a water pump breaks.',
        hint: 'Your water, your plants, or your time?',
        options: [
          { label: 'Give the plants your drinking water', effects: { F: 10, L: -10 }, reason: 'You saved the plants with your own water.' },
          { label: 'Pick the lettuce early', effects: { F: 5 }, stars: -1, reason: 'Small leaves. The plant experiment ended early.' },
          { label: 'Fix the pump first', effects: { F: -10, P: -5 }, reason: 'The pump works again. Some plants died.' },
        ],
      },
    ],
    replay: {
      F: 'Packed food runs out. The next rocket is 26 months away. Crews must grow food too.',
      L: 'Water is heavy to launch. The Space Station cleans and reuses almost every drop.',
      default: 'A farm is a trade: water and power now, food later.',
    },
    learned: 'Growing food costs water, power and time. But a farm pays you back.',
  },
  {
    id: 6,
    title: 'Crew Up',
    place: 'Mars · Sol 400 to Sol 500',
    teaches: 'Nobody survives Mars alone.',
    story:
      'A second ship lands with five experts. Your base has air and food for only three more. Then comes the hardest part of the mission.',
    source: 'Storm: NASA DONKI · Samples: NASA Perseverance / Mars Sample Return · Picture: NASA APOD',
    onEnter: [LIVING, ...SUNLIGHT],
    adjust: [{ var: 'X', if: ['buried'], add: -10, reason: 'Your buried base blocks part of the storm.' }],
    steps: [
      {
        kind: 'crew',
        task: 'Pick your crew',
        prompt: 'Pick your crew: 3 of the 5 experts.',
        hint: 'Which meters are lowest? An expert halves every loss to their meter.',
        pick: 3,
        costPerPerson: { L: -3, F: -3 },
        members: [
          { id: 'engineer', label: 'Engineer', protects: 'P', blurb: 'Halves every Power loss.' },
          { id: 'lifesupport', label: 'Air and Water Expert', protects: 'L', blurb: 'Halves every Air & Water loss.' },
          { id: 'botanist', label: 'Plant Expert', protects: 'F', blurb: 'Halves every Food loss.' },
          { id: 'medic', label: 'Doctor', protects: 'S', blurb: 'Halves every Shield loss.' },
          { id: 'scientist', label: 'Scientist', doublesStars: true, blurb: 'Doubles the stars you earn. Protects nothing.' },
        ],
      },
      {
        kind: 'choice',
        task: 'Survive two storms',
        prompt: 'A Sun storm and a dust storm arrive together!',
        hint: 'The shelter saves your Shield. But the panels need someone outside.',
        options: [
          { label: 'Everyone into the shelter', effects: { S: '-(X-10)', P: -20 }, reason: 'Safe from the storm. Nobody cleaned the panels.' },
          { label: 'Two hide, one keeps the panels clean', effects: { S: '-(X+5)', P: -5 }, reason: 'The panels stayed clean. One person took the storm.' },
          { label: 'Finish the experiment first', stars: 2, effects: { S: '-(X+15)' }, reason: 'The science is saved. The crew took the whole storm.' },
        ],
      },
      {
        kind: 'choice',
        task: 'Fix the air',
        prompt: 'The machine that cleans your air has broken.',
        hint: 'The Apollo 13 crew once built a new one from spare parts.',
        options: [
          { label: 'Build a new one from spare parts', effects: { L: 10, P: -20 }, reason: 'It works! The power tools drained the batteries.' },
          { label: 'Close the greenhouse and use its air', effects: { L: 15, F: -25 }, reason: 'Air today. No food from the plants tomorrow.' },
          { label: 'Everyone rests to breathe less', effects: { L: -15 }, stars: -1, reason: 'The air lasted. But no work got done.' },
        ],
      },
      {
        kind: 'choice',
        task: 'Collect rocks',
        prompt: 'Last job: collect Mars rocks to send back to Earth.',
        hint: 'The best rocks are far away. Do you have the air and Shield for the trip?',
        options: [
          {
            label: 'The whole crew drives to the old river bed',
            stars: 3,
            effects: { L: -15, S: -10 },
            reason: 'The best rocks! It cost spacesuit air and a day outside.',
            extras: [
              { if: ['labKit'], stars: 1, reason: 'Your lab kit made the rocks worth more.' },
              { if: ['delta'], stars: 1, reason: 'You landed by the river bed. The rocks were close.' },
            ],
          },
          {
            label: 'Send the rover',
            stars: 1,
            effects: { P: -15 },
            reason: 'Safe but slow. Fewer rocks.',
            extras: [
              { if: ['labKit'], stars: 1, reason: 'Your lab kit made the rocks worth more.' },
              { if: ['delta'], stars: 1, reason: 'You landed by the river bed. The rocks were close.' },
            ],
          },
          {
            label: 'Collect rocks near the base',
            stars: 1,
            effects: { F: -5 },
            reason: 'Plain rocks, a short walk and a long lunch.',
            extras: [{ if: ['labKit'], stars: 1, reason: 'Your lab kit made the rocks worth more.' }],
          },
        ],
      },
    ],
    replay: {
      default: 'Real crews have many kinds of experts. Every system has someone who knows it.',
    },
    learned: 'Nobody survives Mars alone. Different experts protect different things.',
  },
];
