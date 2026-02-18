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
  return jsonResponse(
    { error: message, ...(details && { details }) },
    { status }
  );
}
