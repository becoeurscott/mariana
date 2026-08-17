import * as repo from '@/repositories/userRepo';
import { hashPassword, comparePassword, signToken } from '@/lib/auth';
import { parseOrThrow, registerInput, loginInput } from '@/lib/validation';
import { httpError } from '@/lib/http';

export async function register(input) {
  const data = parseOrThrow(registerInput, input);
  const exists = await repo.findUserByEmail(data.email);
  if (exists) throw httpError(409, 'E-mail déjà utilisé');
  const user = await repo.createUser({
    email: data.email,
    passwordHash: await hashPassword(data.password),
    firstName: data.firstName,
    lastName:  data.lastName,
    phone:     data.phone,
  });
  const token = signToken({ sub: user.id, role: user.role });
  return { token, user: publicUser(user) };
}

export async function login(input) {
  const data = parseOrThrow(loginInput, input);
  const user = await repo.findUserByEmail(data.email);
  if (!user?.passwordHash) throw httpError(401, 'Identifiants invalides');
  const ok = await comparePassword(data.password, user.passwordHash);
  if (!ok) throw httpError(401, 'Identifiants invalides');
  const token = signToken({ sub: user.id, role: user.role });
  return { token, user: publicUser(user) };
}

export async function guest() {
  const user = await repo.createGuest();
  const token = signToken({ sub: user.id, role: 'CUSTOMER', guest: true });
  return { token, user: { id: user.id, isGuest: true } };
}

function publicUser(u) {
  return { id: u.id, email: u.email, role: u.role, firstName: u.firstName, lastName: u.lastName };
}
