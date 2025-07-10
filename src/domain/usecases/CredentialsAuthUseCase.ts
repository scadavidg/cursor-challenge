import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { HashService } from "../../services/HashService";
import { loginSchema, LoginInput } from "../validators/authValidator";

export class CredentialsAuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService
  ) {}

  async execute(credentials: LoginInput) {
    const validated = loginSchema.parse(credentials);
    const user = await this.userRepository.findByEmail(validated.email);
    if (!user || !user.password) {
      return null;
    }
    const isValid = await this.hashService.compare(validated.password, user.password);
    if (!isValid) {
      return null;
    }
    // Retornar solo los datos necesarios para la sesión
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
    };
  }
} 