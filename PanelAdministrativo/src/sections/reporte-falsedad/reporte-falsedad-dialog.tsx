// src/sections/reporte-falsedad/reporte-falsedad-dialog.tsx

import type { ReporteFalsedad } from 'src/services/reporte-falsedad-api';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  reporte?: ReporteFalsedad | null;
  onClose: () => void;
  onSave: (data: {
    denunciaId?: number;
    usuarioId?: number;
    motivo: string;
  }) => Promise<void>;
};

export function ReporteFalsedadDialog({ open, mode, reporte, onClose, onSave }: Props) {
  const [denunciaId, setDenunciaId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && reporte) {
      setMotivo(reporte.motivo ?? '');
    } else {
      setDenunciaId('');
      setUsuarioId('');
      setMotivo('');
    }
    setError(null);
  }, [open, mode, reporte]);

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      setError('El motivo es requerido');
      return;
    }
    if (mode === 'create') {
      if (!denunciaId || isNaN(Number(denunciaId))) {
        setError('El ID de denuncia es requerido');
        return;
      }
      if (!usuarioId || isNaN(Number(usuarioId))) {
        setError('El ID de usuario es requerido');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      await onSave({
        motivo: motivo.trim(),
        denunciaId: denunciaId ? Number(denunciaId) : undefined,
        usuarioId: usuarioId ? Number(usuarioId) : undefined,
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
      <DialogTitle>
        {mode === 'create' ? 'Nuevo Reporte de Falsedad' : 'Editar Reporte de Falsedad'}
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {mode === 'create' && (
            <>
              <TextField
                fullWidth
                label="ID de Denuncia"
                type="number"
                value={denunciaId}
                onChange={(e) => { setDenunciaId(e.target.value); setError(null); }}
                disabled={loading}
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                fullWidth
                label="ID de Usuario"
                type="number"
                value={usuarioId}
                onChange={(e) => { setUsuarioId(e.target.value); setError(null); }}
                disabled={loading}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Motivo"
            multiline
            rows={4}
            value={motivo}
            onChange={(e) => { setMotivo(e.target.value); setError(null); }}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {error && (
            <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>{error}</Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}