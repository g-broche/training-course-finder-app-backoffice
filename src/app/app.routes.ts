import { Routes } from '@angular/router';
import { LoginComponent } from './layouts/auth/login/login.component';
import { AnnouncesIndexComponent } from './layouts/announces/index/index.component';
import { AnnounceDetailsComponent } from './layouts/announces/details/details.component';
import { authGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'announces',
    component: AnnouncesIndexComponent,
    canActivate: [authGuard]
  },
  {
    path: 'announces/:id',
    component: AnnounceDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/announces',
    pathMatch: 'full'
  }
];
