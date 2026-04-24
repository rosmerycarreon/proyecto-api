#!/usr/bin/env node

/**
 * Script para detectar el host correcto de InfinityFree
 * Uso: node test-infinity-hosts.js
 */

const dns = require('dns').promises;
const net = require('net');

// Lista de hosts comunes de InfinityFree a probar
const HOSTS_TO_TEST = [
  'sql100.infinityfree.com',
  'sql101.infinityfree.com',
  'sql102.infinityfree.com',
  'sql103.infinityfree.com',
  'sql104.infinityfree.com',
  'sql105.infinityfree.com',
  'sql300.infinityfree.com',
  'sql301.infinityfree.com',
  'db.infinityfree.com',
  'mysql.infinityfree.com',
];

const PORT = 3306;

async function testDNS(host) {
  try {
    const addresses = await dns.resolve4(host);
    console.log(`  ✅ DNS Resuelto: ${addresses.join(', ')}`);
    return true;
  } catch (error) {
    console.log(`  ❌ DNS No resolvible: ${error.message}`);
    return false;
  }
}

async function testPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 3000; // 3 segundos

    socket.setTimeout(timeout);

    socket.on('connect', () => {
      console.log(`  ✅ Puerto ${port} abierto`);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', (error) => {
      console.log(`  ❌ Puerto ${port} cerrado/no accesible: ${error.message}`);
      resolve(false);
    });

    socket.on('timeout', () => {
      console.log(`  ⏱️  Timeout en puerto ${port}`);
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

async function testHost(host) {
  console.log(`\n🔍 Probando: ${host}`);
  console.log('─'.repeat(50));

  // Probar DNS
  const dnsOk = await testDNS(host);

  // Probar puerto si DNS resolvió
  let portOk = false;
  if (dnsOk) {
    portOk = await testPort(host, PORT);
  }

  return { host, dnsOk, portOk };
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  🔧 DETECTOR DE HOSTS - InfinityFree MySQL        ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const results = [];

  for (const host of HOSTS_TO_TEST) {
    const result = await testHost(host);
    results.push(result);
  }

  // Mostrar resumen
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  📊 RESUMEN DE RESULTADOS                          ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  console.log('| Host | DNS | Puerto |');
  console.log('|------|-----|--------|');

  results.forEach(({ host, dnsOk, portOk }) => {
    const dnsBadge = dnsOk ? '✅' : '❌';
    const portBadge = portOk ? '✅' : '❌';
    console.log(`| ${host.padEnd(30)} | ${dnsBadge} | ${portBadge} |`);
  });

  // Recomendaciones
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  💡 RECOMENDACIONES                               ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const workingHosts = results.filter(r => r.dnsOk && r.portOk).map(r => r.host);
  const dnsHosts = results.filter(r => r.dnsOk && !r.portOk).map(r => r.host);

  if (workingHosts.length > 0) {
    console.log('✅ HOSTS QUE FUNCIONAN:');
    workingHosts.forEach(host => {
      console.log(`   - ${host}`);
      console.log(`     Actualiza tu .env: DB_HOST=${host}`);
    });
  } else if (dnsHosts.length > 0) {
    console.log('⚠️  HOSTS CON DNS RESOLVIBLE (pero puerto cerrado):');
    dnsHosts.forEach(host => {
      console.log(`   - ${host}`);
      console.log(`     Intenta con puerto 3307 en el .env`);
    });
  } else {
    console.log('❌ NINGÚN HOST FUNCIONÓ');
    console.log('   Causas posibles:');
    console.log('   1. Red restringida / Firewall corporativo');
    console.log('   2. Host incorrecto en la lista');
    console.log('   3. InfinityFree no permite acceso remoto');
    console.log('   4. Credenciales incorrectas');
  }

  console.log('\n┌────────────────────────────────────────────────────┐');
  console.log('│ Para actualizar el .env con el host encontrado:  │');
  console.log('│                                                  │');
  console.log('│ 1. Abre .env en tu editor                       │');
  console.log('│ 2. Busca: DB_HOST=                              │');
  console.log('│ 3. Reemplaza con: DB_HOST=<host_funcionante>   │');
  console.log('│ 4. Guarda el archivo                            │');
  console.log('│ 5. Ejecuta: npm start                           │');
  console.log('└────────────────────────────────────────────────────┘\n');
}

main().catch(console.error);
