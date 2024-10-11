import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../../../../lib/prisma"; 

export const GET = handleAuth({
  async afterCallback(req, res, session, state) {
    const { user } = session;

    console.log("Authenticated user:", user);
    try {
      // console.log("User details:", {
      //   id: user.id,
      //   username: user.username,
      //   picture: user.picture,
      // });

      const existingUser = await prisma.user.findUnique({
        where: { twitterId: user.id },
      });

      if (existingUser) {
        console.log("User already exists in the database:", existingUser);
      }
    } catch (error) {
      console.error("Error checking user in the database:", error);
    }

    return { session, state };
  },
});
