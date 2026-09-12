-- Supabase Authでユーザーが作成されたら自動でcustomersプロフィール行を作る。
-- サインアップの経路（フォーム・管理者作成など）に関わらず一箇所で担保するためトリガーにする。
create or replace function public.handle_new_customer()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.customers (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;
--> statement-breakpoint
drop trigger if exists on_auth_user_created on auth.users;
--> statement-breakpoint
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_customer();
