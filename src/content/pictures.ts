// R5 (BUILD_SEQUENCE.md §4.1a): every decision shown as pictures first.
// For each option: `short` (2–5 words on the card), `scene` (one big icon and an optional small one),
// `chain` (the cause → effect icons drawn before the meter chips) and `line` (the one-line result, shortened
// from the option's reason in levels.ts). The full sentences stay in levels.ts for Read-to-me, Hint and Replay.
// For each choice step: a short bubble `caption`, keyed by the step's full prompt.
import {
  Battery,
  BatteryLow,
  Bed,
  Bot,
  Brush,
  Car,
  Cylinder,
  DoorClosed,
  Drill,
  Droplets,
  FlaskConical,
  Funnel,
  Gem,
  GlassWater,
  Hammer,
  Hourglass,
  House,
  Leaf,
  Microscope,
  Moon,
  Mountain,
  Package,
  Radio,
  Recycle,
  Scissors,
  Shell,
  Shield,
  Shovel,
  Snowflake,
  SolarPanel,
  Sprout,
  Sun,
  SunDim,
  Tractor,
  Truck,
  UsersRound,
  Utensils,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface Picture {
  short: string;
  scene: [LucideIcon, LucideIcon?];
  chain: LucideIcon[];
  line: string;
}

export const PICTURES: Record<string, Picture> = {
  // Level 1 · last seat
  'Science lab kit': { short: 'Science kit', scene: [Microscope], chain: [Microscope, Utensils], line: 'The kit took snack space. Your rocks will be worth more.' },
  'Box of spare parts': { short: 'Spare parts', scene: [Wrench, Package], chain: [Wrench, Shield], line: 'It took a shield plate’s place. It fixes panels later.' },
  'Seeds and soil': { short: 'Seeds and soil', scene: [Sprout], chain: [Sprout, Droplets], line: 'Seeds need water from day one. Your farm grows more later.' },
  // Level 2 · storm
  'Build a shelter from water bags and food boxes': { short: 'Hide behind water', scene: [UsersRound, Droplets], chain: [Droplets, Shield], line: 'The water blocked most of the storm. Nobody could work.' },
  'Keep working on the experiment': { short: 'Keep working', scene: [FlaskConical, Zap], chain: [Zap, Shield], line: 'The science is done. The crew took the whole storm.' },
  'Turn the fuel tanks to the Sun and power down': { short: 'Tanks face the Sun', scene: [Cylinder, Sun], chain: [Cylinder, Shield], line: 'The tanks blocked part of the storm. Panels faced away.' },
  // Level 2 · filter
  'Run the cleaning machine now': { short: 'Run the cleaner', scene: [Recycle, Zap], chain: [Zap, Droplets], line: 'It took lots of power. The water is flowing again.' },
  'Drink less until Mars': { short: 'Drink less', scene: [GlassWater], chain: [GlassWater, Utensils], line: 'Dried food needs water. You can’t eat it dry.' },
  'Put in the spare filter': { short: 'Spare filter', scene: [Funnel], chain: [Funnel, Droplets], line: 'A new filter works right away.' },
  // Level 2 · landing zone
  'The flat plain — smooth and sunny': { short: 'Flat sunny plain', scene: [Sun], chain: [Sun, SolarPanel], line: 'Sun all day. Nothing to hide behind.' },
  'Next to the crater cliff — sheltered': { short: 'Crater cliff', scene: [Mountain, Shield], chain: [Mountain, SunDim], line: 'The cliff protects you but shades your panels.' },
  'The old river bed — best rocks, bumpy': { short: 'Old river bed', scene: [Shell, Gem], chain: [Shell, Droplets], line: 'A hard bump cracked a water tank. The rocks are worth it.' },
  // Level 3 · protect
  'Leave it and start exploring': { short: 'Explore now', scene: [Car], chain: [Car, Shield], line: 'You explored early. Space rays add up every sol.' },
  'Pile bags of Mars soil over the bedroom': { short: 'Cover the bedroom', scene: [Bed, Shovel], chain: [Shovel, Utensils], line: 'The crew sleeps under armour. Digging is hungry work.' },
  'Bury the whole base': { short: 'Bury the base', scene: [House, Shovel], chain: [Shovel, Shield], line: 'Your home is under soil. A big storm will hurt less.' },
  // Level 3 · leak
  'Ask Mission Control what to do': { short: 'Ask Earth', scene: [Radio], chain: [Radio, Hourglass, Wind], line: 'A great answer, but it came late. Air leaked the whole time.' },
  'Patch it yourself, right now': { short: 'Patch it now', scene: [Wrench], chain: [Wrench, Wind], line: 'Fast, and good enough.' },
  'Close off the leaking room': { short: 'Close the room', scene: [DoorClosed], chain: [DoorClosed, Utensils], line: 'The leak stopped. But the food was in that room.' },
  // Level 3 · oxygen maker
  'Run it day and night': { short: 'Day and night', scene: [Wind, Moon], chain: [Wind, BatteryLow], line: 'Lots of oxygen. The batteries never rest.' },
  'Run it only in sunlight': { short: 'Sunlight only', scene: [SunDim], chain: [SunDim, Wind], line: 'Slower, and easier on power.' },
  'Turn it off and use the tanks': { short: 'Use the tanks', scene: [Cylinder], chain: [Cylinder, Wind], line: 'Power saved today. The tanks won’t last.' },
  // Level 4 · panels
  'Fold them away and use the battery': { short: 'Fold the panels', scene: [SolarPanel, Battery], chain: [SolarPanel, Battery], line: 'The panels are safe. The greenhouse lights were dimmed.' },
  'Leave them out to catch the last light': { short: 'Leave them out', scene: [Sun, SolarPanel], chain: [Sun, Wind], line: 'You caught more light. Dust is piling up on the panels.' },
  'Fold half of them, in the rising wind': { short: 'Fold half', scene: [SolarPanel, Wind], chain: [Wind, SolarPanel], line: 'Half the panels kept working. Folding took a long time outside.' },
  // Level 4 · cleaning
  'Go outside and brush them': { short: 'Brush them', scene: [Brush], chain: [Brush, Zap], line: 'Clean panels right away. Outside, there is no shield.' },
  'Wait for the wind to clean them': { short: 'Wait for wind', scene: [Wind], chain: [Wind, Snowflake], line: 'Safe and slow. The heaters ran low on power.' },
  'Send the little robot': { short: 'Send the robot', scene: [Bot], chain: [Bot, FlaskConical], line: 'The panels are clean. But the robot was for science.' },
  // Level 5 · farm
  'A big farm': { short: 'Big farm', scene: [Tractor], chain: [Tractor, Droplets, Zap], line: 'Lots of plants. Lots of water. Lots of lamps.' },
  'A small garden': { short: 'Small garden', scene: [Sprout], chain: [Sprout, Utensils], line: 'Fresh food for a small cost.' },
  'No farm — eat packed food': { short: 'No farm', scene: [Package], chain: [Package, Utensils], line: 'Nothing to water. Nothing to pick.' },
  // Level 5 · water
  'Clean used water at full power': { short: 'Clean used water', scene: [Recycle, Droplets], chain: [Zap, Droplets], line: 'Used water became clean water again.' },
  'Drill for ice under the ground': { short: 'Drill for ice', scene: [Drill, Snowflake], chain: [Drill, Droplets, Shield], line: 'Lots of water. A long day outside the shield.' },
  'Give the plants less water': { short: 'Less for plants', scene: [Leaf], chain: [Leaf, Utensils], line: 'The crew drinks. The plants shrink.' },
  // Level 5 · pump
  'Give the plants your drinking water': { short: 'Give plants your water', scene: [GlassWater, Leaf], chain: [GlassWater, Leaf], line: 'You saved the plants with your own water.' },
  'Pick the lettuce early': { short: 'Pick lettuce early', scene: [Scissors, Leaf], chain: [Scissors, FlaskConical], line: 'Small leaves. The plant experiment ended early.' },
  'Fix the pump first': { short: 'Fix the pump', scene: [Wrench], chain: [Wrench, Leaf], line: 'The pump works again. Some plants died.' },
  // Level 6 · storm + dust
  'Everyone into the shelter': { short: 'All in shelter', scene: [House, UsersRound], chain: [House, SolarPanel], line: 'Safe from the storm. Nobody cleaned the panels.' },
  'Two hide, one keeps the panels clean': { short: 'Two hide, one cleans', scene: [UsersRound, Brush], chain: [Brush, Shield], line: 'The panels stayed clean. One person took the storm.' },
  'Finish the experiment first': { short: 'Finish the science', scene: [FlaskConical, Zap], chain: [FlaskConical, Shield], line: 'The science is saved. The crew took the whole storm.' },
  // Level 6 · scrubber
  'Build a new one from spare parts': { short: 'Build a new one', scene: [Hammer], chain: [Hammer, Zap], line: 'It works! The power tools drained the batteries.' },
  'Close the greenhouse and use its air': { short: 'Use greenhouse air', scene: [Leaf, Wind], chain: [Leaf, Utensils], line: 'Air today. No food from the plants tomorrow.' },
  'Everyone rests to breathe less': { short: 'Everyone rests', scene: [Bed], chain: [Bed, FlaskConical], line: 'The air lasted. But no work got done.' },
  // Level 6 · samples
  'The whole crew drives to the old river bed': { short: 'Drive to river bed', scene: [Truck, Gem], chain: [Truck, Wind], line: 'The best rocks! It cost suit air and a day outside.' },
  'Send the rover': { short: 'Send the rover', scene: [Car, Gem], chain: [Car, Zap], line: 'Safe but slow. Fewer rocks.' },
  'Collect rocks near the base': { short: 'Rocks near base', scene: [Mountain], chain: [Mountain, Utensils], line: 'Plain rocks, a short walk and a long lunch.' },
};

/** The bubble over each decision: a few words. The full prompt stays in levels.ts. Keyed by that full prompt. */
export const CAPTION: Record<string, string> = {
  'One seat is left on the rocket. What gets it?': 'One seat left. Who gets it?',
  'Storm alert! Harmful rays from the Sun arrive in one hour.': 'Storm alert! Rays in one hour.',
  'The filter that cleans your water is blocked.': 'The water filter is blocked.',
  'Mars is in the window! Where in Jezero Crater will you land?': 'Mars! Pick a landing spot.',
  'Space rays hit Mars every day. Protect your base?': 'Rays hit the base. Cover it?',
  'Alarm! Air is leaking out of the base!': 'Alarm! Air is leaking out!',
  'A machine can make oxygen from Mars air. It uses lots of power.': 'Make oxygen? It uses power.',
  'The storm arrives in minutes. What about the solar panels?': 'Dust storm! What about panels?',
  'The storm is over. The panels are grey with dust.': 'The panels are grey.',
  'How big will your farm be?': 'How big is your farm?',
  'Water is running low.': 'Water is running low.',
  'The lettuce is nearly ready. Then a water pump breaks.': 'The pump breaks! Lettuce nearly ready.',
  'A Sun storm and a dust storm arrive together!': 'Sun storm and dust storm together!',
  'The machine that cleans your air has broken.': 'The air cleaner broke.',
  'Last job: collect Mars rocks to send back to Earth.': 'Last job: collect Mars rocks.',
};

export const pictureFor = (label: string): Picture | undefined => PICTURES[label];
export const captionFor = (prompt: string): string => CAPTION[prompt] ?? prompt;
