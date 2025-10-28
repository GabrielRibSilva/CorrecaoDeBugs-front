export interface FuncionarioRequest {
  nome: string;
  email: string;
  cargo: string;
  salario: number;
  dataAdmissao: string; // ISO
  departamentoId: number;
}
