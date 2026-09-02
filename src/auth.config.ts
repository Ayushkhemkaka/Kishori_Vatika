import Credentials from "next-auth/providers/credentials";
import { supabase, supabaseAuth } from "@/lib/supabase";

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

        const { data: authData, error: authError } =
          await supabaseAuth.auth.signInWithPassword({
            email,
            password,
          });
        if (authError || !authData?.user) return null;

        const { data: user } = await supabase
          .from('"User"')
          .select("id,email,name,role")
          .eq("email", email)
          .maybeSingle();
        if (!user || user.role !== OWNER_ROLE) return null;

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
