// src/app/productos/productos.component.ts
import { Component, OnInit } from '@angular/core';
import { Producto } from './models/producto.interface';
import { ProductosService } from './service/productos.service';
import Swal from 'sweetalert2';
import { Familia } from './models/familia.interface';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  familias: Familia[] = [];
  nuevoProducto: Producto = {
    idProducto: null, // O undefined
    nombreProducto: '',
    precio: null,
    productosFamilias: { idFamilia: 0, nombreFamilia: '' },
    //esto
    idFamilia: 0,
  };

  formVisible: boolean = false;
  submitted: boolean = false;
  isEditing: boolean = false;
  editMode: boolean = false;
  modal: Modal | null = null;
  // Producto seleccionado (para edición)
  selectedProducto: Producto | null = null;
  mostrarModalFlag: boolean = false;

  constructor(private productosService: ProductosService) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.obtenerFamilias();
  }

  cargarProductos(): void {
    this.productosService.getProductos().subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  obtenerFamilias(): void {
    this.productosService.obtenerFamilias().subscribe({
      next: (familias) => {
        this.familias = familias;
      },
      error: (err) => {
        console.error('Error al cargar las familias:', err);
      },
    });
  }

  mostrarModalNuevo(): void {
    this.editMode = false;
    this.isEditing = false;
    this.nuevoProducto = {
      idProducto: null,
      nombreProducto: '',
      precio: null,
      productosFamilias: { idFamilia: 0, nombreFamilia: '' },
    };
    this.selectedProducto = null;
    this.resetFormulario();
    this.abrirModal();
  }

  mostrarModalEditar(): void {
    if (this.selectedProducto) {
      this.editMode = true;
      this.nuevoProducto = { ...this.selectedProducto };
      console.log(this.nuevoProducto);
      this.submitted = false;
      this.abrirModal();
    }
  }

  abrirModal(): void {
    const modalElement = document.getElementById('productoModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
      this.modal.show();
    }
  }

  actualizarProducto(): void {
    this.nuevoProducto.idProducto = Number(this.nuevoProducto.idProducto);
    console.log(this.nuevoProducto);

    if (this.nuevoProducto.idProducto) {
      //y esto
      this.nuevoProducto.idFamilia = Number(
        this.nuevoProducto.productosFamilias.idFamilia
      );
      this.productosService
        .actualizarProducto(this.nuevoProducto)
        .subscribe(() => {
          const index = this.productos.findIndex(
            (producto) => producto.idProducto === this.nuevoProducto.idProducto
          );
          if (index !== -1) {
            this.productos[index] = { ...this.nuevoProducto };
          }
          this.cargarProductos();
          this.selectedProducto = null;
          this.closeModal();
          this.resetFormulario();
          this.submitted = false;
        });
    } else {
      console.error('El idProducto es null o undefined');
    }
  }

  editarProducto(producto: Producto) {
    this.selectedProducto = producto;
    this.nuevoProducto = { ...producto };
    this.mostrarModalFlag = true;
  }

  resetFormulario() {
    this.nuevoProducto = {
      idProducto: null,
      nombreProducto: '',
      precio: null,
      productosFamilias: { idFamilia: 0, nombreFamilia: '' },
    };
    this.submitted = false;
  }

  closeModal() {
    const modalElement = document.getElementById('productoModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide(); // Ocultar el modal
      }
      this.resetFormulario();
      this.submitted = false;
      this.editMode = false;
      this.selectedProducto = null;
    }
  }

  cancelar() {
    this.formVisible = false;
    this.nuevoProducto = {
      idProducto: null,
      nombreProducto: '',
      precio: null,
      productosFamilias: { idFamilia: 0, nombreFamilia: '' },
    };
    this.selectedProducto = null;
  }

  agregarProducto() {
    this.submitted = true;

    if (
      this.nuevoProducto.idProducto &&
      this.nuevoProducto.nombreProducto &&
      this.nuevoProducto.precio &&
      this.nuevoProducto.precio > 0 &&
      this.nuevoProducto.productosFamilias.idFamilia
    ) {
      this.nuevoProducto.precio = parseFloat(
        this.nuevoProducto.precio.toFixed(2) // Redondear a 2 decimales
      );

      if (this.isEditing) {
        const index = this.productos.findIndex(
          (p) => p.idProducto === this.nuevoProducto.idProducto
        );
        if (index > -1) {
          this.productos[index] = { ...this.nuevoProducto };
        }
      } else {
        //me hacia falta esto
        this.nuevoProducto.idFamilia = Number(
          this.nuevoProducto.productosFamilias.idFamilia
        );
        this.productosService.agregarProducto(this.nuevoProducto).subscribe({
          next: (producto) => {
            this.productos.push(producto);
            console.log('Producto agregado:', producto);
            this.closeModal();
            //
            this.resetFormulario();
            this.submitted = false;
          },
          error: (error) => {
            console.error('Error al agregar producto:', error);
          },
        });
      }
    } else {
      console.error(
        'Datos inválidos. Asegúrate de completar todos los campos correctamente.'
      );
    }
  }

  seleccionarProducto(producto: Producto) {
    this.selectedProducto = producto;
  }

  eliminarProductoo(): void {
    if (this.selectedProducto) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¡No podrás recuperar el producto "${this.selectedProducto.nombreProducto}"!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.productosService
            .eliminarProducto(this.selectedProducto!.idProducto ?? 0)
            .subscribe({
              next: () => {
                this.productos = this.productos.filter(
                  (producto) =>
                    producto.idProducto !== this.selectedProducto?.idProducto
                );
                this.selectedProducto = null; // Resetear selección
                Swal.fire(
                  'Eliminado',
                  'El producto ha sido eliminado.',
                  'success'
                ); // Mensaje de éxito
              },
              error: (err) => {
                console.error('Error al eliminar el producto:', err);
                Swal.fire(
                  'Error',
                  'Hubo un problema al eliminar el producto.',
                  'error'
                ); // Si hay error
              },
            });
        }
      });
    }
  }
}
