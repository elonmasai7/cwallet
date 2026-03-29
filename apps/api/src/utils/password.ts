import bcrypt from "bcryptjs";

export function hashPassword(value: string) {
  return bcrypt.hash(value, 10);
}

export function comparePassword(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

