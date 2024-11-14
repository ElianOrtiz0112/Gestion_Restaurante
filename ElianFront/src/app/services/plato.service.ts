// src/app/services/plato.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlatoService {
  private apiUrl = 'http://localhost:3000/api/platos';

  constructor(private http: HttpClient) { }

  crearPlato(plato: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, plato);
  }

  obtenerPlatos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerPlato(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarPlato(id: number, plato: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, plato);
  }

  eliminarPlato(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
