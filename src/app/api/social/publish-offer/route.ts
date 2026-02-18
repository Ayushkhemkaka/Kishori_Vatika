import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { publishToFacebookPage, publishToInstagram } from "@/lib/meta-graph";
import { SocialPlatform } from "@prisma/client";
import { PublicationStatus } from "@prisma/client";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });
    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const baseUrl =
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
      price: `₹${Number(offer.price).toLocaleString("en-IN")}`,
    };

    const accounts = await prisma.socialAccount.findMany({
      where: { platform: { in: platforms as SocialPlatform[] } },
    });
    const accountByPlatform = new Map(accounts.map((a) => [a.platform, a]));

    const results: { platform: string; status: string; error?: string }[] = [];

    for (const platform of platforms as SocialPlatform[]) {
      const account = accountByPlatform.get(platform);
      if (!account) {
        await prisma.offerPublication.create({
          data: {
            offerId,
            platform,
            status: PublicationStatus.FAILED,
            errorMessage: "No social account connected for this platform",
          },
        });
        results.push({
          platform,
          status: "FAILED",
          error: "No account connected",
        });
        continue;
      }

      try {
        if (platform === SocialPlatform.FACEBOOK && account.pageId) {
          const { postId } = await publishToFacebookPage(
            account.pageId,
            account.accessToken,
            payload
          );
          await prisma.offerPublication.create({
            data: {
              offerId,
              platform,
              status: PublicationStatus.SUCCESS,
              externalPostId: postId,
              socialAccountId: account.id,
            },
          });
          results.push({ platform, status: "SUCCESS" });
        } else if (platform === SocialPlatform.INSTAGRAM && account.accountId) {
          const { mediaId } = await publishToInstagram(
            account.accountId,
            account.accessToken,
            payload
          );
          await prisma.offerPublication.create({
            data: {
              offerId,
              platform,
              status: PublicationStatus.SUCCESS,
              externalPostId: mediaId,
              socialAccountId: account.id,
            },
          });
          results.push({ platform, status: "SUCCESS" });
        } else {
          const msg =
            platform === SocialPlatform.FACEBOOK
              ? "Facebook page ID missing"
              : "Instagram account ID missing";
          await prisma.offerPublication.create({
            data: {
              offerId,
              platform,
              status: PublicationStatus.FAILED,
              errorMessage: msg,
              socialAccountId: account.id,
            },
          });
          results.push({ platform, status: "FAILED", error: msg });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        await prisma.offerPublication.create({
          data: {
            offerId,
            platform,
            status: PublicationStatus.FAILED,
            errorMessage: message,
            socialAccountId: account.id,
          },
        });
        results.push({ platform, status: "FAILED", error: message });
      }
    }

    return NextResponse.json({ results });
  } catch (e) {
    console.error("Publish offer error:", e);
    return NextResponse.json(
      { error: "Failed to publish" },
      { status: 500 }
    );
  }
}
