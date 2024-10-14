"use client"
import React, { useState, useEffect, useRef } from 'react';

type MockUser = {
  id: number;
  username: string;
  color: string;
  x: number;
  y: number;
};

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

const ProfilePictureCanvas = ({ users }: { users: MockUser[] }) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [positionedUsers, setPositionedUsers] = useState<MockUser[]>([]);
  const [imageSize, setImageSize] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const calculateOptimalImageSize = (userCount: number, canvasWidth: number, canvasHeight: number): number => {
      const aspectRatio = canvasWidth / canvasHeight;
      const columnsF = Math.sqrt(userCount * aspectRatio);
      const rowsF = userCount / columnsF;
      
      const columns = Math.ceil(columnsF);
      const rows = Math.ceil(rowsF);
      
      const sizeByWidth = Math.floor(canvasWidth / columns);
      const sizeByHeight = Math.floor(canvasHeight / rows);
      
      return Math.floor(Math.min(sizeByWidth, sizeByHeight, 100));
    };

    const newImageSize = calculateOptimalImageSize(users.length, canvasSize.width, canvasSize.height);
    setImageSize(newImageSize);

    const columns = Math.floor(canvasSize.width / newImageSize);

    const positioned = users.map((user, index) => ({
      ...user,
      x: (index % columns) * newImageSize,
      y: Math.floor(index / columns) * newImageSize,
    }));

    setPositionedUsers(positioned);
  }, [users, canvasSize]);

  return (
    <div ref={canvasRef} className="fixed inset-0 overflow-hidden bg-gray-100">
      {positionedUsers.map((user) => (
        <div
          key={user.id}
          className="absolute overflow-hidden flex items-center justify-center text-xs"
          style={{
            left: `${user.x}px`,
            top: `${user.y}px`,
            width: `${imageSize}px`,
            height: `${imageSize}px`,
            backgroundColor: user.color,
            fontSize: `${Math.max(8, imageSize / 8)}px`,
          }}
        >
          {user.username}
        </div>
      ))}
    </div>
  );
};

const TestProfilePictureCanvas: React.FC = () => {
  const generateSampleUsers = (count: number): MockUser[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      username: `u${i}`,
      color: getRandomColor(),
      x: 0,
      y: 0,
    }));
  };

  const sampleUsers = generateSampleUsers(10000); // Generate 10000 sample users

  return <ProfilePictureCanvas users={sampleUsers} />;
};

export default TestProfilePictureCanvas;