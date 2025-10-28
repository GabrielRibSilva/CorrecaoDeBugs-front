import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DepartamentoService } from '../../services/departamento.service';
import { DepartamentoResponse } from '../../models/departamentoResponse';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-departamento-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './departamento-list.component.html',
})
export class DepartamentoListComponent implements OnInit {
  departamentos: DepartamentoResponse[] = [];
  carregando = false;

  constructor(
    private service: DepartamentoService,
    private msg: MessageService,
    private confirm: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.service.listarTodos().subscribe({
      next: (lista) => {
        this.departamentos = lista;
        this.carregando = false;
      },
      error: (err) => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar departamentos' });
        console.error(err);
        this.carregando = false;
      }
    });
  }

  novo(): void {
    this.router.navigate(['/departamentos/novo']);
  }

  editar(id: number): void {
    this.router.navigate(['/departamentos', id]);
  }

  confirmarInativacao(depto: DepartamentoResponse): void {
    this.confirm.confirm({
      message: `Confirma inativar o departamento ${depto.nome}?`,
      header: 'Confirmar Inativação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => this.inativar(depto.id)
    });
  }

  private inativar(id: number): void {
    this.carregando = true;
    this.service.inativar(id).subscribe({
      next: () => {
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Departamento inativado' });
        this.carregar();
      },
      error: (err) => {
        const detail = err?.error?.message || 'Não foi possível inativar o departamento.';
        this.msg.add({ severity: 'error', summary: 'Erro', detail: detail });
        console.error(err);
        this.carregando = false;
      }
    });
  }
}
