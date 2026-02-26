const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
require("dotenv").config();

function buildDatabaseUrlFromParts() {
  const user = process.env.db_user ?? process.env.DB_USER;
  const password = process.env.db_password ?? process.env.DB_PASSWORD;
  const host = process.env.db_host ?? process.env.DB_HOST ?? "localhost";
  const port = process.env.db_port ?? process.env.DB_PORT ?? "3306";
  const database =
    process.env.db_database ??
    process.env.db_dbatabase ??
    process.env.DB_DATABASE ??
    process.env.DB_DBATABASE;

  if (!user || !password || !database) {
    return null;
  }

  return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

async function run() {
  const databaseUrl = process.env.DATABASE_URL ?? buildDatabaseUrlFromParts();
  if (!databaseUrl) {
    throw new Error("Missing DB config. Provide db_user, db_password, db_port, db_database.");
  }

  const sqlPath = path.resolve(process.cwd(), "sql", "mysql-app-queries.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  const connection = await mysql.createConnection({
    uri: databaseUrl,
    multipleStatements: true
  });

  try {
    await connection.query(sql);
    console.log("db:init complete: mysql-app-queries.sql executed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error("db:init failed:", error.message);
  process.exit(1);
});
