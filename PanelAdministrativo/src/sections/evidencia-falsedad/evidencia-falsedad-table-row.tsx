import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type EvidenciaFalsedadRow = {
  id: string;
  tipo: string;
  url: string;
  creadoEn: string;
  reporteId: string;
};

type Props = {
  row: EvidenciaFalsedadRow;
  selected: boolean;
  onSelectRow: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function EvidenciaFalsedadTableRow({
  row,
  selected,
  onSelectRow,
  onEdit,
  onDelete,
}: Props) {
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>

      <TableCell align="center">{row.id}</TableCell>
      <TableCell>{row.tipo}</TableCell>
      <TableCell>{row.url}</TableCell>
      <TableCell align="center">{row.reporteId}</TableCell>
      <TableCell align="center">{row.creadoEn}</TableCell>

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
