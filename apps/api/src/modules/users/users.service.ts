import {
  UsersRepository,
} from "./users.repository";

const usersRepository =
  new UsersRepository();

export class UsersService {
  async findAll() {
    const users =
      await usersRepository.findAll();

    return users.map(
      (user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt:
          user.createdAt,
      })
    );
  }

  async updateRole(
    id: string,
    role: string
  ) {
    const user =
      await usersRepository.findById(
        id
      );

    if (!user) {
      throw new Error(
        "USER_NOT_FOUND"
      );
    }

    const updatedUser =
      await usersRepository.updateRole(
        id,
        role
      );

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }
}