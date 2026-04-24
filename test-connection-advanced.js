#!/usr/bin/env node

/**
 * Script de Diagnóstico Avanzado de Conexión
 * Intenta múltiples métodos para detectar el problema
 * Uso: node test-connection-advanced.js
 */

const dns = require('dns').promises;
const net = require('net');
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║  🔍 DIAGNÓSTICO AVANZADO DE CONEXIÓN             ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

// Configuración
const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

console.log('📋 Configuración:');
console.log(`  Host:     ${config.host}`);
console.log(`  Usuario:  ${config.user}`);
console.log(`  BD:       ${config.database}`);
console.log(`  Puerto:   ${config.port}\n`);

// Funciones de prueba
async function testDNS() {
  console.log('🧪 TEST 1: Resolución DNS');
  console.log('─'.repeat(50));
  try {
    const addresses = await dns.resolve4(config.host);
    console.log(`  ✅ ÉXITO: Host resolvió a ${addresses.join(', ')}\n`);
    return true;
  } catch (error) {
    console.log(`  ❌ FALLO: ${error.message}\n`);
    return false;
  }
}

function testPort(host, port) {
  return new Promise((resolve) => {
    console.log(`🧪 TEST 2: Conectividad TCP (Puerto ${port})`);
    console.log('─'.repeat(50));
    
    const socket = new net.Socket();
    const timeout = 5000;

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      console.log(`  ✅ ÉXITO: Puerto ${port} accesible\n`);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', (error) => {
      console.log(`  ❌ FALLO: ${error.message}\n`);
      resolve(false);
    });

    socket.on('timeout', () => {
      console.log(`  ❌ FALLO: Timeout (${timeout}ms)\n`);
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function testMySQLConnection() {
  console.log('🧪 TEST 3: Conexión MySQL');
  console.log('─'.repeat(50));
  
  try {
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port,
      connectTimeout: 5000,
    });

    console.log('  ✅ ÉXITO: Conexión MySQL establecida');
    
    // Test query
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('  ✅ Query ejecutada correctamente');
    
    await connection.end();
    console.log('');
    return true;
  } catch (error) {
    console.log(`  ❌ FALLO: ${error.message}\n`);
    return false;
  }
}

async function testMySQLWithDB() {
  console.log('🧪 TEST 4: Conexión MySQL (con BD)');
  console.log('─'.repeat(50));
  
  try {
    const connection = await mysql.createConnection(config);

    console.log('  ✅ ÉXITO: Conectado a BD');
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`  ✅ Tablas encontradas: ${tables.length}`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`     - ${tableName}`);
    });
    
    await connection.end();
    console.log('');
    return true;
  } catch (error) {
    console.log(`  ❌ FALLO: ${error.message}\n`);
    return false;
  }
}

async function runDiagnostics() {
  const results = {};

  // Test DNS
  results.dns = await testDNS();

  // Test Puerto
  if (results.dns) {
    results.port = await testPort(config.host, config.port);
  } else {
    console.log('⏭️  Saltando TEST 2 (DNS falló)\n');
    results.port = false;
  }

  // Test MySQL
  if (results.port) {
    results.mysql = await testMySQLConnection();
  } else {
    console.log('⏭️  Saltando TEST 3 (Puerto no accesible)\n');
    results.mysql = false;
  }

  // Test MySQL con BD
  if (results.mysql) {
    results.mysqlDB = await testMySQLWithDB();
  } else {
    console.log('⏭️  Saltando TEST 4 (MySQL falló)\n');
    results.mysqlDB = false;
  }

  // Resumen
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  📊 RESUMEN DE DIAGNÓSTICO                        ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  console.log('RESULTADOS:');
  console.log(`  TEST 1 (DNS):            ${results.dns ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  TEST 2 (Puerto):         ${results.port ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  TEST 3 (MySQL):          ${results.mysql ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  TEST 4 (MySQL + BD):     ${results.mysqlDB ? '✅ PASS' : '❌ FAIL'}\n`);

  // Recomendaciones
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  💡 RECOMENDACIONES                               ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  if (results.mysqlDB) {
    console.log('🎉 ¡EXCELENTE! Conexión completamente funcional');
    console.log('\nPróximos pasos:');
    console.log('  1. Ejecuta: npm start');
    console.log('  2. Accede a: http://localhost:3000');
    console.log('  3. Prueba los endpoints\n');
  } else if (results.mysql) {
    console.log('⚠️  Conexión MySQL OK pero no se puede acceder a la BD');
    console.log('\nProbables causas:');
    console.log('  - BD no existe');
    console.log('  - Nombre de BD incorrecto');
    console.log('  - Usuario no tiene permisos\n');
  } else if (results.port) {
    console.log('⚠️  Puerto TCP accesible pero MySQL no responde');
    console.log('\nProbables causas:');
    console.log('  - MySQL no está ejecutándose');
    console.log('  - Credenciales incorrectas');
    console.log('  - Puerto es otro servicio\n');
  } else if (results.dns) {
    console.log('❌ Host resolvió pero puerto no es accesible');
    console.log('\nProbables causas:');
    console.log('  - Firewall corporativo bloqueando puerto 3306');
    console.log('  - SOLUCIÓN: Usar VPN');
    console.log('  - ALTERNATIVA: Cambiar a MongoDB Atlas\n');
  } else {
    console.log('❌ DNS no resolvió el host');
    console.log('\nProbables causas:');
    console.log('  - Firewall corporativo bloqueando DNS');
    console.log('  - Red sin acceso a internet');
    console.log('  - SOLUCIÓN: Usar VPN');
    console.log('  - ALTERNATIVA: Cambiar a MongoDB Atlas\n');
  }

  // Opciones
  console.log('╔═══════════════════════════════════════════════════╗');
  console.log('║  🚀 OPCIONES DISPONIBLES                          ║');
  console.log('╚═══════════════════════════════════════════════════╝\n');

  if (!results.mysqlDB) {
    console.log('Opción 1: Usar VPN (RECOMENDADA)');
    console.log('  - Conecta tu VPN corporativa');
    console.log('  - Abre terminal nueva');
    console.log('  - Ejecuta: npm start\n');

    console.log('Opción 2: Cambiar a MongoDB Atlas');
    console.log('  - Más fácil de configurar');
    console.log('  - Funciona desde cualquier red');
    console.log('  - URL: https://www.mongodb.com/cloud/atlas\n');

    console.log('Opción 3: Probar desde otra red');
    console.log('  - Red del hogar');
    console.log('  - Hotspot móvil');
    console.log('  - Red pública\n');
  }
}

// Ejecutar diagnóstico
runDiagnostics().catch(console.error);
