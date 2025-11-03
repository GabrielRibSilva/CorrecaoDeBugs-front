import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FuncionarioService } from '../../services/funcionario.service';
import { MessageService } from 'primeng/api';
import { DepartamentoService } from '../../services/departamento.service';
import { DepartamentoResponse } from '../../models/departamentoResponse';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FuncionarioRequest } from "../../models/funcionarioRequest";
import { DropdownModule } from 'primeng/dropdown';

import { CanComponentDeactivate } from '../../guards/unsaved-changes.guard';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    InputTextModule, InputNumberModule, CalendarModule, ButtonModule, ToastModule, DropdownModule
  ],
  templateUrl: './funcionario-form.component.html',
  styleUrls: ['./funcionario-form.component.css']
})
export class FuncionarioFormComponent implements OnInit, CanComponentDeactivate {
  id: number | null = null;
  isEdicao = false;
  carregando = this.service.loading;
  carregandoDeptos = signal(false);

  funcionario: FuncionarioRequest = {
    nome: '',
    email: '',
    cargo: '',
    salario: 0,
    dataAdmissao: this.hojeISO(),
    departamentoId: 0
  };
  toDate: Date = new Date();

  private initialFuncionarioJson: string = '';

  departamentos: DepartamentoResponse[] = [];

  constructor(
    private service: FuncionarioService,
    private deptoService: DepartamentoService,
    private route: ActivatedRoute,
    private router: Router,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarDepartamentos();
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.isEdicao = true;
      this.id = Number(paramId);
      this.carregarFuncionario(this.id);
    } else {
      this.initialFuncionarioJson = JSON.stringify(this.funcionario);
    }
  }

  canDeactivate(): boolean {
    if (JSON.stringify(this.funcionario) !== this.initialFuncionarioJson) {
      return false;
    }
    return true;
  }

  private hojeISO(): string {
    return new Date().toISOString().substring(0, 10);
  }

  private carregarDepartamentos(): void {
    this.carregandoDeptos.set(true);
    this.deptoService.listarAtivos().subscribe({
      next: (lista) => {
        this.departamentos = lista;
        this.carregandoDeptos.set(false);
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar departamentos' });
        this.carregandoDeptos.set(false);
      }
    });
  }

  private carregarFuncionario(id: number): void {
    this.service.loading.set(true);
    this.service.buscarPorId(id).subscribe({
      next: (f) => {
        this.funcionario = {
          nome: f.nome,
          email: f.email,
          cargo: f.cargo,
          salario: f.salario,
          dataAdmissao: f.dataAdmissao,
          departamentoId: f.departamentoId
        };
        this.initialFuncionarioJson = JSON.stringify(this.funcionario);
        this.service.loading.set(false);
      },
      error: () => {
        this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Funcionário não encontrado' });
        this.service.loading.set(false);
        this.router.navigate(['/funcionarios']);
      }
    });
  }

  salvar(): void {
    if (!this.validarCampos()) return;

    this.service.loading.set(true);
    if (this.isEdicao && this.id) {
      this.service.atualizar(this.id, this.funcionario).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário atualizado' });
          this.initialFuncionarioJson = JSON.stringify(this.funcionario);
          this.service.loading.set(false);
          this.router.navigate(['/funcionarios']);
        },
        error: (err) => this.tratarErroHttp(err)
      });
    } else {
      this.service.criar(this.funcionario).subscribe({
        next: () => {
          this.msg.add({ severity: 'success', summary: 'Sucesso', detail: 'Funcionário cadastrado' });
          this.initialFuncionarioJson = JSON.stringify(this.funcionario);
          this.service.loading.set(false);
          this.router.navigate(['/funcionarios']);
        },
        error: (err) => this.tratarErroHttp(err)
      });
    }
  }

  limpar(): void {
    this.funcionario = {
      nome: '',
      email: '',
      cargo: '',
      salario: 0,
      dataAdmissao: this.hojeISO(),
      departamentoId: 0
    };
    this.initialFuncionarioJson = JSON.stringify(this.funcionario);
  }

  private validarCampos(): boolean {
    const f = this.funcionario;

    if (!f.nome || f.nome.trim().length < 3) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Nome deve ter pelo menos 3 caracteres' });
      return false;
    }

    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'E-mail inválido' });
      return false;
    }

    if (!f.cargo || f.cargo.trim() === '') {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Cargo é obrigatório' });
      return false;
    }

    if (f.salario <= 0) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Salário deve ser maior que zero' });
      return false;
    }

    if (!f.dataAdmissao || f.dataAdmissao > this.hojeISO()) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Data de admissão inválida' });
      return false;
    }
    if (!f.departamentoId || f.departamentoId <= 0) {
      this.msg.add({ severity: 'warn', summary: 'Validação', detail: 'Departamento é obrigatório' });
      return false;
    }

    return true;
  }

  private tratarErroHttp(err: any) {
    this.service.loading.set(false);
    const status = err?.status;
    if (status === 409) {
      this.msg.add({ severity: 'warn', summary: 'Conflito', detail: 'E-mail já cadastrado' });
    } else if (status === 400) {
      this.msg.add({ severity: 'warn', summary: 'Regras', detail: err?.error?.message || 'Violação de regra de negócio' });
    } else {
      this.msg.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar' });
    }
  }
}
