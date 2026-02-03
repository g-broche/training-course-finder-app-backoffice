import { Routes } from '@angular/router';
import { LoginComponent } from './layouts/auth/login/login.component';
import { AnnouncesIndexLayoutComponent } from './layouts/announces/index/announce-index-layout.component';
import { AnnounceDetailsLayoutComponent } from './layouts/announces/details/announce-details-layout.component';
import { DiscussionsIndexComponent } from './layouts/discussions/index/announce-index.component';
import { authGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'announces',
    component: AnnouncesIndexLayoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'announces/:id',
    component: AnnounceDetailsLayoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'discussions',
    component: DiscussionsIndexComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/announces',
    pathMatch: 'full'
  }
];
