import { pbkdf2, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const pbkdf2Async = promisify(pbkdf2);
const iterations = 210_000;
const keyLength = 32;
const digest = "sha256";

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = await pbkdf2Async(password, salt, iterations, keyLength, digest);

  return `pbkdf2:${iterations}:${salt}:${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationValue, salt, hash] = storedHash.split(":");

  if (algorithm !== "pbkdf2" || !iterationValue || !salt || !hash) {
    return false;
  }

  const derivedKey = await pbkdf2Async(password, salt, Number(iterationValue), keyLength, digest);
  const storedKey = Buffer.from(hash, "base64url");

  return storedKey.length === derivedKey.length && timingSafeEqual(storedKey, derivedKey);
}
