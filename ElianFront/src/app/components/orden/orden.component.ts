// src/app/components/orden/orden.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdenService } from '../../services/orden.service';
import { HttpClientModule } from '@angular/common/http';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-orden',
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class OrdenComponent {
  ordenes: any[] = [];
  nuevaOrden: any = {};
  editando: boolean = false;
  modalVisible: boolean = false;
  showConfirmDialog: boolean = false;
  ordenToDelete: number | null = null;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'update' | 'delete' = 'success';
  clientes: any[] = [];

  constructor(
    private ordenService: OrdenService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.obtenerOrdenes();
    this.obtenerClientes();
  }

  obtenerOrdenes(): void {
    this.ordenService.obtenerOrdenes().subscribe(ordenes => {
      this.ordenes = ordenes;
      this.ordenes.forEach(orden => {
        this.clienteService.obtenerCliente(orden.clienteId).subscribe(cliente => {
          orden.clienteNombre = cliente.nombre;
        });
      });
    });
  }

  obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  mostrarModal() {
    this.modalVisible = true;
    this.nuevaOrden = {
      clienteId: '',
      fecha: new Date().toISOString().split('T')[0]
    };
    this.editando = false;
  }

  cerrarModal() {
    const modalContent = document.querySelector('.modal-content');
    modalContent?.classList.add('closing');
    
    setTimeout(() => {
      this.modalVisible = false;
      this.nuevaOrden = {};
      this.editando = false;
    }, 280);
  }

  guardarOrden(): void {
    if (!this.formularioValido) return;

    if (this.editando) {
      this.ordenService.actualizarOrden(this.nuevaOrden.id, this.nuevaOrden).subscribe(ordenActualizada => {
        this.clienteService.obtenerCliente(ordenActualizada.clienteId).subscribe(cliente => {
          ordenActualizada.clienteNombre = cliente.nombre;
          const index = this.ordenes.findIndex(o => o.id === ordenActualizada.id);
          if (index !== -1) {
            this.ordenes[index] = {...ordenActualizada};
            setTimeout(() => {
              const row = document.querySelector(`tr[data-id="${ordenActualizada.id}"]`);
              if (row) {
                row.classList.remove('update-highlight');
                // Forzar reflow sin usar offsetHeight
                getComputedStyle(row).display;
                row.classList.add('update-highlight');
              }
            }, 0);
          }
          this.mostrarNotificacion('Orden actualizada exitosamente', 'update');
          this.cerrarModal();
        });
      });
    } else {
      this.ordenService.crearOrden(this.nuevaOrden).subscribe(orden => {
        this.clienteService.obtenerCliente(orden.clienteId).subscribe(cliente => {
          orden.clienteNombre = cliente.nombre;
          this.ordenes.unshift(orden);
          setTimeout(() => {
            const row = document.querySelector(`tr[data-id="${orden.id}"]`);
            if (row) {
              row.classList.add('slide-in-new');
            }
          });
          this.mostrarNotificacion('Orden creada exitosamente', 'success');
          this.cerrarModal();
        });
      });
    }
  }

  editarOrden(orden: any): void {
    this.nuevaOrden = {
      id: orden.id,
      clienteId: orden.clienteId,
      fecha: orden.fecha
    };
    this.editando = true;
    this.modalVisible = true;
  }

  eliminarOrden(id: number): void {
    this.ordenToDelete = id;
    this.showConfirmDialog = true;
  }

  confirmarEliminacion(): void {
    if (this.ordenToDelete) {
      const row = document.querySelector(`tr[data-id="${this.ordenToDelete}"]`);
      if (row) {
        row.classList.add('delete-animation');
        setTimeout(() => {
          this.ordenService.eliminarOrden(this.ordenToDelete!).subscribe(() => {
            this.ordenes = this.ordenes.filter(o => o.id !== this.ordenToDelete);
            this.showConfirmDialog = false;
            this.ordenToDelete = null;
            this.mostrarNotificacion('Orden eliminada exitosamente', 'delete');
          });
        }, 500);
      }
    }
  }

  cancelarEliminacion(): void {
    this.showConfirmDialog = false;
    this.ordenToDelete = null;
  }

  get formularioValido(): boolean {
    return this.nuevaOrden.clienteId && 
           this.nuevaOrden.fecha;
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'update' | 'delete'): void {
    this.notificationMessage = mensaje;
    this.notificationType = tipo;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}