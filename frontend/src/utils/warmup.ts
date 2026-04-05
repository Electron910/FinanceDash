export async function warmupBackend(): Promise<void> {
  try {
    await fetch(
      (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '') + '/health'
    );
  } catch {
    // silent fail
  }
}