import React from 'react'
import Image from 'next/image'

interface LoaderProps {
  error: string | null
  loadingAttachment: string | null
}

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
      <div className="flex flex-col items-center">
        <Image
          src={"/loader/loader.gif"}
          alt={"Loading..."}
          width={200}
          height={200}
        />
        <h2 className="text-lg font-semibold text-gray-800 font-mono">db-kun is working hard for you :3</h2>
      </div>
    </div>
  )
}