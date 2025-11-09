#!/usr/bin/env node

/**
 * Script de verificação do ambiente
 * Garante que todas as dependências e configurações estão corretas
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando ambiente do RadarEdu...\n');

let hasErrors = false;

// 1. Verificar Node.js
console.log('📦 Verificando Node.js...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));
if (majorVersion < 18) {
  console.error('❌ Node.js deve ser 18 ou superior. Atual:', nodeVersion);
  hasErrors = true;
} else {
  console.log('✅ Node.js:', nodeVersion);
}

// 2. Verificar package.json
console.log('\n📄 Verificando package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'next',
    'react',
    'typescript',
    '@ai-sdk/openai',
    'whatsapp-web.js',
    'qrcode-terminal'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length > 0) {
    console.error('❌ Dependências faltando:', missingDeps.join(', '));
    hasErrors = true;
  } else {
    console.log('✅ Todas as dependências estão listadas');
  }
} catch (error) {
  console.error('❌ Erro ao ler package.json:', error.message);
  hasErrors = true;
}

// 3. Verificar node_modules
console.log('\n📚 Verificando node_modules...');
if (!fs.existsSync('node_modules')) {
  console.error('❌ node_modules não encontrado. Execute: npm install');
  hasErrors = true;
} else {
  console.log('✅ node_modules existe');
}

// 4. Verificar .env.local
console.log('\n🔑 Verificando variáveis de ambiente...');
if (!fs.existsSync('.env.local')) {
  console.warn('⚠️  .env.local não encontrado');
  console.warn('   Crie o arquivo com: OPENAI_API_KEY=sua_chave');
  hasErrors = true;
} else {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  if (!envContent.includes('OPENAI_API_KEY')) {
    console.warn('⚠️  OPENAI_API_KEY não configurada no .env.local');
    hasErrors = true;
  } else {
    console.log('✅ OPENAI_API_KEY configurada');
  }
}

// 5. Verificar estrutura de pastas
console.log('\n📁 Verificando estrutura de pastas...');
const requiredDirs = [
  'app',
  'app/api',
  'components',
  'data',
  'lib',
  'public'
];

const missingDirs = requiredDirs.filter(dir => !fs.existsSync(dir));
if (missingDirs.length > 0) {
  console.error('❌ Pastas faltando:', missingDirs.join(', '));
  hasErrors = true;
} else {
  console.log('✅ Estrutura de pastas correta');
}

// 6. Verificar arquivos de dados
console.log('\n📊 Verificando arquivos de dados...');
const requiredDataFiles = [
  'data/students.json',
  'data/daily-absences.json',
  'data/absence-notifications.json'
];

const missingFiles = requiredDataFiles.filter(file => !fs.existsSync(file));
if (missingFiles.length > 0) {
  console.error('❌ Arquivos de dados faltando:', missingFiles.join(', '));
  hasErrors = true;
} else {
  console.log('✅ Arquivos de dados presentes');
}

// 7. Verificar TypeScript config
console.log('\n⚙️  Verificando TypeScript...');
if (!fs.existsSync('tsconfig.json')) {
  console.error('❌ tsconfig.json não encontrado');
  hasErrors = true;
} else {
  console.log('✅ tsconfig.json encontrado');
}

// 8. Verificar Next.js config
console.log('\n⚙️  Verificando Next.js...');
if (!fs.existsSync('next.config.mjs')) {
  console.warn('⚠️  next.config.mjs não encontrado');
} else {
  console.log('✅ next.config.mjs encontrado');
}

// Resumo
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('\n❌ Verificação concluída COM ERROS');
  console.error('\nCorreja os problemas acima antes de iniciar o servidor.\n');
  process.exit(1);
} else {
  console.log('\n✅ VERIFICAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('\nSistema pronto para uso. Execute:');
  console.log('  npm run dev    (ou: pnpm dev)');
  console.log('\nDepois acesse: http://localhost:3000\n');
  process.exit(0);
}
