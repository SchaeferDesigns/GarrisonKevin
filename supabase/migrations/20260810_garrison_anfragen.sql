-- Anfragen aus dem Kontaktformular der Website Kevin Garrison.
-- Eigenes Präfix, weil das Projekt mit dem CMS geteilt wird.
--
-- Mehrfaches Ausführen ist unschädlich: Tabelle, Bucket und Funktion werden
-- nur angelegt beziehungsweise aktualisiert, nie gelöscht.

create table if not exists public.garrison_anfragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Bearbeitungsstand für eine spätere Übersicht
  status text not null default 'neu'
    check (status in ('neu', 'gelesen', 'beantwortet', 'archiviert')),

  -- Kontakt
  name text not null,
  phone text,
  email text,
  contact_preference text not null,

  -- Vorhaben
  services text[] not null default '{}',
  area_sqm numeric(8, 2),
  skirting_meters numeric(8, 2),
  joint_meters numeric(8, 2),
  old_floor text,
  material text,
  customer_type text,
  place text not null,
  timeframe text,
  notes text,

  -- Anhänge: [{ name, size, type, path }]
  attachments jsonb not null default '[]'::jsonb,

  -- Fertig formatierte Fassung, so wie sie auch per E-Mail rausgeht
  summary text not null,

  -- Einwilligung
  consent boolean not null default false,
  consent_at timestamptz,

  -- Technischer Kontext; die IP wird nur gehasht abgelegt
  origin text,
  user_agent text,
  ip_hash text,

  -- Weiterleitung per E-Mail
  mail_status text not null default 'offen'
    check (mail_status in ('offen', 'gesendet', 'fehler', 'deaktiviert')),
  mail_error text,
  mail_sent_at timestamptz,

  constraint garrison_anfragen_kontakt_vorhanden
    check (coalesce(phone, '') <> '' or coalesce(email, '') <> '')
);

comment on table public.garrison_anfragen is
  'Anfragen aus dem Kontaktformular kevin-garrison.de. Enthält personenbezogene Daten – Aufbewahrung begrenzen.';
comment on column public.garrison_anfragen.ip_hash is
  'sha256(IP + Tagesdatum + Salt), nur zur Missbrauchserkennung. Keine Klartext-IP.';

create index if not exists garrison_anfragen_created_at_idx
  on public.garrison_anfragen (created_at desc);
create index if not exists garrison_anfragen_status_idx
  on public.garrison_anfragen (status) where status = 'neu';
create index if not exists garrison_anfragen_ip_hash_idx
  on public.garrison_anfragen (ip_hash, created_at desc);

-- Kein Zugriff über die öffentliche API: RLS an, bewusst ohne Policy.
-- Nur der Service-Role-Key der Edge Function kommt an die Tabelle.
alter table public.garrison_anfragen enable row level security;

-- Privater Bucket für Fotos und PDF aus dem Formular.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'garrison-anfragen',
  'garrison-anfragen',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Aufräumen nach Aufbewahrungsfrist; kann später per Cron gerufen werden.
create or replace function public.garrison_anfragen_aufraeumen(monate integer default 12)
returns integer
language plpgsql
security definer
set search_path = public, storage
as $$
declare
  geloescht integer;
begin
  with weg as (
    delete from public.garrison_anfragen
    where created_at < now() - make_interval(months => monate)
    returning id
  )
  select count(*) into geloescht from weg;

  delete from storage.objects
  where bucket_id = 'garrison-anfragen'
    and created_at < now() - make_interval(months => monate);

  return geloescht;
end;
$$;

comment on function public.garrison_anfragen_aufraeumen(integer) is
  'Löscht Anfragen und zugehörige Dateien, die älter als die angegebene Monatszahl sind.';

revoke all on function public.garrison_anfragen_aufraeumen(integer) from public, anon, authenticated;
