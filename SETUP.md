# Guía de Setup: Base de Datos MySQL en db4free.net

Esta guía te ayudará a crear y configurar tu base de datos MySQL remota en db4free.net para usar con la API.

## Paso 1: Crear Cuenta en db4free.net

1. Visita [db4free.net](https://www.db4free.net/) en tu navegador
2. Haz clic en **"Sign Up"** o **"Register"**
3. Completa el formulario:
   - **User Name**: Tu nombre de usuario (ej: `mi_usuario`)
   - **Password**: Una contraseña segura
   - **Retype Password**: Confirma la contraseña
   - **Email**: Tu dirección de correo electrónico
   - Acepta los términos y condiciones
4. Haz clic en **"Create my account"**
5. Verifica tu correo electrónico (revisa spam si no lo ves)

## Paso 2: Crear Base de Datos

1. Inicia sesión en [db4free.net](https://www.db4free.net/)
2. En el panel de control, haz clic en **"Create Database"**
3. Completa los datos:
   - **Database Name**: `backend_api` (o el nombre que prefieras)
   - Deja las otras opciones por defecto
4. Haz clic en **"Create"**
5. Espera a que se cree la base de datos (generalmente 1-2 minutos)
6. Una vez creada, verás la información de conexión

## Paso 3: Obtener Credenciales de Conexión

En el panel de control, busca tu base de datos y encontrarás:

- **Host**: `db4free.net`
- **Port**: `3306`
- **User**: Tu nombre de usuario (el que registraste)
- **Password**: Tu contraseña
- **Database**: `backend_api` (o el nombre que elegiste)

**Ejemplo:**
```
Host: db4free.net
Port: 3306
User: mi_usuario
Password: mi_contraseña_segura
Database: backend_api
```

## Paso 4: Acceder a phpMyAdmin (Opcional)

Para ver y gestionar tu base de datos gráficamente:

1. En db4free.net, haz clic en **"phpMyAdmin"**
2. Ingresa tus credenciales:
   - **Username**: Tu usuario
   - **Password**: Tu contraseña
   - **Server**: Selecciona `db4free.net` de la lista desplegable
3. Haz clic en **"Go"**

## Paso 5: Crear Tablas (Automático)

La API creará automáticamente las tablas `users` e `items` en el primer inicio si no existen.

**Si quieres crearlas manualmente en phpMyAdmin:**

### Tabla `users`

En phpMyAdmin, selecciona tu base de datos y ve a **"SQL"**, luego copia y ejecuta:

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

## Paso 6: Configurar Variables de Entorno

1. En la raíz del proyecto (`proyecto-api/`), copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Abre `.env` en tu editor de texto

3. Reemplaza los valores con tus credenciales de db4free.net:

```env
# Configuración de base de datos MySQL
DB_HOST=db4free.net
DB_USER=tu_usuario_aqui
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=backend_api
DB_PORT=3306

# Configuración de JWT
JWT_SECRET=mi_secret_clave_super_segura_cambiar
JWT_EXPIRATION=24h

# Configuración de la aplicación
NODE_ENV=development
PORT=3000
```

**⚠️ Importante:**
- No compartas tu `.env` en GitHub
- El archivo `.env` ya está en `.gitignore`
- Cambia `JWT_SECRET` por una clave segura y única

## Paso 7: Verificar Conexión

1. Asegúrate de tener Node.js instalado
2. Navega a la carpeta del proyecto:
```bash
cd proyecto-api
```

3. Instala las dependencias:
```bash
npm install
```

4. Ejecuta el servidor:
```bash
npm start
```

5. Si ves este mensaje, ¡la conexión funcionó! ✓
```
✓ Servidor ejecutándose en http://localhost:3000
✓ Entorno: development
✓ Conexión a MySQL establecida exitosamente
✓ Tablas inicializadas correctamente
```

## Paso 8: Probar la API

### Registrar un usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Respuesta esperada:
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "test@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Crear un item (requiere token)

Usa el token del login anterior:

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer tu_token_aqui" \
  -d '{
    "nombre": "Mi primer item",
    "descripcion": "Descripción del item",
    "estado": true
  }'
```

### Obtener items

```bash
curl -X GET http://localhost:3000/api/items \
  -H "Authorization: Bearer tu_token_aqui"
```

## Solución de Problemas

### "Error: Connection timeout"

- Verifica que tus credenciales en `.env` son correctas
- Asegúrate de que la base de datos se creó exitosamente en db4free.net
- Espera unos minutos después de crear la BD

### "Error: Access denied for user"

- Verifica que el usuario y contraseña en `.env` coinciden con los de db4free.net
- No confundas el usuario de db4free con el usuario de la BD

### "Error: Unknown database"

- Verifica que el nombre de la base de datos en `.env` es correcto
- Comprueba en db4free.net que la BD existe

### "Error: Duplicate entry for key 'email'"

- Esto significa que intentas registrar un usuario con un email que ya existe
- Intenta con otro email

## Información Adicional

- **Limite de conexiones**: db4free.net permite hasta 10 conexiones simultáneas
- **Almacenamiento**: Tienes acceso a suficiente espacio para proyectos académicos
- **Copia de seguridad**: Realiza backups periódicos desde phpMyAdmin
- **Documentación**: Más info en [db4free.net FAQ](https://www.db4free.net/en/faq.php)

## Próximos Pasos

1. ✅ Base de datos configurada
2. ✅ Credenciales en `.env`
3. ⏭️ Ejecutar API en modo desarrollo (`npm run dev`)
4. ⏭️ Probar todos los endpoints
5. ⏭️ Subir a GitHub
6. ⏭️ (Opcional) Contenerizar con Docker

---

**¿Necesitas ayuda?** Consulta el [README.md](./README.md) o abre un issue en GitHub.
