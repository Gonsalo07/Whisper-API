import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Estadisticas',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Usuarios     ',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Denuncias',
    path: '/denuncia',
    icon: icon('ic-cart'),
  },
  {
    title: 'Evidencias',
    path: '/evidencia',
    icon: icon('ic-cart'),
  },
  {
    title: 'Reportes de Falsos',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Alias Publicos',
<<<<<<< Updated upstream
    path: '/blog',
=======
    path: '/alias-publicos',
    icon: icon('ic-user'),
  },
  {
    title: 'Comentarios',
    path: '/comentario',
    icon: icon('ic-blog'),
  },
  {
    title: 'Evidencias Falsas',
    path: '/evidencia-falsedad',
    icon: icon('ic-blog'),
  },
  {
    title: 'Reportes Falsos',
    path: '/reporte-falsedad',
>>>>>>> Stashed changes
    icon: icon('ic-blog'),
  },
  {
    title: 'Ingresar',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic-disabled'),
  },
];
