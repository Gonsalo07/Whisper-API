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
  type Usuario,
  fetchUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  fetchUsuarioById,
} from 'src/services/usuario-api';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { UserDialog } from '../user-dialog';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';

export function UserView() {
  const table = useTable();

  // Estados para la API
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');

  // Estados para el diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  // Estados para notificaciones
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Función para mostrar notificaciones
  const showSnackbar = useCallback((message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Función para cargar usuarios
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsuarios();

      const mappedUsers = data.map((user: Usuario) => ({
        id: user.id!.toString(),
        email: user.email,
        role: user.rol || 'Usuario',
        status: user.estado === 'ACTIVO' ? 'active' : 'banned',
        avatarUrl: '',
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error al obtener los usuarios: ', error);
      showSnackbar('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Función para cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Función para abrir diálogo de creación
  const handleCreateClick = () => {
    setDialogMode('create');
    setSelectedUsuario(null);
    setDialogOpen(true);
  };

  // Función para abrir diálogo de edición
  const handleEditClick = useCallback(
    async (userId: string) => {
      try {
        const fullUsuario = await fetchUsuarioById(parseInt(userId));
        if (fullUsuario) {
          setSelectedUsuario(fullUsuario);
          setDialogMode('edit');
          setDialogOpen(true);
        } else {
          showSnackbar('Usuario no encontrado', 'error');
        }
      } catch {
        showSnackbar('Error al cargar datos del usuario', 'error');
      }
    },
    [showSnackbar]
  );

  // Función para guardar usuario (crear o editar)
  const handleSaveUsuario = useCallback(
    async (usuarioData: {
      email: string;
      password?: string;
      rol: string;
      estado: 'ACTIVO' | 'INACTIVO';
    }) => {
      try {
        if (dialogMode === 'create') {
          // En creación, password es requerido
          if (!usuarioData.password) {
            throw new Error('La contraseña es requerida');
          }
          await createUsuario({
            email: usuarioData.email,
            password: usuarioData.password,
            rol: usuarioData.rol,
            estado: usuarioData.estado,
          });
          showSnackbar('Usuario creado exitosamente', 'success');
        } else if (selectedUsuario?.id) {
          // En modo edición, construir el objeto de actualización
          const updateData: {
            email?: string;
            password?: string;
            rol?: string;
            estado?: 'ACTIVO' | 'INACTIVO';
          } = {
            email: usuarioData.email,
            estado: usuarioData.estado,
            rol: usuarioData.rol,
          };
          // Solo agregar password si se proporcionó uno nuevo
          if (usuarioData.password && usuarioData.password.trim()) {
            updateData.password = usuarioData.password.trim();
          }
          await updateUsuario(selectedUsuario.id, updateData);
          showSnackbar('Usuario actualizado exitosamente', 'success');
        }
        await loadUsers();
        table.onSelectAllRows(false, []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Error al guardar usuario';
        showSnackbar(message, 'error');
        throw error; // Re-lanzar para que el diálogo maneje el error
      }
    },
    [dialogMode, selectedUsuario, showSnackbar, loadUsers, table.onSelectAllRows]
  );

  // Función para eliminar usuario(s)
  const handleDeleteClick = useCallback(async () => {
    if (table.selected.length === 0) return;

    const confirmMessage =
      table.selected.length === 1
        ? '¿Estás seguro de eliminar este usuario?'
        : `¿Estás seguro de eliminar ${table.selected.length} usuarios?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const deletePromises = table.selected.map((id) => deleteUsuario(parseInt(id)));
      await Promise.all(deletePromises);

      showSnackbar(
        table.selected.length === 1
          ? 'Usuario eliminado exitosamente'
          : 'Usuarios eliminados exitosamente',
        'success'
      );

      table.onSelectAllRows(false, []);
      await loadUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al eliminar usuario(s)';
      showSnackbar(message, 'error');
    }
  }, [table.selected, table.onSelectAllRows, loadUsers, showSnackbar]);

  // Función para eliminar un solo usuario desde el menú
  const handleDeleteSingle = useCallback(
    async (userId: string) => {
      if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

      try {
        await deleteUsuario(parseInt(userId));
        showSnackbar('Usuario eliminado exitosamente', 'success');
        table.onSelectRow(userId); // Deseleccionar
        await loadUsers();
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Error al eliminar usuario';
        showSnackbar(message, 'error');
      }
    },
    [loadUsers, showSnackbar, table.onSelectRow]
  );

  const dataFiltered: UserProps[] = applyFilter({
    inputData: users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Usuarios
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreateClick}
        >
          Nuevo Usuario
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
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, users.map((user) => user.id))
                }
                headLabel={[
                  { id: 'id', label: 'ID', align:'center' },
                  { id: 'email', label: 'Email', align:'center'  },
                  { id: 'role', label: 'Rol' , align:'center' },
                  { id: 'status', label: 'Estado' , align:'center' },
                ]}
              />
              <TableBody>
                {!loading && dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <UserTableRow
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <UserDialog
        open={dialogOpen}
        mode={dialogMode}
        usuario={selectedUsuario}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveUsuario}
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

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
