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
import { Mailer } from '../utilities/mail';
import { z } from 'zod';

/***** CONSTANTS *****/
export const prisma = new PrismaClient();
const mailer = new Mailer();

/***** TYPE DEFINITIONS *****/
const StandardBuilderValidator = z.object({
  code: z.string().optional(),
  status: z.number().optional(),
  data: z.any(),
  meta: z.any().optional(),
  type: z.literal("standard").optional()
});

const FieldErrorBuilderValidator = z.object({
  fieldErrors: z.record(z.string().optional()),
  status: z.number(),
  meta: z.any().optional(),
  type: z.literal("fieldError").optional()
});

export type TStandardBuilder = z.infer<typeof StandardBuilderValidator>;
export type TFieldErrorBuilder = z.infer<typeof FieldErrorBuilderValidator>;
export type TBuilder = (args: TStandardBuilder | TFieldErrorBuilder) => void;
export type TPrisma = typeof prisma;
export type TCreateBaseArgs = {
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
   * DI context
   */
  ctx: {
    /**
     * The mailer utility
     */
    mailer: typeof mailer;

    /**
     * The prisma client
     */
    prisma: typeof prisma;
  }
}

type TCreateMiddlewareArgs = TCreateBaseArgs & {
  next: express.NextFunction;
}

type TUser = {};

type TCreateAuthenticatedRouteCallbackArgs = {
  user: TUser;
} & TCreateBaseArgs;

const generateBuilder = (res: express.Response, req: express.Request) => (args: TStandardBuilder | TFieldErrorBuilder) => {
  const _args = { ...args, type: args.type ?? "standard" };

  if (_args.type === "fieldError") {
    const { fieldErrors, status, meta } = _args as TFieldErrorBuilder;
    return res.status(status).send({
      code: "FORM_VALIDATION_ERROR",
      status,
      meta,
      route: req.route.path,
      data: {
        fieldErrors
      }
    })
  }

  if (_args.type === "standard") {
    const { data, status, code, meta } = _args as TStandardBuilder;
    return res.status(status ?? 200).send({
      code,
      status,
      data,
      meta,
      route: req.route.path
    });
  }
}

/***** COMPONENT START *****/
export const createMiddlewareCallback = (callback: (options: TCreateMiddlewareArgs) => void) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const builder = generateBuilder(res, req);

  try {
    callback({
      req,
      res,
      next,
      ctx: {
        mailer,
        prisma,
      },
      builder
    })
  } catch (e) {
    const standardBuilder = StandardBuilderValidator.safeParse(e);
    const fieldErrorBuilder = FieldErrorBuilderValidator.safeParse(e);

    switch (true) {
      case standardBuilder.success:
        return builder(standardBuilder.data);
      case fieldErrorBuilder.success:
        return builder(fieldErrorBuilder.data);
      default:
        return builder({
          status: 500,
          data: "An unknown error occurred"
        });
    }
  }
}

/***** COMPONENT START *****/
export const createRouteCallback = (callback: (options: TCreateBaseArgs) => void) => (req: express.Request, res: express.Response) => {
  const builder = generateBuilder(res, req);

  try {
    return callback({
      req,
      res,
      ctx: {
        mailer,
        prisma,
      },
      builder
    });
  } catch (e) {
    const standardBuilder = StandardBuilderValidator.safeParse(e);
    const fieldErrorBuilder = FieldErrorBuilderValidator.safeParse(e);

    switch (true) {
      case standardBuilder.success:
        return builder(standardBuilder.data);
      case fieldErrorBuilder.success:
        return builder(fieldErrorBuilder.data);
      default:
        return builder({
          status: 500,
          data: "An unknown error occurred"
        });
    }
  }
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
      ctx: {
        mailer,
        prisma,
      },
      user: {} as TUser,
      builder:generateBuilder(res, req)
    });
  }
}
