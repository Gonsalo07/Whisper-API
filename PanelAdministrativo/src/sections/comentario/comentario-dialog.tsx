// src/sections/comentario/comentario-dialog.tsx

import type { Comentario } from 'src/services/comentario-api';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// ----------------------------------------------------------------------

type ComentarioDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  comentario?: Comentario | null;
  onClose: () => void;
  onSave: (data: {
    contenido: string;
    denunciaId?: number;
    aliasId?: number;
  }) => Promise<void>;
};

export function ComentarioDialog({
  open,
  mode,
  comentario,
  onClose,
  onSave,
}: ComentarioDialogProps) {
  const [contenido, setContenido] = useState('');
  const [denunciaId, setDenunciaId] = useState('');
  const [aliasId, setAliasId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cuando se abre el diálogo, cargamos los datos si estamos editando
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && comentario) {
        setContenido(comentario.contenido || '');
        setDenunciaId(comentario.denunciaId?.id?.toString() || '');
        setAliasId(comentario.aliasId?.id?.toString() || '');
      } else {
        // Limpiar formulario para nuevo comentario
        setContenido('');
        setDenunciaId('');
        setAliasId('');
      }
      setError(null);
    }
  }, [open, mode, comentario]);

  const handleSubmit = async () => {
    // Validaciones
    if (!contenido.trim()) {
      setError('El contenido es requerido');
      return;
    }
    if (mode === 'create') {
      if (!denunciaId || isNaN(Number(denunciaId))) {
        setError('El ID de denuncia es requerido y debe ser un número');
        return;
      }
      if (!aliasId || isNaN(Number(aliasId))) {
        setError('El ID de alias es requerido y debe ser un número');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      await onSave({
        contenido: contenido.trim(),
        denunciaId: denunciaId ? Number(denunciaId) : undefined,
        aliasId: aliasId ? Number(aliasId) : undefined,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar comentario');
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
        {mode === 'create' ? 'Nuevo Comentario' : 'Editar Comentario'}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>

          {/* Solo mostramos estos campos al crear — en edición solo se puede cambiar contenido */}
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
                label="ID de Alias Público"
                type="number"
                value={aliasId}
                onChange={(e) => { setAliasId(e.target.value); setError(null); }}
                disabled={loading}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Contenido"
            multiline
            rows={4}
            value={contenido}
            onChange={(e) => { setContenido(e.target.value); setError(null); }}
            disabled={loading}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          {error && (
            <Box sx={{ color: 'error.main', fontSize: '0.875rem', mt: -2 }}>
              {error}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}