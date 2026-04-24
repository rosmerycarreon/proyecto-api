# 🚀 GUÍA DE CONEXIÓN VIA VPN - InfinityFree

**Fecha:** 20 de abril de 2026  
**Estado:** El proyecto está listo, solo necesita conexión a BD desde VPN

---

## 📋 Datos Confirmados del Panel InfinityFree

```
Usuario MySQL:        if0_41710291
Host MySQL:           sql100.infinityfree.com
Puerto MySQL:         3306
Contraseña:           rosmerycarreon2 ✅ (confirmada)
Base de Datos:        if0_41710291_XXX (⏳ pendiente nombre exacto)
```

---

## 🔐 Configuración Actual en `.env`

```env
DB_HOST=sql100.infinityfree.com
DB_PORT=3306
DB_USER=if0_41710291
DB_PASSWORD=rosmerycarreon2
DB_NAME=if0_41710291_backend_api
JWT_SECRET=mi_clave_secreta_super_segura_2024
JWT_EXPIRATION=7d
```

---

## ⚠️ Problema Identificado

❌ El host `sql100.infinityfree.com` **NO es accesible desde la red actual**
- Error: `ENOTFOUND` - DNS no se resuelve
- Causa probable: Firewall corporativo bloqueando conexiones MySQL

✅ **Solución:** Usar VPN para acceder a InfinityFree

---

## 🛠️ Pasos para Probar desde VPN

### Paso 1: Conectar a VPN
```bash
# Conéctate a tu VPN corporativa o servicio VPN
# (Expressvpn, NordVPN, OpenVPN, etc.)
```

### Paso 2: Verificar Conectividad
```bash
# Abre una terminal NUEVA después de conectar VPN
ping sql100.infinityfree.com

# Si funciona, verás:
# PING sql100.infinityfree.com (XXX.XXX.XXX.XXX) ...
# Reply from ... bytes=32 time=XX ms
```

### Paso 3: Probar Conexión MySQL desde VPN
```bash
# Navega al proyecto
cd C:\Users\ROSS\PYTHON\IMPLEMENTACION_API\proyecto-api

# Prueba conexión específica
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
}).then(conn => {
  console.log('✅ CONEXIÓN EXITOSA');
  conn.end();
}).catch(err => {
  console.error('❌ ERROR:', err.message);
});
"
```

### Paso 4: Iniciar Servidor desde VPN
```bash
# Si la conexión fue exitosa:
npm start

# Deberías ver:
# ✓ Conectando a MySQL...
# ✓ Conexión exitosa
# ✓ Servidor ejecutándose en http://localhost:3000
```

### Paso 5: Probar Endpoints
```bash
# NUEVA TERMINAL (con VPN activa)

# Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Crear item (usa el token del login anterior)
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer <TOKEN_AQUI>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test desde VPN",
    "descripcion": "Primer item",
    "estado": true
  }'
```

---

## ⚡ Checklist de Resolución

- [ ] Conectar a VPN
- [ ] Verificar con `ping sql100.infinityfree.com`
- [ ] Ejecutar script de prueba MySQL
- [ ] Iniciar servidor: `npm start`
- [ ] Probar endpoints con curl
- [ ] Verificar datos en phpMyAdmin

---

## ℹ️ Información Importante

### ¿Qué nombre exacto de BD debería usar?
El panel dice: `if0_41710291_XXX`

El `.env` actualmente tiene: `if0_41710291_backend_api`

**Si el nombre es diferente**, actualiza:
```bash
# Edita .env y cambia:
DB_NAME=if0_41710291_NOMBRE_CORRECTO
```

### ¿Dónde ver el nombre exacto?
1. Accede a: https://panel.infinityfree.com
2. Ve a: **MySQL Databases**
3. Busca la sección "Database Name"
4. Copia el nombre exacto
5. Actualiza en `.env`

---

## 🔄 Si aún no funciona desde VPN

### Opción 1: Usar Proxy en VPN
```bash
# Algunos VPN requieren proxy
npm config set http-proxy http://proxy:puerto
npm config set https-proxy https://proxy:puerto
```

### Opción 2: Cambiar de Servidor VPN
- Intenta VPN en diferente ubicación
- Algunos servidores pueden estar bloqueados por InfinityFree

### Opción 3: Usar Alternativa a InfinityFree
Si InfinityFree no funciona, usa:
- **MongoDB Atlas** (gratuito): https://www.mongodb.com/cloud/atlas
- **Firebase** (gratuito): https://firebase.google.com
- **Railway** (gratuito): https://railway.app
- **Render** (gratuito): https://render.com

---

## 📞 Debugging Avanzado

### Ver detalles de conexión
```bash
# En debug mode (muestra más info)
DEBUG=* npm start
```

### Verificar DNS
```bash
nslookup sql100.infinityfree.com
# Debería retornar una IP, no ENODATA
```

### Verificar acceso TCP
```bash
Test-NetConnection -ComputerName sql100.infinityfree.com -Port 3306
```

---

## 🎯 Siguiente Acción

1. **Conecta a VPN** (si tienes disponible)
2. **Prueba ping** a sql100.infinityfree.com
3. **Si funciona:** Ejecuta `npm start`
4. **Si no funciona:** Usa alternativa de BD (MongoDB Atlas es más fácil)

---

**Importante:** Sin VPN o con firewall bloqueado, será imposible conectar a InfinityFree. Si la VPN no funciona, considera usar MongoDB Atlas que es más accesible desde cualquier red.

*Última actualización: 20/04/2026 16:42 UTC*
