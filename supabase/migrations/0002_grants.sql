-- Permisos para el rol authenticated (RLS ya limita las filas).
grant usage on schema public to authenticated;

grant select, insert, update, delete
  on public.ehs_centros, public.ehs_estado, public.ehs_respaldos
  to authenticated;

grant select on public.ehs_cobertura to authenticated;
