// src/app/components/plato/plato.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlatoService } from '../../services/plato.service';

@Component({
  selector: 'app-plato',
  templateUrl: './plato.component.html',
  styleUrls: ['./plato.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class PlatoComponent {
  platos: any[] = [];
  nuevoPlato: any = {};
  editando: boolean = false;
  modalVisible: boolean = false;
  showConfirmDialog: boolean = false;
  platoToDelete: number | null = null;
  showNotification: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'update' | 'delete' = 'success';

  constructor(private platoService: PlatoService) {}

  ngOnInit(): void {
    this.obtenerPlatos();
  }

  obtenerPlatos(): void {
    this.platoService.obtenerPlatos().subscribe(platos => {
      this.platos = platos;
    });
  }

  mostrarModal() {
    this.modalVisible = true;
    this.nuevoPlato = {};
    this.editando = false;
  }

  cerrarModal() {
    const modalContent = document.querySelector('.modal-content');
    modalContent?.classList.add('closing');
    
    setTimeout(() => {
      this.modalVisible = false;
      this.nuevoPlato = {};
      this.editando = false;
    }, 280);
  }

  guardarPlato(): void {
    if (!this.formularioValido) return;

    if (this.editando) {
      this.platoService.actualizarPlato(this.nuevoPlato.id, this.nuevoPlato).subscribe(platoActualizado => {
        const index = this.platos.findIndex(p => p.id === platoActualizado.id);
        if (index !== -1) {
          this.platos[index] = {...platoActualizado};
          setTimeout(() => {
            const row = document.querySelector(`tr[data-id="${platoActualizado.id}"]`);
            if (row) {
              row.classList.remove('update-highlight');
              getComputedStyle(row).display;
              row.classList.add('update-highlight');
            }
          }, 0);
        }
        this.mostrarNotificacion('Plato actualizado exitosamente', 'update');
        this.cerrarModal();
      });
    } else {
      this.platoService.crearPlato(this.nuevoPlato).subscribe(plato => {
        this.platos.unshift(plato);
        setTimeout(() => {
          const row = document.querySelector(`tr[data-id="${plato.id}"]`);
          if (row) {
            row.classList.add('slide-in-new');
          }
        });
        this.mostrarNotificacion('Plato creado exitosamente', 'success');
        this.cerrarModal();
      });
    }
  }

  editarPlato(plato: any): void {
    this.nuevoPlato = {...plato};
    this.editando = true;
    this.modalVisible = true;
  }

  eliminarPlato(id: number): void {
    this.platoToDelete = id;
    this.showConfirmDialog = true;
  }

  confirmarEliminacion(): void {
    if (this.platoToDelete) {
      const row = document.querySelector(`tr[data-id="${this.platoToDelete}"]`);
      if (row) {
        row.classList.add('delete-animation');
        setTimeout(() => {
          this.platoService.eliminarPlato(this.platoToDelete!).subscribe(() => {
            this.platos = this.platos.filter(p => p.id !== this.platoToDelete);
            this.showConfirmDialog = false;
            this.platoToDelete = null;
            this.mostrarNotificacion('Plato eliminado exitosamente', 'delete');
          });
        }, 500);
      }
    }
  }

  cancelarEliminacion(): void {
    this.showConfirmDialog = false;
    this.platoToDelete = null;
  }

  get formularioValido(): boolean {
    return this.nuevoPlato.nombre && 
           this.nuevoPlato.precio;
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
