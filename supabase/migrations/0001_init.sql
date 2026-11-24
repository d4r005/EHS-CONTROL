-- EHS Control · esquema inicial
-- Proyecto: brhnoixerulcdpvtoxra
-- Aplica con: Supabase → SQL Editor, o `supabase db push` si usas la CLI.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Centros de trabajo (una fila por sucursal / planta)
-- ---------------------------------------------------------------------------
create table if not exists public.ehs_centros (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null unique,
  razon_social  text,
  responsable   text,
  puesto        text,
  anio          int  not null default extract(year from now())::int,
  activo        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Estado del sistema por centro (espejo del objeto DB de la app)
--   data = { org, normas, docs, hallazgos, incidentes, quimicos, capacitacion, comision }
-- ---------------------------------------------------------------------------
create table if not exists public.ehs_estado (
  centro_id   uuid primary key references public.ehs_centros(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  version     bigint not null default 1,
  updated_at  timestamptz not null default now(),
  updated_by  uuid
);

-- ---------------------------------------------------------------------------
-- Respaldos históricos (un renglón por respaldo descargado o automático)
-- ---------------------------------------------------------------------------
create table if not exists public.ehs_respaldos (
  id          uuid primary key default gen_random_uuid(),
  centro_id   uuid references public.ehs_centros(id) on delete cascade,
  data        jsonb not null,
  nota        text,
  bytes       int generated always as (length(data::text)) stored,
  created_at  timestamptz not null default now()
);

create index if not exists ehs_respaldos_centro_idx on public.ehs_respaldos (centro_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------------------
create or replace function public.ehs_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists ehs_centros_touch on public.ehs_centros;
create trigger ehs_centros_touch before update on public.ehs_centros
  for each row execute function public.ehs_touch_updated_at();

drop trigger if exists ehs_estado_touch on public.ehs_estado;
create trigger ehs_estado_touch before update on public.ehs_estado
  for each row execute function public.ehs_touch_updated_at();

-- ---------------------------------------------------------------------------
-- RLS: cerrado por defecto. Solo usuarios autenticados del proyecto acceden.
-- La clave anónima NO puede leer ni escribir.
-- ---------------------------------------------------------------------------
alter table public.ehs_centros   enable row level security;
alter table public.ehs_estado    enable row level security;
alter table public.ehs_respaldos enable row level security;

do $$
declare t text;
begin
  foreach t in array array['ehs_centros','ehs_estado','ehs_respaldos'] loop
    execute format('drop policy if exists %I on public.%I', t||'_authenticated_all', t);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      t||'_authenticated_all', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Vista rápida de cobertura de evidencia por centro
-- ---------------------------------------------------------------------------
create or replace view public.ehs_cobertura as
select
  c.id                                            as centro_id,
  c.nombre                                        as centro,
  coalesce(jsonb_array_length(coalesce(e.data->'docs','[]'::jsonb)), 0)       as registros,
  coalesce(jsonb_array_length(coalesce(e.data->'hallazgos','[]'::jsonb)), 0)  as hallazgos,
  coalesce(jsonb_array_length(coalesce(e.data->'incidentes','[]'::jsonb)), 0) as incidentes,
  coalesce(jsonb_array_length(coalesce(e.data->'capacitacion','[]'::jsonb)),0) as capacitaciones,
  e.updated_at
from public.ehs_centros c
left join public.ehs_estado e on e.centro_id = c.id;

grant select on public.ehs_cobertura to authenticated;
