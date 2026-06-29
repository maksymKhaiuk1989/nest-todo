import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const generateHash = async (value: string): Promise<string> => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(value, saltRounds);

  return hash;
};

export const compareHash = async (
  value: string,
  hash: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(value, hash);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid hashed values');
  }

  return isMatch;
};
