import { TeamNavigation, INavigation } from 'projects/core/src/public_api';

export const AppNavigation: INavigation[] = [
  {
    title: 'Authentications (Public)',
    children: [
      {
        title: 'Login',
        link: '/login',
        type: 'PUBLIC',
      },
      {
        title: 'Signup',
        link: '/signup',
        type: 'PUBLIC',
      },
      {
        title: 'Reset password',
        link: '/reset-password',
        type: 'PUBLIC',
      },
      {
        title: 'Forgot password',
        link: '/forgot-password',
        type: 'PUBLIC',
      },
    ],
  },
  ...TeamNavigation,
  {
    type: 'AngularRouter',
    title: 'Developer',
    link: '/developer',
  },
];