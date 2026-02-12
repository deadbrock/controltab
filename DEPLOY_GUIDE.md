# 🚀 Guia de Deploy - ControlTab V2.0

Deploy do Backend no Railway e Frontend no Vercel

---

## 📦 Parte 1: Deploy do Backend (Railway + PostgreSQL)

### Passo 1: Preparar conta no Railway

1. Acesse https://railway.app
2. Faça login com GitHub
3. Clique em "New Project"

### Passo 2: Adicionar PostgreSQL

1. No projeto, clique em "+ New"
2. Selecione "Database" → "PostgreSQL"
3. Aguarde o provisionamento
4. Copie a `DATABASE_URL` (será usada depois)

### Passo 3: Deploy do Backend

1. No projeto, clique em "+ New"
2. Selecione "GitHub Repo"
3. Conecte seu repositório (ou use "Empty Service")

#### Se usar "Empty Service":

```bash
# No seu terminal local
cd C:\Users\user\Documents\controltab

# Inicializar git (se ainda não tiver)
git init
git add .
git commit -m "Initial commit - ControlTab V2"

# Conectar ao Railway
railway link

# Deploy
railway up
```

### Passo 4: Configurar Variáveis de Ambiente no Railway

No painel do Railway, clique no serviço do backend e vá em "Variables":

```
NODE_ENV=production
PORT=3000
DB_TYPE=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=seu_secret_super_seguro_mude_aqui_98765
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://seu-app.vercel.app
ADMIN_EMAIL=admin@controltab.com
ADMIN_PASSWORD=MudeSenhaFortAqui@2024
ADMIN_NAME=Administrador
```

⚠️ **IMPORTANTE:** Troque o `JWT_SECRET` por um valor único e seguro!

### Passo 5: Executar Migrações

Após o deploy, execute via Railway CLI ou no console do Railway:

```bash
# Via Railway CLI
railway run npm run migrate:auth
railway run npm run migrate:v2
railway run npm run seed:admin
```

Ou adicione um script de inicialização:

**Criar:** `backend/init-production.js`
```javascript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function init() {
  try {
    console.log('Executando migrações...');
    await execAsync('node database/migrate-auth.js');
    await execAsync('node database/migrate-v2.js');
    await execAsync('node database/seed-admin.js');
    console.log('Inicialização completa!');
  } catch (error) {
    console.error('Erro na inicialização:', error);
  }
}

init();
```

### Passo 6: Obter URL do Backend

Após o deploy, Railway fornecerá uma URL:
```
https://controltab-backend-production.up.railway.app
```

Copie esta URL para usar no Vercel!

---

## 🌐 Parte 2: Deploy do Frontend (Vercel)

### Passo 1: Preparar conta no Vercel

1. Acesse https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New" → "Project"

### Passo 2: Importar Projeto

1. Selecione seu repositório do GitHub
2. Ou use Vercel CLI:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd C:\Users\user\Documents\controltab\frontend
vercel
```

### Passo 3: Configurar Build

No painel do Vercel:

**Framework Preset:** Vite
**Root Directory:** `frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`

### Passo 4: Configurar Variáveis de Ambiente

No Vercel, vá em Settings → Environment Variables:

```
VITE_API_URL=https://seu-backend.railway.app
```

⚠️ **Substitua pela URL real do seu backend no Railway!**

### Passo 5: Redeployar

Após configurar a variável de ambiente:
1. Vá em "Deployments"
2. Clique nos 3 pontos do último deploy
3. "Redeploy"

### Passo 6: Atualizar CORS no Backend

Volte no Railway e atualize a variável `FRONTEND_URL`:

```
FRONTEND_URL=https://seu-app.vercel.app
```

⚠️ **Use a URL real fornecida pelo Vercel!**

---

## ✅ Verificação Pós-Deploy

### 1. Testar Backend

```bash
# Testar health check
curl https://seu-backend.railway.app/health

