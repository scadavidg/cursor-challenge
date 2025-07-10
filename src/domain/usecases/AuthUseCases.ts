import { loginSchema, LoginInput } from "../validators/authValidator";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { HashService } from "../../services/HashService";
import { AuthService } from "../../services/AuthService";

export class AuthUseCases {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService,
    private authService: AuthService
  ) {}

  async login(input: LoginInput) {
    const validated = loginSchema.parse(input);
    const user = await this.userRepository.findByEmail(validated.email);
    if (!user || !user.password) {
      throw new Error("Credenciales inválidas");
    }
    const isValid = await this.hashService.compare(validated.password, user.password);
    if (!isValid) {
      throw new Error("Credenciales inválidas");
    }
    // Generar token de sesión (JWT)
    const token = this.authService.generateToken({ id: user.id, email: user.email });
    return { user, token };
  }
} 