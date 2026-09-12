import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

async function main() {
  const [, , email, password] = process.argv;
  if (!email || !password) {
    console.error("使い方: npm run admin:create -- <email> <password>");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY is not set. Add them to .env.local."
    );
  }

  const admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
  });
  if (error) throw error;

  console.log(
    `管理者アカウントを作成しました: ${data.user.email} (id: ${data.user.id})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
