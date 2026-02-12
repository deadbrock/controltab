# 🚀 COMECE AQUI - ControlTab V2.0

## ⚡ Sistema pronto! Siga estes passos:

---

## 📦 Passo 1: Instalar Dependências

Abra o PowerShell e execute:

```powershell
cd C:\Users\user\Documents\controltab
npm run install:all
```

⏱️ **Tempo estimado:** 2-3 minutos

Você verá:
```
✅ Instalando dependências do backend...
✅ Instalando dependências do frontend...
✅ Concluído!
```

---

## 🗄️ Passo 2: Configurar Banco de Dados

### 2.1 Criar Tabelas do Sistema

```powershell
cd backend
npm run migrate
npm run migrate:v2
```

Você verá:
```
✅ Tabelas criadas com sucesso
```

### 2.2 Criar Tabela de Usuários

```powershell
npm run migrate:auth
```

Você verá:
```
✅ Tabela "users" criada com sucesso
✅ Índices criados com sucesso
```

### 2.3 Criar Usuário Administrador

```powershell
npm run seed:admin
```

Você verá:
```
✅ Usuário administrador criado com sucesso!

📋 Credenciais de Acesso:
─────────────────────────────────
📧 Email: admin@controltab.com
🔑 Senha: Admin@123456
─────────────────────────────────

⚠️  IMPORTANTE: Altere a senha após o primeiro login!
```

**⚠️ ANOTE ESSAS CREDENCIAIS!**

---

## 🎯 Passo 3: Iniciar o Sistema

```powershell
cd ..
npm run dev
```

Você verá:
```
[backend] 🚀 Servidor rodando na porta 3000
[frontend] ⚡ Vite dev server rodando em http://localhost:5173
```

**✅ Sistema iniciado!**

---

## 🌐 Passo 4: Acessar o Sistema

1. Abra seu navegador
2. Acesse: **http://localhost:5173**
3. Você verá a tela de login

### Fazer Login:

**Email:** `admin@controltab.com`  
**Senha:** `Admin@123456`

Clique em "Entrar"

**🎉 Pronto! Você está dentro do sistema!**

---

## 👥 Passo 5: Criar Outros Usuários (Opcional)

### Como Admin:

1. No menu lateral, clique em "**Usuários**"
2. Clique em "+ Novo Usuário"
3. Preencha os dados:
   ```
   Nome: João Silva
   Email: joao@empresa.com
   Senha: Senha@123
   Nível: Usuário (ou Admin)
   ```
4. Clique em "Salvar"

**✅ Novo usuário criado!**

Compartilhe as credenciais com o usuário.

---

## 🔒 Diferença entre Admin e Usuário

### Usuário Normal pode:
- ✅ Ver dashboard
- ✅ Gerenciar tablets
- ✅ Registrar manutenções
- ✅ Registrar falhas
- ✅ Ver trocas

### Administrador pode (tudo acima +):
- ✅ Registrar trocas
- ✅ Ver relatórios
- ✅ Exportar PDF/Excel
- ✅ Gerenciar usuários

---

## 🧪 Teste o Sistema

### 1. Como Admin:

✅ Verifique se o menu mostra:
- Dashboard
- Tablets
- Manutenções
- Falhas
- Trocas
- **Relatórios** ← Só admin vê
- **Usuários** ← Só admin vê

### 2. Cadastre um Tablet:

1. Clique em "Tablets"
2. Clique em "+ Novo Tablet"
3. Preencha os dados básicos:
   ```
   Tombamento: TAB001
   Modelo: Samsung Galaxy Tab A8
   Fabricante: Samsung
   SO: Android
   Versão: 13
   IMEI: 123456789012345
   Série: SN123456
   Região: NORTE
   Estado: AM
   Cidade: Manaus
   Cliente: Empresa XYZ
   Localização: Matriz - Recepção
   Data de Aquisição: 01/01/2024
   ```
4. Salvar

✅ Tablet cadastrado!

### 3. Teste Permissões:

1. Crie um usuário normal
2. Faça logout (botão "Sair" no rodapé do menu)
3. Faça login com o usuário normal
4. Verifique que NÃO aparece "Relatórios" e "Usuários"

---

## 📂 Arquivos Importantes

### Você já tem tudo pronto em:

```
C:\Users\user\Documents\controltab\
```

### Documentação Completa:

1. **`README_V2.md`** - Overview geral do sistema
2. **`INICIO_RAPIDO_AUTH.md`** - Guia de 5 minutos
3. **`AUTENTICACAO_COMPLETA.md`** - Documentação técnica
4. **`DEPLOY_GUIDE.md`** - Guia para deploy em produção
5. **`MANUAL_USO.md`** - Manual do usuário
6. **`RESUMO_FINAL_V2.md`** - Resumo técnico completo

---

## 🆘 Problemas?

### "npm run install:all" falha

**Solução:**
```powershell
# Instalar manualmente
cd backend
npm install

cd ../frontend
npm install
```

### "Não consigo fazer login"

**Verifique:**
1. Executou `npm run seed:admin`?
2. Email e senha corretos?
3. Backend está rodando?

**Solução:**
```powershell
cd backend
npm run seed:admin
```

### "Token inválido"

**Solução:**
1. Faça logout
2. Limpe cache do navegador (Ctrl+Shift+Delete)
3. Faça login novamente

### "Erro ao conectar ao banco"

**Verifique:**
1. Executou as migrações?
2. Arquivo `backend/database/controltab.db` existe?

