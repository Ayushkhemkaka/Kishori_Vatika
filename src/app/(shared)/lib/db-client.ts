import { prisma } from "@/app/(shared)/lib/db";

/**
 * Supabase-shaped query builder backed by Prisma/MySQL.
 *
 * The app is written against the `supabase.from(...).select(...)` fluent API.
 * The database is Hostinger MySQL, so this translates that surface onto Prisma
 * and returns the same `{ data, error, count }` envelope callers expect.
 */

const TABLE_TO_MODEL = {
  User: "user",
  Offer: "offer",
  Enquiry: "enquiry",
  Visit: "visit",
  OfferFeature: "offerFeature",
  SocialAccount: "socialAccount",
  OfferPublication: "offerPublication",
  AnalyticsEvent: "analyticsEvent",
  Visitor: "visitor",
  UserPreference: "userPreference",
  ContactMessage: "contactMessage",
  NewsletterSignup: "newsletterSignup",
  AdminActivity: "adminActivity",
  ErrorLog: "errorLog",
} as const;

type TableName = keyof typeof TABLE_TO_MODEL;

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyRecord = Record<string, any>;

/**
 * Rows are untyped records: the Supabase client this replaces was used without
 * generated table types, so call sites index columns freely.
 *
 * The list form is deliberately `AnyRecord[]` rather than `any` so that
 * `.map((row) => ...)` callbacks are contextually typed — under `noImplicitAny`
 * a bare `any` receiver would leave every such callback parameter an error.
 */
export interface QueryResult<T = AnyRecord[] | null> {
  data: T;
  error: unknown;
  count: number | null;
}

interface SelectOptions {
  count?: "exact";
  head?: boolean;
}

/** Callers write .from with PostgREST-style quoting; strip the quotes. */
function normalizeTable(name: string): string {
  return String(name).split('"').join("");
}

