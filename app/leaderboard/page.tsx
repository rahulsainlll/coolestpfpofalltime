import Layout from "@/components/layout";
import ProfileCard from "@/components/ProfileCard";

export default function Leaderboard() {
  return (
    <Layout>
      <h1 className="text-3xl my-6 mb-12 text-center">Leaderboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <ProfileCard />
      </div>
    </Layout>
  );
}