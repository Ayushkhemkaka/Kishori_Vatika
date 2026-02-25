function jsonResponse(data, init = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers
    }
  });
}
function errorResponse(message, status, details) {
  const payload = { error: message };
  if (details !== void 0) {
    payload.details = details;
  }
  return jsonResponse(
    payload,
    { status }
  );
}
export { errorResponse };
export { jsonResponse };
