import { prisma } from "@/lib/prisma";
import Layout from "@/components/layout";
import Image from "next/image";
import { colorHash } from "@/lib/utils";
import VoteButton from "./vote-button";
import { getKindeServerSession, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "./ui/button";
import ProfileShareButton from "./profile-share-button";
import Link from "next/link";
import { LucideBoxSelect, LucideListOrdered, LucideLogOut } from "lucide-react";
import Nav from "./nav";
import BrandLogo from "./brand-logo";

export default async function UserPage({ twitterId }: { twitterId: string }) {
  const { isAuthenticated, getUser } = getKindeServerSession();

  const isUserAuthenticated = await isAuthenticated();
  const currentUser = await getUser();
  const currentUserData = currentUser && currentUser.id && await prisma.user.findUnique({
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
  let timeSinceLastVote = null;
  
  if (currentUser && currentUser.id && currentUserData && currentUserData.id) {
    const votesFromCurrentUser = user.votesReceived
      .filter((vote) => vote.voterId === currentUserData.id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const lastVote = votesFromCurrentUser.find((vote) => vote.voterId === currentUserData?.id);
    if (lastVote) {
      timeSinceLastVote = new Date().getTime() - lastVote.createdAt.getTime();
    } else {
      timeSinceLastVote = 3600001;
    }
  }

  const bgClasses = colorHash(user.pfpUrl || "coolestpfpofalltime");

  return (
    <Layout className="flex flex-col items-center justify-center h-dvh">
      <BrandLogo />
      <Nav>
        <Button asChild className="rounded-xl mt-4 font-mono">
          <Link href="/">
            <LucideBoxSelect size={14} className="mr-2" />
            Canvas
          </Link>
        </Button>
        <Button asChild className="rounded-xl mt-4 font-mono">
          <Link href="/leaderboard">
            <LucideListOrdered size={14} className="mr-2" />
            Leaderboard
          </Link>
        </Button>
        <LogoutLink>
              <Button className="rounded-xl mt-4 font-mono">
                <LucideLogOut size={14} className="sm:mr-2" />
                <span className="hidden sm:block">Log out</span>
              </Button>
            </LogoutLink>
      </Nav>

      <div className="relative flex flex-col items-center justify-center bg-gray-100 p-8 rounded-2xl max-w-lg w-full overflow-hidden cursor-default shadow">
        <div className={`h-40 w-full absolute top-0 ${bgClasses}`} />
        <div className="relative size-48 overflow-hidden object-contain rounded-[2rem] border-8 p-8 border-gray-100 bg-white/50 shadow mb-2">
          <Image className="border-8 border-transparent rounded-3xl" src={user.pfpUrl || "/fallback.jpg"} fill alt={`${user.username}'s PFP`} />
        </div>
        <h1 className="font-mono text-xl font-bold text-center mb-2">{user.username}</h1>
        <div className="flex gap-2 mb-5">
          <p className="text-sm p-2 px-4 rounded-full bg-white border-2 font-mono">Voted For: {user.votesGiven.length} Users</p>
          <p className="text-sm p-2 px-4 rounded-full bg-white border-2 font-mono">Votes By: {user.votesReceived.length} Users</p>
        </div>


        {
          isUserAuthenticated && currentUser.id !== user.twitterId
          && (timeSinceLastVote && timeSinceLastVote >= 3600000)
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


        <ProfileShareButton _username={user.username} self={currentUser && currentUser.id ? currentUser.id === user.twitterId : false} />
      </div>
    </Layout>
  )
}