import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class RegistroComponent {
  usuario = {
    email: '',
    password: ''
  };
  showPassword: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.registro(this.usuario).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/clientes']);
      },
      error: (error) => {
        this.showError = true;
        this.errorMessage = error.error.mensaje || 'Error en el registro';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
} 