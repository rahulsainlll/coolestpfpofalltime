export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <main className="p-4 md:p-8 max-w-screen-lg mx-auto">
      { children }
    </main>
  );
}