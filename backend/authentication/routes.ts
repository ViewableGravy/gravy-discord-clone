export const ROUTES = {
  SOCKETS: {
    INVALIDATE: {
      JOIN_ROOM: '/invalidate/join',
      LEAVE_ROOM: '/invalidate/leave',
    },
  },
  HTTP: {
    AMI: {
      ALIVE: '/api/ami/alive',
      AUTHORIZED: '/api/ami/authorized',
    },
    AUTH: {
      CREATE_ACCOUNT: '/api/auth/signup',
      LOGIN: '/api/auth/login',
      REFRESH: '/api/auth/refresh',
      LOGOUT: '/api/auth/logout',
      USERNAME_AVAILABILITY: '/api/auth/username-availability',
      VERIFY_ACCOUNT: '/api/auth/verify',
    },
  }
} as const;
