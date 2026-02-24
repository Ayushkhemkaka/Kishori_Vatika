import { supabase } from "@/app/(shared)/lib/supabase";
import { SocialConnectForm } from "./components/SocialConnectForm";

export const runtime = "edge";
export const dynamic = "force-dynamic";

type SocialAccountRow = {
  id: string;
  platform: string;
  pageId: string | null;
  accountId: string | null;
  createdAt: string;
};

export default async function AdminSocialPage() {
  const { data: accountsData } = await supabase
    .from('"SocialAccount"')
    .select("id,platform,pageId,accountId,createdAt")
    .order("platform", { ascending: true });
  const accounts = (accountsData ?? []) as SocialAccountRow[];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-amber-50">Social accounts</h1>
      <p className="max-w-xl text-sm text-slate-400">
        Connect your Facebook Page and Instagram Business account to auto-post
        offers when you publish. Use long-lived access tokens from the Meta
        Developer portal.
      </p>

      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <h2 className="text-sm font-medium text-amber-100">Connected accounts</h2>
        {accounts.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">
            No accounts connected yet. Add one below.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {accounts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-950/60 px-4 py-2 text-sm"
              >
                <span className="font-medium text-slate-200">{a.platform}</span>
                <span className="text-slate-400">
                  {a.platform === "FACEBOOK" ? a.pageId : a.accountId}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SocialConnectForm />
    </div>
  );
}

