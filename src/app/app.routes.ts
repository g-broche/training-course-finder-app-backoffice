import { Routes } from '@angular/router';
import { LoginComponent } from './layouts/auth/login/login.component';
import { AnnouncesIndexLayoutComponent } from './layouts/announces/index/announce-index-layout.component';
import { AnnounceDetailsLayoutComponent } from './layouts/announces/details/announce-details-layout.component';
import { DiscussionsIndexComponent } from './layouts/discussions/index/discussion-index.component';
import { DiscussionDetailsLayoutComponent } from './layouts/discussions/details/discussion-details-layout.component';
import { UsersIndexComponent } from './layouts/users/index/user-index.component';
import { UserDetailsLayoutComponent } from './layouts/users/details/user-details-layout.component';
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
    path: 'discussions/:id',
    component: DiscussionDetailsLayoutComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UsersIndexComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users/:displayName',
    component: UserDetailsLayoutComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: '/announces',
    pathMatch: 'full'
  }
];
