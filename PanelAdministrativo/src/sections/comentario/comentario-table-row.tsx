// src/sections/comentario/comentario-table-row.tsx

import { useState, useCallback } from 'react';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ComentarioProps = {
  id: string;
  contenido: string;
  denunciaId: string;
  aliasId: string;
  creadoEn: string;
};

type ComentarioTableRowProps = {
  row: ComentarioProps;
  selected: boolean;
  onSelectRow: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ComentarioTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
}: ComentarioTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    onEdit?.();
  }, [onEdit, handleClosePopover]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    onDelete?.();
  }, [onDelete, handleClosePopover]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell align="center">{row.id}</TableCell>

        {/* Truncamos el contenido largo para que no rompa la tabla */}
        <TableCell>
          {row.contenido.length > 80
            ? `${row.contenido.substring(0, 80)}...`
            : row.contenido}
        </TableCell>

        <TableCell align="center">{row.denunciaId}</TableCell>
        <TableCell align="center">{row.aliasId}</TableCell>
        <TableCell align="center">
          {row.creadoEn
            ? new Date(row.creadoEn).toLocaleDateString('es-PE')
            : '—'}
        </TableCell>

        <TableCell align="center">
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
            width: 140,
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
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Eliminar
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}