import type { DEBUG_LEVELS } from "../models/enums";


export const log = (level: ValueOf<typeof DEBUG_LEVELS>, error: unknown) => {
  console.log(`[${level}] `, error);
}