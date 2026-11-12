// Lets plain Node (type stripping) run the game's TypeScript: imports here have no ".ts" ending, so add it.
import { register } from 'node:module';

register('./ts-resolve-hooks.mjs', import.meta.url);
