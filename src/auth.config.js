import { randomUUID } from "crypto";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/app/(shared)/lib/db";
import { hashPassword, isPasswordHashed, verifyPassword } from "@/app/(shared)/lib/auth-password";

const OWNER_ROLE = "OWNER";
const DEVICE_COOKIE_NAME = "admin-device";

function createDeviceId() {
  if (typeof randomUUID === "function") {
    return randomUUID();
  }
  return `dev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        deviceId: { label: "Device ID", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        const deviceId = String(credentials.deviceId ?? createDeviceId());
        const user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, role: true, password: true }
        });
        if (!user || user.role !== OWNER_ROLE) return null;
        if (!user.password) return null;
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) return null;
        if (!isPasswordHashed(user.password)) {
          try {
            const upgradedHash = await hashPassword(password);
            await prisma.user.update({
              where: { id: user.id },
              data: { password: upgradedHash }
            });
          } catch (err) {
            console.warn("Failed to upgrade legacy admin password hash", err);
          }
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? void 0,
          role: user.role,
          deviceId
        };
      }
    })
  ],
  callbacks: {
    jwt({ token, user, credentials }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.deviceId) token.deviceId = user.deviceId;
      }
      if (!token.deviceId) {
        token.deviceId = credentials?.deviceId ? String(credentials.deviceId) : createDeviceId();
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.deviceId = token.deviceId;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  }
};
export { authConfig };
