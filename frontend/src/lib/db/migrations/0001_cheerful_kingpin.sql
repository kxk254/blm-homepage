CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"full_name" varchar(200),
	"phone" varchar(50),
	"postal_code" varchar(10),
	"address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "stock_quantity" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "customers_select_own" ON "customers" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "customers"."id");--> statement-breakpoint
CREATE POLICY "customers_insert_own" ON "customers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "customers"."id");--> statement-breakpoint
CREATE POLICY "customers_update_own" ON "customers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "customers"."id") WITH CHECK ((select auth.uid()) = "customers"."id");