import type { Usuario } from 'src/services/usuario-api';
import type { SelectChangeEvent } from '@mui/material/Select';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UserDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  usuario?: Usuario | null;
  onClose: () => void;
  onSave: (usuario: {
    email: string;
    password?: string;
    rol: string;
    estado: 'ACTIVO' | 'INACTIVO';
  }) => Promise<void>;
};

export function UserDialog({ open, mode, usuario, onClose, onSave }: UserDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<'USUARIO' | 'ADMINISTRADOR'>('USUARIO');
  const [estado, setEstado] = useState<'ACTIVO' | 'INACTIVO'>('ACTIVO');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && usuario) {
        setEmail(usuario.email || '');
        setPassword(usuario.password || ''); // No mostrar password existente por seguridad
        setRol((usuario.rol as 'USUARIO' | 'ADMINISTRADOR') || 'USUARIO');
        setEstado(usuario.estado || 'ACTIVO');
      } else {
        setEmail('');
        setPassword('');
        setRol('USUARIO');
        setEstado('ACTIVO');
      }
      setError(null);
      setShowPassword(false);
    }
  }, [open, mode, usuario]);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    // Validación de password: requerido en creación, opcional en edición
    if (mode === 'create' && !password.trim()) {
      setError('La contraseña es requerida');
      return;
    }

    // Validación de longitud mínima de password
    if (password.trim() && password.trim().length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const usuarioData: {
        email: string;
        password?: string;
        rol: string;
        estado: 'ACTIVO' | 'INACTIVO';
      } = {
        email: email.trim(),
        rol,
        estado,
      };

      // Solo agregar password si se proporcionó uno (requerido en creación, opcional en edición)
      if (password.trim()) {
        usuarioData.password = password.trim();
      }

      await onSave(usuarioData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar usuario');
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
      <DialogTitle>{mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}</DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            error={!!error && error.includes('email')}
            disabled={loading || mode === 'edit'}
            helperText={mode === 'edit' ? 'El email no se puede modificar' : undefined}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />

          <TextField
            fullWidth
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            error={!!error && error.includes('contraseña')}
            disabled={loading}
            helperText={
              mode === 'edit'
                ? 'Dejar en blanco para mantener la contraseña actual'
                : error && error.includes('contraseña')
                  ? error
                  : undefined
            }
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      <Iconify
                        icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel shrink>Rol</InputLabel>
            <Select
              value={rol}
              onChange={(e: SelectChangeEvent<'USUARIO' | 'ADMINISTRADOR'>) => {
                setRol(e.target.value as 'USUARIO' | 'ADMINISTRADOR');
                setError(null);
              }}
              disabled={loading}
            >
              <MenuItem value="USUARIO">Usuario</MenuItem>
              <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel shrink>Estado</InputLabel>
            <Select
              value={estado}
              onChange={(e: SelectChangeEvent<'ACTIVO' | 'INACTIVO'>) => {
                setEstado(e.target.value as 'ACTIVO' | 'INACTIVO');
                setError(null);
              }}
              disabled={loading}
            >
              <MenuItem value="ACTIVO">Activo</MenuItem>
              <MenuItem value="INACTIVO">Inactivo</MenuItem>
            </Select>
          </FormControl>

          {error && !error.includes('email') && !error.includes('contraseña') && (
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
