function LoadingScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-12 w-12 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
        </div>
        <p className="text-sm font-medium text-slate-500">Fetching store data...</p>
      </div>

      <div className="grid w-full max-w-5xl gap-4 px-6 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="grid w-full max-w-5xl gap-4 px-6 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-200" style={{ animationDelay: `${(i + 4) * 80}ms` }} />
        ))}
      </div>
    </main>
  )
}

export default LoadingScreen