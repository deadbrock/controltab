import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { query, execute, queryOne } from './connection.js';

dotenv.config();

console.log('🌱 Criando usuário administrador...\n');

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@controltab.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    // Verificar se já existe um admin
    const existingAdmin = await queryOne(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );

    if (existingAdmin) {
      console.log('⚠️  Usuário administrador já existe!');
      console.log(`📧 Email: ${adminEmail}`);
      console.log('\n💡 Para criar novo admin, delete o existente ou use outro email.\n');
      process.exit(0);
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Inserir admin
    await execute(
      `INSERT INTO users (name, email, password, role, active) 
       VALUES (?, ?, ?, 'admin', 1)`,
      [adminName, adminEmail, hashedPassword]
    );

    console.log('✅ Usuário administrador criado com sucesso!\n');
    console.log('📋 Credenciais de Acesso:');
    console.log('─────────────────────────────────');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Senha: ${adminPassword}`);
    console.log('─────────────────────────────────');
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');
    console.log('🚀 Agora você pode iniciar o sistema com: npm run dev\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error);
    process.exit(1);
  }
};

seedAdmin();
