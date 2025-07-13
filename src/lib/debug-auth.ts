// Script para debuggear la configuración de NextAuth
// Ejecutar con: npx tsx src/lib/debug-auth.ts

import { authOptions } from './auth';

console.log('=== DEBUG: Configuración de NextAuth ===');
console.log('');

console.log('1. Variables de entorno:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ Configurado' : '❌ No configurado');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ Configurado' : '❌ No configurado');
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✅ Configurado' : '❌ No configurado');
console.log('');

console.log('2. URLs generadas automáticamente:');
const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:9002';
console.log('Base URL:', baseUrl);
console.log('Callback URL para Google:', `${baseUrl}/api/auth/callback/google`);
console.log('');

console.log('3. Configuración de providers:');
if (authOptions.providers) {
  authOptions.providers.forEach((provider, index) => {
    console.log(`Provider ${index + 1}:`, provider.id);
    if (provider.id === 'google') {
      console.log('  - Tipo: Google OAuth');
      console.log('  - Client ID configurado:', !!process.env.GOOGLE_CLIENT_ID);
      console.log('  - Client Secret configurado:', !!process.env.GOOGLE_CLIENT_SECRET);
    }
  });
}
console.log('');

console.log('4. Configuración de sesión:');
console.log('Strategy:', authOptions.session?.strategy);
console.log('Max Age:', authOptions.session?.maxAge, 'segundos');
console.log('Update Age:', authOptions.session?.updateAge, 'segundos');
console.log('');

console.log('5. Páginas personalizadas:');
console.log('Sign In Page:', authOptions.pages?.signIn || '/api/auth/signin');
console.log('');

console.log('=== INSTRUCCIONES PARA GOOGLE CLOUD CONSOLE ===');
console.log('');
console.log('En Google Cloud Console, configura las siguientes URLs:');
console.log('');
console.log('Authorized JavaScript origins:');
console.log(`  ${baseUrl}`);
console.log('');
console.log('Authorized redirect URIs:');
console.log(`  ${baseUrl}/api/auth/callback/google`);
console.log('');
console.log('IMPORTANTE:');
console.log('- No agregues espacios extra');
console.log('- No agregues barras al final');
console.log('- Asegúrate de que coincida exactamente con el puerto y protocolo');
console.log('- Guarda los cambios y espera 5-10 minutos'); 