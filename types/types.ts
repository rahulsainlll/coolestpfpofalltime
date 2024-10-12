import { User, Vote, ProfilePicture } from "@prisma/client";

export type UserWithRelations = User & {
  votes: Vote[];
  profilePicture: ProfilePicture[];
};