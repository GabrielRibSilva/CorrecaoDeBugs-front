import { Routes } from '@angular/router';
import { FuncionarioListComponent } from "./components/funcionario-list/funcionario-list.component";
import { FuncionarioFormComponent } from "./components/funcionario-form/funcionario-form.component";
import { DepartamentoListComponent } from './components/departamento-list/departamento-list.component'; // NOVO
import { DepartamentoFormComponent } from './components/departamento-form/departamento-form.component'; // NOVO

export const routes: Routes = [
  { path: '', redirectTo: 'funcionarios', pathMatch: 'full' },
  { path: 'funcionarios', component: FuncionarioListComponent },
  { path: 'funcionarios/novo', component: FuncionarioFormComponent },
  { path: 'funcionarios/:id', component: FuncionarioFormComponent },

  { path: 'departamentos', component: DepartamentoListComponent },
  { path: 'departamentos/novo', component: DepartamentoFormComponent },
  { path: 'departamentos/:id', component: DepartamentoFormComponent },
];
