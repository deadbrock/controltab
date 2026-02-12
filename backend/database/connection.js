import sqlite3 from 'sqlite3';
import pg from 'pg';
import dbConfig from '../config/database.js';

const { Pool } = pg;

let db = null;
let dbType = dbConfig.type;

// Inicializar conexão com base no tipo de banco
if (dbType === 'postgres') {
  // PostgreSQL
  db = new Pool(dbConfig.postgres);
  
  db.on('error', (err) => {
    console.error('❌ Erro no pool do PostgreSQL:', err);
  });

  console.log('✅ Configurado para usar PostgreSQL');
} else {
  // SQLite
  const sqlite = sqlite3.verbose();
  const sqliteDb = new sqlite.Database(dbConfig.sqlite.path, (err) => {
    if (err) {
      console.error('❌ Erro ao conectar ao SQLite:', err);
    } else {
      console.log('✅ Conectado ao SQLite');
    }
  });

  sqliteDb.run('PRAGMA foreign_keys = ON');

  // Wrapper para compatibilidade
  db = {
    run: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqliteDb.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    
    get: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqliteDb.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    },
    
    all: (sql, params = []) => {
      return new Promise((resolve, reject) => {
        sqliteDb.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  };

  console.log('✅ Configurado para usar SQLite');
}

// Converter placeholders ? para $1, $2, $3 (PostgreSQL)
const convertPlaceholders = (sql) => {
  if (dbType !== 'postgres') return sql;
  
  let index = 0;
  return sql.replace(/\?/g, () => {
    index++;
    return `$${index}`;
  });
};

// Funções adaptadas para ambos os bancos
export const query = async (sql, params = []) => {
  const adaptedSql = convertPlaceholders(sql);
  
  if (dbType === 'postgres') {
    const result = await db.query(adaptedSql, params);
    return result.rows;
  } else {
    return await db.all(sql, params);
  }
};

export const queryOne = async (sql, params = []) => {
  const adaptedSql = convertPlaceholders(sql);
  
  if (dbType === 'postgres') {
    const result = await db.query(adaptedSql, params);
    return result.rows[0];
  } else {
    return await db.get(sql, params);
  }
};

export const execute = async (sql, params = []) => {
  const adaptedSql = convertPlaceholders(sql);
  
  if (dbType === 'postgres') {
    // Para INSERT, tentar retornar o ID
    const sqlTrimmed = sql.trim().toUpperCase();
    const isInsert = sqlTrimmed.startsWith('INSERT');
    
    if (isInsert && !adaptedSql.toUpperCase().includes('RETURNING')) {
      // Adicionar RETURNING id se não tiver
      // Remover ponto e vírgula e espaços no final, depois adicionar RETURNING
      const cleanSql = adaptedSql.replace(/;\s*$/g, '').trim();
      const sqlWithReturning = cleanSql + ' RETURNING id';
      
      try {
        const result = await db.query(sqlWithReturning, params);
        return { 
          lastID: result.rows[0]?.id, 
          changes: result.rowCount 
        };
      } catch (error) {
        console.error('❌ Erro no execute (PostgreSQL):', error.message);
        console.error('SQL:', sqlWithReturning);
        console.error('Params:', params);
        throw error;
      }
    } else {
      try {
        const result = await db.query(adaptedSql, params);
        return { 
          lastID: result.rows[0]?.id, 
          changes: result.rowCount 
        };
      } catch (error) {
        console.error('❌ Erro no execute (PostgreSQL):', error.message);
        console.error('SQL:', adaptedSql);
        console.error('Params:', params);
        throw error;
      }
    }
  } else {
    return await db.run(sql, params);
  }
};

export { dbType };
export default db;
