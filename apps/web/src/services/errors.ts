export function handleApiError(
  error: unknown
) {
  if (
    error instanceof Error &&
    error.message === "FORBIDDEN"
  ) {
    window.location.href =
      "/forbidden";

    return;
  }

  throw error;
}   