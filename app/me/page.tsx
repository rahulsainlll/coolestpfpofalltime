import UserPage from "@/components/user-page";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function Me() {
  // kinde auth get user twitter id
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  
  if (!isUserAuthenticated) { return redirect("/"); }

  const currentUser = await getUser();
  
  redirect(`/u/${currentUser.id}`);
}