// src/app/components/cliente/cliente.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class ClienteComponent {
  clientes: any[] = [];
  nuevoCliente: any = {};
  editando: boolean = false;
  modalVisible: boolean = false;
  showConfirmDialog: boolean = false;
  clienteToDelete: number | null = null;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'update' | 'delete' = 'success';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  mostrarModal() {
    this.modalVisible = true;
    this.nuevoCliente = {};
    this.editando = false;
  }

  cerrarModal() {
    const modalContent = document.querySelector('.modal-content');
    modalContent?.classList.add('closing');
    
    setTimeout(() => {
      this.modalVisible = false;
      this.nuevoCliente = {};
      this.editando = false;
    }, 280);
  }

  obtenerClientes(): void {
    this.clienteService.obtenerClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  crearCliente(): void {
    if (this.editando) {
      this.clienteService.actualizarCliente(this.nuevoCliente.id, this.nuevoCliente).subscribe(clienteActualizado => {
        const index = this.clientes.findIndex(c => c.id === clienteActualizado.id);
        if (index !== -1) {
          this.clientes[index] = clienteActualizado;
          setTimeout(() => {
            const updatedRow = document.querySelector(`tr[data-id="${clienteActualizado.id}"]`);
            if (updatedRow) {
              updatedRow.classList.add('update-highlight');
            }
          });
        }
        this.mostrarNotificacion('Cliente actualizado exitosamente', 'update');
        this.cerrarModal();
      });
    } else {
      this.clienteService.crearCliente(this.nuevoCliente).subscribe(cliente => {
        this.clientes.unshift(cliente);
        setTimeout(() => {
          const newRow = document.querySelector(`tr[data-id="${cliente.id}"]`);
          if (newRow) {
            newRow.classList.add('slide-in-new');
          }
        });
        this.mostrarNotificacion('Cliente creado exitosamente', 'success');
        this.cerrarModal();
      });
    }
  }

  editarCliente(cliente: any): void {
    this.nuevoCliente = {...cliente};
    this.editando = true;
    this.modalVisible = true;
  }

  eliminarCliente(id: number): void {
    this.clienteToDelete = id;
    this.showConfirmDialog = true;
  }

  confirmarEliminacion(): void {
    if (this.clienteToDelete) {
      const row = document.querySelector(`tr[data-id="${this.clienteToDelete}"]`);
      if (row) {
        row.classList.add('delete-animation');
        setTimeout(() => {
          this.clienteService.eliminarCliente(this.clienteToDelete!).subscribe(() => {
            this.clientes = this.clientes.filter(c => c.id !== this.clienteToDelete);
            this.showConfirmDialog = false;
            this.clienteToDelete = null;
            this.mostrarNotificacion('Cliente eliminado exitosamente', 'delete');
          });
        }, 500);
      }
    }
  }

  cancelarEliminacion(): void {
    this.showConfirmDialog = false;
    this.clienteToDelete = null;
  }

  get formularioValido(): boolean {
    return this.nuevoCliente.nombre?.trim() && 
           this.nuevoCliente.email?.trim() && 
           this.nuevoCliente.telefono?.trim();
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
