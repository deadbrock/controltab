# 🚀 Deploy Rápido no Railway

## ✅ Arquivos Corrigidos

Os seguintes arquivos foram atualizados para funcionar corretamente no Railway:

- `Dockerfile` - Build do backend
- `railway.json` - Configuração do Railway
- `.dockerignore` - Otimização do build

---

## 📋 Passo a Passo

### 1. Fazer Commit das Alterações

```bash
git add .
git commit -m "fix: corrigir configuração Railway"
git push
```

### 2. Configurar PostgreSQL no Railway

1. No seu projeto Railway, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde o provisionamento
4. Copie a variável `DATABASE_URL` (será usada depois)

### 3. Configurar Variáveis de Ambiente

No serviço do backend, vá em "Variables" e adicione:

```
NODE_ENV=production
PORT=3000

# Banco de Dados
DB_TYPE=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Autenticação (TROQUE ESTES VALORES!)
JWT_SECRET=seu_secret_super_seguro_e_unico_aqui_12345
JWT_EXPIRES_IN=7d

# Frontend (atualize após deploy do Vercel)
FRONTEND_URL=https://seu-app.vercel.app

# Admin Padrão
ADMIN_EMAIL=admin@controltab.com
ADMIN_PASSWORD=SuaSenhaSegura@2024
ADMIN_NAME=Administrador
```

⚠️ **IMPORTANTE:** 
- Troque `JWT_SECRET` por um valor único e seguro
- Use uma senha forte para `ADMIN_PASSWORD`

### 4. Fazer Redeploy

1. Vá em "Deployments"
2. Clique nos 3 pontos do último deploy
3. "Redeploy"

O deploy deve funcionar agora! ✅

### 5. Executar Migrações

Após o deploy bem-sucedido, você precisa criar as tabelas no PostgreSQL.

**Opção A: Via Railway CLI**

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Conectar ao projeto
railway link

# Executar migrações
railway run npm run migrate:auth
railway run npm run seed:admin
```

**Opção B: Via Console do Railway**

1. Vá no serviço do backend
2. Clique em "Settings" → "Deploy"
3. Em "Custom Start Command" temporariamente coloque:
   ```
   npm run migrate:auth && npm run seed:admin && npm start
   ```
4. Redeploy
5. Após completar, remova o comando customizado

**Opção C: Criar script de inicialização**

Já existe um arquivo SQL pronto em `backend/database/init-postgres.sql`

1. Acesse o PostgreSQL no Railway
2. Vá em "Data"
3. Cole e execute o conteúdo de `init-postgres.sql`
4. Depois execute o seed do admin via Railway Run

---

## 🧪 Testar o Deploy

### 1. Testar API

Acesse a URL do seu backend Railway:
```
https://seu-backend.railway.app/health
```

Deve retornar:
```json
{
  "status": "OK",
  "timestamp": "...",
  "uptime": ...
}
```

### 2. Testar Login

```bash
curl -X POST https://seu-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@controltab.com","password":"SuaSenhaSegura@2024"}'
```

Deve retornar um token JWT.

---

## ⚠️ Troubleshooting

### Erro: "Cannot find module 'dotenv'"

✅ **Resolvido!** O Dockerfile já instala todas as dependências.

### Erro: "The executable 'cd' could not be found"

✅ **Resolvido!** O `railway.json` agora usa o Dockerfile corretamente.

### Erro ao conectar ao PostgreSQL

**Verifique:**
1. `DATABASE_URL` está configurada?
2. `DB_TYPE=postgres` está definido?
3. PostgreSQL está rodando no Railway?

**Solução:**
- Copie a `DATABASE_URL` do PostgreSQL Railway
- Cole nas variáveis do backend

### Tabelas não existem

**Causa:** Migrações não foram executadas

**Solução:** Execute as migrações (veja Passo 5 acima)

---

## 🔐 Segurança

### ✅ Checklist:

- [ ] Trocou `JWT_SECRET` por valor único
- [ ] Usou senha forte para admin
- [ ] Configurou `FRONTEND_URL` correta
- [ ] PostgreSQL protegido (interno Railway)
- [ ] Variáveis de ambiente não commitadas

---

## 📊 Estrutura do Deploy

```
Railway Project
├── PostgreSQL
│   └── DATABASE_URL gerado automaticamente
│
└── Backend (ControlTab)
    ├── Build: Dockerfile
    ├── Port: 3000
    └── Variables:
        ├── DB_TYPE=postgres
        ├── DATABASE_URL=${{Postgres.DATABASE_URL}}
        ├── JWT_SECRET=...
        ├── FRONTEND_URL=...
        └── ...
```

---

## 🎯 Próximos Passos

Após o backend estar rodando no Railway:

1. ✅ Anote a URL do backend: `https://_____.railway.app`
2. ✅ Faça deploy do frontend no Vercel
3. ✅ Configure `VITE_API_URL` no Vercel com a URL do backend
4. ✅ Atualize `FRONTEND_URL` no Railway com a URL do Vercel
5. ✅ Teste o sistema completo

---

## 💡 Dicas

### Logs

Ver logs em tempo real:
```bash
railway logs --tail
```

### Banco de Dados

Conectar ao PostgreSQL:
```bash
railway connect postgres
```

### Reiniciar Serviço

```bash
railway restart
```

### Atualizar Deploy

Qualquer `git push` no branch conectado faz deploy automático!

---

## 📞 Comandos Úteis

```bash
# Ver status
railway status

# Ver variáveis
railway variables

# Abrir dashboard
railway open

# Desconectar
railway unlink
```

---

**Deploy corrigido e pronto para funcionar!** 🚀

Faça o commit, push e redeploy no Railway.
