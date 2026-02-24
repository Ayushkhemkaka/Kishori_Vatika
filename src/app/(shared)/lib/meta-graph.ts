/**
 * Meta Graph API helpers for posting offers to Facebook Page and Instagram.
 * Requires long-lived Page access token (FB) and Instagram Business account linked to the Page.
 * @see https://developers.facebook.com/docs/graph-api/
 */

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

export type PublishOfferPayload = {
  title: string;
  description: string;
  offerUrl: string;
  imageUrl: string | null;
  price?: string;
};

/**
 * Post to a Facebook Page: uses /feed with message + link, or /photos if imageUrl is provided.
 */
export async function publishToFacebookPage(
  pageId: string,
  accessToken: string,
  payload: PublishOfferPayload
): Promise<{ postId: string }> {
  const message = buildPostMessage(payload);
  const url = `${GRAPH_API_BASE}/${pageId}`;

  const tokenParam = `access_token=${encodeURIComponent(accessToken)}`;

  if (payload.imageUrl) {
    const res = await fetch(`${url}/photos?${tokenParam}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: payload.imageUrl,
        caption: message,
        link: payload.offerUrl,
      }),
    });
    const data = (await res.json()) as { id?: string; error?: { message: string } };
    if (!res.ok || data.error) {
      throw new Error(data.error?.message ?? `Facebook API error: ${res.status}`);
    }
    return { postId: data.id! };
  }

  const res = await fetch(`${url}/feed?${tokenParam}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      link: payload.offerUrl,
    }),
  });
  const data = (await res.json()) as { id?: string; error?: { message: string } };
  if (!res.ok || data.error) {
    throw new Error(data.error?.message ?? `Facebook API error: ${res.status}`);
  }
  return { postId: data.id! };
}

/**
 * Publish to Instagram Business account: create container then publish.
 * accountId is the Instagram Business account ID (ig-user-id).
 * Image must be publicly accessible.
 */
export async function publishToInstagram(
  accountId: string,
  accessToken: string,
  payload: PublishOfferPayload
): Promise<{ mediaId: string }> {
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
        caption,
      }),
    }
  );
  const createData = (await createRes.json()) as {
    id?: string;
    error?: { message: string };
  };
  if (!createRes.ok || createData.error) {
    throw new Error(
      createData.error?.message ?? `Instagram container error: ${createRes.status}`
    );
  }
  const containerId = createData.id!;

  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${accountId}/media_publish?${tokenParam}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: containerId,
      }),
    }
  );
  const publishData = (await publishRes.json()) as {
    id?: string;
    error?: { message: string };
  };
  if (!publishRes.ok || publishData.error) {
    throw new Error(
      publishData.error?.message ?? `Instagram publish error: ${publishRes.status}`
    );
  }
  return { mediaId: publishData.id! };
}

function buildPostMessage(payload: PublishOfferPayload): string {
  const lines = [payload.title, payload.description];
  if (payload.price) lines.push(`From ${payload.price}`);
  return lines.join("\n\n");
}
