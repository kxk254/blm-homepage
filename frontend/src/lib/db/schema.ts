import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  // 「No. 001」のような品番表示・Stripeの行アイテム検索にそのまま使うため文字列IDのまま
  id: varchar("id", { length: 20 }).primaryKey(),
  productType: varchar("product_type", { length: 100 }).notNull(),
  productColor: varchar("product_color", { length: 100 }).notNull(),
  productName: varchar("product_name", { length: 200 }).notNull(),
  productDescription: text("product_description").notNull(),
  productPrice: integer("product_price").notNull(),
  imageSrc: text("image_src").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
