import Image from "next/image";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { User as PrismaUser } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { imgResize } from "@/lib/utils";

export default async function Home() {
  const user = await currentUser()

  if (!user) {
    redirect("/login");
  }
  
  const username = user.username;

  console.log("Authenticated user:", user);
  console.log("User picture URL:", user.imageUrl);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!existingUser) {
      console.log("Creating new user in the database");

      const pictureUrl = imgResize(user.imageUrl) || "/fallbackAvatar.png"; 

      const newUser = await prisma.user.upsert({
        where: { clerkId: user.id },
        update: {
          username: username || "Default Username",
          pfpUrl: pictureUrl,
        },
        create: {
          clerkId: user.id,
          username: username || "Default Username",
          pfpUrl: pictureUrl,
        },
      });

      console.log("User created successfully");
    } else {
      console.log("User already exists:", existingUser);
    }
  } catch (error) {
    console.error("Error creating user:", error);
  }

  return (
    <div>
      <h1>Hey {username}, sup?</h1>
    </div>
  );
}