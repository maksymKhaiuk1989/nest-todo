import ms from 'ms';

export const expiresInToDate = (
  expiresIn: `${number}Minutes` | `${number}Days`,
): Date => {
  const duration = ms(expiresIn);
  return new Date(Date.now() + duration);
};
