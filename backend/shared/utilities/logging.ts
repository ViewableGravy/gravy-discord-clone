/***** TYPE DEFINITIONS *****/
import { DEBUG_LEVELS } from "./constants";

/***** FUNCTIONS *****/
export const log = (level: ValueOf<typeof DEBUG_LEVELS>, error: unknown) => {
  console.log(`[${level}]`, error);
}