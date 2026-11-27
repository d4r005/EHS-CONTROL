-- 0005: marca por empresa (logo y color) para los formatos impresos y la interfaz.
alter table public.ehs_centros add column if not exists logo  text;
alter table public.ehs_centros add column if not exists color text;

comment on column public.ehs_centros.logo  is 'Logo de la empresa como data URI (PNG optimizado, ~320 px de ancho)';
comment on column public.ehs_centros.color is 'Color de la empresa en hexadecimal, usado en la barra de titulo y tablas de los formatos';
