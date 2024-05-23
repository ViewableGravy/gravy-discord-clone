/**
 * @fileoverview Base socket validator. This includes the base object that should be received from the clinet
 * in any and all requests
 */
import { z } from 'zod';

/***** TYPE DEFINITIONS *****/
export type TTypeLiteralsAsStrings = typeof types[number] extends z.ZodLiteral<infer R> ? R : never;
type TGetTypeLiteral = <T extends TTypeLiteralsAsStrings>(type: T) => z.ZodLiteral<T>;
type TGetTypeLiteralAsString = <T extends TTypeLiteralsAsStrings>(type: T) => T;

/***** CONSTS *****/
const types = [
  z.literal('join-room'),
  z.literal('leave-room'),
] as const;

/***** EXPORTS *****/
export const getTypeLiteral: TGetTypeLiteral = (type) => types.find(x => x.value === type) as any;
export const getTypeLiteralAsString: TGetTypeLiteralAsString = (type) => type;
export const baseValidators = {
  types,
  base: z.object({
    type: z.union(types),
  })
}
