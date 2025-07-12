// Script de prueba para el sistema de caché
// Ejecutar en la consola del navegador para verificar funcionamiento

import { cacheManager, CACHE_KEYS } from './cache';

export async function testCacheSystem() {
  console.log('🧪 Iniciando pruebas del sistema de caché...\n');

  // Test 1: Configuración inicial
  console.log('📊 Estadísticas iniciales:', cacheManager.getStats());

  // Test 2: Guardar y recuperar datos
  const testData = {
    id: 'test-album-123',
    name: 'Test Album',
    artist: 'Test Artist',
    tracks: ['Track 1', 'Track 2', 'Track 3']
  };

  console.log('\n💾 Guardando datos de prueba...');
  await cacheManager.set(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123', testData);
  
  console.log('📖 Recuperando datos...');
  const retrievedData = await cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123');
  
  if (retrievedData && JSON.stringify(retrievedData) === JSON.stringify(testData)) {
    console.log('✅ Test 2 PASADO: Datos guardados y recuperados correctamente');
  } else {
    console.log('❌ Test 2 FALLIDO: Error en guardado/recuperación');
  }

  // Test 3: Verificar estadísticas después de guardar
  console.log('\n📊 Estadísticas después de guardar:', cacheManager.getStats());

  // Test 4: Invalidación específica
  console.log('\n🗑️ Probando invalidación específica...');
  await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123');
  const afterInvalidation = await cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, 'test-album-123');
  
  if (afterInvalidation === null) {
    console.log('✅ Test 4 PASADO: Invalidación específica funciona');
  } else {
    console.log('❌ Test 4 FALLIDO: Invalidación específica no funciona');
  }

  // Test 5: Múltiples items
  console.log('\n📦 Probando múltiples items...');
  const testItems = [
    { id: 'album-1', name: 'Album 1' },
    { id: 'album-2', name: 'Album 2' },
    { id: 'album-3', name: 'Album 3' }
  ];

  for (const item of testItems) {
    await cacheManager.set(CACHE_KEYS.ALBUM_DETAILS, item.id, item);
  }

  console.log('📊 Estadísticas con múltiples items:', cacheManager.getStats());

  // Test 6: Invalidación por prefijo
  console.log('\n🗑️ Probando invalidación por prefijo...');
  await cacheManager.invalidate(CACHE_KEYS.ALBUM_DETAILS);
  
  const allRetrieved = await Promise.all(
    testItems.map(item => cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, item.id))
  );
  
  const allNull = allRetrieved.every(item => item === null);
  if (allNull) {
    console.log('✅ Test 6 PASADO: Invalidación por prefijo funciona');
  } else {
    console.log('❌ Test 6 FALLIDO: Invalidación por prefijo no funciona');
  }

  // Test 7: Limpieza completa
  console.log('\n🧹 Probando limpieza completa...');
  await cacheManager.clear();
  console.log('📊 Estadísticas después de limpieza:', cacheManager.getStats());

  console.log('\n🎉 Pruebas completadas!');
}

// Función para probar rendimiento
export async function testCachePerformance() {
  console.log('⚡ Iniciando pruebas de rendimiento...\n');

  const iterations = 100;
  const testData = { id: 'perf-test', data: 'x'.repeat(1000) };

  // Test sin caché (simulado)
  console.log('📊 Probando sin caché...');
  const startWithoutCache = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    // Simular petición al servidor
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  const timeWithoutCache = performance.now() - startWithoutCache;
  console.log(`⏱️ Tiempo sin caché: ${timeWithoutCache.toFixed(2)}ms`);

  // Test con caché
  console.log('\n📊 Probando con caché...');
  const startWithCache = performance.now();
  
  for (let i = 0; i < iterations; i++) {
    await cacheManager.get(CACHE_KEYS.ALBUM_DETAILS, 'perf-test');
  }
  
  const timeWithCache = performance.now() - startWithCache;
  console.log(`⏱️ Tiempo con caché: ${timeWithCache.toFixed(2)}ms`);

  const improvement = ((timeWithoutCache - timeWithCache) / timeWithoutCache) * 100;
  console.log(`🚀 Mejora de rendimiento: ${improvement.toFixed(1)}%`);
}

// Función para limpiar datos de prueba
export async function cleanupTestData() {
  console.log('🧹 Limpiando datos de prueba...');
  await cacheManager.clear();
  console.log('✅ Datos de prueba eliminados');
}

// Exportar funciones para uso en consola
if (typeof window !== 'undefined') {
  (window as any).testCacheSystem = testCacheSystem;
  (window as any).testCachePerformance = testCachePerformance;
  (window as any).cleanupTestData = cleanupTestData;
  
  console.log('🔧 Funciones de prueba disponibles:');
  console.log('- testCacheSystem()');
  console.log('- testCachePerformance()');
  console.log('- cleanupTestData()');
} 