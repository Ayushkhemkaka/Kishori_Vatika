import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const nextAuth = NextAuth as unknown as (config: Record<string, unknown>) => {
  handlers: unknown;
  auth: unknown;
  signIn: unknown;
  signOut: unknown;
};

export const { handlers, auth, signIn, signOut } = nextAuth({
  ...authConfig,
  trustHost: true,
});
