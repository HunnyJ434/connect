// lib/auth.ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: any): Promise<any> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: any, hashedPassword: any): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
