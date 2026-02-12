import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'controltab.db');
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
  }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

// Criar tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS tablets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tombamento TEXT UNIQUE NOT NULL,
    modelo TEXT NOT NULL,
    fabricante TEXT NOT NULL,
    sistema_operacional TEXT NOT NULL,
    versao_so TEXT,
    imei TEXT UNIQUE NOT NULL,
    numero_serie TEXT UNIQUE NOT NULL,
    regiao TEXT NOT NULL CHECK(regiao IN ('NORTE', 'NORDESTE')),
    estado TEXT NOT NULL,
    cidade TEXT NOT NULL,
    endereco TEXT,
    cliente TEXT NOT NULL,
    localizacao TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('ATIVO', 'MANUTENCAO', 'INATIVO', 'SUBSTITUIDO')) DEFAULT 'ATIVO',
    data_aquisicao TEXT NOT NULL,
    valor_aquisicao REAL,
    fornecedor TEXT,
    numero_nota_fiscal TEXT,
    garantia_ate TEXT,
    apolice_seguro TEXT,
    email_conta TEXT,
    senha_email TEXT,
    senha_tablet TEXT,
    numero_telefone TEXT,
    operadora TEXT,
    observacoes TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    updated_at TEXT DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS manutencoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tablet_id INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('PREVENTIVA', 'CORRETIVA', 'TROCA_PECAS')),
    descricao TEXT NOT NULL,
    data_inicio TEXT NOT NULL,
    data_conclusao TEXT,
    tecnico_responsavel TEXT,
    custo REAL,
    status TEXT NOT NULL CHECK(status IN ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA')) DEFAULT 'AGENDADA',
    observacoes TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (tablet_id) REFERENCES tablets(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS falhas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tablet_id INTEGER NOT NULL,
    tipo_falha TEXT NOT NULL,
    descricao TEXT NOT NULL,
    severidade TEXT NOT NULL CHECK(severidade IN ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA')),
    data_ocorrencia TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('ABERTA', 'EM_ANALISE', 'RESOLVIDA', 'NAO_RESOLVIDA')) DEFAULT 'ABERTA',
    solucao TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (tablet_id) REFERENCES tablets(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS trocas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tablet_antigo_id INTEGER NOT NULL,
    tablet_novo_id INTEGER,
    motivo TEXT NOT NULL,
    descricao_detalhada TEXT,
    data_troca TEXT NOT NULL,
    responsavel TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (tablet_antigo_id) REFERENCES tablets(id) ON DELETE CASCADE,
    FOREIGN KEY (tablet_novo_id) REFERENCES tablets(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS historico_uso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tablet_id INTEGER NOT NULL,
    evento TEXT NOT NULL,
    descricao TEXT,
    data_evento TEXT NOT NULL,
    usuario TEXT,
    created_at TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (tablet_id) REFERENCES tablets(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_tablets_status ON tablets(status);
  CREATE INDEX IF NOT EXISTS idx_tablets_regiao ON tablets(regiao);
  CREATE INDEX IF NOT EXISTS idx_manutencoes_tablet ON manutencoes(tablet_id);
  CREATE INDEX IF NOT EXISTS idx_falhas_tablet ON falhas(tablet_id);
  CREATE INDEX IF NOT EXISTS idx_trocas_tablet_antigo ON trocas(tablet_antigo_id);
`, (err) => {
  if (err) {
    console.error('❌ Erro ao criar tabelas:', err);
  } else {
    console.log('✅ Banco de dados inicializado com sucesso!');
  }
});

// Wrapper para promisificar as operações
const dbWrapper = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

export default dbWrapper;
