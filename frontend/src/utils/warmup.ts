export async function warmupBackend(): Promise<void> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    await fetch(apiUrl + '/health');
  } catch {
    // silent fail
  }
}