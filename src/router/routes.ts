import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/InicioSesion.vue') }],
  },
  {
    path: '/PagPrincipal',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/PagPrincipal.vue') }],

  },
  {
    path: '/MostrarDatos',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/MostrarDatos.vue') }],

  }

  // Always leave this as last one,
  // but you can also remove it
  
];

export default routes;
