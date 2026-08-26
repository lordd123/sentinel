import bcrypt from "bcryptjs";

import { AuthRepository } from "./auth.repository";

import type {
  LoginInput,
  RegisterInput,
} from "./auth.schema";

const authRepository =
  new AuthRepository();

export class AuthService {
  // ========================================
  // CADASTRO
  // ========================================

  async register(
    data: RegisterInput
  ) {
    const existingUser =
      await authRepository.findByEmail(
        data.email
      );

    if (existingUser) {
      throw new Error(
        "EMAIL_ALREADY_EXISTS"
      );
    }

    const passwordHash =
      await bcrypt.hash(
        data.password,
        12
      );

    const user =
      await authRepository.createUser({
        name: data.name,
        email: data.email,
        passwordHash,
        role: "VIEWER",
      });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  // ========================================
  // LOGIN
  // ========================================

  async login(
    data: LoginInput
  ) {
    const user =
      await authRepository.findByEmail(
        data.email
      );

    // Usuário não encontrado
    if (!user) {
      throw new Error(
        "INVALID_CREDENTIALS"
      );
    }

    // Compara a senha enviada
    // com o hash salvo no banco
    const passwordMatches =
      await bcrypt.compare(
        data.password,
        user.passwordHash
      );

    // Senha incorreta
    if (!passwordMatches) {
      throw new Error(
        "INVALID_CREDENTIALS"
      );
    }

    // Nunca retornamos passwordHash
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}