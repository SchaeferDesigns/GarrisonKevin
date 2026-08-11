-- ===========================================================================
--  Anfragen aus dem Kontaktformular von kevin-garrison.de
--
--  Die Website spricht Supabase direkt an, mit dem öffentlichen anon key.
--  Der Key steht nach dem Build im ausgelieferten JavaScript – jeder kann ihn
--  lesen. Die Absicherung liegt deshalb vollständig hier:
--
--    * RLS erlaubt ausschließlich INSERT. Lesen, Ändern und Löschen ist über
--      die API unmöglich; Kevin sieht die Anfragen im Supabase-Dashboard.
--    * CHECK-Constraints erzwingen echte Werte. Die Prüfung im Browser ist
--      Komfort, diese hier ist die Zusage.
--    * Ein Trigger deckelt die Anfragen pro Stunde, damit ein Skript die
--      Tabelle nicht vollschreiben kann.
--
--  Mehrfaches Ausführen ist unschädlich.
-- ===========================================================================

create table if not exists public.anfragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Bearbeitungsstand, nur im Dashboard gepflegt
  status text not null default 'neu'
    check (status in ('neu', 'gelesen', 'beantwortet', 'archiviert')),

  -- Kontakt
  name text not null,
  phone text,
  email text,
  contact_preference text not null
    check (contact_preference in ('WhatsApp', 'Telefon', 'E-Mail')),

  -- Vorhaben
  services text[] not null,
  area_sqm numeric(8, 2),
  skirting_meters numeric(8, 2),
  joint_meters numeric(8, 2),
  old_floor text,
  material text,
  customer_type text check (customer_type in ('Privat', 'Gewerbe')),
  place text not null,
  timeframe text,
  notes text,

  -- Anhänge: [{ name, size, type, path }] im Bucket "anfragen"
  attachments jsonb not null default '[]'::jsonb,

  -- Fertig formatierte Fassung, direkt als E-Mail-Text verwendbar
  summary text not null,

  -- Einwilligung; ohne sie darf nichts gespeichert werden
  consent boolean not null,

  -- ------------------------------------------------------ Werte erzwingen
  constraint anfragen_name_echt check (
    char_length(name) between 2 and 70
    and name !~ '[0-9]'
    and name ~ '[[:alpha:]]{2}'
  ),
  constraint anfragen_telefon_echt check (
    phone is null or phone ~ '^(\+[0-9]{8,17}|0[0-9]{6,14})$'
  ),
  constraint anfragen_mail_echt check (
    email is null
    or (char_length(email) <= 120
        and email ~* '^[^@[:space:],;]+@[^@[:space:],;.]+(\.[^@[:space:],;.]+)*\.[a-z]{2,24}$')
  ),
  constraint anfragen_erreichbar check (
    coalesce(phone, '') <> '' or coalesce(email, '') <> ''
  ),
  constraint anfragen_ort_echt check (char_length(place) between 2 and 80),
  constraint anfragen_leistungen_vorhanden check (
    array_length(services, 1) between 1 and 10
  ),
  constraint anfragen_flaeche_plausibel check (
    area_sqm is null or area_sqm between 1 and 2000
  ),
  constraint anfragen_leisten_plausibel check (
    skirting_meters is null or skirting_meters between 1 and 2000
  ),
  constraint anfragen_fugen_plausibel check (
    joint_meters is null or joint_meters between 1 and 500
  ),
  constraint anfragen_beschreibung_laenge check (
    notes is null or char_length(notes) <= 2000
  ),
  constraint anfragen_zusammenfassung_laenge check (char_length(summary) <= 8000),
  constraint anfragen_anhaenge_anzahl check (jsonb_array_length(attachments) <= 6),
  constraint anfragen_einwilligung check (consent)
);

comment on table public.anfragen is
  'Anfragen aus dem Kontaktformular. Enthält personenbezogene Daten – Aufbewahrung begrenzen.';

create index if not exists anfragen_created_at_idx on public.anfragen (created_at desc);
create index if not exists anfragen_offen_idx on public.anfragen (created_at desc)
  where status = 'neu';

-- ---------------------------------------------------------------- Zugriff

alter table public.anfragen enable row level security;

-- Nur anlegen. Es gibt bewusst keine Policy für select, update oder delete,
-- damit über den öffentlichen Key niemand Kundendaten auslesen kann.
drop policy if exists "Anfragen anlegen" on public.anfragen;
create policy "Anfragen anlegen"
  on public.anfragen
  for insert
  to anon, authenticated
  with check (true);

-- ------------------------------------------------------------ Sendebremse

create or replace function public.anfragen_bremse()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  letzte_stunde integer;
begin
  select count(*) into letzte_stunde
  from public.anfragen
  where created_at > now() - interval '1 hour';

  if letzte_stunde >= 30 then
    raise exception 'Zu viele Anfragen in kurzer Zeit'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

comment on function public.anfragen_bremse() is
  'Begrenzt auf 30 Anfragen je Stunde. Ohne IP ist nur eine Gesamtgrenze möglich; das Formular weicht bei Ablehnung auf WhatsApp und E-Mail aus.';

drop trigger if exists anfragen_bremse_trigger on public.anfragen;
create trigger anfragen_bremse_trigger
  before insert on public.anfragen
  for each row execute function public.anfragen_bremse();

-- ------------------------------------------------------- Fotos und Dateien

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'anfragen',
  'anfragen',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Hochladen ja, herunterladen nein. Größe und Dateityp begrenzt der Bucket.
drop policy if exists "Anfrage-Dateien hochladen" on storage.objects;
create policy "Anfrage-Dateien hochladen"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'anfragen');

-- --------------------------------------------------------------- Aufräumen

create or replace function public.anfragen_aufraeumen(monate integer default 12)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  geloescht integer;
begin
  with weg as (
    delete from public.anfragen
    where created_at < now() - make_interval(months => monate)
    returning id
  )
  select count(*) into geloescht from weg;

  return geloescht;
end;
$$;

comment on function public.anfragen_aufraeumen(integer) is
  'Löscht Anfragen, die älter als die angegebene Monatszahl sind. Dateien im Bucket bitte über die Storage-Oberfläche entfernen.';

revoke all on function public.anfragen_aufraeumen(integer) from public, anon, authenticated;
