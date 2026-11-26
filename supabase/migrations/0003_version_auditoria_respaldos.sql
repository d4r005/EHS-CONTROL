-- 0003: control de versión (anti-pisado), auditoría y respaldos automáticos.
-- ASUMIDO (no pude leer 0001_init.sql): ehs_estado tiene columnas centro_id (uuid) y data (jsonb);
-- ehs_respaldos tiene centro_id, data y created_at. Ajusta nombres si difieren. Probar primero en una rama de Supabase.

alter table ehs_estado add column if not exists version integer not null default 1;
alter table ehs_estado add column if not exists updated_at timestamptz not null default now();
alter table ehs_estado add column if not exists updated_by uuid;

create table if not exists ehs_auditoria (
  id bigserial primary key,
  centro_id uuid not null,
  usuario uuid,
  accion text not null,
  version_anterior integer,
  version_nueva integer,
  creado timestamptz not null default now()
);
alter table ehs_auditoria enable row level security;

-- Guardado con control optimista: falla si otra persona guardó antes.
create or replace function ehs_guardar_estado(p_centro uuid, p_data jsonb, p_version integer)
returns integer language plpgsql security invoker as $$
declare nueva integer;
begin
  update ehs_estado
     set data = p_data, version = version + 1, updated_at = now(), updated_by = auth.uid()
   where centro_id = p_centro and version = p_version
   returning version into nueva;
  if nueva is null then
    raise exception 'CONFLICTO_VERSION: el centro cambió desde que lo abriste; recarga y vuelve a aplicar tus cambios'
      using errcode = 'P0001';
  end if;
  insert into ehs_auditoria(centro_id, usuario, accion, version_anterior, version_nueva)
  values (p_centro, auth.uid(), 'guardar', p_version, nueva);
  return nueva;
end $$;

-- Respaldo diario con retención de 30 días (requiere extensión pg_cron habilitada en Supabase).
create or replace function ehs_respaldo_diario() returns void language sql security definer as $$
  insert into ehs_respaldos(centro_id, data, created_at)
  select centro_id, data, now() from ehs_estado;
  delete from ehs_respaldos where created_at < now() - interval '30 days';
$$;
-- select cron.schedule('ehs-respaldo-diario', '0 9 * * *', 'select ehs_respaldo_diario()');

-- --- Integración: la función es security invoker, así que el usuario necesita
-- --- permisos y políticas sobre la tabla de auditoría.
grant select, insert on public.ehs_auditoria to authenticated;
grant usage, select on sequence public.ehs_auditoria_id_seq to authenticated;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ehs_auditoria' and policyname='auditoria_insert') then
    create policy auditoria_insert on public.ehs_auditoria
      for insert to authenticated with check (usuario = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='ehs_auditoria' and policyname='auditoria_select') then
    create policy auditoria_select on public.ehs_auditoria
      for select to authenticated using (true);
  end if;
end $$;
