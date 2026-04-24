#!/usr/bin/env node

/**
 * Script de verificación rápida - Ejecutar desde VPN
 * Uso: node verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  ✅ VERIFICADOR DE CONFIGURACIÓN DEL PROYECTO     ║');
console.log('╚════════════════════════════════════════════════════╝\n');

// 1. Verificar archivos clave
console.log('📁 Verificando estructura de archivos...');
const requiredFiles = [
  'package.json',
  '.env',
  'src/index.js',
  'src/controllers/authController.js',
  'src/controllers/itemsController.js',
  'src/models/User.js',
  'src/models/Item.js',
  'src/routes/authRoutes.js',
  'src/routes/itemsRoutes.js'
];

let filesOk = true;
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) filesOk = false;
});

// 2. Verificar variables de entorno
console.log('\n🔧 Verificando variables de entorno (.env)...');
require('dotenv').config();

const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_PORT',
  'JWT_SECRET',
  'JWT_EXPIRATION'
];

let envOk = true;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const exists = !!value;
  const maskedValue = varName.includes('PASSWORD') 
    ? '***' + value.slice(-3)
    : value;
  console.log(`  ${exists ? '✅' : '❌'} ${varName}${exists ? ` = ${maskedValue}` : ' (FALTA)'}`);
  if (!exists) envOk = false;
});

// 3. Verificar dependencias
console.log('\n📦 Verificando dependencias npm...');
try {
  require('express');
  console.log('  ✅ express');
  require('mysql2/promise');
  console.log('  ✅ mysql2');
  require('jsonwebtoken');
  console.log('  ✅ jsonwebtoken');
  require('bcryptjs');
  console.log('  ✅ bcryptjs');
  require('dotenv');
  console.log('  ✅ dotenv');
} catch (error) {
  console.log('  ❌ ' + error.message);
  console.log('\n    Ejecuta: npm install');
}

// 4. Resumen final
console.log('\n╔════════════════════════════════════════════════════╗');
console.log('║  📊 RESUMEN DE VERIFICACIÓN                        ║');
console.log('╚════════════════════════════════════════════════════╝\n');

const status = filesOk && envOk ? '✅ LISTO' : '⚠️  REVISAR';
console.log(`Estado General: ${status}\n`);

if (status === '✅ LISTO') {
  console.log('🎉 Todo está configurado correctamente\n');
  console.log('Próximos pasos:');
  console.log('  1. Conecta a VPN');
  console.log('  2. Ejecuta: npm start');
  console.log('  3. Accede a: http://localhost:3000\n');
} else {
  console.log('⚠️  Hay problemas que revisar\n');
  console.log('Soluciones:');
  if (!filesOk) console.log('  - Verifica que todos los archivos existan');
  if (!envOk) console.log('  - Copia .env.example a .env');
  if (!envOk) console.log('  - Actualiza las variables de entorno\n');
}

// 5. Información de conexión
console.log('📡 Configuración de conexión:');
console.log(`  Host: ${process.env.DB_HOST}`);
console.log(`  Usuario: ${process.env.DB_USER}`);
console.log(`  BD: ${process.env.DB_NAME}`);
console.log(`  Puerto: ${process.env.DB_PORT}\n`);

console.log('⚠️  IMPORTANTE: Asegúrate de estar conectado a VPN\n');
