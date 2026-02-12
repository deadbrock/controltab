# 🌐 Deploy no Vercel - Frontend

## ✅ Configuração Corrigida

Os seguintes arquivos foram atualizados:
- `vercel.json` - Configuração simplificada
- `frontend/src/services/api.js` - Suporte a variável de ambiente

---

## 🚀 Passo a Passo

### 1. Obter URL do Backend (Railway)

Você precisa da URL do seu backend no Railway. Exemplo:
```
https://controltab-backend-production.up.railway.app
```

**⚠️ Não inclua `/api` no final!**

---

### 2. Configurar Variável de Ambiente no Vercel

1. Vá no projeto no Vercel
2. Clique em **Settings** → **Environment Variables**
3. Adicione a variável:

```
Nome: VITE_API_URL
Valor: https://sua-url-do-railway.railway.app
```

**Importante:**
- ✅ Use a URL completa do Railway
- ✅ SEM barra no final
- ✅ SEM `/api` no final
- ✅ Exemplo correto: `https://controltab-production.up.railway.app`
- ❌ Exemplo errado: `https://controltab-production.up.railway.app/`
- ❌ Exemplo errado: `https://controltab-production.up.railway.app/api`

---

### 3. Configurar Build no Vercel

**Framework Preset:** Vite

**Root Directory:** `frontend`

**Build Command:** `npm run build`

**Output Directory:** `dist`

**Install Command:** `npm install`

Deixe o Vercel auto-detectar ou configure manualmente.

---

### 4. Fazer Commit e Deploy

```bash
# Commit das alterações
git add .
git commit -m "fix: configurar API para produção"
git push
```

O Vercel vai fazer deploy automático! ✅

Ou force o redeploy:
1. Vá em **Deployments**
2. Clique nos 3 pontos → **Redeploy**

---

### 5. Atualizar CORS no Railway

Após obter a URL do Vercel (ex: `https://controltab.vercel.app`):

1. Vá no Railway
2. No serviço do backend
3. Adicione/atualize a variável:
   ```
   FRONTEND_URL=https://seu-app.vercel.app
   ```
4. Redeploy o backend

---

## 🧪 Testar

### 1. Acessar Frontend

Acesse sua URL do Vercel:
```
https://seu-app.vercel.app
```

### 2. Verificar Console

Abra o console do navegador (F12):
- Verifique se há erros de CORS
- Verifique se as requisições estão indo para a URL correta do Railway

### 3. Fazer Login

Use as credenciais configuradas no Railway:
- Email: `admin@controltab.com`
- Senha: (a que você configurou na variável `ADMIN_PASSWORD`)

---

## ⚠️ Troubleshooting

### Erro 404 em /api/auth/login

**Causa:** Variável `VITE_API_URL` não configurada ou incorreta

**Solução:**
1. Vá em Settings → Environment Variables no Vercel
2. Adicione `VITE_API_URL` com a URL do Railway
3. Redeploy

### Erro de CORS

**Causa:** `FRONTEND_URL` não configurada no Railway

**Solução:**
1. Vá no Railway, serviço backend
2. Adicione variável `FRONTEND_URL` com URL do Vercel
3. Redeploy o backend

### Erro 401 ao fazer login

**Causa:** Backend não está rodando ou credenciais incorretas

**Solução:**
1. Teste a API do Railway diretamente:
   ```bash
   curl https://seu-backend.railway.app/health
   ```
2. Verifique se as credenciais estão corretas
3. Verifique se executou as migrações no Railway

### Build falha no Vercel

**Causa:** Dependências não instaladas ou erro de build

**Solução:**
1. Verifique os logs de build no Vercel
2. Teste build local:
   ```bash
   cd frontend
   npm run build
   ```
3. Se funcionar local, limpe cache do Vercel e redeploy

---

## 📊 Estrutura Completa

```
┌─────────────────────────────────────┐
│         Usuário                     │
└─────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  Vercel (Frontend)                  │
│  https://controltab.vercel.app      │
│                                     │
│  Variável:                          │
│  VITE_API_URL=                      │
│    https://backend.railway.app      │
└─────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  Railway (Backend)                  │
│  https://backend.railway.app        │
│                                     │
│  Variáveis:                         │
│  FRONTEND_URL=                      │
│    https://controltab.vercel.app    │
│  DATABASE_URL=...                   │
│  JWT_SECRET=...                     │
└─────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│  Railway PostgreSQL                 │
│  (interno)                          │
└─────────────────────────────────────┘
```

---

## ✅ Checklist Final

Deploy no Vercel:
- [ ] Variável `VITE_API_URL` configurada
- [ ] Root Directory: `frontend`
- [ ] Framework: Vite
- [ ] Build funcionando
- [ ] Deploy bem-sucedido

Deploy no Railway:
- [ ] Backend rodando
- [ ] PostgreSQL provisionado
- [ ] Migrações executadas
- [ ] Variável `FRONTEND_URL` atualizada com URL do Vercel

Testes:
- [ ] Frontend abre sem erros
- [ ] Console sem erros 404/CORS
- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Pode criar tablet

---

## 💡 Dicas

### Desenvolvimento Local

Em desenvolvimento, continue usando:
```bash
npm run dev
```

O proxy do Vite (porta 5173 → 3000) funciona normalmente.

### Variáveis de Ambiente Local

Arquivo `frontend/.env.local`:
```
VITE_API_URL=http://localhost:3000
```

Este arquivo já existe e funciona!

### Logs do Vercel

Ver logs em tempo real:
```bash
vercel logs --follow
```

### Comandos Úteis

```bash
# Deploy manual
vercel

# Deploy para produção
vercel --prod

# Ver projetos
vercel list

# Abrir dashboard
vercel open
```

---

## 🔄 Atualizar Deploy

### Automático

Qualquer `git push` faz deploy automático no Vercel!

### Manual

```bash
# Na pasta frontend
cd frontend
vercel --prod
```

---

## 📞 URLs Importantes

Após configurar, anote suas URLs:

```
Frontend (Vercel):  https://_____.vercel.app
Backend (Railway):  https://_____.railway.app
PostgreSQL:         (interno Railway)
```

---

**Sistema pronto para produção!** 🎉

Agora é só usar! 🚀
