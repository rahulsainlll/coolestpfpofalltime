import Layout from "@/components/layout";
import ProfileCard from "@/components/ProfileCard";
import ExtendedLeaderboard from "@/components/ExtendedLeaderboard";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

type UserWithVotes = User & {
  totalVotes: number;
};

async function getUsers(): Promise<UserWithVotes[]> {
  const rawUsers = await prisma.user.findMany({
    include: {
      votesReceived: true,
    },
  });

  const users = rawUsers.map(user => ({
    ...user,
    totalVotes: user.votesReceived.reduce((sum, vote) => sum + vote.value, 0),
  }));

  // Sort users by total votes
  return users.sort((a, b) => b.totalVotes - a.totalVotes);
}

export default async function Leaderboard() {
  const users = await getUsers();
  const top3Users = users.slice(0, 3);

  return (
    <Layout>
      <h1 className="my-6 mb-12 text-3xl text-center font-mono font-bold">Leaderboard</h1>
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-6">
          {top3Users.map((user, rank) => (
            <ProfileCard key={user.id} user={user} rank={rank + 1} />
          ))}
        </div>
      </div>
      <ExtendedLeaderboard users={users} />
    </Layout>
  );
}