# Correção do Schema PostgreSQL

## Problema
O campo `data_aquisicao` está definido como `NOT NULL`, mas o sistema permite cadastrar tablets sem essa data.

## Soluções

### Opção 1: Railway Web Console (Mais fácil)
1. Acesse Railway Dashboard
2. Vá no serviço PostgreSQL
3. Clique em "Data" > "Query"
4. Execute este comando:
```sql
ALTER TABLE tablets ALTER COLUMN data_aquisicao DROP NOT NULL;
```

### Opção 2: Railway CLI
No terminal local, execute:
```bash
railway run psql $DATABASE_URL
```

Depois execute:
```sql
ALTER TABLE tablets ALTER COLUMN data_aquisicao DROP NOT NULL;
\q
```

### Opção 3: pgAdmin ou outro cliente PostgreSQL
1. Use a URL de conexão do Railway
2. Conecte ao banco
3. Execute o SQL acima

## Verificação
Após executar, verifique se funcionou:
```sql
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'tablets' AND column_name = 'data_aquisicao';
```

O resultado deve mostrar `is_nullable = YES`.

## Depois de corrigir
Teste cadastrar um novo tablet no sistema.
