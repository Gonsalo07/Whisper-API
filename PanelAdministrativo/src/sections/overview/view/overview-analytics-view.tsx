// src/sections/overview/view/overview-analytics-view.tsx

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchUsuarios } from 'src/services/usuario-api';
import { fetchDenuncias } from 'src/services/denuncia-api';
import { fetchComentarios } from 'src/services/comentario-api';
import { fetchReportes } from 'src/services/reporte-falsedad-api';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

// Agrupa items por mes — soporta creadoEn y creadaEn
function agruparPorMes(items: { creadoEn?: string; creadaEn?: string }[], meses = 6) {
  const ahora = new Date();
  const series: number[] = [];
  const categories: string[] = [];

  for (let i = meses - 1; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const mes = fecha.toLocaleString('es-PE', { month: 'short' });
    categories.push(mes.charAt(0).toUpperCase() + mes.slice(1));

    const count = items.filter((item) => {
      const fechaItem = item.creadoEn || item.creadaEn;
      if (!fechaItem) return false;
      const d = new Date(fechaItem);
      return d.getMonth() === fecha.getMonth() && d.getFullYear() === fecha.getFullYear();
    }).length;

    series.push(count);
  }

  return { series, categories };
}

// % de cambio entre el mes actual y el anterior
function calcularPorcentajeCambio(series: number[]): number {
  if (series.length < 2) return 0;
  const actual = series[series.length - 1];
  const anterior = series[series.length - 2];
  if (anterior === 0) return actual > 0 ? 100 : 0;
  return Math.round(((actual - anterior) / anterior) * 100 * 10) / 10;
}

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [loading, setLoading] = useState(true);

  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalComentarios, setTotalComentarios] = useState(0);
  const [totalReportes, setTotalReportes] = useState(0);
  const [totalDenuncias, setTotalDenuncias] = useState(0);

  const [usuariosActivos, setUsuariosActivos] = useState(0);
  const [usuariosInactivos, setUsuariosInactivos] = useState(0);
  const [denunciasPorEstado, setDenunciasPorEstado] = useState<{ label: string; value: number }[]>([]);

  const [denunciasPorMes, setDenunciasPorMes] = useState<{ series: number[]; categories: string[] }>({ series: [], categories: [] });
  const [reportesPorMes, setReportesPorMes]   = useState<{ series: number[]; categories: string[] }>({ series: [], categories: [] });
  const [comentariosPorMes, setComentariosPorMes] = useState<{ series: number[]; categories: string[] }>({ series: [], categories: [] });

  const [timeline, setTimeline] = useState<{ id: string; type: string; title: string; time: string }[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resU, resC, resR, resD] = await Promise.allSettled([
          fetchUsuarios(),
          fetchComentarios(),
          fetchReportes(),
          fetchDenuncias(),
        ]);

        const usuarios    = resU.status === 'fulfilled' ? resU.value : [];
        const comentarios = resC.status === 'fulfilled' ? resC.value : [];
        const reportes    = resR.status === 'fulfilled' ? resR.value : [];
        const denuncias   = resD.status === 'fulfilled' ? resD.value : [];

        setTotalUsuarios(usuarios.length);
        setTotalComentarios(comentarios.length);
        setTotalReportes(reportes.length);
        setTotalDenuncias(denuncias.length);

        setUsuariosActivos(usuarios.filter((u) => u.estado === 'ACTIVO').length);
        setUsuariosInactivos(usuarios.filter((u) => u.estado === 'INACTIVO').length);

        // Denuncias agrupadas por estado
        const estadosMap: Record<string, number> = {};
        denuncias.forEach((d) => {
          const estado = d.estado ?? 'SIN ESTADO';
          estadosMap[estado] = (estadosMap[estado] ?? 0) + 1;
        });
        setDenunciasPorEstado(Object.entries(estadosMap).map(([label, value]) => ({ label, value })));

        const dMes = agruparPorMes(denuncias, 6);
        const rMes = agruparPorMes(reportes, 6);
        const cMes = agruparPorMes(comentarios, 6);
        setDenunciasPorMes(dMes);
        setReportesPorMes(rMes);
        setComentariosPorMes(cMes);

        // Últimas 5 denuncias para timeline
        const ultimas = [...denuncias]
          .filter((d) => d.creadaEn)
          .sort((a, b) => new Date(b.creadaEn!).getTime() - new Date(a.creadaEn!).getTime())
          .slice(0, 5)
          .map((d, i) => ({
            id: d.id!.toString(),
            type: `order${i + 1}`,
            title: d.descripcion ? `${d.descripcion.substring(0, 50)}...` : `Denuncia #${d.id}`,
            time: new Date(d.creadaEn!).toLocaleDateString('es-PE'),
          }));
        setTimeline(ultimas);

      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  if (loading) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3" sx={{ mb: { xs: 3, md: 5 } }}>
        Whisper — Panel de Control
      </Typography>

      <Grid container spacing={3}>

        {/* WIDGETS */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Usuarios Registrados"
            percent={0}
            total={totalUsuarios}
            icon={<img alt="Usuarios" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{ categories: denunciasPorMes.categories, series: denunciasPorMes.categories.map(() => totalUsuarios) }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Denuncias"
            percent={calcularPorcentajeCambio(denunciasPorMes.series)}
            total={totalDenuncias}
            color="warning"
            icon={<img alt="Denuncias" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{ categories: denunciasPorMes.categories, series: denunciasPorMes.series }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Comentarios"
            percent={calcularPorcentajeCambio(comentariosPorMes.series)}
            total={totalComentarios}
            color="secondary"
            icon={<img alt="Comentarios" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{ categories: comentariosPorMes.categories, series: comentariosPorMes.series }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Reportes de Falsedad"
            percent={calcularPorcentajeCambio(reportesPorMes.series)}
            total={totalReportes}
            color="error"
            icon={<img alt="Reportes" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{ categories: reportesPorMes.categories, series: reportesPorMes.series }}
          />
        </Grid>

        {/* DONUT: Estado de denuncias */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Denuncias por Estado"
            chart={{
              series: denunciasPorEstado.length > 0
                ? denunciasPorEstado
                : [{ label: 'Sin datos', value: 1 }],
            }}
          />
        </Grid>

        {/* BARRAS: Actividad mensual */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Actividad Mensual"
            subheader="Últimos 6 meses"
            chart={{
              categories: denunciasPorMes.categories,
              series: [
                { name: 'Denuncias', data: denunciasPorMes.series },
                { name: 'Comentarios', data: comentariosPorMes.series },
                { name: 'Reportes', data: reportesPorMes.series },
              ],
            }}
          />
        </Grid>

        {/* BARRAS HORIZONTALES: Totales */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Resumen por Módulo"
            subheader="Total de registros en el sistema"
            chart={{
              categories: ['Usuarios', 'Denuncias', 'Comentarios', 'Reportes'],
              series: [{ name: 'Total', data: [totalUsuarios, totalDenuncias, totalComentarios, totalReportes] }],
            }}
          />
        </Grid>

        {/* DONUT: Usuarios activos vs inactivos */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Estado de Usuarios"
            chart={{
              series: [
                { label: 'Activos', value: usuariosActivos },
                { label: 'Inactivos', value: usuariosInactivos },
              ],
            }}
          />
        </Grid>

        {/* TIMELINE */}
        <Grid size={{ xs: 12 }}>
          <AnalyticsOrderTimeline
            title="Últimas Denuncias Registradas"
            list={timeline.map((item) => ({
              id: item.id,
              type: item.type,
              title: item.title,
              time: item.time,
            }))}
          />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}