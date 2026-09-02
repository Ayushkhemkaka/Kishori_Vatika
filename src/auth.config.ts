import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/app/(shared)/lib/db";
import {
  hashPassword,
  isPasswordHashed,
  verifyPassword,
} from "@/app/(shared)/lib/auth-password";

const OWNER_ROLE = "OWNER";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
          },
        });
        if (!user || user.role !== OWNER_ROLE) return null;
        if (!user.password) return null;

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;

        // Transparently upgrade any row still holding a plaintext password.
        if (!isPasswordHashed(user.password)) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { password: await hashPassword(password) },
            });
          } catch (err) {
            console.error("[auth] password hash upgrade failed", err);
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }: { token: { id?: string; role?: string }; user?: { id?: string; role?: string } }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }: { session: { user?: { id?: string; role?: string } }; token: { id?: string; role?: string } }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};
