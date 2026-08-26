import { db } from "../../prisma/db";

type CreateUserData = {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
};

export class AuthRepository {
  async findByEmail(
    email: string
  ) {
    return db.orm.public.User.first({
      email,
    });
  }

  async createUser(
    data: CreateUserData
  ) {
    return db.orm.public.User.create({
      name: data.name,
      email: data.email,
      passwordHash:
        data.passwordHash,
      role: data.role,
    });
  }
}