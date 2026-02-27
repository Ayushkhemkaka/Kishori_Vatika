import * as bcrypt from "bcryptjs";

const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function withPepper(password) {
  const pepper = process.env.AUTH_PASSWORD_PEPPER ?? "";
  return `${password}${pepper}`;
}

function isPasswordHashed(stored) {
  return BCRYPT_HASH_REGEX.test(stored);
}

async function hashPassword(password) {
  return bcrypt.hash(withPepper(password), 12);
}

async function verifyPassword(plain, stored) {
  if (!stored) return false;
  if (isPasswordHashed(stored)) {
    return bcrypt.compare(withPepper(plain), stored);
  }
  // Legacy fallback for records saved as plaintext.
  return plain === stored;
}
export { hashPassword };
export { verifyPassword };
export { isPasswordHashed };
