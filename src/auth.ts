import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

type NextAuthResult = {
  handlers: {
    GET?: (...args: any[]) => Promise<any>;
    POST?: (...args: any[]) => Promise<any>;
  };
  auth: (...args: any[]) => Promise<any>;
  signIn: (...args: any[]) => Promise<any>;
  signOut: (...args: any[]) => Promise<any>;
};

const nextAuth = NextAuth as unknown as (
  config: Record<string, unknown>
) => NextAuthResult;

export const { handlers, auth, signIn, signOut } = nextAuth({
  ...authConfig,
  trustHost: true,
});
