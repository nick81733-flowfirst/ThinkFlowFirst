-- Admin management migration. Applied to TFF Information Portal Supabase project.
-- Run after schema.sql on a fresh installation.
create table if not exists public.portal_admin_audit (
 id bigint generated always as identity primary key,
 actor_id uuid not null references auth.users(id),
 target_id uuid not null references auth.users(id),
 action text not null check (action in ('grant','revoke')),
 occurred_at timestamptz not null default now()
);
alter table public.portal_admin_audit enable row level security;
create policy portal_admin_audit_read on public.portal_admin_audit for select to authenticated using(public.portal_is_admin());

create or replace function public.portal_list_admins()
returns table(user_id uuid,email text,created_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
 if not public.portal_is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
 return query
 select a.user_id,u.email::text,a.created_at
 from public.portal_admins a join auth.users u on u.id=a.user_id order by a.created_at asc;
end; $$;

create or replace function public.portal_grant_admin(p_email text)
returns uuid language plpgsql security definer set search_path=''
as $$
declare target uuid;
begin
 if not public.portal_is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
 if p_email is null or length(btrim(p_email))<3 then raise exception 'Email required'; end if;
 perform pg_catalog.pg_advisory_xact_lock(97831425);
 select u.id into target from auth.users u
 where lower(u.email)=lower(btrim(p_email)) and u.email_confirmed_at is not null;
 if target is null then
  raise exception 'That email is not registered and verified. Ask the person to sign in and verify their email first.';
 end if;
 if exists(select 1 from public.portal_admins where user_id=target) then
  raise exception 'This account is already an administrator.';
 end if;
 insert into public.portal_admins(user_id) values(target);
 insert into public.portal_admin_audit(actor_id,target_id,action) values(auth.uid(),target,'grant');
 return target;
end; $$;

create or replace function public.portal_revoke_admin(p_user_id uuid)
returns boolean language plpgsql security definer set search_path=''
as $$
begin
 if not public.portal_is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(97831425);
 if not exists(select 1 from public.portal_admins where user_id=p_user_id) then
  raise exception 'Administrator not found';
 end if;
 if (select count(*) from public.portal_admins)<=1 then
  raise exception 'Cannot remove the last administrator';
 end if;
 delete from public.portal_admins where user_id=p_user_id;
 insert into public.portal_admin_audit(actor_id,target_id,action) values(auth.uid(),p_user_id,'revoke');
 return true;
end; $$;

revoke all on function public.portal_list_admins() from public,anon,authenticated;
revoke all on function public.portal_grant_admin(text) from public,anon,authenticated;
revoke all on function public.portal_revoke_admin(uuid) from public,anon,authenticated;
grant execute on function public.portal_list_admins() to authenticated;
grant execute on function public.portal_grant_admin(text) to authenticated;
grant execute on function public.portal_revoke_admin(uuid) to authenticated;
