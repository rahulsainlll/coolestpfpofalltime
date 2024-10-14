import FullPageCanvas from "@/components/canvas";
import { User } from "@prisma/client";
import Image from "next/image";

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
  const fetchedUsers: User[] = await fetchUsers();
  return <FullPageCanvas fetchedUsers={fetchedUsers} />;
}
