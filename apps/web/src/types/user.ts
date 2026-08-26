import type {
  UserRole,
} from "./auth";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};