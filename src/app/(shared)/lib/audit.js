import { supabase } from "@/app/(shared)/lib/supabase";
async function logAdminActivity(input) {
  try {
    await supabase.from('"AdminActivity"').insert({
      adminId: input.adminId ?? null,
      action: input.action,
      entity: input.entity ?? null,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? null
    });
  } catch (err) {
    console.warn("Failed to log admin activity", err);
  }
}
async function logError(input) {
  try {
    await supabase.from('"ErrorLog"').insert({
      level: input.level ?? "error",
      message: input.message,
      stack: input.stack ?? null,
      path: input.path ?? null,
      context: input.context ?? null
    });
  } catch (err) {
    console.warn("Failed to log error", err);
  }
}
export { logAdminActivity };
export { logError };
