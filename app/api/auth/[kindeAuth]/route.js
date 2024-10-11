import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = handleAuth({
  async afterCallback(req, res, session, state) {
    const { user } = session;

    console.log("something")
    console.log(user)

    // Check if the user already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { twitterId: user.id },
    });

    if (!existingUser) {
      // Insert the new user into the database
      await prisma.user.create({
        data: {
          twitterId: user.id,
          username: user.username,
          pfpUrl: user.picture,
        },
      });
    }

    return { session, state };
  },
});