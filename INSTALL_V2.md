# ⚡ Instalação Rápida - ControlTab V2.0

## 🆕 Primeira Instalação (Novo Usuário)

```powershell
# 1. Navegar para o diretório
cd C:\Users\user\Documents\controltab

# 2. Instalar todas as dependências
npm run install:all

# 3. Iniciar o sistema
npm run dev
```

✅ **Pronto!** Acesse: http://localhost:5173

---

## 🔄 Atualização da V1 para V2 (Usuários Existentes)

```powershell
# 1. Navegar para o diretório
cd C:\Users\user\Documents\controltab

# 2. Atualizar dependências do backend
cd backend
npm install

# 3. Executar migração V2 (adiciona novos campos)
npm run migrate:v2

# Você verá:
# ✅ Coluna 'valor_aquisicao' adicionada
# ✅ Coluna 'fornecedor' adicionada
# ✅ Coluna 'email_conta' adicionada
# ... (10 colunas no total)

# 4. Atualizar frontend
cd ../frontend
npm install

# 5. Voltar e iniciar
cd ..
npm run dev
```

✅ **Atualizado!** Seus dados foram preservados.

---

## 📋 O que Muda na V2?

### ✨ 10 Novos Campos:
1. Valor de Aquisição
2. Fornecedor
3. Número da NF
4. Garantia até
5. Apólice de Seguro
6. Email da Conta
7. Senha do Email
8. Senha do Tablet
9. Número de Telefone
10. Operadora

### 📊 6 Tipos de Relatórios:
- Geral de Tablets
- Falhas
- Manutenções
- Por Cliente
- Garantias
- Financeiro

### 📥 Exportação:
- PDF (Tablets)
- Excel (Tablets, Falhas, Manutenções)

### 🎨 Nova Tela:
- Menu "Relatórios" com filtros e exportação

---

## ⚠️ Importante

### Tablets Existentes:
- Novos campos ficarão vazios (NULL)
- Edite cada tablet para preenchê-los
- Funcionalidade não é afetada

### Backup (Recomendado):
```powershell
# Antes de migrar, faça backup do banco:
cd backend/database
copy controltab.db controltab.db.backup
```

---

## ✅ Verificação Pós-Instalação

### Teste Básico:
1. ✅ Sistema inicia sem erros
2. ✅ Menu "Relatórios" aparece
3. ✅ Novo tablet: campos financeiros visíveis
4. ✅ Novo tablet: campos de credenciais visíveis
5. ✅ Exportar relatório em PDF funciona
6. ✅ Exportar relatório em Excel funciona

### Teste os Novos Campos:
1. Acesse **Tablets → Novo Tablet**
2. Role até **Informações Financeiras e Garantia**
3. Preencha: Valor, Fornecedor, Garantia
4. Role até **Credenciais e Acesso**
5. Preencha: Email, Senha Email, Senha Tablet
6. Marque ☑️ "Mostrar senhas" para testar
7. Salve e verifique nos detalhes

### Teste os Relatórios:
1. Acesse **Menu → Relatórios**
2. Clique em **PDF** no "Relatório Geral"
3. Arquivo deve baixar automaticamente
4. Clique em **Excel** no mesmo relatório
5. Arquivo Excel deve abrir

---

## 🆘 Solução de Problemas

### Erro: "Column not found"
```powershell
# Execute a migração novamente
cd backend
npm run migrate:v2
```

### Erro: "Cannot find module pdfkit"
```powershell
# Instale as dependências de exportação
cd backend
npm install pdfkit exceljs
```

### Erro: "EPERM" durante instalação
```powershell
# Execute PowerShell como Administrador
# Feche VS Code e Node processos
# Tente novamente
```

### Frontend não atualiza
```powershell
# Limpe cache do navegador (Ctrl+Shift+Del)
# Ou acesse em aba anônima
# Ou force reload (Ctrl+F5)
```

---

## 📞 Comandos Úteis

```powershell
# Ver estrutura do banco (verificar migração)
cd backend/database
sqlite3 controltab.db ".schema tablets"

# Reinstalar tudo do zero (APAGA DADOS!)
rmdir /s /q node_modules backend\node_modules frontend\node_modules
npm run install:all

# Ver logs do backend
cd backend
npm run dev

# Ver logs do frontend
cd frontend
npm run dev
```

---

## 🎯 Próximos Passos

1. ✅ Instalar/Atualizar sistema
2. 📝 Editar tablets existentes com novos dados
3. 📊 Gerar primeiro relatório
4. 📥 Testar exportação PDF/Excel
5. 📚 Ler **NOVA_VERSAO_V2.md** para detalhes

---

**V2.0 Instalada! Sistema completo de gestão pronto.** 🚀

Problemas? Consulte: **NOVA_VERSAO_V2.md** (Seção "Problemas Comuns")
