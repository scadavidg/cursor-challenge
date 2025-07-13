import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/infrastructure/db/prisma";
import { CredentialsAuthUseCase } from "@/domain/usecases/CredentialsAuthUseCase";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { HashService } from "@/services/HashService";
import "./types";

const credentialsAuthUseCase = new CredentialsAuthUseCase(
  new UserRepository(),
  new HashService()
);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        return credentialsAuthUseCase.execute({
          email: credentials.email,
          password: credentials.password,
        });
      }
    }),
    // GoogleProvider preparado para el futuro
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hora (en segundos)
    updateAge: 30 * 60, // 30 minutos (en segundos)
  },
  cookies: process.env.NODE_ENV === "development" ? {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: false, // <--- Cambia esto a false temporalmente para probar
      sameSite: "lax",
      path: "/",
      secure: false,
    },
  },
} : undefined,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 