import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
const nextAuth = NextAuth;
const { handlers, auth, signIn, signOut } = nextAuth({
  ...authConfig,
  trustHost: true
});
export { auth };
export { handlers };
export { signIn };
export { signOut };
