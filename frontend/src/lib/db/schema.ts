import { sql } from "drizzle-orm";
import {
  integer,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUid, authUsers } from "drizzle-orm/supabase";

export const products = pgTable("products", {
  // 「No. 001」のような品番表示・Stripeの行アイテム検索にそのまま使うため文字列IDのまま
  id: varchar("id", { length: 20 }).primaryKey(),
  productType: varchar("product_type", { length: 100 }).notNull(),
  productColor: varchar("product_color", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 200 }).notNull(),
  productDescription: text("product_description").notNull(),
  productPrice: integer("product_price").notNull(),
  imageSrc: text("image_src").notNull(),
  // 手作り・一点物在庫の点数管理。0になったら購入不可（欠品）として扱う
  stockQuantity: integer("stock_quantity").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// Supabase Authのauth.usersに1:1で紐づく顧客プロフィール。
// authUidはRLSポリシー内でのみ評価されるため、通常のアプリクエリでは使わない。
export const customers = pgTable(
  "customers",
  {
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 200 }),
    phone: varchar("phone", { length: 50 }),
    postalCode: varchar("postal_code", { length: 10 }),
    address: text("address"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    pgPolicy("customers_select_own", {
      for: "select",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("customers_insert_own", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`${authUid} = ${table.id}`,
    }),
    pgPolicy("customers_update_own", {
      for: "update",
      to: authenticatedRole,
      using: sql`${authUid} = ${table.id}`,
      withCheck: sql`${authUid} = ${table.id}`,
    }),
  ]
).enableRLS();

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
