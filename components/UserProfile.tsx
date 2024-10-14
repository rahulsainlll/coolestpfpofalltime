// components/UserProfile.tsx

import { useEffect } from 'react';
import Image from 'next/image';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '../lib/prisma';

interface UserProfileProps {
  onUserCreated: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onUserCreated }) => {
  useEffect(() => {
    const fetchUserData = async () => {
      const { isAuthenticated, getUser } = getKindeServerSession();
      const isUserAuthenticated = await isAuthenticated();

      if (!isUserAuthenticated) {
        redirect('/login');
        return;
      }

      const user = await getUser();
      const username = user.given_name;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { twitterId: user.id },
        });

        if (!existingUser) {
          console.log('Creating new user in the database');
          await prisma.user.create({
            data: {
              twitterId: user.id,
              username: username || 'Default Username',
              pfpUrl: user.picture,
            },
          });
          console.log('User created successfully');
          onUserCreated(); // Call the prop function to indicate user creation
        } else {
          console.warn('User already exists:', existingUser.id);
        }
      } catch (error) {
        console.error('Error creating user:', error);
      }
    };

    fetchUserData();
  }, [onUserCreated]);

  return null;
};

export default UserProfile;
