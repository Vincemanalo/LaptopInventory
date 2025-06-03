import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MainLayoutComponent } from './core/main-layout/main-layout.component';
import { LaptopComponent } from './features/laptop/laptop.component';
import { UserManagementComponent } from './features/usermanagement/usermanagement.component';
import { DesktopComponent } from './features/desktop/desktop.component';
import { ServerComponent } from './features/server/server.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'main',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'laptop', component: LaptopComponent},
      { path: 'user-management', component: UserManagementComponent},
      { path: 'desktop', component: DesktopComponent},
      { path: 'server', component: ServerComponent  },
    ],
  },
];


