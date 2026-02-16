// src/sections/evidencia/view/evidencia-view.tsx

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  fetchEvidencias,
  createEvidencia,
  updateEvidencia,
  deleteEvidencia,
  fetchEvidenciaById,
  type Evidencia,
} from 'src/services/evidencia-api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../../user/table-no-data';
import { useTable } from '../use-evidencia-table';
import { UserTableHead } from '../../user/user-table-head';
import { emptyRows, getComparator } from '../../user/utils';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { UserTableToolbar } from '../../user/user-table-toolbar';
import { EvidenciaDialog } from '../evidencia-dialog';
import { EvidenciaTableRow, type EvidenciaRow } from '../evidencia-table-row';

export function EvidenciaView() {
  const table = useTable();

  const [rows, setRows] = useState<EvidenciaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Evidencia | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEvidencias();

      const mapped: EvidenciaRow[] = data.map((e) => ({
        id: e.id!.toString(),
        denunciaId: e.denunciaId?.id?.toString() ?? '—',
        denunciaTitulo: '',
        url: e.url ?? '—',
        tipo: e.tipo ?? '—',
        creadoEn: e.creadoEn
          ? new Date(e.creadoEn).toLocaleDateString('es-PE', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—',
        estado: e.estado ?? 'VISIBLE',
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
      showSnackbar('Error al cargar evidencias', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = useCallback(
    async (data: { denunciaId?: number; url: string; tipo: string }) => {
      try {
        if (dialogMode === 'create') {
          await createEvidencia({
            denunciaId: { id: data.denunciaId! },
            url: data.url,
            tipo: data.tipo,
          });
          showSnackbar('Evidencia creada', 'success');
        } else if (selected?.id) {
          await updateEvidencia(selected.id, {
            url: data.url,
            tipo: data.tipo,
          });
          showSnackbar('Evidencia actualizada', 'success');
        }

        await loadData();
        table.onSelectAllRows(false, []);
      } catch (err) {
        showSnackbar(err instanceof Error ? err.message : 'Error al guardar', 'error');
        throw err;
      }
    },
    [dialogMode, selected, loadData, showSnackbar, table]
  );

  const handleEdit = useCallback(
    async (id: string) => {
      const full = await fetchEvidenciaById(Number(id));
      if (!full) {
        showSnackbar('No encontrada', 'error');
        return;
      }
      setSelected(full);
      setDialogMode('edit');
      setDialogOpen(true);
    },
    [showSnackbar]
  );

  const handleDeleteOne = useCallback(
    async (id: string) => {
      if (!window.confirm('¿Ocultar esta evidencia?')) return;
      await deleteEvidencia(Number(id));
      showSnackbar('Evidencia ocultada', 'success');
      await loadData();
    },
    [loadData, showSnackbar]
  );

  const handleDeleteMany = useCallback(async () => {
    if (!table.selected.length) return;
    if (!window.confirm('¿Ocultar las evidencias seleccionadas?')) return;
    await Promise.all(table.selected.map((id) => deleteEvidencia(Number(id))));
    showSnackbar('Evidencias ocultadas', 'success');
    table.onSelectAllRows(false, []);
    await loadData();
  }, [table, loadData, showSnackbar]);

  const dataFiltered = rows
    .filter((r) => (filterName ? r.tipo.toLowerCase().includes(filterName.toLowerCase()) : true))
    .sort(getComparator(table.order, table.orderBy));

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Evidencias
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
          Nueva Evidencia
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(e) => {
            setFilterName(e.target.value);
            table.onResetPage();
          }}
          onDelete={handleDeleteMany}
        />

        <Scrollbar>
          <TableContainer>
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            )}

            <Table>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={rows.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    rows.map((r) => r.id)
                  )
                }
                headLabel={[
                  { id: 'id', label: 'ID' },
                  { id: 'denunciaId', label: 'Denuncia' },
                  { id: 'url', label: 'URL' },
                  { id: 'tipo', label: 'Tipo' },
                  { id: 'creadoEn', label: 'Fecha' },
                  { id: 'estado', label: 'Estado' },
                ]}
              />

              <TableBody>
                {!loading &&
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <EvidenciaTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEdit={() => handleEdit(row.id)}
                        onDelete={() => handleDeleteOne(row.id)}
                      />
                    ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, rows.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={rows.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <EvidenciaDialog
        open={dialogOpen}
        mode={dialogMode}
        evidencia={selected}
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
