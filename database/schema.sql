-- ============================================================
-- schema.sql | Base de datos del videojuego (Supabase / PostgreSQL)
-- Ejecutar en: Supabase > SQL Editor > New query  (1.º de 3 scripts)
-- Es re-ejecutable: usa IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================


create extension if not exists pgcrypto with schema extensions;

create table if not exists public.usuarios (
  id              uuid        primary key default gen_random_uuid(),
  nombre          text        not null check (char_length(btrim(nombre)) between 1 and 60),
  email           text        not null check (position('@' in email) > 1),
  password_hash   text        not null,
  fecha_registro  timestamptz not null default now()
);

-- Email único sin distinguir mayúsculas/minúsculas (409 en el backend si se repite).
create unique index if not exists usuarios_email_uk on public.usuarios (lower(email));

-- ------------------------------------------------------------
-- NAVES  (cadencia_disparo = milisegundos entre disparos)
-- ------------------------------------------------------------
create table if not exists public.naves (
  id                integer generated always as identity primary key,
  nombre            text    not null unique,
  velocidad         integer not null check (velocidad > 0),
  vida              integer not null check (vida > 0),
  cadencia_disparo  integer not null check (cadencia_disparo > 0)
);

-- ------------------------------------------------------------
-- ENEMIGOS
-- ------------------------------------------------------------
create table if not exists public.enemigos (
  id      integer generated always as identity primary key,
  nombre  text    not null unique,
  tipo    text    not null,
  vida    integer not null check (vida > 0),
  danio   integer not null check (danio >= 0)
);

-- ------------------------------------------------------------
-- PARTIDAS
-- ------------------------------------------------------------
create table if not exists public.partidas (
  id            bigint      generated always as identity primary key,
  usuario_id    uuid        not null references public.usuarios (id) on delete cascade,
  nave_id       integer     not null references public.naves (id),
  puntaje       integer     not null check (puntaje >= 0),
  duracion_seg  integer     not null check (duracion_seg >= 0),
  disparos      integer     not null check (disparos >= 0),
  aciertos      integer     not null check (aciertos >= 0),
  fecha         timestamptz not null default now(),
  constraint partidas_aciertos_le_disparos check (aciertos <= disparos)
);

-- ------------------------------------------------------------
-- EVENTOS_PARTIDA
-- ------------------------------------------------------------
create table if not exists public.eventos_partida (
  id           bigint        generated always as identity primary key,
  partida_id   bigint        not null references public.partidas (id) on delete cascade,
  tipo_evento  text          not null
               check (tipo_evento in ('enemigo_destruido', 'impacto_meteorito', 'impacto_bala', 'muerte')),
  enemigo_id   integer       references public.enemigos (id) on delete set null,
  momento_seg  numeric(8,2)  not null check (momento_seg >= 0)
);

-- ------------------------------------------------------------
-- ÍNDICES (claves foráneas y consultas frecuentes)
-- ------------------------------------------------------------
create index if not exists idx_partidas_usuario_id  on public.partidas (usuario_id);
create index if not exists idx_partidas_fecha       on public.partidas (fecha);
create index if not exists idx_partidas_nave_id     on public.partidas (nave_id);
create index if not exists idx_partidas_ranking     on public.partidas (puntaje desc, fecha);
create index if not exists idx_eventos_partida_id   on public.eventos_partida (partida_id);
create index if not exists idx_eventos_tipo         on public.eventos_partida (tipo_evento);
create index if not exists idx_eventos_enemigo_id   on public.eventos_partida (enemigo_id);

-- ------------------------------------------------------------
-- SEGURIDAD
-- Solo el backend (clave service_role) toca la base de datos.
-- RLS activado y sin políticas = la API pública (anon/authenticated)
-- no puede leer ni escribir nada. service_role ignora RLS.
-- ------------------------------------------------------------
alter table public.usuarios        enable row level security;
alter table public.naves           enable row level security;
alter table public.enemigos        enable row level security;
alter table public.partidas        enable row level security;
alter table public.eventos_partida enable row level security;

revoke all on public.usuarios, public.naves, public.enemigos,
              public.partidas, public.eventos_partida
  from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- ------------------------------------------------------------
-- FUNCIÓN registrar_partida
-- Guarda la partida y todos sus eventos en UNA sola transacción
-- (si algo falla, no queda una partida a medias).
-- El backend la llama con: supabase.rpc('registrar_partida', {...})
-- Devuelve el id de la partida creada.
-- ------------------------------------------------------------
create or replace function public.registrar_partida(
  p_usuario_id    uuid,
  p_nave_id       integer,
  p_puntaje       integer,
  p_duracion_seg  integer,
  p_disparos      integer,
  p_aciertos      integer,
  p_eventos       jsonb default '[]'::jsonb
) returns bigint
language plpgsql
set search_path = public
as $$
declare
  v_id bigint;
begin
  insert into partidas (usuario_id, nave_id, puntaje, duracion_seg, disparos, aciertos)
  values (p_usuario_id, p_nave_id, p_puntaje, p_duracion_seg, p_disparos, p_aciertos)
  returning id into v_id;

  insert into eventos_partida (partida_id, tipo_evento, enemigo_id, momento_seg)
  select v_id,
         e ->> 'tipo_evento',
         nullif(e ->> 'enemigo_id', '')::integer,
         (e ->> 'momento_seg')::numeric
  from jsonb_array_elements(coalesce(p_eventos, '[]'::jsonb)) as e;

  return v_id;
end;
$$;

revoke all on function public.registrar_partida(uuid, integer, integer, integer, integer, integer, jsonb)
  from public, anon, authenticated;
grant execute on function public.registrar_partida(uuid, integer, integer, integer, integer, integer, jsonb)
  to service_role;
