function LoadingScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-950">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <div className="absolute h-10 w-10 animate-spin rounded-full border-2 border-white/8 border-t-violet-500" />
        </div>
        <p className="font-mono-dm text-xs text-zinc-600">Fetching store data...</p>
      </div>
      <div className="grid w-full max-w-5xl gap-3 px-8 grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-zinc-800" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    </main>
  );
}
export default LoadingScreen;