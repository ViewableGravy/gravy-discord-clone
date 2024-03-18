import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto"

const iterations = 10000;
const keylen = 64;
const digest = 'sha512';

export const hashPassword = (password: string) => {
  const salt = randomBytes(128).toString('base64');
  const hash = pbkdf2Sync(password, salt, iterations, keylen, digest); 

  return { salt, hash }
}

export const validatePassword = (password: string, savedHash: Buffer, savedSalt: string) => {
  return timingSafeEqual(savedHash, pbkdf2Sync(password, savedSalt, iterations, keylen, digest));
}