function parseSelectFields(raw?: string): string[] | null {
  if (!raw || raw === "*") return null;
  return String(raw)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Mimic PostgREST column projection; Prisma already returned full rows. */
function applyFieldSelection<T>(data: T, fields: string[] | null): T {
  if (!fields || !Array.isArray(data)) return data;
  return (data as AnyRecord[]).map((row) => {
    const picked: AnyRecord = {};
    for (const field of fields) picked[field] = row[field];
    return picked;
  }) as T;
}

class QueryBuilder implements PromiseLike<QueryResult> {
  private where: AnyRecord = {};
  private orderBy: AnyRecord | undefined;
  private take: number | undefined;
  private skip: number | undefined;
  private action: "find" | "insert" | "update" | "delete" | "upsert" = "find";
  private payload: AnyRecord | AnyRecord[] | undefined;
  private selectFields: string[] | null = null;
  private selectOptions: SelectOptions = {};
  private conflict: string | null = null;

  constructor(private modelName: string) {}

  private get model(): AnyRecord {
    return (prisma as unknown as AnyRecord)[this.modelName];
  }

  select(fields?: string, options: SelectOptions = {}): this {
    this.selectFields = parseSelectFields(fields);
    this.selectOptions = options ?? {};
    return this;
  }

  eq(field: string, value: unknown): this {
    this.where[field] = value;
    return this;
  }

  lte(field: string, value: unknown): this {
    this.where[field] = { ...(this.where[field] ?? {}), lte: value };
    return this;
  }

  gte(field: string, value: unknown): this {
    this.where[field] = { ...(this.where[field] ?? {}), gte: value };
    return this;
  }

  in(field: string, values: unknown[]): this {
    this.where[field] = { in: values };
    return this;
  }

  not(field: string, operator: string, value: unknown): this {
    if (operator === "is") this.where[field] = { not: value };
    return this;
  }

  order(
    field: string,
    { ascending = true }: { ascending?: boolean } = {}
  ): this {
    this.orderBy = { [field]: ascending ? "asc" : "desc" };
    return this;
  }

  limit(n: number): this {
    this.take = n;
    return this;
  }

  range(from: number, to: number): this {
    this.skip = from;
    this.take = to - from + 1;
    return this;
  }

  insert(data: AnyRecord | AnyRecord[]): this {
    this.action = "insert";
    this.payload = data;
    return this;
  }

  update(data: AnyRecord): this {
    this.action = "update";
    this.payload = data;
    return this;
  }

  delete(): this {
    this.action = "delete";
    return this;
  }

  upsert(data: AnyRecord, options: { onConflict?: string } = {}): this {
    this.action = "upsert";
    this.payload = data;
    this.conflict = options.onConflict ?? null;
    return this;
  }

  /** Single-row reads stay `any` so callers can spread and index the row. */
  maybeSingle<T = any>(): Promise<QueryResult<T>> {
    return this.execute(true) as Promise<QueryResult<T>>;
  }

  /** Resolve the unique key Prisma needs for an upsert. */
  private upsertWhere(payload: AnyRecord): AnyRecord {
    switch (this.conflict) {
      case "email":
        return { email: payload.email };
      case "platform":
        return { platform: payload.platform };
      case "sessionId,key":
        return {
          sessionId_key: { sessionId: payload.sessionId, key: payload.key },
        };
      default:
        return { id: payload.id };
    }
  }

  // Returns `any` internally; the public entry points pin the precise shape
  // (an array for the awaited builder, a single row for `maybeSingle`).
  private async execute(expectSingle = false): Promise<QueryResult<any>> {
    try {
      const countRequested = this.selectOptions?.count === "exact";
      const headOnly = this.selectOptions?.head === true;
      let count: number | null = null;

      if (countRequested) count = await this.model.count({ where: this.where });
      if (headOnly) return { data: null, error: null, count };

      let data: AnyRecord | AnyRecord[] | undefined;

      if (this.action === "find") {
        data = await this.model.findMany({
          where: this.where,
          orderBy: this.orderBy,
          take: this.take,
          skip: this.skip,
        });
      } else if (this.action === "insert") {
        const payload = this.payload as AnyRecord | AnyRecord[];
        data = Array.isArray(payload)
          ? await prisma.$transaction(
              payload.map((row) => this.model.create({ data: row }))
            )
          : [await this.model.create({ data: payload })];
      } else if (this.action === "update") {
        if (this.where.id != null) {
          data = [
            await this.model.update({
              where: { id: this.where.id },
              data: this.payload,
            }),
          ];
        } else {
          await this.model.updateMany({
            where: this.where,
            data: this.payload,
          });
          data = await this.model.findMany({
            where: this.where,
            orderBy: this.orderBy,
            take: this.take,
            skip: this.skip,
          });
        }
      } else if (this.action === "delete") {
        if (this.where.id != null) {
          await this.model.delete({ where: { id: this.where.id } });
        } else {
          await this.model.deleteMany({ where: this.where });
        }
        data = [];
      } else if (this.action === "upsert") {
        const payload = this.payload as AnyRecord;
        data = [
          await this.model.upsert({
            where: this.upsertWhere(payload),
            create: payload,
            update: payload,
          }),
        ];
      }

      data = applyFieldSelection(data, this.selectFields);
      if (expectSingle) {
        return { data: (data as AnyRecord[])?.[0] ?? null, error: null, count };
      }
      return { data: data ?? null, error: null, count };
    } catch (error) {
      return { data: null, error, count: null };
    }
  }

  // Awaiting the builder runs the query, matching the Supabase client.
  then<R1 = QueryResult, R2 = never>(
    resolve?: ((value: QueryResult) => R1 | PromiseLike<R1>) | null,
    reject?: ((reason: unknown) => R2 | PromiseLike<R2>) | null
  ): Promise<R1 | R2> {
    return this.execute(false).then(resolve, reject);
  }
}

export const dbClient = {
  from(tableName: string): QueryBuilder {
    const table = normalizeTable(tableName) as TableName;
    const modelName = TABLE_TO_MODEL[table];
    if (!modelName) throw new Error(`Unknown table "${table}"`);
    return new QueryBuilder(modelName);
  },
};
