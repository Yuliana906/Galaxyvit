-- ============================================================
-- views.sql | Vistas para Looker Studio y el ranking  (3.º de 3 scripts)
-- Requiere schema.sql (y seed.sql si quieres ver datos).
-- Es re-ejecutable: borra y recrea las vistas.
-- Fechas en zona horaria America/Bogota.
-- ============================================================

drop view if exists public.v_partidas_por_dia;
drop view if exists public.v_puntaje_por_nave;
drop view if exists public.v_muertes_por_causa;
drop view if exists public.v_eventos_por_tipo;
drop view if exists public.v_enemigos_destruidos;
drop view if exists public.v_ranking_top10;
drop view if exists public.v_kpis_generales;

-- 1) Partidas por día
create view public.v_partidas_por_dia as
select (p.fecha at time zone 'America/Bogota')::date  as dia,
       count(*)::int                                  as total_partidas,
       count(distinct p.usuario_id)::int              as jugadores_unicos,
       round(avg(p.puntaje), 2)                       as puntaje_promedio,
       round(avg(p.duracion_seg), 1)                  as duracion_promedio_seg
from public.partidas p
group by 1
order by 1;

-- 2) Puntaje promedio (y más) por nave
create view public.v_puntaje_por_nave as
select n.nombre                                                    as nave,
       count(p.id)::int                                            as total_partidas,
       coalesce(round(avg(p.puntaje), 2), 0)                       as puntaje_promedio,
       coalesce(max(p.puntaje), 0)                                 as puntaje_maximo,
       coalesce(round(avg(p.duracion_seg), 1), 0)                  as duracion_promedio_seg,
       coalesce(round(100.0 * sum(p.aciertos) / nullif(sum(p.disparos), 0), 1), 0) as precision_pct
from public.naves n
left join public.partidas p on p.nave_id = n.id
group by n.id, n.nombre
order by n.id;

-- 3) Muertes por causa: el último impacto antes de cada muerte
create view public.v_muertes_por_causa as
select coalesce(c.causa, 'Desconocida') as causa,
       count(*)::int                    as total_muertes
from public.eventos_partida m
left join lateral (
  select case e.tipo_evento
           when 'impacto_meteorito' then 'Meteorito'
           when 'impacto_bala'      then 'Bala enemiga'
         end as causa
  from public.eventos_partida e
  where e.partida_id = m.partida_id
    and e.tipo_evento in ('impacto_meteorito', 'impacto_bala')
    and e.momento_seg <= m.momento_seg
  order by e.momento_seg desc
  limit 1
) c on true
where m.tipo_evento = 'muerte'
group by 1
order by 2 desc;

-- 4) Eventos por tipo
create view public.v_eventos_por_tipo as
select tipo_evento,
       count(*)::int as total
from public.eventos_partida
group by tipo_evento
order by total desc;

-- 5) Enemigos destruidos por tipo de enemigo
create view public.v_enemigos_destruidos as
select en.nombre as enemigo,
       en.tipo,
       count(*)::int as total_destruidos
from public.eventos_partida e
join public.enemigos en on en.id = e.enemigo_id
where e.tipo_evento = 'enemigo_destruido'
group by en.id, en.nombre, en.tipo
order by total_destruidos desc;

-- 6) Ranking top 10 (el backend lo usa para GET /api/ranking)
create view public.v_ranking_top10 as
select (row_number() over (order by p.puntaje desc, p.fecha asc))::int as posicion,
       u.nombre,
       p.puntaje,
       n.nombre as nave,
       p.fecha
from public.partidas p
join public.usuarios u on u.id = p.usuario_id
join public.naves    n on n.id = p.nave_id
order by p.puntaje desc, p.fecha asc
limit 10;

-- 7) KPIs generales (una sola fila)
create view public.v_kpis_generales as
select (select count(*) from public.usuarios)::int                                   as total_usuarios,
       (select count(*) from public.partidas)::int                                   as total_partidas,
       coalesce((select round(avg(puntaje), 2) from public.partidas), 0)             as puntaje_promedio,
       coalesce((select max(puntaje) from public.partidas), 0)                       as puntaje_maximo,
       coalesce((select round(avg(duracion_seg), 1) from public.partidas), 0)        as duracion_promedio_seg,
       coalesce((select round(100.0 * sum(aciertos) / nullif(sum(disparos), 0), 1)
                 from public.partidas), 0)                                           as precision_pct,
       (select count(*) from public.eventos_partida
         where tipo_evento = 'enemigo_destruido')::int                               as enemigos_destruidos,
       (select count(*) from public.partidas
         where fecha >= now() - interval '7 days')::int                              as partidas_ultimos_7_dias;

-- ------------------------------------------------------------
-- SEGURIDAD: la API pública no debe ver las vistas.
-- (Es normal que Supabase muestre un aviso "Security Definer View":
--  es seguro porque anon/authenticated no tienen permiso.)
-- ------------------------------------------------------------
revoke all on public.v_partidas_por_dia, public.v_puntaje_por_nave,
              public.v_muertes_por_causa, public.v_eventos_por_tipo,
              public.v_enemigos_destruidos, public.v_ranking_top10,
              public.v_kpis_generales
  from anon, authenticated;

