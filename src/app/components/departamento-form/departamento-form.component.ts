import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DepartamentoService } from '../../services/departamento.service';
import { DepartamentoRequest } from '../../models/departamentoRequest';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CanComponentDeactivate } from '../../guards/unsaved-changes.guard';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    InputTextModule, ButtonModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './departamento-form.component.html',
})
export class DepartamentoFormComponent implements OnInit, CanComponentDeactivate {
  id: number | null = null;
  isEdicao = false;
  carregando = this.service.loading;

  departamento: DepartamentoRequest = {
    nome: '',
    sigla: ''
  };

  private initialDepartamentoJson: string = '';

  constructor(
    private service: DepartamentoService,
    private route: ActivatedRoute,
    private router: Router,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdicao = true;
      this.id = Number(paramId);
      this.carregarDepartamento(this.id);
    } else {
      this.initialDepartamentoJson = JSON.stringify(this.departamento);
    }
  }

  canDeactivate(): boolean {
    if (JSON.stringify(this.departamento) !== this.initialDepartamentoJson) {
      return false;
    }
    return true;
  }

  private carregarDepartamento(id: number): void {
    this.carregando.set(true);
    this.service.buscarPorId(id).subscribe({
      next: (d) => {
        this.departamento = { nome: d.nome, sigla: d.sigla };
        this.initialDepartamentoJson = JSON.stringify(this.departamento);
        this.carregando.set(false);
      },
      error: (err) => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Departamento não encontrado' });
        console.error(err);
        this.carregando.set(false);
        this.router.navigate(['/departamentos']);
      }
    });
  }

  salvar(): void {
    if (!this.validarCampos()) return;

    this.carregando.set(true);
    const request = { ...this.departamento };

    const operation = this.isEdicao && this.id
      ? this.service.atualizar(this.id, request)
      : this.service.criar(request);

    operation.subscribe({
      next: () => {
        const detail = this.isEdicao ? 'Departamento atualizado' : 'Departamento cadastrado';
        this.msg.add({ severity: 'success', summary: 'Sucesso', detail: detail });

        this.initialDepartamentoJson = JSON.stringify(this.departamento);

        this.carregando.set(false);
        setTimeout(() => this.router.navigate(['/departamentos']), 1000);
      },
      error: (err) => this.tratarErroHttp(err)
    });
  }

  limpar(): void {
    this.departamento = { nome: '', sigla: '' };
    this.initialDepartamentoJson = JSON.stringify(this.departamento);
  }

  private validarCampos(): boolean {
    const d = this.departamento;
    if (!d.nome || d.nome.trim().length < 3) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Nome deve ter pelo menos 3 caracteres' });
      return false;
    }
    if (!d.sigla || d.sigla.trim().length === 0 || d.sigla.trim().length > 10) {
       this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Sigla é obrigatória e deve ter no máximo 10 caracteres' });
       return false;
    }
    return true;
  }

  private tratarErroHttp(err: any): void {
    this.carregando.set(false);
    const status = err?.status;
    let detail = 'Falha ao salvar departamento';

    if (status === 409) {
      detail = err?.error?.message || 'Nome de departamento já cadastrado';
    } else if (status === 400) {
      detail = err?.error?.message || 'Dados inválidos ou violação de regra';
    }

    this.msg.add({ severity: 'error', summary: 'Erro', detail: detail });
    console.error(err);
  }
}
