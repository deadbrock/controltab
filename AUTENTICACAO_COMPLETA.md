# 🔐 Sistema de Autenticação - ControlTab V2.0

## ✅ Implementação Completa

### 🎯 Recursos Implementados

#### 1. Sistema de Login
- ✅ Tela de login profissional
- ✅ Validação de email e senha
- ✅ Tokens JWT (válidos por 7 dias)
- ✅ Armazenamento seguro (localStorage)
- ✅ Mensagens de erro amigáveis

#### 2. Níveis de Permissão
- ✅ **Administrador (admin)** - Acesso total
- ✅ **Usuário (user)** - Acesso limitado

#### 3. Controle de Acesso

**Usuário Normal pode:**
- ✅ Ver dashboard
- ✅ Ver lista de tablets
- ✅ Ver detalhes de tablets
- ✅ Cadastrar/editar tablets
- ✅ Registrar manutenções
- ✅ Registrar falhas
- ✅ Ver trocas (apenas visualizar)

**Apenas Admin pode:**
- ✅ Exportar relatórios (PDF/Excel)
- ✅ Registrar trocas de tablets
- ✅ Deletar trocas
- ✅ Acessar tela de Relatórios
- ✅ Gerenciar usuários
- ✅ Criar novos usuários
- ✅ Editar usuários
- ✅ Desativar/ativar usuários
- ✅ Resetar senhas de usuários

#### 4. Proteção de Rotas

**Rotas Públicas:**
- `/login` - Tela de login

**Rotas Protegidas (autenticação):**
- `/` - Dashboard
- `/tablets` - Lista de tablets
- `/tablets/:id` - Detalhes
- `/manutencoes` - Manutenções
- `/falhas` - Falhas
- `/trocas` - Trocas (visualização)

**Rotas Admin:**
- `/relatorios` - Relatórios e exportação
- `/usuarios` - Gestão de usuários
- `/trocas` (criar/deletar) - Protegido no backend

#### 5. Gestão de Usuários (Admin)

**Funcionalidades:**
- ✅ Listar todos os usuários
- ✅ Criar novo usuário
- ✅ Editar usuário (nome, email, role, status)
- ✅ Desativar usuário
- ✅ Resetar senha de usuário
- ✅ Excluir usuário
- ✅ Indicadores visuais (Admin/Usuário, Ativo/Inativo)

---

## 🔧 Configuração

### 1. Instalar Dependências

```powershell
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

**Backend:** Edite `backend/.env`

```
JWT_SECRET=seu_secret_super_seguro_mude_em_producao
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@controltab.com
ADMIN_PASSWORD=Admin@123456
ADMIN_NAME=Administrador
```

### 3. Criar Tabela de Usuários

```powershell
cd backend
npm run migrate:auth
```

### 4. Criar Usuário Administrador

```powershell
npm run seed:admin
```

Você verá:
```
✅ Usuário administrador criado!
📧 Email: admin@controltab.com
🔑 Senha: Admin@123456
```

### 5. Iniciar Sistema

```powershell
cd ..
npm run dev
```

### 6. Fazer Login

1. Acesse: http://localhost:5173
2. Será redirecionado para `/login`
3. Use as credenciais do admin:
   - Email: `admin@controltab.com`
   - Senha: `Admin@123456`
4. Clique em "Entrar"

---

## 👥 Gerenciando Usuários

### Criar Novo Usuário

1. Faça login como admin
2. Menu → Usuários
3. Clique em "+ Novo Usuário"
4. Preencha:
   - Nome
   - Email
   - Senha (mínimo 6 caracteres)
   - Nível: Admin ou Usuário
5. Salvar

### Editar Usuário

1. Menu → Usuários
2. Clique em "Editar"
3. Altere: nome, email, role ou status
4. Salvar

⚠️ **Nota:** Para alterar senha, use "Resetar Senha"

### Resetar Senha

1. Menu → Usuários
2. Clique em "Resetar Senha"
3. Digite nova senha
4. Usuário receberá a nova senha (comunique por canal seguro)

### Desativar Usuário

1. Menu → Usuários
2. Clique em "Editar"
3. Desmarque "Usuário ativo"
4. Salvar

Usuário não poderá mais fazer login.

---

## 🔐 Segurança

### Senhas

**Hash com bcrypt:**
- ✅ Senhas nunca armazenadas em texto puro
- ✅ Salt rounds: 10
- ✅ Algoritmo bcrypt industry-standard

**Requisitos:**
- Mínimo 6 caracteres
- Recomendado: letras, números e símbolos

### Tokens JWT

**Configuração:**
- ✅ Assinatura com secret seguro
- ✅ Expiração: 7 dias (configurável)
- ✅ Contém: userId, email, role
- ✅ Validação em cada requisição

**Armazenamento:**
- Frontend: localStorage
- Enviado via header: `Authorization: Bearer <token>`

### Proteção de Rotas

**Backend:**
- ✅ Middleware `authenticateToken` - Valida token
- ✅ Middleware `requireAdmin` - Valida se é admin
- ✅ Rotas sensíveis protegidas

**Frontend:**
- ✅ Context API para estado global
- ✅ Componente `PrivateRoute` - Requer login
- ✅ Componente `AdminRoute` - Requer admin
- ✅ Menu dinâmico (mostra/oculta por permissão)

### CORS

**Configuração:**
```javascript
cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
})
```

**Produção:**
- Configure `FRONTEND_URL` no Railway
- Apenas origem permitida pode acessar API

---

## 🎯 Fluxo de Autenticação

### Login

```
1. Usuário entra com email/senha
   ↓
