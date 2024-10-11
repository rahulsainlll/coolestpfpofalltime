import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 rounded-2xl max-w-[200px] mx-auto">
      <Image src="https://pbs.twimg.com/profile_images/1843616285508415492/qC9Ee_dQ.jpg" className="aspect-square w-full max-w-[200px] h-auto rounded-xl shadow mb-2" alt="volty" width={400} height={400} />
      <h1 className="text-xl font-bold font-mono">volty</h1>
      <p className="text-sm">#1</p>
    </div>
  )
}