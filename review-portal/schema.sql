-- Snapshot & Share Portal schema (review before applying to a dedicated Supabase project)
-- No patient clinical records belong in this database.
create extension if not exists pgcrypto;
create table if not exists public.portal_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
create table if not exists public.portal_documents (
 id uuid primary key default gen_random_uuid(),
 title text not null, description text not null default '',
 category text not null default 'general',
 audience text not null default 'doctors',
 evidence_level text check (evidence_level is null or evidence_level in ('L1','L2','L3','L4','L5')),
 created_at timestamptz not null default now(),
 created_by uuid not null references auth.users(id)
);
create table if not exists public.portal_document_versions (
 id uuid primary key default gen_random_uuid(),
 document_id uuid not null references public.portal_documents(id) on delete restrict,
 version_no integer not null check (version_no > 0),
 kind text not null check (kind in ('file','external_url')),
 storage_path text,
 external_url text,
 sha256 text,
 bytes bigint,
 created_at timestamptz not null default now(),
 created_by uuid not null references auth.users(id),
 unique(document_id,version_no),
 constraint version_content_check check (
 (kind='file' and storage_path is not null and external_url is null)
 or (kind='external_url' and external_url is not null and storage_path is null)
 )
);
create index if not exists portal_binary_hash_lookup
 on public.portal_document_versions (sha256) where sha256 is not null;
-- Multiple version records may reuse the same SHA-256 / storage object.
create table if not exists public.portal_packages (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 audience text not null check (audience in ('doctors','patients','partners','investors')),
 description text not null default '',
 created_by uuid not null references auth.users(id),
 updated_at timestamptz not null default now()
);
create table if not exists public.portal_package_items (
 id uuid primary key default gen_random_uuid(),
 package_id uuid not null references public.portal_packages(id) on delete cascade,
 version_id uuid not null references public.portal_document_versions(id) on delete restrict,
 position integer not null check (position >= 0),
 note text not null default '',
 unique(package_id,version_id)
);
create table if not exists public.portal_snapshots (
 id uuid primary key default gen_random_uuid(),
 package_id uuid not null references public.portal_packages(id),
 title text not null, audience text not null, description text not null default '',
 captured_at timestamptz not null default now(),
 captured_by uuid not null references auth.users(id)
);
create table if not exists public.portal_snapshot_items (
 id uuid primary key default gen_random_uuid(),
 snapshot_id uuid not null references public.portal_snapshots(id) on delete restrict,
 version_id uuid not null references public.portal_document_versions(id) on delete restrict,
 position integer not null, note text not null default '',
 title_at_capture text not null, description_at_capture text not null default '',
 unique(snapshot_id,version_id)
);
create table if not exists public.portal_invites (
 id uuid primary key default gen_random_uuid(),
 snapshot_id uuid not null references public.portal_snapshots(id) on delete restrict,
 email text not null,
 recipient_name text not null,
 organization text not null default '',
 expires_at timestamptz not null default (now()+ interval '30 days'),
 revoked_at timestamptz,
 allow_download boolean not null default false,
 created_at timestamptz not null default now(),
 created_by uuid not null references auth.users(id),
 unique(snapshot_id,email)
);
create table if not exists public.portal_review_events (
 id uuid primary key default gen_random_uuid(),
 invite_id uuid not null references public.portal_invites(id) on delete restrict,
 version_id uuid references public.portal_document_versions(id),
 kind text not null check (kind in ('opened','acknowledged','question')),
 message text,
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);
create or replace function public.portal_is_admin()
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.portal_admins a where a.user_id=(select auth.uid()));
$$;
create or replace function public.portal_has_snapshot_access(p_snapshot uuid)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(
  select 1 from public.portal_invites i join auth.users u on u.id=(select auth.uid())
  where i.snapshot_id=p_snapshot and lower(i.email)=lower(u.email)
  and u.email_confirmed_at is not null
  and i.revoked_at is null and i.expires_at>now()
 );
