export interface Usuario {
  id?: number;
  email: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  token: string;
  usuario: {
    id: number;
    email: string;
  }
} 