import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const SALT_LEN = 16;
const KEY_LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN).toString("hex");
  const buf = (await scryptAsync(password, salt, KEY_LEN)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function verifyPassword(
  plain: string,
  stored: string
): Promise<boolean> {
  const [hashHex, salt] = stored.split(".");
  if (!hashHex || !salt) return false;
  const buf = (await scryptAsync(plain, salt, KEY_LEN)) as Buffer;
  const storedBuf = Buffer.from(hashHex, "hex");
  return buf.length === storedBuf.length && timingSafeEqual(buf, storedBuf);
}
