/**
 * @fileoverview Base function for creating a model. This includes information about the route,
 * status and data, meta, etc.
 */

import express from 'express';
import { STATUS } from './status';
import { CODES } from './enums';

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
}

export const createRouteCallback = (callback: ({ req, res, builder }: TCreateBaseArgs) => void) => (req: express.Request, res: express.Response) => {
  const route = req.route.path;

  callback({
    req,
    res,
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

type TUser = {};

type TCreateAuthenticatedRouteCallbackArgs = {
  user: TUser;
} & TCreateBaseArgs

export const createAuthenticatedRouteCallback = (level: string, callback: ({ req, res, user, builder }: TCreateAuthenticatedRouteCallbackArgs) => void) => {
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