# Deve retornar:
# {"status":"OK","timestamp":"...","uptime":...}
```

### 2. Testar Frontend

1. Acesse sua URL do Vercel
2. Tela de login deve aparecer
3. Faça login com credenciais admin
4. Navegue pelo sistema

### 3. Testar Funcionalidades

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Consegue cadastrar tablet
- [ ] Consegue ver lista de tablets
- [ ] Admin vê menu "Relatórios"
- [ ] Admin vê menu "Usuários"
- [ ] Exportação PDF/Excel funciona
- [ ] Logout funciona

---

## 🔧 Configuração Avançada

### Custom Domain (Vercel)

1. Vá em Settings → Domains
2. Adicione seu domínio: `controltab.suaempresa.com`
3. Configure DNS conforme instruções
4. Atualize `FRONTEND_URL` no Railway

### SSL/HTTPS

✅ Railway fornece SSL automático
✅ Vercel fornece SSL automático
✅ Sem configuração necessária!

### Backup do PostgreSQL

No Railway:
1. Acesse o serviço PostgreSQL
2. Clique em "Data"
3. Use ferramenta de backup (pg_dump)

Ou configure backup automático via Railway CLI.

---

## 📊 Monitoramento

### Logs do Backend (Railway)

```bash
# Via CLI
railway logs

# Ou no painel do Railway:
# Serviço → Deployments → View Logs
```

### Logs do Frontend (Vercel)

```bash
# Via CLI
vercel logs

# Ou no painel do Vercel:
# Projeto → Deployments → Functions
```

---

## 🔐 Segurança em Produção

### ✅ Checklist de Segurança:

- [ ] Trocou `JWT_SECRET` por valor único
- [ ] Alterou senha padrão do admin
- [ ] Configurou CORS corretamente
- [ ] HTTPS ativado (automático)
- [ ] Senhas fortes nos usuários
- [ ] Backup configurado
- [ ] Variáveis de ambiente não commitadas

### Credenciais de Produção:

⚠️ **NUNCA use senhas padrão em produção!**

Após primeiro deploy:
1. Faça login no sistema
2. Vá em Usuários (se admin)
3. Edite o usuário admin
4. Mude email se necessário
5. Use "Resetar Senha" com senha forte

---

## 🛠️ Troubleshooting

### Backend não inicia no Railway

**Verifique:**
1. `DATABASE_URL` está configurada?
2. Migrações foram executadas?
3. Logs mostram algum erro?

**Solução:**
```bash
railway logs --tail
```

### Frontend não conecta ao Backend

**Verifique:**
1. `VITE_API_URL` está correta?
2. CORS configurado no backend?
3. Backend está rodando?

**Solução:**
1. Teste URL do backend no navegador
2. Verifique console do navegador (F12)
3. Veja logs no Vercel

### Erro 401 (Unauthorized)

**Causa:** Token inválido ou expirado

**Solução:**
1. Faça logout e login novamente
2. Verifique se JWT_SECRET é o mesmo em todos deploys

### Erro ao criar usuário admin

**Causa:** Tabela `users` não existe

**Solução:**
```bash
railway run npm run migrate:auth
railway run npm run seed:admin
```

---

## 📱 Atualizar Aplicação

### Atualizar Backend:

```bash
# Fazer mudanças no código
git add .
git commit -m "Update backend"
git push

# Railway faz deploy automático!
```

### Atualizar Frontend:

```bash
# Fazer mudanças no código
git add .
git commit -m "Update frontend"
git push

# Vercel faz deploy automático!
```

---

## 💰 Custos Estimados

### Railway (Backend + PostgreSQL)
- **Free Tier:** $5 de crédito/mês
- **Hobby:** ~$10-20/mês
- Inclui PostgreSQL e Backend

### Vercel (Frontend)
- **Free Tier:** Ilimitado para hobby
- **Pro:** $20/mês (se precisar)

**Total estimado:** GRÁTIS (com free tiers) ou ~$10-20/mês

---

## 🎯 URLs Importantes

Após deploy, anote suas URLs:

```
Backend (Railway):    https://_____.railway.app
Frontend (Vercel):    https://_____.vercel.app
PostgreSQL:           internal (via DATABASE_URL)
```

---

## 📞 Suporte

**Documentação Oficial:**
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- PostgreSQL: https://www.postgresql.org/docs

**Problemas?**
Consulte seção "Troubleshooting" acima ou verifique logs.

---

**Sistema pronto para produção!** 🎉

Bom deploy! 🚀
