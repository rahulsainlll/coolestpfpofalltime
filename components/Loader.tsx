import React from 'react';
import Image from 'next/image';

interface LoaderProps {
  error: string | null;
  loadingMessage?: string;
}

export default function Loader({ error, loadingMessage = "db-kun is working hard for you :3" }: LoaderProps) {

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
      <div className="flex flex-col items-center">
        {error ? (
          <>
            <Image
              src="/loader/error.png"
              alt="Error occurred"
              width={200}
              height={200}
            />
            <div className="text-red-500 text-lg font-semibold">{error}</div>
          </>
        ) : (
          <>
            <Image
              src="/loader/loader.gif"
              alt="Loading..."
              width={200}
              height={200}
            />
            <h2 className="text-lg font-semibold text-gray-800 font-mono">{loadingMessage}</h2>
          </>
        )}
      </div>
    </div>
  );
}
