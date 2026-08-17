import * as repo from '@/repositories/userRepo';
import { httpError } from '@/lib/http';

const ROLES = ['CUSTOMER', 'STAFF', 'OWNER', 'ADMIN'];

export async function listUsers() { return repo.listUsers(); }

export async function setUserRole(id, role) {
  if (!ROLES.includes(role)) throw httpError(400, 'Rôle inconnu');
  return repo.updateUser(id, { role });
}

export async function deleteUser(id) { return repo.deleteUser(id); }
