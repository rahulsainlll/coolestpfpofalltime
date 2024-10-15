import { LucideStars } from "lucide-react";
import CoolestPFPLogo from "./coolestpfp-logo";


export default function BrandLogo() {
  return (
    <a href="/" className="fixed flex items-center justify-center gap-2 p-2 px-3 bg-white shadow top-4 md:bottom-4 md:top-auto left-1/2 md:left-4 -translate-x-1/2 md:translate-x-0 rounded-2xl font-mono font-semibold text-sm z-50 overflow-hidden">
      <p className="flex gap-1 items-center justify-center z-50 text-neutral-700"><LucideStars size={14} />coolestpfpofalltime</p>
      <div className={`absolute inset-0 bg-gradient-to-bl from-yellow-200 via-sky-200 to-green-200 opacity-60 animate-gradient-diagonal-slow`}></div>
      {/* <CoolestPFPLogo className="h-6 w-auto z-50" /> */}

    </a>
  )
}