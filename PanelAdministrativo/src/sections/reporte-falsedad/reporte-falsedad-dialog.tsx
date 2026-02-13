import type { ReporteFalsedad } from 'src/services/reporte-falsedad-api';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  reporte?: ReporteFalsedad | null;
  onClose: () => void;
  onSave: (data: {
    denunciaId?: number;
    usuarioId?: number;
    motivo?: string;
    creadoEn: string;
  }) => Promise<void>;
};

export function ReporteFalsedadDialog({ open, mode, reporte, onClose, onSave }: Props) {
  const [denunciaId, setDenunciaId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [creadoEn, setCreadoEn] = useState('');

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit' && reporte) {
      setMotivo(reporte.motivo ?? '');
      setCreadoEn(reporte.creadoEn ?? '');
    } else {
      setDenunciaId('');
      setUsuarioId('');
      setMotivo('');
      setCreadoEn('');
    }
  }, [open, mode, reporte]);

  const handleSubmit = async () => {
    await onSave({
      denunciaId: denunciaId ? Number(denunciaId) : undefined,
      usuarioId: usuarioId ? Number(usuarioId) : undefined,
      motivo,
      creadoEn,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {mode === 'create' && (
            <>
              <TextField label="Denuncia ID" value={denunciaId} onChange={(e) => setDenunciaId(e.target.value)} type="number" />
              <TextField label="Usuario ID" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} type="number" />
            </>
          )}

          <TextField label="Motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} />

          <TextField
            type="date"
            label="Fecha"
            InputLabelProps={{ shrink: true }}
            value={creadoEn}
            onChange={(e) => setCreadoEn(e.target.value)}
          />
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
