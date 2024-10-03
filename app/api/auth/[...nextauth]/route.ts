import NextAuth from "next-auth";
import XProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    XProvider({
      clientId: process.env.X_CLIENT_ID ?? "",
      clientSecret: process.env.X_CLIENT_SECRET ?? "",
    }),
  ],
});

export { handler as GET, handler as POST };
