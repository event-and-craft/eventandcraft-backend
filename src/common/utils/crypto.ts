import * as crypto from 'crypto';

/**
 * Hashes a plaintext password using PBKDF2.
 * @param password Plaintext password to hash
 * @returns A string in the format salt:hashedPassword
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored hashed password.
 * @param password Plaintext password to verify
 * @param storedValue Salted hash in salt:hashedPassword format
 * @returns boolean indicating if password matches
 */
export function verifyPassword(password: string, storedValue: string): boolean {
  if (!storedValue) return false;
  const parts = storedValue.split(':');
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  const verifyHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex');
  return hash === verifyHash;
}
