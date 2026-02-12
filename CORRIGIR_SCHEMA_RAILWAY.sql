-- Corrigir schema PostgreSQL para permitir NULL em data_aquisicao
-- Execute este SQL diretamente no console PostgreSQL do Railway

ALTER TABLE tablets ALTER COLUMN data_aquisicao DROP NOT NULL;

-- Verificar se funcionou
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'tablets' AND column_name = 'data_aquisicao';
