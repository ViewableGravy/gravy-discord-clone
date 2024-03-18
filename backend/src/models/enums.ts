

export const CODES = {
  NO_AUTHORIZATION_HEADER: 'NO_AUTHORIZATION_HEADER',
  AUTHORIZATION_HEADER_INVALID: 'AUTHORIZATION_HEADER_INVALID',
} as const;

export const DEBUG_LEVELS = {
  ERROR: 'ERROR',
  INFO: 'INFO',
  WARN: 'WARN',
} as const;

export const ROOMS = {
  INVALIDATE_ENDPOINT_A: 'invalidate/endpointA',
  INVALIDATE_ENDPOINT_B: 'invalidate/endpointB',
  INVALIDATE_EXAMPLE: 'invalidate/example',
} as const;

export const INVALIDATE_ROOMS = {
  ENDPOINT_A: 'endpointA',
  ENDPOINT_B: 'endpointB',
  EXAMPLE: 'example',
} as const;

export const PRISMA_CODES = {
  UNIQUE_CONSTRAINT: 'P2002',
} as const;