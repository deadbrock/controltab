import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const { Pool } = pg;

console.log('🚀 Configurando banco de dados de produção...\n');

// Conectar ao PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('✅ Conectado ao PostgreSQL\n');
    
    // 1. Criar tabela tablets
    console.log('📝 Criando tabela tablets...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS tablets (
        id SERIAL PRIMARY KEY,
        tombamento VARCHAR(255) UNIQUE NOT NULL,
        modelo VARCHAR(255) NOT NULL,
        fabricante VARCHAR(255) NOT NULL,
        sistema_operacional VARCHAR(100) NOT NULL,
        versao_so VARCHAR(50),
        imei VARCHAR(20) UNIQUE NOT NULL,
        numero_serie VARCHAR(255) UNIQUE NOT NULL,
        regiao VARCHAR(20) NOT NULL CHECK(regiao IN ('NORTE', 'NORDESTE')),
        estado VARCHAR(2) NOT NULL,
        cidade VARCHAR(255) NOT NULL,
        endereco TEXT,
        cliente VARCHAR(255) NOT NULL,
        localizacao VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL CHECK(status IN ('ATIVO', 'MANUTENCAO', 'INATIVO', 'SUBSTITUIDO')) DEFAULT 'ATIVO',
        data_aquisicao DATE NOT NULL,
        valor_aquisicao DECIMAL(10, 2),
        fornecedor VARCHAR(255),
        numero_nota_fiscal VARCHAR(100),
        garantia_ate DATE,
        apolice_seguro VARCHAR(100),
        email_conta VARCHAR(255),
        senha_email VARCHAR(255),
        senha_tablet VARCHAR(100),
        numero_telefone VARCHAR(20),
        operadora VARCHAR(100),
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela tablets criada\n');

    // 2. Criar tabela manutencoes
    console.log('📝 Criando tabela manutencoes...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS manutencoes (
        id SERIAL PRIMARY KEY,
        tablet_id INTEGER NOT NULL,
        tipo VARCHAR(20) NOT NULL CHECK(tipo IN ('PREVENTIVA', 'CORRETIVA', 'TROCA_PECAS')),
        descricao TEXT NOT NULL,
        data_inicio DATE NOT NULL,
        data_conclusao DATE,
        tecnico_responsavel VARCHAR(255),
        custo DECIMAL(10, 2),
        status VARCHAR(20) NOT NULL CHECK(status IN ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')) DEFAULT 'AGENDADA',
        observacoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tablet_id) REFERENCES tablets(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabela manutencoes criada\n');

    // 3. Criar tabela falhas
    console.log('📝 Criando tabela falhas...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS falhas (
        id SERIAL PRIMARY KEY,
        tablet_id INTEGER NOT NULL,
        tipo_falha VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        severidade VARCHAR(20) NOT NULL CHECK(severidade IN ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA')),
        data_ocorrencia TIMESTAMP NOT NULL,
        status VARCHAR(20) NOT NULL CHECK(status IN ('ABERTA', 'EM_ANALISE', 'RESOLVIDA', 'NAO_RESOLVIDA')) DEFAULT 'ABERTA',
        solucao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tablet_id) REFERENCES tablets(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabela falhas criada\n');

    // 4. Criar tabela trocas
    console.log('📝 Criando tabela trocas...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS trocas (
        id SERIAL PRIMARY KEY,
        tablet_antigo_id INTEGER NOT NULL,
        tablet_novo_id INTEGER,
        motivo VARCHAR(255) NOT NULL,
        descricao_detalhada TEXT,
        data_troca DATE NOT NULL,
        responsavel VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tablet_antigo_id) REFERENCES tablets(id) ON DELETE CASCADE,
        FOREIGN KEY (tablet_novo_id) REFERENCES tablets(id) ON DELETE SET NULL
      )
    `);
    console.log('✅ Tabela trocas criada\n');

    // 5. Criar tabela historico_uso
    console.log('📝 Criando tabela historico_uso...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS historico_uso (
        id SERIAL PRIMARY KEY,
        tablet_id INTEGER NOT NULL,
        evento VARCHAR(100) NOT NULL,
        descricao TEXT,
        data_evento TIMESTAMP NOT NULL,
        usuario VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tablet_id) REFERENCES tablets(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ Tabela historico_uso criada\n');

    // 6. Criar tabela users
    console.log('📝 Criando tabela users...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'user')) DEFAULT 'user',
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela users criada\n');

    // 7. Criar índices
    console.log('📝 Criando índices...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tablets_status ON tablets(status);
      CREATE INDEX IF NOT EXISTS idx_tablets_regiao ON tablets(regiao);
      CREATE INDEX IF NOT EXISTS idx_tablets_cliente ON tablets(cliente);
      CREATE INDEX IF NOT EXISTS idx_manutencoes_tablet ON manutencoes(tablet_id);
      CREATE INDEX IF NOT EXISTS idx_falhas_tablet ON falhas(tablet_id);
      CREATE INDEX IF NOT EXISTS idx_trocas_tablet_antigo ON trocas(tablet_antigo_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);
    console.log('✅ Índices criados\n');

    // 8. Verificar se admin existe
    const adminCheck = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [process.env.ADMIN_EMAIL]
    );

    if (adminCheck.rows.length === 0) {
      console.log('👤 Criando usuário administrador...');
      
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      
      await client.query(`
        INSERT INTO users (name, email, password, role, active)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        process.env.ADMIN_NAME || 'Administrador',
        process.env.ADMIN_EMAIL,
        hashedPassword,
        'admin',
        true
      ]);
      
      console.log('✅ Usuário admin criado\n');
    } else {
      console.log('ℹ️  Usuário admin já existe\n');
    }

    // 9. Verificar resultado
    const result = await client.query('SELECT id, name, email, role FROM users');
    console.log('👥 Usuários cadastrados:');
    console.log(result.rows);
    console.log('');

    console.log('🎉 Setup completo!\n');
    console.log('📋 Credenciais de Acesso:');
    console.log('─────────────────────────────────');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔑 Senha: ${process.env.ADMIN_PASSWORD}`);
    console.log('─────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Erro no setup:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase()
  .then(() => {
    console.log('✅ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
