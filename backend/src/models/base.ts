/**
 * @fileoverview Base function for creating a model. This includes information about the route,
 * status and data, meta, etc.
 */

import express from 'express';
import { STATUS } from './status';
import { CODES } from './enums';
import { PrismaClient } from '@prisma/client';

/***** CONSTANTS *****/
const prisma = new PrismaClient();

/***** TYPE DEFINITIONS *****/
type TBuilder = (args: {
  status: ValueOf<typeof STATUS>;
  data: Record<TObjectKeys, unknown> | string;
  meta?: Record<TObjectKeys, unknown>;
}) => void;

type TCreateBaseArgs = {
  builder: TBuilder

  /**
   * The request object
   */
  req: express.Request;

  /**
   * The response object
   */
  res: express.Response;

  /**
   * The prisma client
   */
  prisma: typeof prisma;
}

type TCreateMiddlewareArgs = TCreateBaseArgs & {
  next: express.NextFunction;
}

type TUser = {};

type TCreateAuthenticatedRouteCallbackArgs = {
  user: TUser;
} & TCreateBaseArgs;

export const createMiddlewareCallback = (callback: (options: TCreateMiddlewareArgs) => void) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const route = req.route.path;

  callback({
    req,
    res,
    next,
    prisma,
    builder: ({ status, data, meta }) => {
      res.status(status).send({
        route, 
        status,
        data,
        meta
      })
    }
  });
}

export const createRouteCallback = (callback: (options: TCreateBaseArgs) => void) => (req: express.Request, res: express.Response) => {
  const route = req.route.path;

  callback({
    req,
    res,
    prisma,
    builder: ({ status, data, meta }) => {
      res.status(status).send({
        route, 
        status,
        data,
        meta
      })
    }
  });
}

export const createAuthenticatedRouteCallback = (level: string, callback: (options: TCreateAuthenticatedRouteCallbackArgs) => void) => {
  return (req: express.Request, res: express.Response) => {
    if (!req.headers.authorization) {
      return res.status(STATUS.UNAUTHORIZED).send({
        route: req.route.path,
        status: STATUS.UNAUTHORIZED,
        code: CODES.NO_AUTHORIZATION_HEADER,
      });
    }

    //temp
    const __socketStore__ = {
      isAuthorized: (authorization: string, level: string) => true 
    } as const;

    if (!__socketStore__.isAuthorized(req.headers.authorization, level)) {
      return res.status(STATUS.UNAUTHORIZED).send({
        route: req.route.path,
        status: STATUS.UNAUTHORIZED,
        code: CODES.AUTHORIZATION_HEADER_INVALID,
        data: "You are not authorized to access this route"
      });
    }

    // call standard route callback
    callback({
      req,
      res,
      prisma,
      user: {} as TUser,
      builder: ({ status, data, meta }) => {
        res.status(status).send({
          status,
          data,
          meta,
          route: req.route.path
        });
      }
    });
  }
}