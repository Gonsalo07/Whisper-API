import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

export type ReporteFalsedadRow = {
  id: string;
  denunciaId: string;
  usuarioId: string;
  motivo: string;
  creadoEn: string;
  estado: string;
};

type Props = {
  row: ReporteFalsedadRow;
  onEdit: () => void;
  onDelete: () => void;
};

export function ReporteFalsedadTableRow({ row, onEdit, onDelete }: Props) {
  return (
    <TableRow hover>
      {/* El orden de las celdas debe coincidir EXACTAMENTE con headLabel en la vista */}
      <TableCell align="center">{row.id}</TableCell>
      <TableCell align="center">{row.denunciaId}</TableCell>
      <TableCell align="center">{row.usuarioId}</TableCell>
      <TableCell>{row.motivo}</TableCell>
      <TableCell align="center">{row.creadoEn}</TableCell>
      <TableCell align="center">
        <Label color={row.estado === 'VISIBLE' ? 'success' : 'error'}>
          {row.estado}
        </Label>
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={onEdit}>
          <Iconify icon="solar:pen-bold" />
        </IconButton>
        <IconButton color="error" onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}