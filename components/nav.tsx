export default function Nav({children}: {children: React.ReactNode}) {
  return (
    <div className="fixed flex items-center justify-center gap-2 p-2 px-3 bg-white shadow bottom-4 left-1/2 md:right-4 md:left-auto -translate-x-1/2 md:translate-x-0 scale-90 md:scale-100 rounded-2xl z-50">
      {children}
    </div>
  )
}