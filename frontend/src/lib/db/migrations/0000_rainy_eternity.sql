CREATE TABLE "products" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"product_type" varchar(100) NOT NULL,
	"product_color" varchar(100) NOT NULL,
	"product_name" varchar(200) NOT NULL,
	"product_description" text NOT NULL,
	"product_price" integer NOT NULL,
	"image_src" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
