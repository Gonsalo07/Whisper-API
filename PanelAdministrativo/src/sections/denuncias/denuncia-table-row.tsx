// src/sections/denuncia/denuncia-table-row.tsx

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useState } from 'react';

export type DenunciaRow = {
  id: string;
  titulo: string;
  descripcion: string;
  usuario: string;
  alias: string;
  categoria: string;
  estado: string;
  creadaEn: string;
};

type DenunciaTableRowProps = {
  row: DenunciaRow;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onChangeEstado: (nuevoEstado: string) => void;
};

export function DenunciaTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
  onChangeEstado,
}: DenunciaTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const getEstadoColor = (estado: string): 'warning' | 'error' | 'success' => {
    if (estado === 'EN_EVALUACION') return 'warning';
    if (estado === 'CUESTIONADA') return 'error';
    return 'success'; // CONSISTENTE
  };

  const getEstadoLabel = (estado: string): string => {
    if (estado === 'EN_EVALUACION') return 'En Evaluación';
    if (estado === 'CUESTIONADA') return 'Cuestionada';
    return 'Consistente';
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row.id}</TableCell>

        <TableCell>
          <Box
            sx={{
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row.titulo}
          </Box>
        </TableCell>

        <TableCell>
          <Box
            sx={{
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row.descripcion}
          </Box>
        </TableCell>

        <TableCell>{row.usuario}</TableCell>

        <TableCell>{row.alias}</TableCell>

        <TableCell>{row.categoria}</TableCell>

        <TableCell>
          <Label color={getEstadoColor(row.estado)}>{getEstadoLabel(row.estado)}</Label>
        </TableCell>

        <TableCell>{row.creadaEn}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 200,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleClosePopover();
              onEdit();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onChangeEstado('EN_EVALUACION');
            }}
            sx={{ color: 'warning.main' }}
          >
            <Iconify icon="solar:restart-bold" />
            En Evaluación
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onChangeEstado('CUESTIONADA');
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:eye-closed-bold" />
            Cuestionada
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onChangeEstado('CONSISTENTE');
            }}
            sx={{ color: 'success.main' }}
          >
            <Iconify icon="solar:eye-bold" />
            Consistente
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClosePopover();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
