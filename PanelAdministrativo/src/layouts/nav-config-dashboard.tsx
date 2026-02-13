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
    path: '/products',
    icon: icon('ic-cart'),
  },
  {
    title: 'Reportes de Falsos',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Alias Publicos',
    path: '/blog',
    icon: icon('ic-blog'),
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
