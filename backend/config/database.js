import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  development: {
    type: process.env.DB_TYPE || 'sqlite',
    sqlite: {
      path: process.env.DB_PATH || join(__dirname, '../database/controltab.db')
    },
    postgres: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
  },
  production: {
    type: 'postgres',
    postgres: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  }
};

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

export default dbConfig;
