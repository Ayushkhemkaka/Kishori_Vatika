const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";
async function publishToFacebookPage(pageId, accessToken, payload) {
  const message = buildPostMessage(payload);
  const url = `${GRAPH_API_BASE}/${pageId}`;
  const tokenParam = `access_token=${encodeURIComponent(accessToken)}`;
  if (payload.imageUrl) {
    const res2 = await fetch(`${url}/photos?${tokenParam}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: payload.imageUrl,
        caption: message,
        link: payload.offerUrl
      })
    });
    const data2 = await res2.json();
    if (!res2.ok || data2.error) {
      throw new Error(data2.error?.message ?? `Facebook API error: ${res2.status}`);
    }
    return { postId: data2.id };
  }
  const res = await fetch(`${url}/feed?${tokenParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      link: payload.offerUrl
    })
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `Facebook API error: ${res.status}`);
  }
  return { postId: data.id };
}
async function publishToInstagram(accountId, accessToken, payload) {
  if (!payload.imageUrl) {
    throw new Error("Instagram requires an image; heroImageUrl is missing.");
  }
  const caption = buildPostMessage(payload);
  const tokenParam = `access_token=${encodeURIComponent(accessToken)}`;
  const createRes = await fetch(
    `${GRAPH_API_BASE}/${accountId}/media?${tokenParam}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: payload.imageUrl,
        caption
      })
    }
  );
  const createData = await createRes.json();
  if (!createRes.ok || createData.error) {
    throw new Error(
      createData.error?.message ?? `Instagram container error: ${createRes.status}`
    );
  }
  const containerId = createData.id;
  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${accountId}/media_publish?${tokenParam}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId
      })
    }
  );
  const publishData = await publishRes.json();
  if (!publishRes.ok || publishData.error) {
    throw new Error(
      publishData.error?.message ?? `Instagram publish error: ${publishRes.status}`
    );
  }
  return { mediaId: publishData.id };
}
function buildPostMessage(payload) {
  const lines = [payload.title, payload.description];
  if (payload.price) lines.push(`From ${payload.price}`);
  return lines.join("\n\n");
}
export { publishToFacebookPage };
export { publishToInstagram };
