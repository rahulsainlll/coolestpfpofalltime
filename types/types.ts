import { User, Vote } from "@prisma/client";

export type UserWithRelations = User & {
  votesReceived: Vote[],
  votesGiven: Vote[],
};