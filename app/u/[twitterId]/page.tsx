import UserPage from "@/components/user-page";

export default function Page({ params }: { params: { twitterId: string } }) {


  return <UserPage twitterId={params.twitterId} />
}