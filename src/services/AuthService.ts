import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "secret");

export class AuthService {
  async generateToken(payload: Record<string, any>): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
  }

  async verifyToken(token: string): Promise<any> {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  }
} 