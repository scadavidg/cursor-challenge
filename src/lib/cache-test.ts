// Script de prueba para el sistema de caché
// Ejecutar en la consola del navegador para verificar funcionamiento

import { cacheManager, CACHE_KEYS } from './cache';
import { TestLogger } from "./test-utils";

export async function testCacheSystem() {
  TestLogger.log('🧪 Iniciando pruebas del sistema de caché...\n');

  // Test 1: Configuración inicial
  TestLogger.log('📊 Estadísticas iniciales:', cacheManager.getStats());

  // Test 2: Guardar y recuperar datos
  const testData = {
    id: 'test-album-123',
    name: 'Test Album',
    artist: 'Test Artist',
    tracks: ['Track 1', 'Track 2', 'Track 3']
  };

  TestLogger.log('\n💾 Guardando datos de prueba...');
  await cacheManager.set(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123', testData);
  
  TestLogger.log('📖 Recuperando datos...');
  const retrievedData = await cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123');
  
  if (retrievedData && JSON.stringify(retrievedData) === JSON.stringify(testData)) {
    TestLogger.testResult('Test 2', true, 'Datos guardados y recuperados correctamente');
  } else {
    TestLogger.testResult('Test 2', false, 'Error en guardado/recuperación');
  }

  // Test 3: Verificar estadísticas después de guardar
  TestLogger.log('\n📊 Estadísticas después de guardar:', cacheManager.getStats());

  // Test 4: Invalidación específica
  TestLogger.log('\n🗑️ Probando invalidación específica...');
  await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123');
  const afterInvalidation = await cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123');
  
  if (afterInvalidation === null) {
    TestLogger.testResult('Test 4', true, 'Invalidación específica funciona');
  } else {
    TestLogger.testResult('Test 4', false, 'Invalidación específica no funciona');
  }

  // Test 5: Múltiples items
  TestLogger.log('\n📦 Probando múltiples items...');
  const testItems = [
    { id: 'album-1', name: 'Album 1' },
    { id: 'album-2', name: 'Album 2' },
    { id: 'album-3', name: 'Album 3' }
  ];

  for (const item of testItems) {
    await cacheManager.set(CACHE_KEYS.ALBUM_DETAILS, item.id, item);
  }

  TestLogger.log('📊 Estadísticas con múltiples items:', cacheManager.getStats());

  // Test 6: Invalidación por prefijo
  TestLogger.log('\n🗑️ Probando invalidación por prefijo...');
  await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS);
  
  const allRetrieved = await Promise.all(
    testItems.map(item => cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, item.id))
  );
  
  const allNull = allRetrieved.every(item => item === null);
  if (allNull) {
    TestLogger.testResult('Test 6', true, 'Invalidación por prefijo funciona');
  } else {
    TestLogger.testResult('Test 6', false, 'Invalidación por prefijo no funciona');
  }

  // Test 7: Limpieza completa
  TestLogger.log('\n🧹 Probando limpieza completa...');
  await cacheManager.clear();
  TestLogger.log('📊 Estadísticas después de limpieza:', cacheManager.getStats());

  TestLogger.log('\n🎉 Pruebas completadas!');
}

// Función para probar rendimiento
export async function testCachePerformance() {
  TestLogger.log('⚡ Iniciando pruebas de rendimiento...\n');

  const iterations = 100;
  const testData = { id: 'perf-test', data: 'x'.repeat(1000) };

  // Test sin caché (simulado)
  TestLogger.log('📊 Probando sin caché...');
  const startWithoutCache = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    // Simular petición al servidor
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  const timeWithoutCache = performance.now() - startWithoutCache;
  TestLogger.performanceTest('Tiempo sin caché', timeWithoutCache);

  // Test con caché
  TestLogger.log('\n📊 Probando con caché...');
  const startWithCache = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, 'perf-test');
  }
  
  const timeWithCache = performance.now() - startWithCache;
  TestLogger.performanceTest('Tiempo con caché', timeWithCache);

  const improvement = ((timeWithoutCache - timeWithCache) / timeWithoutCache) * 100;
  TestLogger.performanceTest('Mejora de rendimiento', improvement);
}

// Función para limpiar datos de prueba
export async function cleanupTestData() {
  TestLogger.log('🧹 Limpiando datos de prueba...');
  await cacheManager.clear();
  TestLogger.log('✅ Datos de prueba eliminados');
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
  (window as any).testCacheSystem = testCacheSystem;
  (window as any).testCachePerformance = testCachePerformance;
  (window as any).cleanupTestData = cleanupTestData;
  
  TestLogger.log('🔧 Funciones de prueba disponibles:');
  TestLogger.log('- testCacheSystem()');
  TestLogger.log('- testCachePerformance()');
  TestLogger.log('- cleanupTestData()');
} 