import { useState, useEffect, useCallback } from 'react';

import {
    Box, Card, Table, Button, Avatar, Dialog, TableRow, TableBody, TableCell,
    TableHead, Typography, IconButton, TableContainer, TextField, MenuItem,
    DialogTitle, DialogContent, DialogActions, InputAdornment, Popover,
    TablePagination // Importamos el componente de paginación
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function AliasView() {
    const [aliasList, setAliasList] = useState<any[]>([]);
    const [usuariosList, setUsuariosList] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [nuevoAlias, setNuevoAlias] = useState({ alias: '', id_usuario: '' });

    // --- ESTADOS PARA PAGINACIÓN ---
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // --- ESTADOS PARA EL MENÚ DE 3 PUNTITOS ---
    const [openMenu, setOpenMenu] = useState<HTMLElement | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setOpenMenu(event.currentTarget);
        setSelectedId(id);
    };

    const handleCloseMenu = () => {
        setOpenMenu(null);
        setSelectedId(null);
    };

    // --- FUNCIONES DE PAGINACIÓN ---
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // --- FUNCIONES DE API ---
    const fetchAlias = useCallback(async (nombre: string = '') => {
        try {
            const url = nombre
                ? `http://localhost:9090/api/alias?nombre=${nombre}`
                : 'http://localhost:9090/api/alias';

            const res = await fetch(url);
            if (res.status === 204) {
                setAliasList([]);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setAliasList(data || []);
            }
        } catch (err) {
            console.error('Error cargando alias:', err);
            setAliasList([]);
        }
    }, []);

    const handleToggleEstado = async () => {
        if (!selectedId) return;
        try {
            const response = await fetch(`http://localhost:9090/api/alias/${selectedId}/estado`, {
                method: 'PATCH',
            });
            if (response.ok) {
                fetchAlias(); 
                handleCloseMenu();
            }
        } catch (error) {
            console.error('Error al cambiar estado:', error);
        }
    };

    useEffect(() => {
        fetchAlias();
        fetch('http://localhost:9090/api/usuarios')
            .then((res) => res.json())
            .then((data) => setUsuariosList(data || []))
            .catch((err) => console.error('Error cargando usuarios:', err));
    }, [fetchAlias]);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFilterName(value);
        fetchAlias(value);
        setPage(0); // Reiniciar a la primera página al filtrar
    };

    const handleGuardar = async () => {
        if (!nuevoAlias.alias || !nuevoAlias.id_usuario) return;
        try {
            const response = await fetch('http://localhost:9090/api/alias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    alias: nuevoAlias.alias,
                    usuarioId: { id: Number(nuevoAlias.id_usuario) }
                }),
            });
            if (response.ok) {
                setOpenModal(false);
                setNuevoAlias({ alias: '', id_usuario: '' });
                fetchAlias();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <DashboardContent>
            <Box display="flex" alignItems="center" mb={5}>
                <Typography variant="h4" sx={{ flexGrow: 1 }}>Alias Públicos</Typography>
                <Button
                    variant="contained"
                    color="inherit"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    onClick={() => setOpenModal(true)}
                >
                    Nuevo Alias
                </Button>
            </Box>

            <Card>
                <Box sx={{ p: 3 }}>
                    <TextField
                        fullWidth
                        value={filterName}
                        onChange={handleFilterChange}
                        placeholder="Buscar por alias..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 1.5 }
                        }}
                    />
                </Box>

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            {/* Cabecera con fondo neutral */}
                            <TableHead sx={{ bgcolor: 'background.neutral' }}>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Usuario</TableCell>
                                    <TableCell>Alias</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {aliasList
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Aplicamos paginación
                                    .map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar alt={row.usuarioId?.email} />
                                                <Typography variant="subtitle2" noWrap>
                                                    {row.usuarioId?.email || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell><strong>{row.alias}</strong></TableCell>

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    height: 24,
                                                    minWidth: 48,
                                                    borderRadius: 1,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    px: 1,
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    bgcolor: row.estado ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 86, 48, 0.16)',
                                                    color: row.estado ? 'rgb(17, 141, 87)' : 'rgb(183, 29, 24)',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {row.estado ? 'Active' : 'Banned'}
                                            </Box>
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton onClick={(e) => handleOpenMenu(e, row.id)}>
                                                <Iconify icon="eva:more-vertical-fill" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                {/* COMPONENTE DE PAGINACIÓN */}
                <TablePagination
                    component="div"
                    count={aliasList.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </Card>

            <Popover
                open={!!openMenu}
                anchorEl={openMenu}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { width: 140, p: 1 } }}
            >
                <MenuItem onClick={handleToggleEstado} sx={{ color: 'error.main' }}>
                    <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>Nuevo Alias</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3} mt={1}>
                        <TextField
                            fullWidth
                            label="Alias"
                            value={nuevoAlias.alias}
                            onChange={(e) => setNuevoAlias({ ...nuevoAlias, alias: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Usuario Responsable"
                            value={nuevoAlias.id_usuario}
                            onChange={(e) => setNuevoAlias({ ...nuevoAlias, id_usuario: e.target.value })}
                        >
                            {usuariosList.map((usuario) => (
                                <MenuItem key={usuario.id} value={usuario.id}>
                                    {usuario.email}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cancelar</Button>
                    <Button variant="contained" onClick={handleGuardar}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </DashboardContent>
    );
}