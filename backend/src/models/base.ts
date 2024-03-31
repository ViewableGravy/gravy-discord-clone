/**
 * @fileoverview Base function for creating a model. This includes information about the route,
 * status and data, meta, etc.
 */
/***** BASE IMPORTS *****/
import express from 'express';
import { PrismaClient } from '@prisma/client';

/***** CONSTS *****/
import { STATUS } from './status';
import { CODES } from './enums';

/***** CONSTANTS *****/
export const prisma = new PrismaClient();

/***** TYPE DEFINITIONS *****/
type TStandardBuilder = {
   /**
   * Code representing the response. This may be a custom code to match on the frontend 
   * in case of a specific error, or it may be a standard HTTP status code.
   */
   code?: string,

   /**
    * The status of the response. This should be a standard HTTP status code.
    */
   status: ValueOf<typeof STATUS>;
 
   /**
    * The data to be sent back to the client. This may be an object, array, or string.
    */
   data: Record<TObjectKeys, unknown> | Array<any> | string;
 
   /**
    * Any additional metadata to be sent back to the client. This may be an object with 
    * additional information about the request.
    */
   meta?: Record<TObjectKeys, unknown>;

   /**
    * Type to narrow the builder into a Standard Builder
    */
   type?: "standard"
}

type TFieldErrorBuilder = {
  /**
   * The Errors for the endpoint to return for the user.
   */
  fieldErrors: Record<TObjectKeys, string | undefined>;

  /**
   * The status of the response. This should be a standard HTTP status code.
   */
  status: ValueOf<Omit<typeof STATUS, "SUCCESS">>;

  /**
   * Any additional metadata to be sent back to the client. This may be an object with 
   * additional information about the request.
   */
  meta?: Record<TObjectKeys, unknown>;

  /**
   * Type to narrow the builder into a Field Error Builder
   */
  type?: "fieldError"
}

export type TBuilder = (args: TStandardBuilder | TFieldErrorBuilder) => void;

export type TPrisma = typeof prisma;

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

/***** COMPONENT START *****/
export const createMiddlewareCallback = (callback: (options: TCreateMiddlewareArgs) => void) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const route = req.route.path;

  callback({
    req,
    res,
    next,
    prisma,
    builder: ({ type = "standard", ...args}) => {
      if (type === "standard") {
        const { data, status, code, meta } = args as TStandardBuilder;
        res.status(status).send({
          route, 
          code,
          status,
          data,
          meta
        });
      }

      if (type === "fieldError") {
        const { fieldErrors, status, meta } = args as TFieldErrorBuilder;
        res.status(status).send({
          code: "FORM_VALIDATION_ERROR",
          route,
          status,
          meta,
          data: {
            fieldErrors
          }
        })
      }
    }
  });
}

/***** COMPONENT START *****/
export const createRouteCallback = (callback: (options: TCreateBaseArgs) => void) => (req: express.Request, res: express.Response) => {
  const route = req.route.path;

  callback({
    req,
    res,
    prisma,
    builder: ({ type = "standard", ...args}) => {
      if (type === "standard") {
        const { data, status, code, meta } = args as TStandardBuilder;
        res.status(status).send({
          route, 
          code,
          status,
          data,
          meta
        });
      }

      if (type === "fieldError") {
        const { fieldErrors, status, meta } = args as TFieldErrorBuilder;
        res.status(status).send({
          code: "FORM_VALIDATION_ERROR",
          route,
          status,
          meta,
          data: {
            fieldErrors
          }
        })
      }
    }
  });
}

/***** COMPONENT START *****/
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
      builder: ({ type = "standard", ...args}) => {
        if (type === "standard") {
          const { data, status, code, meta } = args as TStandardBuilder;
          res.status(status).send({
            route: req.route.path,
            code,
            status,
            data,
            meta
          });
        }

        if (type === "fieldError") {
          const { fieldErrors, status, meta } = args as TFieldErrorBuilder;
          res.status(status).send({
            code: "FORM_VALIDATION_ERROR",
            route: req.route.path,
            status,
            meta,
            data: {
              fieldErrors
            }
          })
        }
      }
    });
  }
}
