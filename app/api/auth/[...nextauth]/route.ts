import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

const handler = NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.X_CLIENT_ID ?? "",
      clientSecret: process.env.X_CLIENT_SECRET ?? "",
      version: '1.0a', // Specify OAuth 1.0a
      authorization: {
        url: 'https://api.twitter.com/oauth/authenticate',
        params: { force_login: true }, // Optional: Forces login every time
      },
    }),
  ],
  pages: {
    error: '/auth/error', // Custom error page (optional)
  },
});

export { handler as GET, handler as POST };
