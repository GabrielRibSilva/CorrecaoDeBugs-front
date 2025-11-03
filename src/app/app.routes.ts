import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { authGuard } from './guards/auth.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

import { FuncionarioListComponent } from "./components/funcionario-list/funcionario-list.component";
import { FuncionarioFormComponent } from "./components/funcionario-form/funcionario-form.component";
import { DepartamentoListComponent } from './components/departamento-list/departamento-list.component';
import { DepartamentoFormComponent } from './components/departamento-form/departamento-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      { path: 'departamentos', component: DepartamentoListComponent },
      {
        path: 'departamentos/novo',
        component: DepartamentoFormComponent,
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: 'departamentos/:id',
        component: DepartamentoFormComponent,
        canDeactivate: [unsavedChangesGuard]
      },
      { path: 'funcionarios', component: FuncionarioListComponent },
      {
        path: 'funcionarios/novo',
        component: FuncionarioFormComponent,
        canDeactivate: [unsavedChangesGuard]
      },
      {
        path: 'funcionarios/:id',
        component: FuncionarioFormComponent,
        canDeactivate: [unsavedChangesGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
