import Layout from "@/components/layout";
import ProfileCard from "@/components/ProfileCard";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

type UserWithVotes = User & {
  totalVotes: number;
};

export default async function Leaderboard() {
  let users: UserWithVotes[] = [];

  try {
    const rawUsers = await prisma.user.findMany({
      include: {
        votesReceived: true,
      },
    });

    users = rawUsers.map(user => ({
      ...user,
      totalVotes: user.votesReceived.reduce((sum, vote) => sum + vote.value, 0),
    }));

    // Sort users by total votes
    users.sort((a, b) => b.totalVotes - a.totalVotes);

    // Take top 10
    users = users.slice(0, 10);

  } catch (error) {
    console.error('Error fetching users:', error);
  }

  // console.log('Fetched users:', JSON.stringify(users, null, 2));

  return (
    <Layout>
      <h1 className="my-6 mb-12 text-3xl text-center">Leaderboard</h1>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {users.map((user, rank) => (
          <ProfileCard key={user.id} user={user} rank={rank + 1} />
        ))}
      </div>
    </Layout>
  );
}