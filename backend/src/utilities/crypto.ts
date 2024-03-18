import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto"

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