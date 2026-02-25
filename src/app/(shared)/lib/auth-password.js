import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
const scryptAsync = promisify(scrypt);
const SALT_LEN = 16;
const KEY_LEN = 64;
async function hashPassword(password) {
  const salt = randomBytes(SALT_LEN).toString("hex");
  const buf = await scryptAsync(password, salt, KEY_LEN);
  return `${buf.toString("hex")}.${salt}`;
}
async function verifyPassword(plain, stored) {
  const [hashHex, salt] = stored.split(".");
  if (!hashHex || !salt) return false;
  const buf = await scryptAsync(plain, salt, KEY_LEN);
  const storedBuf = Buffer.from(hashHex, "hex");
  return buf.length === storedBuf.length && timingSafeEqual(buf, storedBuf);
}
export { hashPassword };
export { verifyPassword };
