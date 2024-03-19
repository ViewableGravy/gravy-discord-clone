/***** BASE IMPORTS *****/
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto"
import jwt from 'jsonwebtoken'
import type { ZodTypeAny } from "zod";

/***** TYPE DEFINITIONS *****/
type Signable = Record<string, any>

/***** CONSTS *****/
const iterations = 10000;
const keylen = 64;
const digest = 'sha512';
const encoding = 'base64';

export const hashPassword = (password: string) => {
  const salt = randomBytes(128).toString(encoding);
  const hash = pbkdf2Sync(password, salt, iterations, keylen, digest).toString(encoding); 

  return { salt, hash }
}

export const validatePassword = (password: string, savedHash: string, savedSalt: string) => {
  const saved = Buffer.from(savedHash, encoding);
  const newHash = pbkdf2Sync(password, savedSalt, iterations, keylen, digest);

  if (saved.length !== newHash.length) {
    return false
  }

  return timingSafeEqual(saved, pbkdf2Sync(password, savedSalt, iterations, keylen, digest));
}

export const createJWT = async (signable: Signable, expiresIn: string = '14d') => {
  if (!Bun.env.JWT_SECRET) 
    throw new Error('JWT_SECRET Not set in .env file. Please follow instructions in README.md to set this value.')

  return jwt.sign(signable, Bun.env.JWT_SECRET, { expiresIn })
}

export const verifyJWT = async <T extends ZodTypeAny | undefined = undefined>(token: string, validator?: T): Promise<T extends ZodTypeAny ? T['_output'] : jwt.JwtPayload | { error: string }>  => {
  if (!Bun.env.JWT_SECRET) 
    throw new Error('JWT_SECRET Not set in .env file. Please follow instructions in README.md to set this value.')

  const decryptedToken = jwt.verify(token, Bun.env.JWT_SECRET)

  if (typeof decryptedToken !== 'object') {
    return { error: 'invalid token' } as any;
  }

  if (!decryptedToken.exp || Date.now() > decryptedToken.exp * 1000) {
    return { error: 'token has expired' } as any;
  }

  if (validator) {
    const validated = validator.safeParse(decryptedToken);
    if (!validated.success) {
      return { error: validated.error.errors } as any;
    }

    return validated.data as any
  }

  return decryptedToken as any;
}