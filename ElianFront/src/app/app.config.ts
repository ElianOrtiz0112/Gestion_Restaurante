// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { OrdenComponent } from './components/orden/orden.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { PlatoComponent } from './components/plato/plato.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './guards/auth.guard';
import { authInterceptor } from './interceptors/auth.interceptor';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'clientes', component: ClienteComponent, canActivate: [AuthGuard] },
  { path: 'ordenes', component: OrdenComponent, canActivate: [AuthGuard] },
  { path: 'pedidos', component: PedidoComponent, canActivate: [AuthGuard] },
  { path: 'platos', component: PlatoComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};

export default routes;
