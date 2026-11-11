// The six levels of the Mars mission. Source of truth: plan.md §6.
// Science and Story leads: edit words and numbers here. `npm test` rejects any
// option that changes fewer than two things.
import type { Extra, Level } from '../engine/types';

const LIVING: Extra = {
  effects: { L: -5, F: -5 },
  reason: 'Time passes. The crew eats, drinks and breathes.',
};
const SUNLIGHT: Extra[] = [
  { unless: ['panelsBuried'], effects: { P: 10 }, reason: 'Sunlight recharged the batteries.' },
  { if: ['panelsBuried'], reason: 'Remember the panels you left out in the storm? They are buried in dust — no recharge.' },
];

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'The Last Departure',
    place: 'Earth · launch day',
    teaches: 'A rocket cannot carry everything.',
    story:
      'The rocket leaves in the morning. The next one cannot leave for 26 months. Whatever you forget, you live without.',
    source: 'Earth: NASA EPIC · Launch windows: NASA Mars missions',
    onEnter: [],
    steps: [
      {
        kind: 'crates',
        prompt: 'Pack the rocket. You have 8 crates and 4 needs.',
        hint: 'Every meter starts at 40. Each crate adds 10. What will you run short of?',
        crates: 8,
        perCrate: 10,
        bins: [
          { meter: 'P', label: 'Solar panels and batteries' },
          { meter: 'L', label: 'Oxygen and water tanks' },
          { meter: 'F', label: 'Food packs' },
          { meter: 'S', label: 'Shield panels' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'One cargo seat is left. What takes it?',
        hint: 'Each one costs a little now and pays you back in a later level.',
        options: [
          {
            label: 'Science lab kit',
            stars: 2,
            effects: { F: -5 },
            reason: 'The kit took the snack locker. Your rock samples will be worth more later.',
            setFlag: 'labKit',
          },
          {
            label: 'Spare parts box',
            effects: { P: 10, S: -5 },
            reason: 'The box sits where a shield plate was. It can fix broken panels later.',
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
        prompt: 'Stow the ship. Only two things fit within reach of your seat.',
        hint: 'What is within reach is quick to grab in an emergency. The rest is deep in the hold.',
        pick: 2,
        items: [
          { flag: 'reachWater', label: 'Water bags', inReach: 'Storm shelter is built in time', inHold: 'Storm shelter is late' },
          { flag: 'reachFilter', label: 'Spare water filter', inReach: 'Quick to swap', inHold: 'Swapping opens the shield wall' },
          { flag: 'reachMedkit', label: 'Medical kit', inReach: 'Ready for a rough landing', inHold: 'A rough landing hurts more' },
          { flag: 'reachTools', label: 'Tool kit', inReach: 'Quick repairs', inHold: 'Repairs cost power' },
        ],
      },
    ],
    replay: { default: 'Real mission planners weigh every kilogram. Try packing for balance.' },
    learned: "A rocket can't carry everything. More shielding means less food.",
  },
  {
    id: 2,
    title: 'The Dangerous Journey',
    place: 'Deep space · 7 months',
    teaches: 'The Sun has storms, and thick things are armour.',
    story:
      'Seven months to Mars. Out here nothing blocks the storms from the Sun. An alert comes in — the same kind that sends real astronauts to shelter.',
    source: 'Storm: NASA DONKI + NOAA SWPC · Radiation: NASA Human Research Program',
    onEnter: [LIVING],
    steps: [
      {
        kind: 'choice',
        prompt: 'Storm alert! The blast arrives in one hour.',
        hint: 'Water is a good radiation shield. Science earns stars — but look at your Shield meter first.',
        options: [
          {
            label: 'Build a shelter from water bags and food boxes, and wait inside',
            effects: { S: '-(X-10)', F: -5, P: -5 },
            reason: 'Water blocked most of the storm, but nobody could work.',
            extras: [{ unless: ['reachWater'], effects: { S: -5 }, reason: 'The water bags were deep in the hold, so the shelter was late.' }],
          },
          {
            label: 'Keep working on the experiment',
            stars: 2,
            effects: { S: '-(X+5)' },
            reason: 'The science is finished. The crew took the full dose.',
          },
          {
            label: 'Turn the ship so the fuel tanks face the Sun, and power down',
            effects: { S: '-(X-5)', P: -15 },
            reason: 'The tanks blocked part of the storm, but the solar panels faced away.',
          },
        ],
      },
      {
        kind: 'choice',
        prompt: 'The water recycler filter is clogged.',
        hint: 'Cleaning uses power. Waiting uses water. Where did you stow the spare filter?',
        options: [
          { label: 'Run the cleaning cycle now', effects: { P: -15, L: 10 }, reason: 'Cleaning took a lot of electricity, but the water is flowing.' },
          { label: 'Drink less until Mars', effects: { L: -15, F: -5 }, reason: 'Dried food cannot be eaten without water.' },
          {
            label: 'Swap in the spare filter',
            effects: { L: 5 },
            reason: 'A fresh filter works at once.',
            extras: [{ unless: ['reachFilter'], effects: { S: -10 }, reason: 'It was packed inside the shield wall. Getting it out left a gap.' }],
          },
        ],
      },
      {
        kind: 'choice',
        prompt: 'Mars fills the window. Choose your landing zone in Jezero Crater.',
        hint: 'Sun means power. A cliff means shelter. The old river delta has the best rocks.',
        options: [
          {
            label: 'The flat plain — smooth and sunny',
            effects: { P: 10, S: -10 },
            reason: 'Sunlight all day. Nothing to hide behind.',
          },
          {
            label: 'Beside the crater cliff — sheltered',
            effects: { S: 10, P: -10 },
            reason: 'The cliff shields you, and shades your panels for part of each day. It will block some dust later.',
            setFlag: 'cliff',
          },
          {
            label: 'The old river delta — best science, rocky',
            stars: 2,
            effects: { L: -10 },
            reason: 'A hard bounce cracked a water tank. The rocks here will be worth it.',
            setFlag: 'delta',
          },
        ],
      },
      {
        kind: 'order',
        prompt: 'Landing checklist. Put the four steps in the right order.',
        hint: 'First slow down in the air, then slow down more, then land gently.',
        sequence: ['Heat shield', 'Parachute', 'Landing engines', 'Touchdown'],
        rightStars: 1,
        rightReason: 'Soft landing. Welcome to Mars, Commander.',
        wrong: { P: -5, S: -5 },
        wrongReason: 'A rough landing shook the ship. Check the order and try again.',
        wrongExtras: [{ unless: ['reachMedkit'], effects: { L: -5 }, reason: 'The medical kit was deep in the hold.' }],
      },
    ],
    replay: {
      S: 'On a real mission, the crew stops work and shelters as soon as a storm alert comes.',
      default: 'In deep space every supply is counted. Shelter first, then fix one thing at a time.',
    },
    learned: 'The Sun has storms. Astronauts watch the alerts and hide behind thick things like water.',
  },
  {
    id: 3,
    title: 'First Breath',
    place: 'Mars · Sol 1 to Sol 30',
    teaches: 'Earth is too far away to help in time.',
    story:
      'You step out. The air is almost all carbon dioxide and far too thin to breathe. Earth is a dot in the sky, and a radio message takes minutes to reach it.',
    source: 'Signal delay: NASA Mars communications · Weather: NASA InSight (archive) · Oxygen: NASA MOXIE',
    onEnter: [LIVING],
    steps: [
      {
        kind: 'choice',
        prompt: 'Protect the habitat from radiation?',
        hint: 'Mars soil is free armour, but moving it takes power and hungry work.',
        options: [
          { label: 'Leave it as it landed and start exploring', stars: 1, effects: { S: -10 }, reason: 'You explored early. Radiation adds up every sol.' },
          {
            label: 'Pile bags of Mars soil over the sleeping room',
            effects: { S: 15, P: -10, F: -5 },
            reason: 'The crew sleeps under armour now. Digging is hungry work.',
          },
          {
            label: 'Bury the whole habitat',
            effects: { S: 25, P: -15, F: -10 },
            reason: 'The whole home is under soil. A big storm will hurt less later.',
            setFlag: 'buried',
          },
        ],
      },
      {
        kind: 'choice',
        prompt: 'Alarm: the cabin is leaking air!',
        hint: 'Mission Control knows the perfect fix — but how long does a message take?',
        options: [
          {
            label: 'Ask Mission Control what to do',
            effects: { L: -10, P: -3 },
            reason: 'A perfect answer — but it arrived late, and air leaked the whole time.',
            clock: true,
          },
          {
            label: 'Patch it yourself, now',
            effects: { L: -5 },
            reason: 'Fast, and good enough.',
            extras: [{ unless: ['reachTools'], effects: { P: -5 }, reason: 'The tool kit was deep in the hold.' }],
          },
          { label: 'Seal off the leaking room', effects: { F: -15, L: -2 }, reason: 'The leak stopped at once. The food store is in that room.' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'The oxygen maker can pull oxygen out of Mars air. It is power-hungry.',
        hint: 'More oxygen costs more power. A dust storm is coming one day.',
        options: [
          { label: 'Run it day and night', effects: { L: 20, P: -20 }, reason: 'Plenty of oxygen. The batteries never rest.' },
          { label: 'Run it only in sunlight', effects: { L: 10, P: -10 }, reason: 'Slower and gentler.' },
          { label: 'Leave it off and live on the tanks', effects: { P: 5, L: -10 }, reason: 'Power saved today. The tanks will not last.' },
        ],
      },
    ],
    replay: {
      L: 'Messages to Mars take minutes each way, so crews are trained to fix emergencies themselves.',
      P: 'Every machine needs power. Real crews never run everything at once.',
      default: 'On Mars, air, power and shelter all pull on each other.',
    },
    learned: 'Mars is so far that a radio message takes minutes. The crew has to decide alone.',
  },
  {
    id: 4,
    title: 'The Dust Storm',
    place: 'Mars · Sol 214',
    teaches: 'Solar power depends on the sky.',
    story:
      'The horizon turns brown. Dust dimmed the Sun on Earth — now it is happening here. Solar panels need sunlight, and dust blocks it.',
    source: 'Dust storms: NASA Opportunity and InSight missions · Sunlight on Mars: NASA',
    onEnter: [LIVING, ...SUNLIGHT],
    adjust: [{ var: 'D', if: ['cliff'], add: -5, reason: 'The crater cliff blocks some of the dust.' }],
    steps: [
      {
        kind: 'choice',
        prompt: 'The storm arrives in minutes. What about the solar panels?',
        hint: 'Folded panels are safe but make no power. Open panels catch light — and dust.',
        options: [
          {
            label: 'Fold them away and run on battery',
            effects: { P: '-(D+10)', F: -5 },
            reason: 'The panels are safe. The greenhouse lights were dimmed to save battery.',
          },
          {
            label: 'Leave them out to catch the last light',
            effects: { P: '-D' },
            reason: 'You caught a little more light. The dust is piling up on the panels.',
            setFlag: 'panelsBuried',
            setFlagCond: { unless: ['spareParts'] },
            extras: [{ if: ['spareParts'], reason: 'The panels were buried — but your spare parts fixed them.' }],
          },
          {
            label: 'Fold half, in the rising wind',
            effects: { P: '-(D+5)', S: -5 },
            reason: 'Half the panels kept working. It was a long spacewalk outside the shield.',
          },
        ],
      },
      {
        kind: 'sliders',
        prompt: 'Share the battery. There is not enough for everything.',
        hint: 'Each system wants 3 units. You have 7. What can go without?',
        units: 7,
        want: 3,
        costPerMissing: 5,
        systems: [
          { meter: 'L', label: 'Heaters and air machines' },
          { meter: 'F', label: 'Greenhouse lights' },
          { meter: 'S', label: 'Storm alarm and shield systems' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'The storm has passed. The panels are grey with dust.',
        hint: 'Fast and risky, slow and safe, or use the science robot?',
        options: [
          { label: 'Go outside and brush them', effects: { P: 25, S: -15 }, reason: 'Clean panels at once. Outside, there is no shield.' },
          { label: 'Wait for the wind to clean them', effects: { P: 10, L: -5 }, reason: 'Safe and slow. The heaters ran on thin power.' },
          { label: 'Send the little robot', effects: { P: 15 }, stars: -1, reason: 'The panels are clean. The robot was meant for science.' },
        ],
      },
    ],
    replay: {
      P: 'Dust on solar panels ended the missions of the Opportunity rover and the InSight lander.',
      F: 'Plants need light. When power is short, something has to be switched off — choose what.',
      default: 'A power budget means choosing what stays on.',
    },
    learned: 'Solar power depends on the sky. When power is short, you choose what stays on.',
  },
  {
    id: 5,
    title: 'Grow or Go Hungry',
    place: 'Mars · Sol 300',
    teaches: 'Growing food costs water, power and time.',
    story:
      'The packed food will not last until the next rocket. Astronauts have grown and eaten lettuce in space. Now it is your turn.',
    source: 'Plants in space: NASA OSDR (Veggie) · Water recycling: NASA ISS life support',
    onEnter: [LIVING, ...SUNLIGHT],
    steps: [
      {
        kind: 'choice',
        prompt: 'How big is the farm?',
        hint: 'More plants need more water and more lamps.',
        options: [
          {
            label: 'A big farm',
            effects: { F: 30, L: -15, P: -15 },
            reason: 'Lots of plants, lots of water, lots of lamps.',
            extras: [{ if: ['seeds'], effects: { F: 10 }, reason: 'The seeds you packed grew extra food.' }],
          },
          {
            label: 'A small garden',
            effects: { F: 10, L: -5, P: -5 },
            reason: 'Fresh food at a small cost.',
            extras: [{ if: ['seeds'], effects: { F: 10 }, reason: 'The seeds you packed grew extra food.' }],
          },
          { label: 'No farm — eat packed food', effects: { F: -20, P: 5 }, reason: 'Nothing to water, nothing to harvest.' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'Water is running low.',
        hint: 'Recycling uses power. Drilling means a day outside. Plants drink too.',
        options: [
          { label: 'Run the recycler at full power', effects: { L: 15, P: -10 }, reason: 'Used water became clean water again.' },
          { label: 'Drill for buried ice', effects: { L: 25, P: -15, S: -10 }, reason: 'A lot of water, and a long day outside the shield.' },
          { label: 'Give the plants less water', effects: { L: 5, F: -15 }, reason: 'The crew drinks. The crop shrinks.' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'The lettuce is nearly ready when a pump fails.',
        hint: 'Your water, your harvest, or your time?',
        options: [
          { label: "Carry the crew's drinking water to the plants", effects: { F: 10, L: -10 }, reason: 'The harvest is saved with your own water.' },
          { label: 'Harvest early', effects: { F: 5 }, stars: -1, reason: 'Small leaves, and the plant experiment was cut short.' },
          { label: 'Fix the pump first', effects: { F: -10, P: -5 }, reason: 'The pump works again. Some plants were lost.' },
        ],
      },
    ],
    replay: {
      F: 'Packed food runs out, and the next rocket is 26 months away. Crews must grow some of their own.',
      L: 'Water is so heavy to launch that the Space Station recycles nearly every drop.',
      default: 'A farm is a trade: water and power now, food later.',
    },
    learned: 'Growing food costs water, power and time — but a farm pays you back.',
  },
  {
    id: 6,
    title: 'Crew Up',
    place: 'Mars · Sol 400 to Sol 500',
    teaches: 'Nobody survives Mars alone.',
    story:
      'A second ship arrives with five specialists. The habitat has air and food for only three more. Then comes the hardest stretch of the mission.',
    source: 'Storm: NASA DONKI · Samples: NASA Perseverance / Mars Sample Return · Picture: NASA APOD',
    onEnter: [LIVING, ...SUNLIGHT],
    adjust: [{ var: 'X', if: ['buried'], add: -10, reason: 'Your buried habitat blocks part of the storm.' }],
    steps: [
      {
        kind: 'crew',
        prompt: 'Choose your crew: 3 of 5.',
        hint: 'Look at your meters. Which systems are weakest? A specialist halves every loss to their system.',
        pick: 3,
        costPerPerson: { L: -3, F: -3 },
        members: [
          { id: 'engineer', label: 'Engineer', protects: 'P', blurb: 'Halves every Power loss.' },
          { id: 'lifesupport', label: 'Life-Support Technician', protects: 'L', blurb: 'Halves every Air & Water loss.' },
          { id: 'botanist', label: 'Botanist', protects: 'F', blurb: 'Halves every Food loss.' },
          { id: 'medic', label: 'Medic', protects: 'S', blurb: 'Halves every Shield loss.' },
          { id: 'scientist', label: 'Scientist', doublesStars: true, blurb: 'Doubles the stars you earn. Protects nothing.' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'A solar storm and a dust front arrive together.',
        hint: 'The shelter saves your Shield. The panels need someone outside.',
        options: [
          { label: 'Everyone into the shelter', effects: { S: '-(X-10)', P: -20 }, reason: 'Safe from the storm. Nobody cleaned the panels.' },
          { label: 'Two shelter, one keeps the panels clean', effects: { S: '-(X+5)', P: -5 }, reason: 'The panels stayed clear. One person took the dose.' },
          { label: 'Finish the experiment first', stars: 2, effects: { S: '-(X+15)' }, reason: 'The data is saved. The crew took the whole storm.' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'The air scrubber that removes carbon dioxide has failed.',
        hint: 'The Apollo 13 crew once built a new one from spare parts.',
        options: [
          { label: 'Build a replacement from spare parts and power tools', effects: { L: 10, P: -20 }, reason: 'It works! The power tools drained the batteries.' },
          { label: 'Close the greenhouse and use its air', effects: { L: 15, F: -25 }, reason: 'Air today. No harvest tomorrow.' },
          { label: 'Everyone rests to breathe less', effects: { L: -15 }, stars: -1, reason: 'The air lasted. No work got done.' },
        ],
      },
      {
        kind: 'choice',
        prompt: 'The science goal: collect Mars rocks to send back to Earth.',
        hint: 'The best rocks are far away. Do you have the air and the shield for the trip?',
        options: [
          {
            label: 'The whole crew drives to the delta',
            stars: 3,
            effects: { L: -15, S: -10 },
            reason: 'The best samples. Spacesuit air, and a day without shelter.',
            extras: [
              { if: ['labKit'], stars: 1, reason: 'Your lab kit made the samples worth more.' },
              { if: ['delta'], stars: 1, reason: 'You landed by the delta — the rocks were close.' },
            ],
          },
          {
            label: 'Send the rover',
            stars: 1,
            effects: { P: -15 },
            reason: 'Safe and slower. Fewer samples.',
            extras: [
              { if: ['labKit'], stars: 1, reason: 'Your lab kit made the samples worth more.' },
              { if: ['delta'], stars: 1, reason: 'You landed by the delta — the rocks were close.' },
            ],
          },
          {
            label: 'Collect near the habitat',
            stars: 1,
            effects: { F: -5 },
            reason: 'Ordinary rocks, a short walk and a long lunch.',
            extras: [{ if: ['labKit'], stars: 1, reason: 'Your lab kit made the samples worth more.' }],
          },
        ],
      },
    ],
    replay: {
      default: 'Real crews are built from different specialists so that every system has someone who knows it.',
    },
    learned: 'Nobody survives Mars alone. Different skills protect different systems.',
  },
];