**Solução:**
```powershell
cd backend
npm run migrate
npm run migrate:v2
npm run migrate:auth
```

---

## 📱 Próximos Passos

### Agora que o sistema está funcionando:

1. ✅ Explore todas as funcionalidades
2. ✅ Cadastre alguns tablets de teste
3. ✅ Registre manutenções e falhas
4. ✅ Teste exportação de relatórios (como admin)
5. ✅ Altere a senha do admin

### Quando estiver pronto para produção:

📖 Leia: **`DEPLOY_GUIDE.md`**

Você aprenderá a:
- Fazer deploy no Railway (backend)
- Fazer deploy no Vercel (frontend)
- Usar PostgreSQL em produção
- Configurar domínio customizado

---

## ⚙️ Comandos Úteis

### Iniciar o sistema:
```powershell
cd C:\Users\user\Documents\controltab
npm run dev
```

### Parar o sistema:
```
Pressione Ctrl+C no PowerShell
```

### Ver usuários no banco:
```powershell
cd backend/database
sqlite3 controltab.db "SELECT id, name, email, role FROM users;"
```

### Criar backup do banco:
```powershell
cd backend/database
copy controltab.db controltab.db.backup
```

### Resetar tudo (CUIDADO!):
```powershell
cd backend/database
del controltab.db
cd ..
npm run migrate
npm run migrate:v2
npm run migrate:auth
npm run seed:admin
```

---

## 🎨 Interface

### Tela de Login:
- Design moderno com gradiente azul
- Logo do tablet centralizado
- Credenciais padrão visíveis
- Mensagens de erro amigáveis

### Dashboard:
- Cards com estatísticas
- Gráficos interativos
- Distribuição por região
- Atividades recentes

### Tablets:
- Lista completa
- Filtros (status, região, cliente)
- Busca rápida
- Detalhes completos

### Usuários (Admin):
- Lista de todos usuários
- Badge de role (Admin/Usuário)
- Badge de status (Ativo/Inativo)
- Ações: Editar, Resetar Senha, Excluir

---

## 🔐 Segurança

### ✅ Sistema Seguro:

- Senhas criptografadas (bcrypt)
- Tokens JWT com expiração
- Rotas protegidas
- Validação de permissões
- CORS configurado

### ⚠️ Lembre-se:

1. Altere a senha do admin
2. Use senhas fortes
3. Não compartilhe credenciais
4. Faça logout ao sair
5. Faça backup regularmente

---

## 📊 Recursos do Sistema

### ✅ Completo e Funcional:

- 🔐 Autenticação com JWT
- 👥 Gestão de usuários
- 📱 Gestão de tablets
- 🔧 Controle de manutenções
- ⚠️ Registro de falhas
- 🔄 Histórico de trocas
- 📊 Relatórios diversos
- 📄 Exportação PDF/Excel
- 🎨 Interface moderna
- 📱 Design responsivo

---

## 🎯 Status do Sistema

### ✅ Implementado:
- Sistema de autenticação
- Níveis de permissão
- Gestão de usuários
- Proteção de rotas
- CRUD completo de tablets
- Manutenções e falhas
- Relatórios e exportação
- Suporte PostgreSQL
- Pronto para produção

### 🚀 Pronto para:
- Desenvolvimento local ✅
- Testes ✅
- Deploy em produção ✅
- Uso por múltiplos usuários ✅

---

## 💡 Dicas

### Para Melhor Experiência:

1. Use Chrome ou Edge (melhor compatibilidade)
2. Tela recomendada: 1366x768 ou maior
3. Mantenha o sistema atualizado
4. Faça backup semanal
5. Revise usuários periodicamente

### Para Desenvolvimento:

1. Mantenha backend e frontend rodando
2. Verifique console (F12) se tiver problemas
3. Logs do backend aparecem no PowerShell
4. Use React DevTools para debug

---

## 📞 Suporte

### Documentação:
- 📖 Leia os arquivos `.md` na pasta raiz
- 🔍 Use Ctrl+F para buscar nos documentos
- 💬 Console do navegador (F12) mostra erros

### Comandos de Diagnóstico:

```powershell
# Verificar versão do Node
node --version

# Verificar se banco existe
dir backend\database\controltab.db

# Ver logs do backend
# (aparecem no PowerShell onde rodou npm run dev)
```

---

## ✨ Parabéns!

### 🎉 Seu sistema está pronto!

Você agora tem:
- ✅ Sistema completo de gestão de tablets
- ✅ Autenticação e controle de acesso
- ✅ Interface moderna e profissional
- ✅ Pronto para uso em produção

---

## 🚀 Comece a Usar Agora!

```powershell
# Se ainda não iniciou:
cd C:\Users\user\Documents\controltab
npm run dev
```

**Acesse:** http://localhost:5173

**Login:**
- Email: admin@controltab.com
- Senha: Admin@123456

**Explore o sistema e boa gestão!** 🎉

---

## 📖 Leitura Recomendada

1. **Primeiro:** Este arquivo (você está aqui!)
2. **Depois:** `INICIO_RAPIDO_AUTH.md` - Teste autenticação
3. **Depois:** `MANUAL_USO.md` - Como usar o sistema
4. **Quando pronto:** `DEPLOY_GUIDE.md` - Deploy em produção

---

**Sistema desenvolvido com ❤️ para gestão eficiente**

**ControlTab V2.0 - 2024**

**Pronto para transformar sua gestão de tablets!** 🚀
