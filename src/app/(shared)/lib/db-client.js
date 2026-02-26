import { prisma } from "@/app/(shared)/lib/db";

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
};

function normalizeTable(name) {
  return String(name).replaceAll('"', "");
}

function parseSelectFields(raw) {
  if (!raw || raw === "*") return null;
  return String(raw)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function applyFieldSelection(data, fields) {
  if (!fields) return data;
  if (!Array.isArray(data)) return data;
  return data.map((row) => {
    const picked = {};
    for (const field of fields) {
      picked[field] = row[field];
    }
    return picked;
  });
}

class QueryBuilder {
  constructor(modelName) {
    this.modelName = modelName;
    this.where = {};
    this.orderBy = undefined;
    this.take = undefined;
    this.skip = undefined;
    this.action = "find";
    this.payload = undefined;
    this.selectFields = null;
    this.selectOptions = {};
    this.conflict = null;
  }

  get model() {
    return prisma[this.modelName];
  }

  select(fields, options = {}) {
    this.selectFields = parseSelectFields(fields);
    this.selectOptions = options ?? {};
    return this;
  }

  eq(field, value) {
    this.where[field] = value;
    return this;
  }

  lte(field, value) {
    const prev = this.where[field] ?? {};
    this.where[field] = { ...prev, lte: value };
    return this;
  }

  gte(field, value) {
    const prev = this.where[field] ?? {};
    this.where[field] = { ...prev, gte: value };
    return this;
  }

  in(field, values) {
    this.where[field] = { in: values };
    return this;
  }

  not(field, operator, value) {
    if (operator === "is") {
      this.where[field] = { not: value };
    }
    return this;
  }

  order(field, { ascending = true } = {}) {
    this.orderBy = { [field]: ascending ? "asc" : "desc" };
    return this;
  }

  limit(n) {
    this.take = n;
    return this;
  }

  range(from, to) {
    this.skip = from;
    this.take = to - from + 1;
    return this;
  }

  insert(data) {
    this.action = "insert";
    this.payload = data;
    return this;
  }

  update(data) {
    this.action = "update";
    this.payload = data;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  upsert(data, options = {}) {
    this.action = "upsert";
    this.payload = data;
    this.conflict = options.onConflict ?? null;
    return this;
  }

  maybeSingle() {
    return this._execute(true);
  }

  async _execute(expectSingle = false) {
    try {
      const countRequested = this.selectOptions?.count === "exact";
      const headOnly = this.selectOptions?.head === true;
      let count = null;

      if (countRequested) {
        count = await this.model.count({ where: this.where });
      }
      if (headOnly) {
        return { data: null, error: null, count };
      }

      let data;
      if (this.action === "find") {
        data = await this.model.findMany({
          where: this.where,
          orderBy: this.orderBy,
          take: this.take,
          skip: this.skip,
        });
      } else if (this.action === "insert") {
        if (Array.isArray(this.payload)) {
          data = await prisma.$transaction(
            this.payload.map((row) => this.model.create({ data: row })),
          );
        } else {
          data = [await this.model.create({ data: this.payload })];
        }
      } else if (this.action === "update") {
        if (this.where.id != null) {
          const updated = await this.model.update({
            where: { id: this.where.id },
            data: this.payload,
          });
          data = [updated];
        } else {
          await this.model.updateMany({ where: this.where, data: this.payload });
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
        const conflict = this.conflict;
        let where;
        if (conflict === "email") {
          where = { email: this.payload.email };
        } else if (conflict === "platform") {
          where = { platform: this.payload.platform };
        } else if (conflict === "sessionId,key") {
          where = {
            sessionId_key: {
              sessionId: this.payload.sessionId,
              key: this.payload.key,
            },
          };
        } else {
          where = { id: this.payload.id };
        }
        const upserted = await this.model.upsert({
          where,
          create: this.payload,
          update: this.payload,
        });
        data = [upserted];
      }

      data = applyFieldSelection(data, this.selectFields);
      if (expectSingle) {
        return { data: data?.[0] ?? null, error: null, count };
      }
      return { data, error: null, count };
    } catch (error) {
      return { data: null, error, count: null };
    }
  }

  then(resolve, reject) {
    return this._execute(false).then(resolve, reject);
  }
}

const dbClient = {
  from(tableName) {
    const table = normalizeTable(tableName);
    const modelName = TABLE_TO_MODEL[table];
    if (!modelName) {
      throw new Error(`Unknown table "${table}"`);
    }
    return new QueryBuilder(modelName);
  },
};

export { dbClient };

