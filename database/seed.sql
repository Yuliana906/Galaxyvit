-- ============================================================
-- seed.sql | Datos de prueba  (2.º de 3 scripts; requiere schema.sql)
-- Ejecutar en: Supabase > SQL Editor > New query
-- Es re-ejecutable: no duplica naves, enemigos, usuarios ni partidas.
-- Los 10 usuarios de prueba tienen la contraseña:  Test1234
-- ============================================================

-- 1) NAVES (cadencia_disparo en milisegundos entre disparos)
insert into public.naves (nombre, velocidad, vida, cadencia_disparo) values
  ('Halcón', 300, 3, 250),   -- equilibrada
  ('Titán',  200, 5, 400),   -- lenta y resistente
  ('Fénix',  400, 2, 150)    -- rápida y frágil
on conflict (nombre) do nothing;

-- 2) ENEMIGOS
insert into public.enemigos (nombre, tipo, vida, danio) values
  ('Explorador', 'basico',   1, 1),
  ('Cazador',    'avanzado', 3, 2)
on conflict (nombre) do nothing;

-- 3) USUARIOS DE PRUEBA (hash bcrypt real, compatible con la librería bcrypt de Node)
insert into public.usuarios (nombre, email, password_hash, fecha_registro)
select v.nombre,
       v.email,
       extensions.crypt('Test1234', extensions.gen_salt('bf', 10)),
       now() - interval '35 days'
from (values
  ('Ana Torres',      'ana.torres@test.com'),
  ('Carlos Ruiz',     'carlos.ruiz@test.com'),
  ('Laura Gómez',     'laura.gomez@test.com'),
  ('Miguel Pérez',    'miguel.perez@test.com'),
  ('Sofía Ramírez',   'sofia.ramirez@test.com'),
  ('Daniel Castro',   'daniel.castro@test.com'),
  ('Valentina Rojas', 'valentina.rojas@test.com'),
  ('Andrés Molina',   'andres.molina@test.com'),
  ('Camila Herrera',  'camila.herrera@test.com'),
  ('Julián Vargas',   'julian.vargas@test.com')
) as v(nombre, email)
on conflict (lower(email)) do nothing;

-- 4) 250 PARTIDAS + EVENTOS en los últimos 30 días
--    Datos coherentes: el puntaje depende de los enemigos destruidos,
--    aciertos <= disparos, y cada partida termina con impactos y una muerte.
do $$
declare
  v_usuarios uuid[];
  v_naves    integer[];
  v_enemigos integer[];
  v_id       bigint;
  v_nave     integer;
  v_vida     integer;
  v_dur      integer;
  v_disp     integer;
  v_acier    integer;
  v_kills    integer;
  v_punt     integer;
  v_tipo     text;
  j          integer;
begin
  if exists (
    select 1
    from public.partidas p
    join public.usuarios u on u.id = p.usuario_id
    where u.email like '%@test.com'
  ) then
    raise notice 'seed: ya existen partidas de prueba; no se duplican.';
    return;
  end if;

  select array_agg(id)           into v_usuarios from public.usuarios where email like '%@test.com';
  select array_agg(id order by id) into v_naves    from public.naves;
  select array_agg(id order by id) into v_enemigos from public.enemigos;

  for i in 1..250 loop
    v_nave  := v_naves[1 + floor(random() * cardinality(v_naves))::int];
    select vida into v_vida from public.naves where id = v_nave;

    v_dur   := 30 + floor(random() * 271)::int;                     -- 30 a 300 s
    v_disp  := 20 + floor(v_dur * (0.3 + random() * 0.5))::int;
    v_acier := floor(v_disp * (0.3 + random() * 0.5))::int;         -- siempre <= disparos
    v_kills := greatest(1, floor(v_acier * 0.6))::int;
    v_punt  := v_kills * 100 + floor(random() * 300)::int;

    insert into public.partidas (usuario_id, nave_id, puntaje, duracion_seg, disparos, aciertos, fecha)
    values (
      v_usuarios[1 + floor(random() * cardinality(v_usuarios))::int],
      v_nave, v_punt, v_dur, v_disp, v_acier,
      now() - random() * interval '30 days'
    )
    returning id into v_id;

    -- Enemigos destruidos
    insert into public.eventos_partida (partida_id, tipo_evento, enemigo_id, momento_seg)
    select v_id,
           'enemigo_destruido',
           v_enemigos[1 + floor(random() * cardinality(v_enemigos))::int],
           round((random() * v_dur)::numeric, 2)
    from generate_series(1, v_kills);

    -- Un impacto por cada vida de la nave; el último justo antes de morir
    for j in 1..v_vida loop
      v_tipo := case when random() < 0.5 then 'impacto_meteorito' else 'impacto_bala' end;
      insert into public.eventos_partida (partida_id, tipo_evento, enemigo_id, momento_seg)
      values (
        v_id,
        v_tipo,
        case when v_tipo = 'impacto_bala'
             then v_enemigos[1 + floor(random() * cardinality(v_enemigos))::int]
             else null end,
        case when j = v_vida
             then v_dur - 0.2
             else greatest(1, round((v_dur::numeric * j / v_vida) - 1 - random()::numeric * 2, 2)) end
      );
    end loop;

    -- Muerte al final de la partida
    insert into public.eventos_partida (partida_id, tipo_evento, enemigo_id, momento_seg)
    values (v_id, 'muerte', null, v_dur);
  end loop;

  raise notice 'seed: 250 partidas de prueba creadas.';
end
$$;


