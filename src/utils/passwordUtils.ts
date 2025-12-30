import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltOrRounds = process.env.PASSWORD_ROUNDS;

  const hash = await bcrypt.hash(password, Number(saltOrRounds));

  return hash;
};

export const matchPassword = async (password: string) => {
  const saltOrRounds = process.env.PASSWORD_ROUNDS;

  const hash = await bcrypt.hash(password, Number(saltOrRounds));
  const isMatch = await bcrypt.compare(password, hash);

  return isMatch;
};
