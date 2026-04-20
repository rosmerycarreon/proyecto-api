# 📚 ÍNDICE DEL PROYECTO - API REST Backend Node.js

## 🎯 Descripción General

API REST completa con Node.js, Express, MySQL, JWT Authentication y Docker. Proyecto académico de aprendizaje con documentación exhaustiva y estructura profesional.

**Versión:** 1.0.0  
**Estado:** ✅ Completado y Funcional  
**Servidor:** http://localhost:3000

---

## 📖 DOCUMENTACIÓN (Lee en este orden)

1. **[QUICKSTART.md](./QUICKSTART.md)** ⭐ **COMIENZA AQUÍ**
   - Checklist de configuración rápida
   - Próximos pasos inmediatos
   - Validación de funcionamiento

2. **[SETUP.md](./SETUP.md)** - Configurar db4free.net
   - Crear cuenta MySQL remota
   - Obtener credenciales
   - Configurar variables de entorno

3. **[README.md](./README.md)** - Documentación Completa
   - Descripción de endpoints
   - Ejemplos con cURL
   - Estructura de BD
   - Guía de instalación

4. **[DOCKER.md](./DOCKER.md)** - Ejecutar en Contenedores
   - Docker build y run
   - docker-compose
   - Troubleshooting

---

## 🗂️ ESTRUCTURA DEL PROYECTO

```
proyecto-api/
│
├─ src/
│  ├─ index.js                    [SERVIDOR PRINCIPAL]
│  │
│  ├─ config/
│  │  └─ database.js              [CONEXIÓN MYSQL2]
│  │
│  ├─ controllers/                [LÓGICA DE NEGOCIO]
│  │  ├─ authController.js        (register, login)
│  │  └─ itemsController.js       (CRUD items)
│  │
│  ├─ middleware/                 [PROCESAMIENTO DE REQUESTS]
│  │  ├─ authMiddleware.js        (validación JWT)
│  │  ├─ validationMiddleware.js  (validación inputs)
│  │  └─ errorHandler.js          (manejo errores)
│  │
│  ├─ models/                     [INTERACCIÓN CON DB]
│  │  ├─ User.js                  (métodos usuario)
│  │  └─ Item.js                  (métodos item)
│  │
│  ├─ routes/                     [DEFINICIÓN DE RUTAS]
│  │  ├─ authRoutes.js            (POST /auth/register, /login)
│  │  └─ itemsRoutes.js           (CRUD /api/items)
│  │
│  └─ utils/
│     └─ tokenUtils.js            (generar/verificar JWT)
│
├─ 📚 DOCUMENTACIÓN
│  ├─ README.md                   [DOCUMENTACIÓN PRINCIPAL]
│  ├─ SETUP.md                    [GUÍA DB4FREE]
│  ├─ DOCKER.md                   [GUÍA DOCKER]
│  ├─ QUICKSTART.md               [INICIO RÁPIDO]
│  └─ INDEX.md                    [ESTE ARCHIVO]
│
├─ 🐳 DOCKER
│  ├─ Dockerfile                  [IMAGEN MULTI-STAGE]
│  ├─ docker-compose.yml          [ORQUESTACIÓN]
│  └─ .dockerignore               [ARCHIVOS EXCLUIDOS]
│
├─ 🔧 CONFIGURACIÓN
│  ├─ package.json                [DEPENDENCIAS]
│  ├─ .env                        [VARIABLES (NO COMPARTIR)]
│  ├─ .env.example                [TEMPLATE .env]
│  └─ .gitignore                  [ARCHIVOS IGNORADOS]
│
└─ 📊 GIT
   ├─ .git/                       [REPOSITORIO LOCAL]
   └─ [commits registrados]       [2 commits iniciales]
```

---

## ⚙️ DEPENDENCIAS INSTALADAS

```json
{
  "express": "^4.18.2",          // Servidor HTTP
  "mysql2": "^3.6.0",            // Driver MySQL
  "dotenv": "^16.0.3",           // Variables de entorno
  "bcryptjs": "^2.4.3",          // Hash de contraseñas
  "jsonwebtoken": "^9.0.0",      // Generación JWT
  "cors": "^2.8.5",              // Cross-origin
  "nodemon": "^2.0.20"           // Dev mode (devDependencies)
}
```

