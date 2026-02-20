export function jsonResponse(
  data: unknown,
  init: ResponseInit = {}
): Response {
  return Response.json(data, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

export function errorResponse(
  message: string,
  status: number,
  details?: unknown
): Response {
  const payload: { error: string; details?: unknown } = { error: message };
  if (details !== undefined) {
    payload.details = details;
  }

  return jsonResponse(
    payload,
    { status }
  );
}
