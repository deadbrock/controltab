# ⚡ Início Rápido - Autenticação

## 🚀 Configure em 5 Minutos

### 1. Instale as novas dependências

```powershell
cd C:\Users\user\Documents\controltab

# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

### 2. Crie a tabela de usuários

```powershell
cd ../backend
npm run migrate:auth
```

Você verá:
```
✅ Tabela "users" criada com sucesso
```

### 3. Crie o usuário administrador

```powershell
npm run seed:admin
```

Você verá:
```
✅ Usuário administrador criado!
📧 Email: admin@controltab.com
🔑 Senha: Admin@123456
```

### 4. Inicie o sistema

```powershell
cd ..
npm run dev
```

### 5. Faça login

1. Abra http://localhost:5173
2. Você será redirecionado para tela de login
3. Use as credenciais:
   - Email: `admin@controltab.com`
   - Senha: `Admin@123456`
4. Clique em "Entrar"

✅ **Pronto! Você está autenticado como admin!**

---

## 👥 Criar Mais Usuários

### Como Admin:

1. Menu → Usuários
2. Clique "+ Novo Usuário"
3. Preencha:
   ```
   Nome: João Silva
   Email: joao@empresa.com
   Senha: Senha@123
   Nível: Usuário (ou Admin)
   ```
4. Salvar

### Credenciais criadas:
- Email: joao@empresa.com
- Senha: Senha@123

Compartilhe com o usuário por canal seguro!

---

## 🔐 Diferenças de Permissão

### Faça o teste:

**1. Como Admin:**
- Menu lateral mostra: Dashboard, Tablets, Manutenções, Falhas, Trocas, **Relatórios**, **Usuários**
- Pode criar trocas
- Pode exportar PDF/Excel

**2. Como Usuário Normal:**
- Menu lateral mostra: Dashboard, Tablets, Manutenções, Falhas, Trocas
- ❌ NÃO vê "Relatórios"
- ❌ NÃO vê "Usuários"
- ❌ NÃO pode registrar trocas (botão não aparece)
- ❌ NÃO pode exportar relatórios

---

## 🎯 Testar Permissões

### 1. Login como Admin

```
Email: admin@controltab.com
Senha: Admin@123456
```

Verifique:
- ✅ Menu tem "Relatórios"
- ✅ Menu tem "Usuários"
- ✅ Em Trocas: botão "+ Registrar Troca" aparece

### 2. Criar Usuário Normal

1. Menu → Usuários → + Novo
2. Nome: "Teste User"
3. Email: "teste@teste.com"
4. Senha: "123456"
5. Nível: **Usuário** (não Admin!)
6. Salvar

### 3. Fazer Logout

1. Clique no botão "Sair" no rodapé do menu

### 4. Login como Usuário Normal

```
Email: teste@teste.com
Senha: 123456
```

Verifique:
- ❌ Menu NÃO tem "Relatórios"
- ❌ Menu NÃO tem "Usuários"
- ❌ Em Trocas: NÃO tem botão "+ Registrar Troca"

---

## 🔑 Resetar Senha

### Como Admin reseta senha de usuário:

1. Menu → Usuários
2. Encontre o usuário
3. Clique "Resetar Senha"
4. Digite nova senha
5. Confirme

Comunique a nova senha ao usuário!

---

## 🚪 Logout

**Duas formas:**

1. Clique no botão "Sair" no menu lateral (rodapé)
2. Token expira automaticamente após 7 dias

---

## ⚠️ Importante

### Primeira Vez:

- ✅ Altere a senha do admin após primeiro login
- ✅ Troque o `JWT_SECRET` em produção
- ✅ Use senhas fortes

### Segurança:

- ✅ Senhas são criptografadas (bcrypt)
- ✅ Tokens expiram após 7 dias
- ✅ Rotas protegidas no backend E frontend
- ✅ CORS configurado

---

## 📞 Comandos Úteis

```powershell
# Criar tabela de usuários
cd backend
npm run migrate:auth

# Criar admin
npm run seed:admin

# Ver usuários no banco (SQLite)
cd database
sqlite3 controltab.db "SELECT * FROM users;"

# Iniciar sistema
cd ../..
npm run dev
```

---

## ✅ Checklist

- [ ] Instalei dependências (backend e frontend)
- [ ] Executei `npm run migrate:auth`
- [ ] Executei `npm run seed:admin`
- [ ] Consegui fazer login como admin
- [ ] Menu mostra "Relatórios" e "Usuários"
- [ ] Consegui criar usuário normal
- [ ] Fiz logout e login como usuário normal
- [ ] Usuário normal NÃO vê "Relatórios"
- [ ] Testei resetar senha
- [ ] Li o AUTENTICACAO_COMPLETA.md

---

**Sistema de autenticação funcionando!** 🎉

Credenciais: admin@controltab.com / Admin@123456

⚠️ **Altere a senha após primeiro login!**
