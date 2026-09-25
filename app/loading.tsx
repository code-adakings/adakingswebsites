export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4" role="status">
      <div className="size-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
