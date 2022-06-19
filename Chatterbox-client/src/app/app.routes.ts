import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
      path: 'chat',
      loadChildren: () => import('./chats/chats.module').then(m => m.ChatsModule)
    },
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {path: "", redirectTo:"/auth/login", pathMatch: "full"},
  ];
