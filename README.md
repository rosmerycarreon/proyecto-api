# API REST Backend con Node.js, Express y MySQL

API REST completa con autenticación JWT, operaciones CRUD protegidas y integración con base de datos MySQL remota.

## 🚀 Características

- ✅ Servidor Express en Node.js
- ✅ Autenticación con JWT (JSON Web Tokens)
- ✅ CRUD completo de items protegido por autenticación
- ✅ Conexión a base de datos MySQL remota (db4free.net)
- ✅ Validación de datos en todos los endpoints
- ✅ Manejo centralizado de errores
- ✅ Respuestas en formato JSON consistente
- ✅ Contenerización con Docker
- ✅ Control de versiones con Git/GitHub

## 📋 Requisitos

- Node.js v18 o superior
- npm v9 o superior
- Cuenta en db4free.net (para MySQL remoto)
- Git (opcional, para control de versiones)
- Docker (opcional, para contenerización)

## 🔧 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/proyecto-api.git
cd proyecto-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia `.env.example` a `.env` y configura tus credenciales:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de db4free.net:

```env
DB_HOST=db4free.net
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_datos
DB_PORT=3306
JWT_SECRET=tu_secret_clave_super_segura
JWT_EXPIRATION=24h
NODE_ENV=development
PORT=3000
```

### 4. Configurar Base de Datos

Consulta [SETUP.md](./SETUP.md) para crear tu base de datos en db4free.net.

### 5. Ejecutar el servidor

**Modo desarrollo (con recarga automática):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📡 Endpoints

### Autenticación

#### Registrar usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "email": "usuario@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### CRUD de Items

> **⚠️ Nota:** Todos los endpoints de items requieren autenticación. Incluye el token en el header:
> ```
> Authorization: Bearer tu_token_aqui
> ```

#### Obtener todos los items
```http
GET /api/items
Authorization: Bearer tu_token_aqui
```

**Respuesta (200):**
```json
{
  "message": "Items recuperados exitosamente",
  "count": 2,
  "data": [
    {
      "id": 1,
      "nombre": "Item 1",
      "descripcion": "Descripción del item 1",
      "estado": true,
      "created_at": "2026-04-20T15:30:00.000Z"
    }
  ]
}
```

#### Obtener item por ID
```http
GET /api/items/1
Authorization: Bearer tu_token_aqui
```

#### Crear item
```http
POST /api/items
Authorization: Bearer tu_token_aqui
Content-Type: application/json

{
  "nombre": "Nuevo Item",
  "descripcion": "Descripción del nuevo item",
  "estado": true
}
```

#### Actualizar item
```http
PUT /api/items/1
Authorization: Bearer tu_token_aqui
Content-Type: application/json

{
  "nombre": "Item actualizado",
  "estado": false
}
```

#### Eliminar item
```http
DELETE /api/items/1
Authorization: Bearer tu_token_aqui
```

## 🗄️ Estructura de Base de Datos

### Tabla `users`
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabla `items`
```sql
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📁 Estructura de Carpetas

```
proyecto-api/
├── src/
│   ├── index.js                    # Punto de entrada
│   ├── config/
│   │   └── database.js             # Configuración MySQL
│   ├── controllers/
│   │   ├── authController.js       # Lógica autenticación
│   │   └── itemsController.js      # Lógica CRUD items
│   ├── middleware/
│   │   ├── authMiddleware.js       # Validación JWT
│   │   ├── validationMiddleware.js # Validación inputs
│   │   └── errorHandler.js         # Manejo errores
│   ├── models/
│   │   ├── User.js                 # Modelo usuario
│   │   └── Item.js                 # Modelo item
│   ├── routes/
│   │   ├── authRoutes.js           # Rutas autenticación
│   │   └── itemsRoutes.js          # Rutas items
│   └── utils/
│       └── tokenUtils.js           # Utilidades JWT
├── .env.example                    # Template variables
├── .gitignore
├── .dockerignore
├── package.json
├── Dockerfile
├── docker-compose.yml
├── README.md                       # Este archivo
├── SETUP.md                        # Guía db4free
└── DOCKER.md                       # Guía Docker
```

## 🐳 Ejecutar con Docker

```bash
docker-compose up
```

El servidor estará disponible en: `http://localhost:3000`

Consulta [DOCKER.md](./DOCKER.md) para más detalles.

## 📚 Ejemplos con cURL

### Registrar usuario
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Obtener items (requiere token)
```bash
curl -X GET http://localhost:3000/api/items \
  -H "Authorization: Bearer tu_token_aqui"
```

### Crear item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_aqui" \
  -d '{"nombre":"Mi Item","descripcion":"Descripción","estado":true}'
```

## 🔐 Seguridad

- Las contraseñas se almacenan hasheadas con bcryptjs (salt rounds: 10)
- Los tokens JWT expiran en 24 horas
- Validación de inputs en todos los endpoints
- Las rutas CRUD están protegidas por autenticación
- Las credenciales de BD se guardan en variables de entorno

## 📝 Commits Git

El proyecto incluye commits estructurados:

1. `init: setup Node.js y Express`
2. `feat: configuración base de datos MySQL`
3. `feat: autenticación register/login con JWT`
4. `feat: CRUD items con rutas protegidas`
5. `feat: validación y manejo de errores`
6. `docs: README y documentación`

## 🚀 Próximos Pasos

- [ ] Configurar db4free.net
- [ ] Actualizar `.env` con credenciales
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm start` o `npm run dev`
- [ ] Probar endpoints con cURL/Postman
- [ ] Subir a GitHub
- [ ] Ejecutar con Docker

## 📧 Contacto

Para preguntas o problemas, abre un issue en el repositorio.

## 📄 Licencia

ISC

---

**Versión:** 1.0.0  
**Última actualización:** 20 de abril de 2026
