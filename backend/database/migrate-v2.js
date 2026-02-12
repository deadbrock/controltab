import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'controltab.db');
const sqlite = sqlite3.verbose();

console.log('🔄 Iniciando migração V2 - Novos campos...\n');

const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
});

// Migração V2: Adicionar campos financeiros, credenciais e telefone
db.serialize(() => {
  db.all("PRAGMA table_info(tablets)", (err, columns) => {
    if (err) {
      console.error('❌ Erro ao verificar estrutura da tabela:', err);
      db.close();
      return;
    }

    const columnNames = columns.map(col => col.name);
    const newColumns = [
      { name: 'valor_aquisicao', type: 'REAL', default: null },
      { name: 'fornecedor', type: 'TEXT', default: null },
      { name: 'numero_nota_fiscal', type: 'TEXT', default: null },
      { name: 'garantia_ate', type: 'TEXT', default: null },
      { name: 'apolice_seguro', type: 'TEXT', default: null },
      { name: 'email_conta', type: 'TEXT', default: null },
      { name: 'senha_email', type: 'TEXT', default: null },
      { name: 'senha_tablet', type: 'TEXT', default: null },
      { name: 'numero_telefone', type: 'TEXT', default: null },
      { name: 'operadora', type: 'TEXT', default: null }
    ];

    let migrationsNeeded = [];
    
    newColumns.forEach(col => {
      if (!columnNames.includes(col.name)) {
        migrationsNeeded.push(col);
      }
    });

    if (migrationsNeeded.length === 0) {
      console.log('✅ Banco de dados já está atualizado com a V2!');
      console.log('✅ Todas as colunas necessárias existem.\n');
      db.close();
      return;
    }

    console.log(`📝 Encontradas ${migrationsNeeded.length} colunas para adicionar:\n`);
    
    let completed = 0;
    migrationsNeeded.forEach(col => {
      const defaultValue = col.default !== null ? `DEFAULT '${col.default}'` : '';
      const sql = `ALTER TABLE tablets ADD COLUMN ${col.name} ${col.type} ${defaultValue}`;
      
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Erro ao adicionar coluna ${col.name}:`, err.message);
        } else {
          console.log(`✅ Coluna '${col.name}' adicionada com sucesso`);
        }
        
        completed++;
        if (completed === migrationsNeeded.length) {
          console.log('\n🎉 Migração V2 concluída com sucesso!');
          console.log('📋 Novos campos disponíveis:');
          console.log('   - Informações Financeiras (valor, fornecedor, NF)');
          console.log('   - Garantia e Seguro');
          console.log('   - Credenciais (email e senhas)');
          console.log('   - Telefone/Chip\n');
          db.close();
        }
      });
    });
  });
});
