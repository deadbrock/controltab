import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'controltab.db');
const sqlite = sqlite3.verbose();

console.log('🔄 Iniciando migração do banco de dados...\n');

const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
    process.exit(1);
  }
});

// Migração: Adicionar novos campos
db.serialize(() => {
  // Verificar se as colunas já existem
  db.all("PRAGMA table_info(tablets)", (err, columns) => {
    if (err) {
      console.error('❌ Erro ao verificar estrutura da tabela:', err);
      db.close();
      return;
    }

    const columnNames = columns.map(col => col.name);
    const newColumns = [
      { name: 'estado', type: 'TEXT', default: "AC" },
      { name: 'cidade', type: 'TEXT', default: "Não especificado" },
      { name: 'endereco', type: 'TEXT', default: null },
      { name: 'cliente', type: 'TEXT', default: "Cliente Padrão" }
    ];

    let migrationsNeeded = [];
    
    newColumns.forEach(col => {
      if (!columnNames.includes(col.name)) {
        migrationsNeeded.push(col);
      }
    });

    if (migrationsNeeded.length === 0) {
      console.log('✅ Banco de dados já está atualizado!');
      console.log('✅ Todas as colunas necessárias existem.\n');
      db.close();
      return;
    }

    console.log(`📝 Encontradas ${migrationsNeeded.length} colunas para adicionar:\n`);
    
    // Adicionar cada coluna faltante
    let completed = 0;
    migrationsNeeded.forEach(col => {
      const defaultValue = col.default ? `DEFAULT '${col.default}'` : '';
      const sql = `ALTER TABLE tablets ADD COLUMN ${col.name} ${col.type} ${defaultValue}`;
      
      db.run(sql, (err) => {
        if (err) {
          console.error(`❌ Erro ao adicionar coluna ${col.name}:`, err.message);
        } else {
          console.log(`✅ Coluna '${col.name}' adicionada com sucesso`);
        }
        
        completed++;
        if (completed === migrationsNeeded.length) {
          console.log('\n🎉 Migração concluída com sucesso!');
          console.log('📋 Nota: Tablets existentes foram preenchidos com valores padrão.');
          console.log('   Edite cada tablet para atualizar as informações.\n');
          db.close();
        }
      });
    });
  });
});
