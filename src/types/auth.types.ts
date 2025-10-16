// src/types/auth.types.ts
// src/types/auth.types.ts
/**
 * Datos para solicitud de login (coincide con LoginRequest del backend Java)
 */
export interface AuthLoginRequest {
  usuario: string;      // Nombre de usuario
  password: string;     // Contraseña en texto plano
}

/**
 * Respuesta del servidor al hacer login (coincide con LoginResponse del backend Java)
 */
export interface AuthLoginResponse {
  cuentaId: number;           // ID de la cuenta (antes era id)
  usuario: string;            // Nombre de usuario
  nombreCompleto: string;     // Nombre completo de la persona (antes era nombre)
  message: string;            // Mensaje de respuesta (antes era mensaje)
  tipoCuenta: string;         // Tipo de cuenta: CIUDADANO, TECNICO, OPERADOR_MUNICIPAL
}

/**
 * Información del usuario autenticado
 */
export interface UsuarioAutenticado {
  id: number;
  usuario: string;
  nombre: string;
  tipoCuenta: string;         // Tipo de cuenta: CIUDADANO, TECNICO, OPERADOR_MUNICIPAL
  token?: string;             // Si implementamos JWT en el futuro
  loginTime: Date;
}

/**
 * Estados posibles de autenticación
 */
export enum AuthState {
  CHECKING = 'checking',     // Verificando autenticación
  AUTHENTICATED = 'authenticated', // Usuario autenticado
  UNAUTHENTICATED = 'unauthenticated' // Usuario no autenticado
}

/**
 * Contexto de autenticación
 */
export interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  estado: AuthState;
  login: (usuario: string, password: string) => Promise<AuthLoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Helpers para roles
  isCiudadano: boolean;
  isTecnico: boolean;
  isOperador: boolean;
}