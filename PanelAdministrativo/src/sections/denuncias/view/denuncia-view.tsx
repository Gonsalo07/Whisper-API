// src/sections/denuncia/view/denuncia-view.tsx

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
  fetchDenuncias,
  createDenuncia,
  updateDenuncia,
  deleteDenuncia,
  fetchDenunciaById,
  cambiarEstadoDenuncia,
  type Denuncia,
} from 'src/services/denuncia-api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { useTable } from '../use-denuncia-table';
import { DenunciaDialog } from '../denuncia-dialog';
import { TableNoData } from '../../user/table-no-data';
import { UserTableHead } from '../../user/user-table-head';
import { emptyRows, getComparator } from '../../user/utils';
import { TableEmptyRows } from '../../user/table-empty-rows';
import { UserTableToolbar } from '../../user/user-table-toolbar';
import { DenunciaTableRow, type DenunciaRow } from '../denuncia-table-row';

export function DenunciaView() {
  const table = useTable();

  const [rows, setRows] = useState<DenunciaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Denuncia | null>(null);

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
      const data = await fetchDenuncias();

      const mapped: DenunciaRow[] = data.map((d) => {
        // Extraer información legible de las relaciones
        const usuarioEmail = (d.usuarioId as any)?.email || '—';
        const aliasNombre = (d.aliasId as any)?.alias || '—';
        const categoriaNombre = (d.categoriaId as any)?.nombre || '—';

        return {
          id: d.id!.toString(),
          titulo: d.titulo ?? '—',
          descripcion: d.descripcion ?? '—',
          usuario: usuarioEmail,
          alias: aliasNombre,
          categoria: categoriaNombre,
          estado: d.estado ?? 'EN_EVALUACION',
          creadaEn: d.creadaEn
            ? new Date(d.creadaEn).toLocaleDateString('es-PE', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : '—',
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error(err);
      showSnackbar('Error al cargar denuncias', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = useCallback(
    async (data: {
      usuarioId?: number;
      aliasId?: number;
      categoriaId?: number;
      titulo: string;
      descripcion: string;
      estado?: string;
    }) => {
      try {
        if (dialogMode === 'create') {
          await createDenuncia({
            usuarioId: { id: data.usuarioId! },
            aliasId: { id: data.aliasId! },
            categoriaId: { id: data.categoriaId! },
            titulo: data.titulo,
            descripcion: data.descripcion,
          });
          showSnackbar('Denuncia creada', 'success');
        } else if (selected?.id) {
          await updateDenuncia(selected.id, {
            titulo: data.titulo,
            descripcion: data.descripcion,
            estado: data.estado,
          });
          showSnackbar('Denuncia actualizada', 'success');
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
      const full = await fetchDenunciaById(Number(id));
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

  const handleChangeEstado = useCallback(
    async (id: string, nuevoEstado: string) => {
      if (!window.confirm(`¿Cambiar estado a ${nuevoEstado}?`)) return;
      try {
        await cambiarEstadoDenuncia(Number(id), nuevoEstado);
        showSnackbar('Estado actualizado', 'success');
        await loadData();
      } catch (err) {
        showSnackbar(err instanceof Error ? err.message : 'Error al cambiar estado', 'error');
      }
    },
    [loadData, showSnackbar]
  );

  const handleDeleteOne = useCallback(
    async (id: string) => {
      if (!window.confirm('¿Eliminar esta denuncia? Esta acción no se puede deshacer.')) return;
      try {
        await deleteDenuncia(Number(id));
        showSnackbar('Denuncia eliminada', 'success');
        await loadData();
      } catch (err) {
        showSnackbar(err instanceof Error ? err.message : 'Error al eliminar', 'error');
      }
    },
    [loadData, showSnackbar]
  );

  const handleDeleteMany = useCallback(async () => {
    if (!table.selected.length) return;
    if (!window.confirm('¿Eliminar las denuncias seleccionadas? Esta acción no se puede deshacer.'))
      return;
    try {
      await Promise.all(table.selected.map((id: string) => deleteDenuncia(Number(id))));
      showSnackbar('Denuncias eliminadas', 'success');
      table.onSelectAllRows(false, []);
      await loadData();
    } catch (err) {
      showSnackbar('Error al eliminar algunas denuncias', 'error');
    }
  }, [table, loadData, showSnackbar]);

  const dataFiltered = rows
    .filter((r) => (filterName ? r.titulo.toLowerCase().includes(filterName.toLowerCase()) : true))
    .sort(getComparator(table.order, table.orderBy));

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Denuncias
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
          Nueva Denuncia
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
                  { id: 'titulo', label: 'Título' },
                  { id: 'descripcion', label: 'Descripción' },
                  { id: 'usuario', label: 'Usuario' },
                  { id: 'alias', label: 'Alias' },
                  { id: 'categoria', label: 'Categoría' },
                  { id: 'estado', label: 'Estado' },
                  { id: 'creadaEn', label: 'Fecha' },
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
                      <DenunciaTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onEdit={() => handleEdit(row.id)}
                        onDelete={() => handleDeleteOne(row.id)}
                        onChangeEstado={(estado) => handleChangeEstado(row.id, estado)}
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

      <DenunciaDialog
        open={dialogOpen}
        mode={dialogMode}
        denuncia={selected}
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