2. Backend valida credenciais
   ↓
3. Backend gera token JWT
   ↓
4. Frontend armazena token + dados do usuário
   ↓
5. Frontend configura axios com token
   ↓
6. Usuário é redirecionado ao dashboard
```

### Requisições Autenticadas

```
1. Usuário faz ação (ex: cadastrar tablet)
   ↓
2. Frontend envia requisição com header:
   Authorization: Bearer <token>
   ↓
3. Backend valida token
   ↓
4. Backend verifica permissões (se admin)
   ↓
5. Backend processa requisição
   ↓
6. Retorna resposta
```

### Logout

```
1. Usuário clica em "Sair"
   ↓
2. Frontend remove token e dados
   ↓
3. Frontend redireciona para /login
```

---

## 📋 Matriz de Permissões

| Funcionalidade | Usuário Normal | Administrador |
|----------------|----------------|---------------|
| Ver Dashboard | ✅ | ✅ |
| Ver Tablets | ✅ | ✅ |
| Cadastrar Tablet | ✅ | ✅ |
| Editar Tablet | ✅ | ✅ |
| Deletar Tablet | ✅ | ✅ |
| Ver Manutenções | ✅ | ✅ |
| Registrar Manutenção | ✅ | ✅ |
| Ver Falhas | ✅ | ✅ |
| Registrar Falha | ✅ | ✅ |
| Ver Trocas | ✅ | ✅ |
| **Registrar Troca** | ❌ | ✅ |
| **Deletar Troca** | ❌ | ✅ |
| **Acessar Relatórios** | ❌ | ✅ |
| **Exportar PDF/Excel** | ❌ | ✅ |
| **Gerenciar Usuários** | ❌ | ✅ |

---

## 🔄 Alterando Sua Própria Senha

**Todos os usuários podem alterar sua senha:**

1. Faça login
2. (Funcionalidade ainda não implementada no frontend)
3. Por ora, peça ao admin para resetar sua senha

**Ou via API:**
```bash
curl -X PUT http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "senhaAtual",
    "newPassword": "novaSenha123"
  }'
```

---

## 🆘 Troubleshooting

### "Não consigo fazer login"

**Verifique:**
1. Criou o usuário admin? (`npm run seed:admin`)
2. Email e senha corretos?
3. Backend está rodando?
4. Console do navegador mostra erros?

### "Token inválido ou expirado"

**Solução:**
1. Faça logout
2. Limpe localStorage (F12 → Application → Local Storage → Clear)
3. Faça login novamente

### "Acesso negado"

**Causa:** Usuário sem permissão

**Solução:**
- Usuário normal tentando acessar recurso admin
- Peça ao admin para promover sua conta

### "Erro 401 em todas requisições"

**Causa:** Token não está sendo enviado

**Solução:**
1. Verifique se fez login
2. Verifique localStorage tem 'token'
3. Verifique axios está configurado com token

---

## 📝 Boas Práticas

### Para Administradores

1. ✅ Altere senha padrão imediatamente
2. ✅ Crie senhas fortes para novos usuários
3. ✅ Desative usuários que não usam mais o sistema
4. ✅ Revise permissões periodicamente
5. ✅ Não compartilhe credenciais de admin

### Para Usuários

1. ✅ Não compartilhe sua senha
2. ✅ Faça logout ao sair
3. ✅ Reporte problemas ao admin
4. ✅ Mantenha dados atualizados

### Para Deploy

1. ✅ Use JWT_SECRET único em produção
2. ✅ Use HTTPS (automático no Railway/Vercel)
3. ✅ Configure CORS corretamente
4. ✅ Faça backups regulares
5. ✅ Monitore logs

---

## 🚀 Próximos Passos

### Implementado:
- ✅ Sistema de login
- ✅ Níveis de permissão
- ✅ Proteção de rotas
- ✅ Gestão de usuários
- ✅ Tokens JWT
- ✅ Middleware de autenticação

### Futuro (opcional):
- [ ] Recuperação de senha por email
- [ ] Login com 2FA
- [ ] Logs de auditoria
- [ ] Sessões ativas
- [ ] Tela de perfil do usuário
- [ ] Histórico de acessos

---

**Sistema de Autenticação Completo e Funcional!** 🎉

Credenciais padrão:
- Email: admin@controltab.com
- Senha: Admin@123456

⚠️ **Troque imediatamente após primeiro acesso!**
