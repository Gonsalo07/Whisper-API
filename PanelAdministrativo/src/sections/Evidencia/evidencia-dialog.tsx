// src/sections/evidencia/evidencia-dialog.tsx

import type { Evidencia } from 'src/services/evidencia-api';

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

import { fetchDenunciasDropdown, type DenunciaDropdown } from 'src/services/evidencia-api';

// ----------------------------------------------------------------------

const TIPOS = ['PDF', 'IMAGEN', 'VIDEO', 'AUDIO'];

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  evidencia?: Evidencia | null;
  onClose: () => void;
  onSave: (data: { tipo: string; url: string; denunciaId?: number }) => Promise<void>;
};

export function EvidenciaDialog({ open, mode, evidencia, onClose, onSave }: Props) {
  const [tipo, setTipo] = useState('');
  const [url, setUrl] = useState('');
  const [denunciaId, setDenunciaId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Para el dropdown
  const [denuncias, setDenuncias] = useState<DenunciaDropdown[]>([]);
  const [loadingDenuncias, setLoadingDenuncias] = useState(false);

  // Cargar denuncias al abrir el diálogo
  useEffect(() => {
    if (!open) return;

    const cargarDenuncias = async () => {
      try {
        setLoadingDenuncias(true);
        const data = await fetchDenunciasDropdown();
        setDenuncias(data);
      } catch (err) {
        console.error('Error al cargar denuncias:', err);
        setError('No se pudieron cargar las denuncias');
      } finally {
        setLoadingDenuncias(false);
      }
    };

    cargarDenuncias();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && evidencia) {
      setTipo(evidencia.tipo ?? '');
      setUrl(evidencia.url ?? '');
      setDenunciaId(evidencia.denunciaId?.id ?? '');
    } else {
      setTipo('');
      setUrl('');
      setDenunciaId('');
    }
    setError(null);
  }, [open, mode, evidencia]);

  const handleSubmit = async () => {
    if (!tipo) {
      setError('El tipo es requerido');
      return;
    }
    if (!url.trim()) {
      setError('La URL es requerida');
      return;
    }
    if (mode === 'create' && !denunciaId) {
      setError('La denuncia es requerida');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave({
        tipo,
        url: url.trim(),
        denunciaId: denunciaId ? Number(denunciaId) : undefined,
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
      <DialogTitle>{mode === 'create' ? 'Nueva Evidencia' : 'Editar Evidencia'}</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {mode === 'create' && (
            <TextField
              fullWidth
              select
              label="Denuncia"
              value={denunciaId}
              onChange={(e) => {
                setDenunciaId(Number(e.target.value));
                setError(null);
              }}
              disabled={loading || loadingDenuncias}
              slotProps={{ inputLabel: { shrink: true } }}
              helperText={loadingDenuncias ? 'Cargando denuncias...' : ''}
            >
              {loadingDenuncias ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Cargando...
                </MenuItem>
              ) : denuncias.length === 0 ? (
                <MenuItem disabled>No hay denuncias disponibles</MenuItem>
              ) : (
                denuncias.map((denuncia) => (
                  <MenuItem key={denuncia.id} value={denuncia.id}>
                    {denuncia.label}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}

          <TextField
            fullWidth
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => {
              setTipo(e.target.value);
              setError(null);
            }}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {TIPOS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder="https://ejemplo.com/archivo.pdf"
          />

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
