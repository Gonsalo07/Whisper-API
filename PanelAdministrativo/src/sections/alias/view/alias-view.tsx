import { useState, useEffect, useCallback } from 'react'; // [1] Agregado useCallback

import {
    Box, Card, Table, Button, Avatar, Dialog, TableRow, TableBody, TableCell,
    TableHead, Typography, IconButton, TableContainer, TextField, MenuItem,
    DialogTitle, DialogContent, DialogActions, InputAdornment // [2] Agregado InputAdornment
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

export function AliasView() {
    // Definimos los estados con tipos explícitos para que VS Code no marque error en .map()
    const [aliasList, setAliasList] = useState<any[]>([]); 
    const [usuariosList, setUsuariosList] = useState<any[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [filterName, setFilterName] = useState('');
    const [nuevoAlias, setNuevoAlias] = useState({ alias: '', id_usuario: '' });

    // 1. Función de carga envuelta en useCallback para evitar el error de dependencia en useEffect
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
                setAliasList(data || []); // [3] data || [] resuelve el error visual de tipo
            }
        } catch (err) {
            console.error('Error cargando alias:', err);
            setAliasList([]);
        }
    }, []);

    useEffect(() => {
        fetchAlias();

        fetch('http://localhost:9090/api/usuarios')
            .then((res) => res.json())
            .then((data) => setUsuariosList(data || []))
            .catch((err) => console.error('Error cargando usuarios:', err));
    }, [fetchAlias]); // Ahora VS Code está feliz con esta dependencia

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFilterName(value);
        fetchAlias(value);
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
                        }}
                    />
                </Box>

                <Scrollbar>
                    <TableContainer>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Usuario</TableCell>
                                    <TableCell>Alias</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {aliasList.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <Avatar alt={row.usuarioId?.email} />
                                                {row.usuarioId?.email || 'N/A'}
                                            </Box>
                                        </TableCell>
                                        <TableCell><strong>{row.alias}</strong></TableCell>
                                        <TableCell align="right">
                                            <IconButton color="error">
                                                <Iconify icon="solar:trash-bin-trash-bold" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>

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