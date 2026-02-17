import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  fetchReportes,
  createReporte,
  updateReporte,
  deleteReporte,
  fetchReporteById,
} from 'src/services/reporte-falsedad-api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UserTableHead } from '../../user/user-table-head';
import { ReporteFalsedadDialog } from '../reporte-falsedad-dialog';
import { useTable } from '../../evidencia-falsedad/use-evidencia-falsedad-table';
import { ReporteFalsedadTableRow, type ReporteFalsedadRow } from '../reporte-falsedad-table-row';

export function ReporteFalsedadView() {
  const table = useTable();

  const [rows, setRows] = useState<ReporteFalsedadRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<any>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const showSnackbar = (message: string, severity: 'success' | 'error') =>
    setSnackbar({ open: true, message, severity });

  const loadData = useCallback(async () => {
    const data = await fetchReportes();
    setRows(
      data.map((r) => ({
        id: r.id!.toString(),
        denunciaId: r.denunciaId?.id?.toString() ?? '—',
        usuarioId: r.usuarioId?.id?.toString() ?? '—',
        motivo: r.motivo ?? '—',
        creadoEn: r.creadoEn
          ? new Date(r.creadoEn).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—',
        estado: r.estado ?? 'VISIBLE',
      }))
    );
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (data: {
    denunciaId?: number;
    usuarioId?: number;
    motivo: string;
  }) => {
    try {
      if (dialogMode === 'create') {
        await createReporte({
          denunciaId: { id: data.denunciaId! },
          usuarioId: { id: data.usuarioId! },
          motivo: data.motivo,
        });
        showSnackbar('Reporte creado', 'success');
      } else {
        await updateReporte(selected.id, { motivo: data.motivo });
        showSnackbar('Reporte actualizado', 'success');
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Error al guardar', 'error');
      throw err;
    }
  };

  const handleEdit = async (id: string) => {
    const full = await fetchReporteById(Number(id));
    setSelected(full);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  // Cambia estado a OCULTO pero sigue apareciendo en la tabla
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Ocultar este reporte?')) return;
    await deleteReporte(Number(id));
    showSnackbar('Reporte ocultado', 'success');
    loadData(); // recarga — ahora aparecerá con estado OCULTO en rojo
  };

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Reportes de Falsedad
        </Typography>

        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => {
            setDialogMode('create');
            setSelected(null);
            setDialogOpen(true);
          }}
        >
          Nuevo Reporte
        </Button>
      </Box>

      <Card>
        <Scrollbar>
          <TableContainer>
            <Table>
              {/* headLabel debe tener el MISMO orden que las celdas en table-row */}
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={rows.length}
                numSelected={0}
                onSort={table.onSort}
                onSelectAllRows={() => {}}
                headLabel={[
                  { id: 'id',         label: 'ID',       align: 'center' },
                  { id: 'denunciaId', label: 'Denuncia', align: 'center' },
                  { id: 'usuarioId',  label: 'Usuario',  align: 'center' },
                  { id: 'motivo',     label: 'Motivo'                    },
                  { id: 'creadoEn',   label: 'Fecha',    align: 'center' },
                  { id: 'estado',     label: 'Estado',   align: 'center' },
                ]}
              />

              <TableBody>
                {rows.map((row) => (
                  <ReporteFalsedadTableRow
                    key={row.id}
                    row={row}
                    onEdit={() => handleEdit(row.id)}
                    onDelete={() => handleDelete(row.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      <ReporteFalsedadDialog
        open={dialogOpen}
        mode={dialogMode}
        reporte={selected}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}