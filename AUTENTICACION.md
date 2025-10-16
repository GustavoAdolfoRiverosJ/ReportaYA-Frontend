# Servicio de Autenticación - Gestión de Login/Logout

## 📝 ¿Qué es el Servicio de Autenticación?

El **servicio de autenticación** maneja el login y logout de usuarios en la aplicación ReportaYA. Se conecta directamente con el backend Spring Boot para validar credenciales y mantener el estado de sesión del usuario.

## 🎯 Funcionalidad Principal

### Login de Usuario
```typescript
POST /api/auth/login
```

**Request:**
```json
{
  "usuario": "mciudadano",
  "password": "mi_contraseña_segura"
}
```

**Response (éxito):**
```json
{
  "id": 1,
  "usuario": "mciudadano",
  "nombre": "María López Rodríguez",
  "mensaje": "Login exitoso"
}
```

**Response (error - credenciales inválidas):**
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```

## 🔧 API de Autenticación

### Login
```typescript
POST /api/auth/login
```

**Parámetros:**
- `usuario`: Nombre de usuario (string)
- `password`: Contraseña en texto plano (string)

**Respuesta:** `AuthLoginResponse`

**Errores posibles:**
- `401 Unauthorized`: Usuario o contraseña incorrectos
- `400 Bad Request`: Datos inválidos
- `500 Internal Server Error`: Error del servidor

## 📊 Estructura de las Interfaces

### AuthLoginRequest
```typescript
interface AuthLoginRequest {
  usuario: string;      // Nombre de usuario
  password: string;     // Contraseña en texto plano
}
```

### AuthLoginResponse
```typescript
interface AuthLoginResponse {
  id: number;           // ID único de la cuenta
  usuario: string;      // Nombre de usuario
  nombre: string;       // Nombre completo de la persona
  mensaje: string;      // Mensaje de respuesta
}
```

### UsuarioAutenticado
```typescript
interface UsuarioAutenticado {
  id: number;
  usuario: string;
  nombre: string;
  token?: string;       // Para futuras implementaciones JWT
  loginTime: Date;
}
```

## 🎨 Uso en Frontend

### Importar el Servicio
```typescript
import ServicioAuth from '../servicios/ServicioAuth';
import { useAuth } from '../context/AuthContext';
```

### Login Directo con el Servicio
```typescript
const loginDirecto = async (usuario: string, password: string) => {
  try {
    const response = await ServicioAuth.login(usuario, password);
    console.log('Login exitoso:', response);
    // Guardar datos del usuario, navegar, etc.
  } catch (error) {
    console.error('Error en login:', error.message);
    // Mostrar error al usuario
  }
};
```

### Usar el Contexto de Autenticación (Recomendado)
```typescript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await login(usuario, password);
      console.log('Usuario autenticado:', response);
      // La navegación se maneja automáticamente
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (isAuthenticated) {
    return <Text>Ya estás autenticado</Text>;
  }

  return (
    <View>
      <TextInput
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={isLoading ? "Iniciando..." : "Iniciar Sesión"}
        onPress={handleLogin}
        disabled={isLoading}
      />
    </View>
  );
};
```

## 🔄 Estados de Autenticación

### AuthState
```typescript
enum AuthState {
  CHECKING = 'checking',         // Verificando autenticación inicial
  AUTHENTICATED = 'authenticated', // Usuario autenticado
  UNAUTHENTICATED = 'unauthenticated' // Usuario no autenticado
}
```

### Contexto de Autenticación
```typescript
interface AuthContextType {
  usuario: UsuarioAutenticado | null;
  estado: AuthState;
  login: (usuario: string, password: string) => Promise<AuthLoginResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

## 📱 Integración en la App

### Envolver la App con AuthProvider
```typescript
// App.tsx
import { AuthProvider } from './src/context/AuthContext';
import { ReportesProvider } from './src/context/ReportesContext';

const App = () => {
  return (
    <AuthProvider>
      <ReportesProvider>
        <AppNavigator />
      </ReportesProvider>
    </AuthProvider>
  );
};
```

### Verificar Autenticación en Pantallas Protegidas
```typescript
const HomeScreen = () => {
  const { isAuthenticated, usuario, logout } = useAuth();

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <View>
      <Text>Bienvenido, {usuario?.nombre}</Text>
      <Button title="Cerrar Sesión" onPress={logout} />
    </View>
  );
};
```

## 🔐 Persistencia de Sesión

### AsyncStorage
- **Login exitoso**: Datos se guardan automáticamente en AsyncStorage
- **Verificación inicial**: Al abrir la app, se verifica sesión guardada
- **Logout**: Datos se eliminan de AsyncStorage
- **Expiración**: Sesión expira después de 24 horas

### Verificación Automática
```typescript
// Se ejecuta automáticamente al iniciar la app
useEffect(() => {
  verificarAutenticacionInicial();
}, []);
```

## 🚨 Manejo de Errores

### Errores del Backend
```typescript
try {
  await login(usuario, password);
} catch (error) {
  if (error.message.includes('Usuario o contraseña')) {
    // Credenciales inválidas
  } else if (error.message.includes('Datos inválidos')) {
    // Request mal formado
  } else {
    // Error genérico
  }
}
```

### Errores de Red
```typescript
catch (error) {
  if (!error.response) {
    // Error de conexión
    Alert.alert('Error', 'No se pudo conectar al servidor');
  } else {
    // Error del servidor
    Alert.alert('Error', error.message);
  }
}
```

## 🔄 Ciclo de Vida

### 1. Inicio de App
- ✅ Verificar AsyncStorage
- ✅ Restaurar sesión si existe y no expiró
- ✅ Estado: `CHECKING` → `AUTHENTICATED` o `UNAUTHENTICATED`

### 2. Login
- ✅ Enviar credenciales al backend
- ✅ Recibir respuesta con datos del usuario
- ✅ Guardar en contexto y AsyncStorage
- ✅ Estado: `AUTHENTICATED`

### 3. Uso Normal
- ✅ Usuario puede acceder a funcionalidades protegidas
- ✅ `isAuthenticated = true`

### 4. Logout
- ✅ Limpiar contexto y AsyncStorage
- ✅ Estado: `UNAUTHENTICATED`
- ✅ Redirigir a pantalla de login

## 🎯 Casos de Uso

### Pantalla de Login
```typescript
const LoginScreen = () => {
  const { login, isLoading } = useAuth();

  const handleSubmit = async () => {
    try {
      await login(usuario, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
};
```

### Protección de Rutas
```typescript
const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
```

### Header con Usuario
```typescript
const Header = () => {
  const { usuario, logout } = useAuth();

  return (
    <View style={styles.header}>
      <Text>Bienvenido, {usuario?.nombre}</Text>
      <TouchableOpacity onPress={logout}>
        <Text>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 🔧 Características Técnicas

### Seguridad
- **HTTPS obligatorio** para todas las peticiones
- **No se almacena la contraseña** en el dispositivo
- **Expiración automática** de sesiones
- **Validación de credenciales** en backend

### Rendimiento
- **Carga inicial rápida** con verificación de AsyncStorage
- **Estados de carga** para mejor UX
- **Reintentos automáticos** en caso de errores temporales

### Escalabilidad
- **Fácil integración** con JWT tokens en el futuro
- **Extensible** para múltiples tipos de usuario
- **Separación de responsabilidades** (servicio + contexto)

## 🚀 Próximas Mejoras

1. **JWT Tokens**: Implementar tokens para autenticación stateless
2. **Refresh Tokens**: Mantener sesiones activas automáticamente
3. **Biometría**: Login con huella dactilar o Face ID
4. **Multi-factor**: Autenticación de dos factores
5. **Roles**: Diferentes niveles de acceso (ciudadano, operador, técnico)

¿Te gustaría que implemente alguna de estas funcionalidades adicionales o necesitas ajustes en el sistema de autenticación actual? 🔐