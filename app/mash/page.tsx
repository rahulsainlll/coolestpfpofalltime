import Image from "next/image";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const {isAuthenticated, getUser} = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) {
    redirect("/login"); // TODO: redirect to appropriate page
  }

  const user = await getUser();
  const username = user.given_name! + user.family_name!;

  return (
    <div>
      { user.picture &&
        <Image src={user.picture} alt={`${username}'s pfp`} width={100} height={100} />
      }
      <h1>hey {username}, sup?</h1>
    </div>
  );
}
