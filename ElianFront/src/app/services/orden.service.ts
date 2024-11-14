// src/app/services/orden.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  private apiUrl = 'http://localhost:3000/api/ordenes';

  constructor(private http: HttpClient) { }

  crearOrden(orden: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orden);
  }

  obtenerOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  obtenerOrden(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarOrden(id: number, orden: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, orden);
  }

  eliminarOrden(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
