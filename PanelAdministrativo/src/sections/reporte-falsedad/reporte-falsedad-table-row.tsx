import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

export type ReporteFalsedadRow = {
  id: string;
  denunciaId: string;
  usuarioId: string;
  motivo: string;
  creadoEn: string;
};

type Props = {
  row: ReporteFalsedadRow;
  onEdit: () => void;
  onDelete: () => void;
};

export function ReporteFalsedadTableRow({ row, onEdit, onDelete }: Props) {
  return (
    <TableRow hover>
      <TableCell>{row.id}</TableCell>
      <TableCell>{row.denunciaId}</TableCell>
      <TableCell>{row.usuarioId}</TableCell>
      <TableCell>{row.motivo}</TableCell>
      <TableCell>{row.creadoEn}</TableCell>

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
