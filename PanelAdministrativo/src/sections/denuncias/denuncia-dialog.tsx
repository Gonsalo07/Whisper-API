// src/sections/denuncia/denuncia-dialog.tsx

import type { Denuncia } from 'src/services/denuncia-api';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import {
  fetchUsuariosDropdown,
  fetchAliasDropdown,
  fetchCategoriasDropdown,
  type DropdownItem,
} from 'src/services/denuncia-api';

// ----------------------------------------------------------------------

const ESTADOS = [
  { value: 'EN_EVALUACION', label: 'En Evaluación' },
  { value: 'CUESTIONADA', label: 'Cuestionada' },
  { value: 'CONSISTENTE', label: 'Consistente' },
];

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  denuncia?: Denuncia | null;
  onClose: () => void;
  onSave: (data: {
    usuarioId?: number;
    aliasId?: number;
    categoriaId?: number;
    titulo: string;
    descripcion: string;
    estado?: string;
  }) => Promise<void>;
};

export function DenunciaDialog({ open, mode, denuncia, onClose, onSave }: Props) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('EN_EVALUACION');
  const [usuarioId, setUsuarioId] = useState<number | ''>('');
  const [aliasId, setAliasId] = useState<number | ''>('');
  const [categoriaId, setCategoriaId] = useState<number | ''>('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dropdowns
  const [usuarios, setUsuarios] = useState<DropdownItem[]>([]);
  const [alias, setAlias] = useState<DropdownItem[]>([]);
  const [categorias, setCategorias] = useState<DropdownItem[]>([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(false);

  // Cargar dropdowns al abrir el diálogo
  useEffect(() => {
    if (!open) return;

    const cargarDropdowns = async () => {
      try {
        setLoadingDropdowns(true);
        const [usuariosData, aliasData, categoriasData] = await Promise.all([
          fetchUsuariosDropdown(),
          fetchAliasDropdown(),
          fetchCategoriasDropdown(),
        ]);
        setUsuarios(usuariosData);
        setAlias(aliasData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error('Error al cargar dropdowns:', err);
        setError('No se pudieron cargar los datos necesarios');
      } finally {
        setLoadingDropdowns(false);
      }
    };

    cargarDropdowns();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && denuncia) {
      setTitulo(denuncia.titulo ?? '');
      setDescripcion(denuncia.descripcion ?? '');
      setEstado(denuncia.estado ?? 'EN_EVALUACION');
      setUsuarioId(denuncia.usuarioId?.id ?? '');
      setAliasId(denuncia.aliasId?.id ?? '');
      setCategoriaId(denuncia.categoriaId?.id ?? '');
    } else {
      setTitulo('');
      setDescripcion('');
      setEstado('EN_EVALUACION');
      setUsuarioId('');
      setAliasId('');
      setCategoriaId('');
    }
    setError(null);
  }, [open, mode, denuncia]);

  const handleSubmit = async () => {
    if (!titulo.trim()) {
      setError('El título es requerido');
      return;
    }
    if (!descripcion.trim()) {
      setError('La descripción es requerida');
      return;
    }
    if (mode === 'create') {
      if (!usuarioId || !aliasId || !categoriaId) {
        setError('Todos los campos son requeridos');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      await onSave({
        usuarioId: usuarioId ? Number(usuarioId) : undefined,
        aliasId: aliasId ? Number(aliasId) : undefined,
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        estado,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{mode === 'create' ? 'Nueva Denuncia' : 'Editar Denuncia'}</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {mode === 'create' && (
            <>
              <TextField
                fullWidth
                select
                label="Usuario"
                value={usuarioId}
                onChange={(e) => {
                  setUsuarioId(Number(e.target.value));
                  setError(null);
                }}
                disabled={loading || loadingDropdowns}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {loadingDropdowns ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Cargando...
                  </MenuItem>
                ) : usuarios.length === 0 ? (
                  <MenuItem disabled>No hay usuarios disponibles</MenuItem>
                ) : (
                  usuarios.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.label}
                    </MenuItem>
                  ))
                )}
              </TextField>

              <TextField
                fullWidth
                select
                label="Alias"
                value={aliasId}
                onChange={(e) => {
                  setAliasId(Number(e.target.value));
                  setError(null);
                }}
                disabled={loading || loadingDropdowns}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {loadingDropdowns ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Cargando...
                  </MenuItem>
                ) : alias.length === 0 ? (
                  <MenuItem disabled>No hay alias disponibles</MenuItem>
                ) : (
                  alias.map((a) => (
                    <MenuItem key={a.id} value={a.id}>
                      {a.label}
                    </MenuItem>
                  ))
                )}
              </TextField>

              <TextField
                fullWidth
                select
                label="Categoría"
                value={categoriaId}
                onChange={(e) => {
                  setCategoriaId(Number(e.target.value));
                  setError(null);
                }}
                disabled={loading || loadingDropdowns}
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {loadingDropdowns ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Cargando...
                  </MenuItem>
                ) : categorias.length === 0 ? (
                  <MenuItem disabled>No hay categorías disponibles</MenuItem>
                ) : (
                  categorias.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.label}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </>
          )}

          <TextField
            fullWidth
            label="Título"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              setError(null);
            }}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="Título breve de la denuncia"
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descripción"
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value);
              setError(null);
            }}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="Descripción detallada de la denuncia"
          />

          {mode === 'edit' && (
            <TextField
              fullWidth
              select
              label="Estado"
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value);
                setError(null);
              }}
              disabled={loading}
              slotProps={{ inputLabel: { shrink: true } }}
            >
              {ESTADOS.map((e) => (
                <MenuItem key={e.value} value={e.value}>
                  {e.label}
                </MenuItem>
              ))}
            </TextField>
          )}

          {error && <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>{error}</Box>}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
