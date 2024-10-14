import FullPageCanvas from "@/components/canvas";
import { UserWithRelations } from "@/types/types";

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export default async function Home() {
  const fetchedUsers: UserWithRelations[] = await fetchUsers();
  return <FullPageCanvas fetchedUsers={fetchedUsers} />;
}
