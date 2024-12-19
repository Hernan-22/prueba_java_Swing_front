import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.interface';
import { Familia } from '../models/familia.interface';
// Asegúrate de importar la interfaz correctamente

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrlList = 'http://localhost:8080/api/productos/list';
  private apiUrlSave= 'http://localhost:8080/api/productos/save';
  private apiUrlDelete= 'http://localhost:8080/api/productos';
  private apiUrlFamilias = 'http://localhost:8080/api/familias/list';
  private apiUrlActualizar = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrlList);
  }

  eliminarProducto(idProducto: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrlDelete}/${idProducto}`);
  }

  obtenerFamilias(): Observable<Familia[]> {
    return this.http.get<Familia[]>(this.apiUrlFamilias);
  }

  actualizarProducto(producto: Producto): Observable<void> {
    return this.http.put<void>(`${this.apiUrlActualizar}/${producto.idProducto}`, producto);
  }

  agregarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrlSave, producto);
  }
}

