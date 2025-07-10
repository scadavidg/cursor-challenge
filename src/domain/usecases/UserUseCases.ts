import { SignupInput, signupSchema } from "../validators/userValidator";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { HashService } from "../../services/HashService";

export class UserUseCases {
  constructor(
    private userRepository: UserRepository,
    private hashService: HashService
  ) {}

  async registerUser(input: SignupInput) {
    // Validar datos
    const validated = signupSchema.parse(input);

    // Verificar si el usuario ya existe
    const existing = await this.userRepository.findByEmail(validated.email);
    if (existing) {
      throw new Error("El email ya está registrado");
    }

    // Hashear contraseña
    const hashedPassword = await this.hashService.hash(validated.password);

    // Crear usuario
    const user = await this.userRepository.create({
      ...validated,
      password: hashedPassword,
    });

    return user;
  }
} 