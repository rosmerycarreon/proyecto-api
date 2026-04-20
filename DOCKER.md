# Guía de Docker: Ejecutar API en Contenedores

Esta guía te ayudará a ejecutar la API con Docker y Docker Compose.

## Requisitos

- Docker instalado y corriendo ([descarga aquí](https://www.docker.com/products/docker-desktop))
- Docker Compose (generalmente incluido con Docker Desktop)
- Archivo `.env` configurado correctamente (ver [SETUP.md](./SETUP.md))

## Verificar Instalación

```bash
docker --version
docker-compose --version
```

## Opción 1: Ejecutar con Docker Compose (Recomendado)

Docker Compose orquesta todos los servicios (API, base de datos si es local, etc.).

### 1. Construir e iniciar los servicios

```bash
docker-compose up
```

**Primera vez:** Docker construirá la imagen. Esto toma 1-2 minutos.

Verás algo como:
```
proyecto-api-api-1  | ✓ Servidor ejecutándose en http://localhost:3000
proyecto-api-api-1  | ✓ Entorno: production
```

### 2. Acceder a la API

Una vez que veas el mensaje de éxito:

```bash
curl http://localhost:3000
```

### 3. Detener los servicios

```bash
# En otra terminal o con Ctrl+C
docker-compose down
```

### 4. Ver logs en tiempo real

```bash
docker-compose logs -f api
```

### 5. Ejecutar comandos en el contenedor

```bash
# Acceder a la terminal del contenedor
docker-compose exec api sh

# Ejecutar un comando específico
docker-compose exec api npm list
```

## Opción 2: Ejecutar con Docker (Solo imagen)

Si prefieres ejecutar solo Docker sin Compose:

### 1. Construir la imagen

```bash
docker build -t api-backend:1.0 .
```

### 2. Ejecutar el contenedor

```bash
docker run \
  -p 3000:3000 \
  --env-file .env \
  --name api-container \
  api-backend:1.0
```

### 3. Detener el contenedor

```bash
docker stop api-container
docker rm api-container
```

## Opciones Avanzadas

### Ejecutar en segundo plano (detached mode)

```bash
docker-compose up -d
```

Para ver logs:
```bash
docker-compose logs -f
```

### Reconstruir sin caché

```bash
docker-compose up --build --no-cache
```

### Limpieza de espacios no utilizados

```bash
docker-compose down -v  # Elimina volúmenes también
docker system prune      # Limpia imágenes y contenedores no usados
```

### Ejecutar servicios específicos

```bash
# Solo la API
docker-compose up api

# Sin detached
docker-compose up --no-start
docker-compose start api
```

## Estructura del docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=${DB_HOST}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=${DB_PORT}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
    volumes:
      - ./src:/app/src
```

## Solución de Problemas

### "Address already in use"

El puerto 3000 ya está siendo usado:

```bash
# Cambiar puerto en docker-compose.yml
# De: "3000:3000"
# A: "3001:3000"  (puerto externo:puerto interno)
```

### "Connection refused to database"

- Verifica que el `.env` tiene las credenciales correctas
- Asegúrate de que la BD en db4free.net está disponible
- Espera 2-3 segundos después de iniciar (tiempo de conexión)

### "Cannot find module"

Reconstruye la imagen:
```bash
docker-compose down
docker-compose up --build
```

### "Permission denied"

En Mac/Linux, puede ser necesario:
```bash
sudo docker-compose up
```

## Ejecutar Tests en Docker

```bash
# Ver logs mientras se ejecuta
docker-compose logs -f api

# Ejecutar un comando personalizado
docker-compose exec api npm test
```

## Deployar en Producción

1. **Cambiar variables en `.env`:**
```env
NODE_ENV=production
```

2. **Usar docker-compose.prod.yml:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. **Considerar:**
- Usar un reverse proxy (nginx)
- Implementar SSL/TLS
- Usar secretos en lugar de `.env`
- Monitoreo y logs centralizados

## Monitoreo

### Ver estado de contenedores

```bash
docker-compose ps
```

### Ver uso de recursos

```bash
docker stats
```

### Ver eventos

```bash
docker-compose events
```

## Volúmenes y Persistencia

El `docker-compose.yml` actual incluye volumen para código en desarrollo:

```yaml
volumes:
  - ./src:/app/src  # Hot-reload de código
```

Para datos persistentes de BD, agregaría:
```yaml
volumes:
  - db_data:/var/lib/mysql
```

## Ejemplos Prácticos

### Desarrollo con hot-reload

```bash
docker-compose up
# Los cambios en ./src se reflejan automáticamente
```

### Ejecutar una migración

```bash
docker-compose exec api npm run migrate
```

### Acceder a la terminal

```bash
docker-compose exec api bash
# o
docker-compose exec api sh
```

### Ver variables de entorno en contenedor

```bash
docker-compose exec api env
```

## Verificación Final

La API está lista cuando ves:

```
✓ Servidor ejecutándose en http://localhost:3000
✓ Entorno: production
✓ Conexión a MySQL establecida exitosamente
```

Luego puedes probar:

```bash
curl http://localhost:3000
```

## Próximos Pasos

1. ✅ Docker configurado
2. ✅ Contenedor ejecutándose
3. ⏭️ Probar endpoints
4. ⏭️ Verificar datos en phpMyAdmin de db4free
5. ⏭️ Subir a GitHub
6. ⏭️ (Opcional) Deploy en servidor cloud

## Referencias

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://docs.docker.com/language/nodejs/build-images/)

---

**¿Necesitas ayuda?** Consulta el [README.md](./README.md) o abre un issue en GitHub.
