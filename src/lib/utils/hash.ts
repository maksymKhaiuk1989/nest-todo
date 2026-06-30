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
  return await bcrypt.compare(value, hash);
};
