import { db } from "../../prisma/db";

export class UsersRepository {
  async findAll() {
    return db.orm.public.User
      .orderBy(
        (user) =>
          user.createdAt.desc()
      )
      .all();
  }

  async findById(
    id: string
  ) {
    return db.orm.public.User.first({
      id,
    });
  }

  async updateRole(
    id: string,
    role: string
  ) {
    return db.orm.public.User.update({
      where: {
        id,
      },

      data: {
        role,
      },
    });
  }
}