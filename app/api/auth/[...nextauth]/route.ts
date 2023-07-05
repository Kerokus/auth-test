import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      //Did the user provide the correct username/password?
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        //Search the database for the user's email address.
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        //If user isn't found return nothing.
        if (!user) {
          return null;
        }
        //Use bcrypt to compare the typed in hash against the hash stored on the database.
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        //If password is bad return null.
        if (!isPasswordValid) {
          return null;
        }
        //If login credentials are valid, create the user cookie.
        return {
          id: user.id + "",
          email: user.email,
          name: user.name,
          testPassKey: "Random value stored on login",
        };
      },
    }),
  ],
  //What is this "testPassKey" and why is it there? This is just to show that during the login process you can create and store
  //any arbitrary information that you want to pass to the session. By default they don't track the same things, so if you want to be able
  //to store, for example, the user ID to be able to track activity, this is how you would pass it.

  callbacks: {
    session: ({ session, token }) => {
      console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          testPassKey: token.testPassKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      console.log("JWT Callback", { token, user });
      if (user) {
        //This "const u" allows us to create arbitrary object keys that do not currently exist on the database. This isn't needed, it's just an example.
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          testPassKey: u.testPassKey,
        };
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
