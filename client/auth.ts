import { logInUser } from "@/app/lib/api";
const { getUserByEmail, createExternalUser } = require("@/../db/queries/users");
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Pass this to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const { user } = await logInUser({ email, password });
        //sample user { id: '1231', email: 'john.doe@example.com', name: 'john_doe' }

        if (user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { id, name, email } = user;
   
      try {
        const existingUser = await getUserByEmail(email);
        /*
      sample existingUser {
            id: '1231',
            username: 'john_doe',
            email: 'john.doe@example.com',
            hashed_password: '$2b$10$va/PwaIzWlsvUFmjrrMMl.c3WS0PbBhfe8i8mVqpB9u46dU3jWDEO',
            deleted: false
          }
      */
        // insert into database
        if (!existingUser) {
          await createExternalUser(id, name, email);
          return true;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },
  },
} satisfies NextAuthOptions;

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}
