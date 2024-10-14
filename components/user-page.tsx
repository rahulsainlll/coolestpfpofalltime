import { prisma } from "@/lib/prisma";
import Layout from "@/components/layout";
import Image from "next/image";
import { colorHash } from "@/lib/utils";
import VoteButton from "./vote-button";
import { getKindeServerSession, LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "./ui/button";
import ProfileShareButton from "./profile-share-button";

export default async function UserPage({ twitterId }: { twitterId: string }) {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const isUserAuthenticated = await isAuthenticated();
  const currentUser = await getUser();
  const currentUserData = await prisma.user.findUnique({
    where: { twitterId: currentUser.id },
  });

  const user = await prisma.user.findUnique({
    where: { twitterId: twitterId },
    include: {
      votesReceived: true,
      votesGiven: true,
    },
  }).then((user) => {
    return user;
  });

  if (!user) {
    return <Layout>User not found</Layout>;
  }

  // find how much time it has been since last vote by user
  const lastVote = (currentUser && currentUser.id) ? user.votesReceived.find((vote) => vote.voterId === currentUserData?.id) : null;
  const timeSinceLastVote = lastVote ? new Date().getTime() - lastVote.createdAt.getTime() : 3600000;

  return (
  <Layout className="flex flex-col items-center justify-center h-dvh">
      <div className="fixed flex items-center justify-center gap-2 p-2 px-3 bg-white shadow bottom-4 right-4 rounded-2xl">
        <Button asChild className="rounded-xl mt-4 font-mono">
          <a href="/">Canvas</a>
        </Button>
        <Button asChild className="rounded-xl mt-4 font-mono">
          <a href="/leaderboard">Leaderboard</a>
        </Button>
      </div>

      <div className="relative flex flex-col items-center justify-center bg-gray-100 p-8 rounded-2xl max-w-lg w-full overflow-hidden cursor-default shadow">
        <div className={`h-40 w-full absolute top-0 ${colorHash(user.pfpUrl || "coolestpfpofalltime")}`} />
        <div className="relative size-48 overflow-hidden object-contain rounded-3xl border-8 border-gray-100 bg-gray-100">
          <Image className="border-8 border-gray-50 rounded-3xl" src={user.pfpUrl || "/fallback.jpg"} fill alt={`${user.username}'s PFP`} />
        </div>
        <h1 className="font-mono text-xl font-bold text-center mb-2">{user.username}</h1>
        <div className="flex gap-2 mb-8">
          <p className="text-sm p-2 px-4 rounded-full bg-white border-2 font-mono">Voted For: {user.votesGiven.length} Users</p>
          <p className="text-sm p-2 px-4 rounded-full bg-white border-2 font-mono">Votes By: {user.votesReceived.length} Users</p>
        </div>


        {
          isUserAuthenticated && currentUser.id !== user.twitterId && (timeSinceLastVote && timeSinceLastVote >= 3600000)
          && (
            <VoteButton username={user.username || "User"} id={user.id} />
          )
        }
        {isUserAuthenticated && currentUser.id !== user.twitterId && (timeSinceLastVote && timeSinceLastVote < 3600000)
          && (
            <Button disabled className="rounded-xl mt-4 font-mono">You can vote again in {Math.ceil((3600000 - timeSinceLastVote) / 60000)} minutes</Button>
          )
        }
        {!isUserAuthenticated && (<LoginLink><Button className="rounded-xl mt-4 font-mono">Sign In To Vote</Button></LoginLink>)}


        <ProfileShareButton _username={user.username} self={currentUser.id === user.twitterId} />
      </div>
    </Layout>
  )
}