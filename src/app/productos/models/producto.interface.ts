import { Familia } from "./familia.interface";

export interface Producto {
  idProducto: number|null;
  nombreProducto: string;
  precio: number|null;
  productosFamilias: Familia;
  idFamilia?: number;
}

