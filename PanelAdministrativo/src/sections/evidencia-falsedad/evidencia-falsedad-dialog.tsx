import type { EvidenciaFalsedad } from 'src/services/evidencia-falsedad-api';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const TIPOS = ['IMAGEN', 'VIDEO', 'DOCUMENTO'];

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  evidencia?: EvidenciaFalsedad | null;
  onClose: () => void;
  onSave: (data: {
    tipo: string;
    url: string;
    creadoEn: string;
    reporteId?: number;
  }) => Promise<void>;
};

export function EvidenciaFalsedadDialog({
  open,
  mode,
  evidencia,
  onClose,
  onSave,
}: Props) {
  const [tipo, setTipo] = useState('');
  const [url, setUrl] = useState('');
  const [creadoEn, setCreadoEn] = useState('');
  const [reporteId, setReporteId] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 🔥 Cargar datos al abrir el dialog
  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && evidencia) {
      setTipo(evidencia.tipo ?? '');
      setUrl(evidencia.url ?? '');

      // ✔ Soporta "yyyy-MM-dd" y "yyyy-MM-ddTHH:mm:ss"
      const fechaLimpia = evidencia.creadoEn
        ? evidencia.creadoEn.split('T')[0]
        : '';

      setCreadoEn(fechaLimpia);

      setReporteId(evidencia.reporteId?.id?.toString() ?? '');
    } else {
      setTipo('');
      setUrl('');
      setCreadoEn('');
      setReporteId('');
    }

    setError(null);
  }, [open, mode, evidencia]);

  const handleSubmit = async () => {
    if (!tipo) {
      setError('Tipo requerido');
      return;
    }

    if (!creadoEn) {
      setError('Fecha requerida');
      return;
    }

    if (mode === 'create' && !reporteId) {
      setError('Reporte requerido');
      return;
    }

    try {
      await onSave({
        tipo,
        url,
        creadoEn, // ✔ enviar directo como "yyyy-MM-dd"
        reporteId: reporteId ? Number(reporteId) : undefined,
      });
    } catch {
      setError('Error al guardar');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {mode === 'create' && (
            <TextField
              label="Reporte ID"
              value={reporteId}
              onChange={(e) => setReporteId(e.target.value)}
              type="number"
            />
          )}

          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            {TIPOS.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <TextField
            type="date"
            label="Fecha"
            InputLabelProps={{ shrink: true }}
            value={creadoEn}
            onChange={(e) => setCreadoEn(e.target.value)}
          />

          {error && <Box color="error.main">{error}</Box>}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
