import CredentialsProvider from "next-auth/providers/credentials";
// @ts-ignore
import NextAuth, {Awaitable, getServerSession} from "next-auth";
import {SessionStrategy} from "next-auth/src/core/types";
import {getAdminByEmail} from "@/db/queries/admin.queries";
import {getInvestorByEmail} from "@/db/queries/investor.queries";
import {Admin, Investor} from "@/db/models";
import {comparePass} from "@/utils/password.utils";

export const nextAuthOptions = {
  callbacks: {
    async jwt({token, user, account}) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.role = user.role;
        token.id = token.sub;
      }
      return token;
    },
    async session({session, token}) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      session.user.id = token.id;
      return session;
    }
  },
  providers: [
    CredentialsProvider({
      id: "investor-login",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials, req): Awaitable<Investor> {
        const {email, password} = credentials ?? {}
        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        // Retrieve investor record by email
        const investor = await getInvestorByEmail(email);

        // @ts-ignore
        // If investor doesn't exist or password doesn't match
        if (!investor || !(await comparePass(password, investor.password))) {
          throw new Error("Invalid email or password");
        }

        // Check if account is verified
        if (!investor.confirmed) {
          // User account hasn't been verified yet
          throw new Error("Please verify your email!");
        }
        // Return User object with role set to "investor"
        return Object.assign({}, investor, {role: "investor"});
      }
    }),
    CredentialsProvider({
      id: "admin-login",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials, req): Awaitable<Admin> {
        const {email, password} = credentials ?? {}
        if (!email || !password) {
          throw new Error("Missing email or password");
        }

        // Retrieve admin record by email
        const admin = await getAdminByEmail(email);

        // @ts-ignore
        // If admin doesn't exist or password doesn't match
        if (!admin || !(await comparePass(password, admin.password))) {
          throw new Error("Invalid email or password");
        }
        // Return User object with role set to "client"
        return Object.assign({}, admin, {role: "admin"});
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login"
  }
};

export default NextAuth(nextAuthOptions);

export const getNextServerSession = (req, res) => getServerSession(req, res, nextAuthOptions);