---

## 🔌 ENDPOINTS DISPONIBLES

### Autenticación (Sin protección)
```
POST /auth/register              Registrar usuario
POST /auth/login                 Obtener JWT
```

### CRUD Items (Requiere Bearer Token)
```
GET  /api/items                  Obtener todos
GET  /api/items/:id              Obtener por ID
POST /api/items                  Crear nuevo
PUT  /api/items/:id              Actualizar
DELETE /api/items/:id            Eliminar
```

### Utilidad
```
GET /                            Info del servidor
GET /health                      Health check
```

---

## 🚀 INICIO RÁPIDO

### 1. Instalar dependencias (ya hecho ✅)
```bash
npm install
```

### 2. Configurar .env
```bash
# Editar .env con credenciales de db4free.net
DB_HOST=db4free.net
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_datos
```

### 3. Ejecutar servidor
```bash
# Desarrollo (con recarga)
npm run dev

# Producción
npm start

# Docker
docker-compose up
```

### 4. Probar API
```bash
curl http://localhost:3000
```

---

## 🔐 Características de Seguridad

✅ Contraseñas hasheadas con bcryptjs (10 salt rounds)  
✅ Tokens JWT con expiración 24h  
✅ Validación de inputs en todos los endpoints  
✅ Rutas protegidas por autenticación  
✅ Middleware centralizado de errores  
✅ Variables sensibles en .env (no en código)  

---

## 📊 Base de Datos

### Tabla `users`
```sql
id (INT, PK)
email (VARCHAR 100, UNIQUE)
password_hash (VARCHAR 255)
created_at (TIMESTAMP)
```

### Tabla `items`
```sql
id (INT, PK)
nombre (VARCHAR 100)
descripcion (TEXT)
estado (BOOLEAN)
created_at (TIMESTAMP)
```

**Ubicación:** db4free.net (remoto)

---

## 📝 GIT COMMITS

```
0ed8c8c - docs: agregar guía de inicio rápido (QUICKSTART.md)
18ffe2f - init: setup Node.js y Express con estructura base
```

**Siguiente paso:** Subir a GitHub

---

## ✅ CHECKLIST DE ESTADO

| Tarea | Estado |
|-------|--------|
| Node.js/Express configurado | ✅ |
| Estructura de carpetas | ✅ |
| Controladores implementados | ✅ |
| Middleware implementado | ✅ |
| Modelos de BD | ✅ |
| Autenticación JWT | ✅ |
| CRUD completo | ✅ |
| Validación de inputs | ✅ |
| Manejo de errores | ✅ |
| Documentación (README) | ✅ |
| Documentación (SETUP.md) | ✅ |
| Documentación (DOCKER.md) | ✅ |
| Dockerfile | ✅ |
| docker-compose.yml | ✅ |
| Git inicializado | ✅ |
| .env.example | ✅ |
| .gitignore | ✅ |
| npm start funciona | ✅ |
| **Base de datos remota** | ⏳ (requiere config) |
| **GitHub** | ⏳ (requiere push del usuario) |

---

## 🎓 Próximos Pasos

1. **Lee [QUICKSTART.md](./QUICKSTART.md)** para el paso a paso
2. **Configura db4free.net** según [SETUP.md](./SETUP.md)
3. **Actualiza `.env`** con credenciales reales
4. **Ejecuta `npm start`** y prueba endpoints
5. **Verifica datos** en phpMyAdmin de db4free
6. **Sube a GitHub** cuando funcione todo

---

## 📞 Soporte

- [db4free.net FAQ](https://www.db4free.net/en/faq.php)
- [Express.js Docs](https://expressjs.com/)
- [MySQL2 Docs](https://github.com/sidorares/node-mysql2)
- [JWT Info](https://jwt.io/)

---

**Versión:** 1.0.0  
**Actualizado:** 20 de abril de 2026  
**Estado:** Listo para usar 🚀

---

👉 **[Comienza con QUICKSTART.md](./QUICKSTART.md)**
