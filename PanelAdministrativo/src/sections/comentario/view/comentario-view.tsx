  // src/sections/comentario/view/comentario-view.tsx

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
    type Comentario,
    createComentario,
    deleteComentario,
    fetchComentarios,
    updateComentario,
    fetchComentarioById,
  } from 'src/services/comentario-api';

  import { Iconify } from 'src/components/iconify';
  import { Scrollbar } from 'src/components/scrollbar';

  import { useTable } from '../use-comentario-table';
  import { TableNoData } from '../../user/table-no-data';
  import { ComentarioDialog } from '../comentario-dialog';
  import { UserTableHead } from '../../user/user-table-head';
  import { emptyRows, getComparator } from '../../user/utils';
  import { TableEmptyRows } from '../../user/table-empty-rows';
  import { UserTableToolbar } from '../../user/user-table-toolbar';
  import { ComentarioTableRow, type ComentarioProps } from '../comentario-table-row';

  // ----------------------------------------------------------------------

  export function ComentarioView() {
    const table = useTable();

    const [comentarios, setComentarios] = useState<ComentarioProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterName, setFilterName] = useState('');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
    const [selectedComentario, setSelectedComentario] = useState<Comentario | null>(null);

    const [snackbar, setSnackbar] = useState<{
      open: boolean;
      message: string;
      severity: 'success' | 'error';
    }>({ open: false, message: '', severity: 'success' });

    const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
      setSnackbar({ open: true, message, severity });
    }, []);

    // ── Cargar datos ──────────────────────────────────────────────────────
    const loadComentarios = useCallback(async () => {
      try {
        setLoading(true);
        const data = await fetchComentarios();

        const mapped = data.map((c: Comentario) => ({
          id: c.id!.toString(),
          contenido: c.contenido,
          denunciaId: c.denunciaId?.id?.toString() ?? '—',
          aliasId: c.aliasId?.id?.toString() ?? '—',
          creadoEn: c.creadoEn ?? '',
        }));

        setComentarios(mapped);
      } catch (error) {
        console.error('Error al obtener comentarios:', error);
        showSnackbar('Error al cargar comentarios', 'error');
      } finally {
        setLoading(false);
      }
    }, [showSnackbar]);

    useEffect(() => {
      loadComentarios();
    }, [loadComentarios]);

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

    const handleCreateClick = () => {
      setDialogMode('create');
      setSelectedComentario(null);
      setDialogOpen(true);
    };

    const handleEditClick = useCallback(
      async (id: string) => {
        try {
          const full = await fetchComentarioById(parseInt(id));
          if (full) {
            setSelectedComentario(full);
            setDialogMode('edit');
            setDialogOpen(true);
          } else {
            showSnackbar('Comentario no encontrado', 'error');
          }
        } catch {
          showSnackbar('Error al cargar datos del comentario', 'error');
        }
      },
      [showSnackbar]
    );

    const handleSave = useCallback(
      async (data: { contenido: string; denunciaId?: number; aliasId?: number }) => {
        try {
          if (dialogMode === 'create') {
            await createComentario({
              contenido: data.contenido,
              denunciaId: { id: data.denunciaId! },
              aliasId: { id: data.aliasId! },
            });
            showSnackbar('Comentario creado exitosamente', 'success');
          } else if (selectedComentario?.id) {
            await updateComentario(selectedComentario.id, { contenido: data.contenido });
            showSnackbar('Comentario actualizado exitosamente', 'success');
          }
          await loadComentarios();
          table.onSelectAllRows(false, []);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Error al guardar';
          showSnackbar(message, 'error');
          throw error;
        }
      },
      [dialogMode, selectedComentario, showSnackbar, loadComentarios, table.onSelectAllRows]
    );

    const handleDeleteClick = useCallback(async () => {
      if (table.selected.length === 0) return;
      const msg =
        table.selected.length === 1
          ? '¿Estás seguro de eliminar este comentario?'
          : `¿Estás seguro de eliminar ${table.selected.length} comentarios?`;
      if (!window.confirm(msg)) return;

      try {
        await Promise.all(table.selected.map((id) => deleteComentario(parseInt(id))));
        showSnackbar(
          table.selected.length === 1
            ? 'Comentario eliminado exitosamente'
            : 'Comentarios eliminados exitosamente',
          'success'
        );
        table.onSelectAllRows(false, []);
        await loadComentarios();
      } catch (error) {
        showSnackbar(error instanceof Error ? error.message : 'Error al eliminar', 'error');
      }
    }, [table.selected, table.onSelectAllRows, loadComentarios, showSnackbar]);

    const handleDeleteSingle = useCallback(
      async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return;
        try {
          await deleteComentario(parseInt(id));
          showSnackbar('Comentario eliminado exitosamente', 'success');
          await loadComentarios();
        } catch (error) {
          showSnackbar(error instanceof Error ? error.message : 'Error al eliminar', 'error');
        }
      },
      [loadComentarios, showSnackbar]
    );

    // ── Filtrado ──────────────────────────────────────────────────────────
  const dataFiltered: ComentarioProps[] = comentarios
    .filter((c) =>
      filterName ? c.contenido.toLowerCase().includes(filterName.toLowerCase()) : true
    )
    .sort(getComparator(table.order, table.orderBy));

    const notFound = !dataFiltered.length && !!filterName;

    // ── Render ────────────────────────────────────────────────────────────
    return (
      <DashboardContent>
        <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Comentarios
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleCreateClick}
          >
            Nuevo Comentario
          </Button>
        </Box>

        <Card>
          <UserTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
            onDelete={handleDeleteClick}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset', position: 'relative' }}>
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              )}

              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={comentarios.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(checked, comentarios.map((c) => c.id))
                  }
                  headLabel={[
                    { id: 'id', label: 'ID', align: 'center' },
                    { id: 'contenido', label: 'Contenido' },
                    { id: 'denunciaId', label: 'Denuncia', align: 'center' },
                    { id: 'aliasId', label: 'Alias', align: 'center' },
                    { id: 'creadoEn', label: 'Creado En', align: 'center' },
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
                        <ComentarioTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          onEdit={() => handleEditClick(row.id)}
                          onDelete={() => handleDeleteSingle(row.id)}
                        />
                      ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, comentarios.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={comentarios.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>

        <ComentarioDialog
          open={dialogOpen}
          mode={dialogMode}
          comentario={selectedComentario}
          onClose={() => setDialogOpen(false)}
          onSave={handleSave}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </DashboardContent>
    );
  }