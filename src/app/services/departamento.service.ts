import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DepartamentoResponse } from "../models/departamentoResponse";
import { DepartamentoRequest } from "../models/departamentoRequest";

@Injectable({ providedIn: 'root' })
export class DepartamentoService {
  private readonly baseUrl = `${environment.apiUrl}/departamentos`;
  loading = signal(false);

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<DepartamentoResponse[]> {
    return this.http.get<DepartamentoResponse[]>(this.baseUrl);
  }

  listarAtivos(): Observable<DepartamentoResponse[]> {
    return this.http.get<DepartamentoResponse[]>(`${this.baseUrl}/ativos`);
  }

  buscarPorId(id: number): Observable<DepartamentoResponse> {
    return this.http.get<DepartamentoResponse>(`${this.baseUrl}/${id}`);
  }

  criar(req: DepartamentoRequest): Observable<DepartamentoResponse> {
    return this.http.post<DepartamentoResponse>(this.baseUrl, req);
  }

  atualizar(id: number, req: DepartamentoRequest): Observable<DepartamentoResponse> {
    return this.http.put<DepartamentoResponse>(`${this.baseUrl}/${id}`, req);
  }

  inativar(id: number): Observable<DepartamentoResponse> {
    return this.http.patch<DepartamentoResponse>(`${this.baseUrl}/${id}/inativar`, {});
  }
}
