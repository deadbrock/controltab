import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

async function fixSchema() {
  console.log('🔧 Iniciando correção do schema...\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Alterar data_aquisicao para permitir NULL
    console.log('📝 Alterando coluna data_aquisicao...');
    await pool.query('ALTER TABLE tablets ALTER COLUMN data_aquisicao DROP NOT NULL');
    console.log('✅ Coluna data_aquisicao agora permite NULL\n');

    // Verificar
    const result = await pool.query(`
      SELECT column_name, is_nullable, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'tablets' AND column_name = 'data_aquisicao'
    `);

    console.log('📊 Verificação:');
    console.table(result.rows);

    console.log('\n✅ Schema corrigido com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao corrigir schema:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixSchema();
