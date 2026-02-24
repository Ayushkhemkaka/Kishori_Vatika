import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { supabase } from "@/app/(shared)/lib/supabase";
import { logAdminActivity, logError } from "@/app/(shared)/lib/audit";
import { publishToFacebookPage, publishToInstagram } from "@/app/(shared)/lib/meta-graph";

export const runtime = "edge";

type Platform = "FACEBOOK" | "INSTAGRAM";

type OfferRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  heroImageUrl: string | null;
};

type SocialAccountRow = {
  id: string;
  platform: Platform;
  pageId: string | null;
  accountId: string | null;
  accessToken: string;
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const adminId = (session.user as { id?: string }).id ?? null;

  try {
    const body = (await request.json()) as {
      offerId: string;
      platforms: string[];
    };
    const { offerId, platforms } = body;
    if (!offerId || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: "offerId and platforms required" },
        { status: 400 }
      );
    }

    const { data: offer } = await supabase
      .from('"Offer"')
      .select("id,title,description,price,heroImageUrl")
      .eq("id", offerId)
      .maybeSingle();
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      process.env.NEXTAUTH_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const offerUrl = new URL(`/offers/${offer.id}`, baseUrl).toString();
    const payload = {
      title: offer.title,
      description: offer.description,
      offerUrl,
      imageUrl: offer.heroImageUrl,
      price: `INR ${Number(offer.price).toLocaleString("en-IN")}`,
    };

    const { data: accounts } = await supabase
      .from('"SocialAccount"')
      .select("id,platform,pageId,accountId,accessToken")
      .in("platform", platforms as Platform[]);

    const accountByPlatform = new Map(
      (accounts ?? []).map((a) => [a.platform, a as SocialAccountRow])
    );

    const results: { platform: string; status: string; error?: string }[] = [];

    for (const platform of platforms as Platform[]) {
      const account = accountByPlatform.get(platform);
      if (!account) {
        await supabase.from('"OfferPublication"').insert({
          offerId,
          platform,
          status: "FAILED",
          errorMessage: "No social account connected for this platform",
        });
        results.push({
          platform,
          status: "FAILED",
          error: "No account connected",
        });
        continue;
      }

      try {
        if (platform === "FACEBOOK" && account.pageId) {
          const { postId } = await publishToFacebookPage(
            account.pageId,
            account.accessToken,
            payload
          );
          await supabase.from('"OfferPublication"').insert({
            offerId,
            platform,
            status: "SUCCESS",
            externalPostId: postId,
            socialAccountId: account.id,
          });
          results.push({ platform, status: "SUCCESS" });
        } else if (platform === "INSTAGRAM" && account.accountId) {
          const { mediaId } = await publishToInstagram(
            account.accountId,
            account.accessToken,
            payload
          );
          await supabase.from('"OfferPublication"').insert({
            offerId,
            platform,
            status: "SUCCESS",
            externalPostId: mediaId,
            socialAccountId: account.id,
          });
          results.push({ platform, status: "SUCCESS" });
        } else {
          const msg =
            platform === "FACEBOOK"
              ? "Facebook page ID missing"
              : "Instagram account ID missing";
          await supabase.from('"OfferPublication"').insert({
            offerId,
            platform,
            status: "FAILED",
            errorMessage: msg,
            socialAccountId: account.id,
          });
          results.push({ platform, status: "FAILED", error: msg });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        await supabase.from('"OfferPublication"').insert({
          offerId,
          platform,
          status: "FAILED",
          errorMessage: message,
          socialAccountId: account.id,
        });
        results.push({ platform, status: "FAILED", error: message });
      }
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error("Publish offer error:", e);
    await logAdminActivity({
      adminId,
      action: "offer.publish",
      entity: "Offer",
      entityId: undefined,
      metadata: { error: e instanceof Error ? e.message : String(e) },
    });
    await logError({
      message: "Publish offer failed",
      stack: e instanceof Error ? e.stack : String(e),
      path: "/api/social/publish-offer",
      context: { adminId },
    });
    return NextResponse.json(
      { error: "Failed to publish" },
      { status: 500 }
    );
  }
}