$$;
revoke all on function public.portal_is_admin() from public;
revoke all on function public.portal_has_snapshot_access(uuid) from public;
grant execute on function public.portal_is_admin() to authenticated;
revoke execute on function public.portal_is_admin() from anon;
grant execute on function public.portal_has_snapshot_access(uuid) to authenticated;
revoke execute on function public.portal_has_snapshot_access(uuid) from anon;
alter table public.portal_admins enable row level security;
alter table public.portal_documents enable row level security;
alter table public.portal_document_versions enable row level security;
alter table public.portal_packages enable row level security;
alter table public.portal_package_items enable row level security;
alter table public.portal_snapshots enable row level security;
alter table public.portal_snapshot_items enable row level security;
alter table public.portal_invites enable row level security;
alter table public.portal_review_events enable row level security;
create policy admins_read on public.portal_admins for select to authenticated using (public.portal_is_admin());
create policy admin_docs on public.portal_documents for all to authenticated using (public.portal_is_admin()) with check (public.portal_is_admin());
create policy admin_versions on public.portal_document_versions for all to authenticated using (public.portal_is_admin()) with check (public.portal_is_admin());
create policy admin_packages on public.portal_packages for all to authenticated using (public.portal_is_admin()) with check (public.portal_is_admin());
create policy admin_items on public.portal_package_items for all to authenticated using (public.portal_is_admin()) with check (public.portal_is_admin());
create policy admin_snapshots_read on public.portal_snapshots for select to authenticated using (public.portal_is_admin());
create policy admin_snapshot_items_read on public.portal_snapshot_items for select to authenticated using (public.portal_is_admin());
create policy admin_invites on public.portal_invites for all to authenticated using (public.portal_is_admin()) with check (public.portal_is_admin());
create policy admin_events on public.portal_review_events for all to authenticated using (public.portal_is_admin()) with check (public.portal_is_admin());
create policy recipient_snapshots on public.portal_snapshots for select to authenticated using (public.portal_has_snapshot_access(id));
create policy recipient_items on public.portal_snapshot_items for select to authenticated using (public.portal_has_snapshot_access(snapshot_id));
create policy recipient_versions on public.portal_document_versions for select to authenticated using (
 exists(select 1 from public.portal_snapshot_items si where si.version_id=id and public.portal_has_snapshot_access(si.snapshot_id))
);
create policy recipient_invites on public.portal_invites for select to authenticated using (
 public.portal_has_snapshot_access(snapshot_id)
 and lower(email)=lower((select auth.jwt()->>'email'))
);
create policy recipient_events on public.portal_review_events for insert to authenticated with check (
 created_by=(select auth.uid())
 and exists(select 1 from public.portal_invites i where i.id=invite_id
   and public.portal_has_snapshot_access(i.snapshot_id)
   and lower(i.email)=lower((select auth.jwt()->>'email')))
 and (version_id is null or exists (
 select 1 from public.portal_snapshot_items si join public.portal_invites i on i.snapshot_id=si.snapshot_id
 where i.id=invite_id and si.version_id=version_id))
);
create policy recipient_own_events on public.portal_review_events for select to authenticated using (created_by=(select auth.uid()));
-- An immutable snapshot is created with one atomic operation, not a multi-request client write.
create or replace function public.portal_capture_snapshot(p_package_id uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare new_id uuid;
begin
 if not public.portal_is_admin() then raise exception 'not authorized'; end if;
 if not exists(select 1 from public.portal_package_items where package_id=p_package_id) then
  raise exception 'package is empty';
 end if;
 insert into public.portal_snapshots(package_id,title,audience,description,captured_by)
 select id,name,audience,description,auth.uid() from public.portal_packages where id=p_package_id
 returning id into new_id;
 if new_id is null then raise exception 'package not found'; end if;
 insert into public.portal_snapshot_items(snapshot_id,version_id,position,note,title_at_capture,description_at_capture)
 select new_id,pi.version_id,pi.position,pi.note,d.title,d.description
 from public.portal_package_items pi
 join public.portal_document_versions v on v.id=pi.version_id
 join public.portal_documents d on d.id=v.document_id
 where pi.package_id=p_package_id;
 return new_id;
end; $$;
revoke all on function public.portal_capture_snapshot(uuid) from public;
grant execute on function public.portal_capture_snapshot(uuid) to authenticated;
revoke execute on function public.portal_capture_snapshot(uuid) from anon;
-- Forbid in-place mutation of versions and snapshots, even by admins.
create or replace function public.portal_block_mutation()
returns trigger language plpgsql set search_path='' as $$
begin raise exception 'immutable record: create a new version or snapshot'; end; $$;
revoke execute on function public.portal_block_mutation() from public, anon, authenticated;
create trigger portal_immutable_versions before update or delete on public.portal_document_versions
 for each row execute function public.portal_block_mutation();
create trigger portal_immutable_snapshots before update or delete on public.portal_snapshots
 for each row execute function public.portal_block_mutation();
create trigger portal_immutable_snapshot_items before update or delete on public.portal_snapshot_items
 for each row execute function public.portal_block_mutation();
-- Private bucket. Create once; never use public=true.
insert into storage.buckets(id,name,public) values ('portal-private','portal-private',false)
 on conflict (id) do update set public=false;
create policy portal_admin_storage_write on storage.objects for insert to authenticated
 with check (bucket_id='portal-private' and public.portal_is_admin());
create policy portal_admin_storage_read on storage.objects for select to authenticated
 using (bucket_id='portal-private' and public.portal_is_admin());
create policy portal_recipient_storage_read on storage.objects for select to authenticated
 using (
 bucket_id='portal-private'
 and exists(select 1 from public.portal_document_versions v
 join public.portal_snapshot_items si on si.version_id=v.id
 where v.storage_path=name and public.portal_has_snapshot_access(si.snapshot_id))
);
-- IMPORTANT: Admin bootstrap is a deliberate manual step AFTER first admin signs in:
-- insert into public.portal_admins(user_id) values ('<auth.users.id>');
-- A private recipient cannot read any material until verified AND individually invited.
