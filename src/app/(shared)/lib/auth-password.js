import * as bcrypt from "bcryptjs";
async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}
async function verifyPassword(plain, stored) {
  if (!stored) return false;
  return bcrypt.compare(plain, stored);
}
export { hashPassword };
export { verifyPassword };
