-- 0004: roles por centro. REVISAR ANTES DE APLICAR: reemplaza el acceso "cualquier autenticado".
-- Primero inserta tu usuario como admin en ehs_miembros o te quedarás sin acceso.

create table if not exists ehs_miembros (
  centro_id uuid not null,
  usuario uuid not null references auth.users(id) on delete cascade,
  rol text not null check (rol in ('lector','editor','admin')),
  primary key (centro_id, usuario)
);
alter table ehs_miembros enable row level security;
create policy miembros_ver on ehs_miembros for select to authenticated using (usuario = auth.uid());

-- Ejemplo (descomenta y ajusta nombres de políticas existentes con: select policyname from pg_policies where tablename='ehs_estado';)
-- drop policy if exists <politica_actual> on ehs_estado;
-- create policy estado_leer on ehs_estado for select to authenticated
--   using (exists (select 1 from ehs_miembros m where m.centro_id = ehs_estado.centro_id and m.usuario = auth.uid()));
-- create policy estado_editar on ehs_estado for update to authenticated
--   using (exists (select 1 from ehs_miembros m where m.centro_id = ehs_estado.centro_id and m.usuario = auth.uid() and m.rol in ('editor','admin')));
