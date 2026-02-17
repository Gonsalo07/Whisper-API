// src/sections/evidencia-falsedad/evidencia-falsedad-dialog.tsx

import type { EvidenciaFalsedad } from 'src/services/evidencia-falsedad-api';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

const TIPOS = ['PDF', 'IMAGEN', 'VIDEO', 'AUDIO'];

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  evidencia?: EvidenciaFalsedad | null;
  onClose: () => void;
  onSave: (data: {
    tipo: string;
    url: string;
    reporteId?: number;
  }) => Promise<void>;
};

export function EvidenciaFalsedadDialog({ open, mode, evidencia, onClose, onSave }: Props) {
  const [tipo, setTipo] = useState('');
  const [url, setUrl] = useState('');
  const [reporteId, setReporteId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && evidencia) {
      setTipo(evidencia.tipo ?? '');
      setUrl(evidencia.url ?? '');
      setReporteId(evidencia.reporteId?.id?.toString() ?? '');
    } else {
      setTipo('');
      setUrl('');
      setReporteId('');
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
    if (mode === 'create' && (!reporteId || isNaN(Number(reporteId)))) {
      setError('El ID de reporte es requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSave({
        tipo,
        url: url.trim(),
        reporteId: reporteId ? Number(reporteId) : undefined,
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
        {mode === 'create' ? 'Nueva Evidencia de Falsedad' : 'Editar Evidencia de Falsedad'}
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} pt={1}>
          {mode === 'create' && (
            <TextField
              fullWidth
              label="ID de Reporte"
              type="number"
              value={reporteId}
              onChange={(e) => { setReporteId(e.target.value); setError(null); }}
              disabled={loading}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}

          <TextField
            fullWidth
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => { setTipo(e.target.value); setError(null); }}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {TIPOS.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
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