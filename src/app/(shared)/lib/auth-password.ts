import * as bcrypt from "bcryptjs";

const BCRYPT_HASH_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function withPepper(password: string): string {
  const pepper = process.env.AUTH_PASSWORD_PEPPER ?? "";
  return `${password}${pepper}`;
}

export function isPasswordHashed(stored: string): boolean {
  return BCRYPT_HASH_REGEX.test(stored);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(withPepper(password), 12);
}

export async function verifyPassword(
  plain: string,
  stored: string | null | undefined
): Promise<boolean> {
  if (!stored) return false;
  if (isPasswordHashed(stored)) {
    return bcrypt.compare(withPepper(plain), stored);
  }
  // Legacy fallback for records saved as plaintext.
  return plain === stored;
}
