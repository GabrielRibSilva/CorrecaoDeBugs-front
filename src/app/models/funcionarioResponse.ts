export interface FuncionarioResponse {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  salario: number;
  dataAdmissao: string;
  ativo: boolean;
  departamentoId: number;
  departamentoNome: string;
  departamentoSigla: string;
}
