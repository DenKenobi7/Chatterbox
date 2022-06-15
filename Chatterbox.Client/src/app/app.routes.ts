import { Routes } from '@angular/router';

export const appRoutes: Routes = [
//    {
//      path: 'products',
//      loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
//    },
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {path: "", redirectTo:"/auth/login", pathMatch: "full"},
  ];
