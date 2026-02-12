import { query, execute, dbType } from './connection.js';

console.log('🔄 Iniciando migração de autenticação...\n');
console.log(`📦 Usando banco: ${dbType}\n`);

const migrateAuth = async () => {
  try {
    // SQL adaptado para ambos os bancos
    const createUsersTable = dbType === 'postgres' 
      ? `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'user')) DEFAULT 'user',
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      `
      : `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL CHECK(role IN ('admin', 'user')) DEFAULT 'user',
          active INTEGER DEFAULT 1,
          created_at TEXT DEFAULT (datetime('now', 'localtime')),
          updated_at TEXT DEFAULT (datetime('now', 'localtime'))
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      `;

    // Executar criação da tabela
    if (dbType === 'postgres') {
      const statements = createUsersTable.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          await execute(statement);
        }
      }
    } else {
      await execute(createUsersTable);
    }

    console.log('✅ Tabela "users" criada com sucesso');
    console.log('✅ Índices criados com sucesso');
    console.log('\n🎉 Migração de autenticação concluída!\n');
    console.log('📝 Próximo passo: Execute "npm run seed:admin" para criar o usuário administrador\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    process.exit(1);
  }
};

migrateAuth();
