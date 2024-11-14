// src/app/components/pedido/pedido.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PedidoService } from '../../services/pedido.service';
import { OrdenService } from '../../services/orden.service';
import { ClienteService } from '../../services/cliente.service';
import { PlatoService } from '../../services/plato.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class PedidoComponent {
  pedidos: any[] = [];
  nuevoPedido: any = {};
  editando: boolean = false;
  modalVisible: boolean = false;
  showConfirmDialog: boolean = false;
  pedidoToDelete: number | null = null;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'update' | 'delete' = 'success';
  ordenes: any[] = [];
  clientes: any[] = [];
  platos: any[] = [];

  constructor(
    private pedidoService: PedidoService,
    private ordenService: OrdenService,
    private clienteService: ClienteService,
    private platoService: PlatoService
  ) {
    this.cargarPedidos();
    this.cargarClientes();
    this.cargarOrdenes();
    this.cargarPlatos();
  }

  cargarPedidos(): void {
    this.pedidoService.obtenerPedidos().subscribe(pedidos => {
      this.pedidos = pedidos;
      this.pedidos.forEach(pedido => {
        this.clienteService.obtenerCliente(pedido.clienteId).subscribe(cliente => {
          pedido.clienteNombre = cliente.nombre;
        });
        this.ordenService.obtenerOrden(pedido.ordenId).subscribe(orden => {
          pedido.ordenFecha = orden.fecha;
        });
        this.platoService.obtenerPlato(pedido.platoId).subscribe(plato => {
          pedido.platoNombre = plato.nombre;
        });
      });
    });
  }

  cargarClientes(): void {
    this.clienteService.obtenerClientes().subscribe(data => {
      this.clientes = data;
    });
  }

  cargarOrdenes(): void {
    this.ordenService.obtenerOrdenes().subscribe(ordenes => {
      this.ordenes = ordenes;
      this.ordenes.forEach(orden => {
        this.clienteService.obtenerCliente(orden.clienteId).subscribe(cliente => {
          orden.clienteNombre = cliente.nombre;
        });
      });
    });
  }

  cargarPlatos(): void {
    this.platoService.obtenerPlatos().subscribe(platos => {
      this.platos = platos;
    });
  }

  mostrarModal() {
    this.modalVisible = true;
    this.nuevoPedido = {
      clienteId: '',
      ordenId: '',
      platoId: '',
      fecha: new Date().toISOString().split('T')[0],
      total: ''
    };
    this.editando = false;
  }

  cerrarModal() {
    const modalContent = document.querySelector('.modal-content');
    modalContent?.classList.add('closing');
    
    setTimeout(() => {
      this.modalVisible = false;
      this.nuevoPedido = {};
      this.editando = false;
    }, 280);
  }

  guardarPedido(): void {
    if (!this.formularioValido) return;

    if (this.editando) {
      this.pedidoService.actualizarPedido(this.nuevoPedido.id, this.nuevoPedido).subscribe(pedidoActualizado => {
        this.clienteService.obtenerCliente(pedidoActualizado.clienteId).subscribe(cliente => {
          pedidoActualizado.clienteNombre = cliente.nombre;
          this.ordenService.obtenerOrden(pedidoActualizado.ordenId).subscribe(orden => {
            pedidoActualizado.ordenFecha = orden.fecha;
            this.platoService.obtenerPlato(pedidoActualizado.platoId).subscribe(plato => {
              pedidoActualizado.platoNombre = plato.nombre;
              const index = this.pedidos.findIndex(p => p.id === pedidoActualizado.id);
              if (index !== -1) {
                this.pedidos[index] = {...pedidoActualizado};
                setTimeout(() => {
                  const row = document.querySelector(`tr[data-id="${pedidoActualizado.id}"]`);
                  if (row) {
                    row.classList.remove('update-highlight');
                    void getComputedStyle(row).display;
                    row.classList.add('update-highlight');
                  }
                }, 0);
              }
              this.mostrarNotificacion('Pedido actualizado exitosamente', 'update');
              this.cerrarModal();
            });
          });
        });
      });
    } else {
      this.pedidoService.crearPedido(this.nuevoPedido).subscribe(pedido => {
        this.clienteService.obtenerCliente(pedido.clienteId).subscribe(cliente => {
          pedido.clienteNombre = cliente.nombre;
          this.ordenService.obtenerOrden(pedido.ordenId).subscribe(orden => {
            pedido.ordenFecha = orden.fecha;
            this.platoService.obtenerPlato(pedido.platoId).subscribe(plato => {
              pedido.platoNombre = plato.nombre;
              this.pedidos.unshift(pedido);
              setTimeout(() => {
                const row = document.querySelector(`tr[data-id="${pedido.id}"]`);
                if (row) {
                  row.classList.add('slide-in-new');
                }
              });
              this.mostrarNotificacion('Pedido creado exitosamente', 'success');
              this.cerrarModal();
            });
          });
        });
      });
    }
  }

  editarPedido(pedido: any): void {
    this.nuevoPedido = {
      id: pedido.id,
      clienteId: pedido.clienteId,
      ordenId: pedido.ordenId,
      platoId: pedido.platoId,
      fecha: pedido.fecha,
      total: pedido.total
    };
    this.editando = true;
    this.modalVisible = true;
  }

  eliminarPedido(id: number): void {
    this.pedidoToDelete = id;
    this.showConfirmDialog = true;
  }

  confirmarEliminacion(): void {
    if (this.pedidoToDelete) {
      const row = document.querySelector(`tr[data-id="${this.pedidoToDelete}"]`);
      if (row) {
        row.classList.add('delete-animation');
        setTimeout(() => {
          this.pedidoService.eliminarPedido(this.pedidoToDelete!).subscribe(() => {
            this.pedidos = this.pedidos.filter(p => p.id !== this.pedidoToDelete);
            this.showConfirmDialog = false;
            this.pedidoToDelete = null;
            this.mostrarNotificacion('Pedido eliminado exitosamente', 'delete');
          });
        }, 500);
      }
    }
  }

  cancelarEliminacion(): void {
    this.showConfirmDialog = false;
    this.pedidoToDelete = null;
  }

  get formularioValido(): boolean {
    return this.nuevoPedido.clienteId && 
           this.nuevoPedido.ordenId && 
           this.nuevoPedido.platoId &&
           this.nuevoPedido.fecha &&
           this.nuevoPedido.total;
  }

  private mostrarNotificacion(mensaje: string, tipo: 'success' | 'update' | 'delete'): void {
    this.notificationMessage = mensaje;
    this.notificationType = tipo;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

  actualizarTotal(): void {
    if (this.nuevoPedido.platoId) {
      const platoSeleccionado = this.platos.find(p => p.id === parseInt(this.nuevoPedido.platoId));
      if (platoSeleccionado) {
        this.nuevoPedido.total = platoSeleccionado.precio;
      }
    }
  }
}
