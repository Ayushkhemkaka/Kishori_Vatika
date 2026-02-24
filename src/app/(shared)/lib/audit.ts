import { supabase } from "@/(shared)/lib/supabase";

type AdminActivityInput = {
  adminId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function logAdminActivity(input: AdminActivityInput) {
  try {
    await supabase.from('"AdminActivity"').insert({
      adminId: input.adminId ?? null,
      action: input.action,
      entity: input.entity ?? null,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? null,
    });
  } catch (err) {
    console.warn("Failed to log admin activity", err);
  }
}

type ErrorLogInput = {
  level?: "error" | "warn" | "info";
  message: string;
  stack?: string | null;
  path?: string | null;
  context?: Record<string, unknown> | null;
};

export async function logError(input: ErrorLogInput) {
  try {
    await supabase.from('"ErrorLog"').insert({
      level: input.level ?? "error",
      message: input.message,
      stack: input.stack ?? null,
      path: input.path ?? null,
      context: input.context ?? null,
    });
  } catch (err) {
    console.warn("Failed to log error", err);
  }
}
