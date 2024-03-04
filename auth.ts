import { logInUser } from "@/lib/services";
import { getUserByEmail, createExternalUser } from "@/db/queries/users";
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
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          const response = await logInUser({ email, password });
          const body = await response.json();

          //sample user { id: '1231', email: 'john.doe@example.com', name: 'john_doe' }
          if (body?.user) {
            return body.user;
          } else {
            // set error message from backend
            throw new Error(body.message);
          }
        } catch (err: any) {
          // Return the error message from backend to client-side
          if (err instanceof Error && err.message) {
            throw new Error(err.message);
          } else {
            console.log(err);
            throw new Error(err);
          }
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
        const existingUser = email && (await getUserByEmail(email));
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
        if (!existingUser && id && name && email) {
          await createExternalUser(id, name, email);
          return true;
        }
      } catch (err) {
        console.log(err);
        return false;
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      // adding user id to token
      if (account) {
        token.id = account.providerAccountId;
      }

      return token;
    },
    async session({ session, token }) {
      // adding user id to session.user
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
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
