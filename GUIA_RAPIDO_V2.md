# ⚡ Guia Rápido - ControlTab V2.0

## 🚀 Começando

### 1. Instalação

**Primeira vez:**
```powershell
npm run install:all
npm run dev
```

**Atualizando de V1:**
```powershell
cd backend && npm install && npm run migrate:v2
cd ../frontend && npm install
cd .. && npm run dev
```

### 2. Acesso
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/api

---

## 📱 Cadastrando Tablet Completo

### Passo a Passo:

1. **Menu → Tablets → + Novo Tablet**

2. **Informações Básicas**
   ```
   Tombamento: TB-001
   Modelo: iPad Pro 11
   Fabricante: Apple
   ```

3. **Localização**
   ```
   Região: Norte
   Estado: AM
   Cidade: Manaus
   Cliente: Empresa ABC
   Localização: Recepção
   ```

4. **💰 Informações Financeiras** (NOVO)
   ```
   Valor: R$ 3.500,00
   Fornecedor: Magazine Luiza
   NF: NF-123456
   Garantia: 2025-12-31
   Seguro: AP-789456
   ```

5. **🔐 Credenciais** (NOVO)
   ```
   Email: tablet001@empresa.com
   Senha Email: MinhaSenh@123
   Senha Tablet: 1234
   ☑️ Mostrar senhas
   ```

6. **📱 Telefone** (NOVO - Opcional)
   ```
   Telefone: (92) 99999-9999
   Operadora: Claro
   ```

7. **Salvar**

---

## 📊 Gerando Relatórios

### Relatório Geral

1. **Menu → Relatórios**
2. Configure filtros (opcional):
   - Região: Norte
   - Cliente: Empresa ABC
3. Clique em **PDF** ou **Excel**
4. Arquivo baixa automaticamente

### Relatório de Falhas

1. **Menu → Relatórios**
2. Encontre "Relatório de Falhas"
3. Configure período (opcional)
4. Clique em **Excel**
5. Abra o arquivo e analise

### Relatório de Manutenções

1. **Menu → Relatórios**
2. "Relatório de Manutenções"
3. Clique em **Excel**
4. Veja custos, tempos e técnicos

---

## 🔍 Visualizando Informações

### Ver Garantia

1. **Tablets → [Selecione um tablet]**
2. Aba "Informações"
3. Veja seção "Informações Financeiras"
4. Garantia mostra:
   - 🟢 "Ativa" (verde) se válida
   - 🔴 "Vencida" (vermelho) se expirada

### Ver Credenciais

1. **Tablets → [Selecione um tablet]**
2. Aba "Informações"
3. Seção "🔐 Credenciais"
4. Senhas aparecem como ••••••••
5. (Edite o tablet para ver senha completa)

---

## 📥 Exportando Dados

### PDF - Tablets

```
Menu → Relatórios → Relatório Geral
Filtros: [Configure se desejar]
Botão: PDF
```

**Contém:**
- Lista de todos os tablets
- Informações principais
- Cliente e localização
- Status e IMEI

### Excel - Tablets Completo

```
Menu → Relatórios → Relatório Geral
Botão: Excel
```

**Colunas incluídas:**
- Tombamento, Modelo, Fabricante
- Cliente, Status, Região
- Estado, Cidade, Localização
- SO, IMEI, Número de Série
- Email, Telefone
- Valor, Garantia, Data Aquisição

### Excel - Falhas

```
Menu → Relatórios → Relatório de Falhas
Botão: Excel
```

**Colunas:**
- Data, Tombamento, Modelo
- Cliente, Tipo de Falha
- Descrição, Severidade
- Status, Solução

### Excel - Manutenções

```
Menu → Relatórios → Relatório de Manutenções
Botão: Excel
```

**Colunas:**
- Datas (início/conclusão)
- Tombamento, Modelo, Cliente
- Tipo, Descrição
- Técnico, Custo, Status

---

## 💡 Dicas de Uso

### Gestão Financeira

```
1. Cadastre valor em todos os tablets
2. Gere "Relatório Geral" em Excel
3. Filtre coluna "Valor" para ver totais
4. Use filtros para análise por cliente/região
```

### Controle de Garantias

```
1. Menu → Relatórios
2. [Futuro: Relatório de Garantias dedicado]
3. Por ora: Filtre no Excel coluna "Garantia Até"
4. Ordene por data
```

### Recuperação de Senhas

```
1. Tablets → [Selecione tablet]
2. Botão "Editar"
3. Role até "Credenciais e Acesso"
4. ☑️ Marque "Mostrar senhas"
5. Copie a senha necessária
```

### Análise de Custos

```
1. Exporte "Relatório de Manutenções"
2. Abra no Excel
3. Some coluna "Custo"
4. Crie tabela dinâmica por:
   - Cliente
   - Tipo de manutenção
   - Período
```

---

## 🎯 Casos de Uso Comuns

### Caso 1: Novo Cliente

```
1. Cadastre todos os tablets do cliente
2. Preencha: Cliente, Localização, Valor
3. Registre credenciais (email/senhas)
4. Gere relatório para arquivo do cliente
```

### Caso 2: Tablet com Problema

```
1. Registre falha (Menu → Falhas)
2. Crie manutenção (Menu → Manutenções)
3. Status do tablet muda para "Manutenção"
4. Após resolver: Marque manutenção como "Concluída"
5. Tablet volta para "Ativo"
```

### Caso 3: Relatório Mensal

```
1. Menu → Relatórios
2. Configure período: início e fim do mês
3. Exporte:
   - Relatório Geral (Excel)
   - Relatório de Falhas (Excel)
   - Relatório de Manutenções (Excel)
4. Consolide dados para gerência
```

### Caso 4: Auditoria de Garantias

```
1. Exporte Relatório Geral em Excel
2. Filtre coluna "Garantia Até"
3. Identifique garantias vencendo
4. Planeje renovações/substituições
```

---

## ⚙️ Configurações Recomendadas

### Backup Regular

```powershell
# Copiar banco de dados
cd backend/database
copy controltab.db controltab-backup-AAAAMMDD.db
```

### Segurança de Senhas

1. Use senhas fortes
2. Troque periodicamente
3. Restrinja acesso ao sistema
4. Considere criptografia (futuro)

---

## 📋 Checklist Diário

- [ ] Verificar tablets inativos
- [ ] Revisar falhas abertas
- [ ] Conferir manutenções pendentes
- [ ] Atualizar status de equipamentos

## 📋 Checklist Mensal

- [ ] Gerar relatório geral
- [ ] Exportar dados para backup
- [ ] Revisar garantias vencendo
- [ ] Analisar custos de manutenção
- [ ] Atualizar informações financeiras

---

## 🆘 Problemas Rápidos

**Sistema não inicia:**
```powershell
# Verificar portas
netstat -ano | findstr :3000
netstat -ano | findstr :5173
# Matar processo se necessário
```

**Campos novos não aparecem:**
```powershell
cd backend
npm run migrate:v2
```

**Exportação não funciona:**
```powershell
cd backend
npm install pdfkit exceljs
```

**Esqueci uma senha:**
```
Tablets → Editar → Credenciais → ☑️ Mostrar senhas
```

---

## 📞 Atalhos Úteis

| Ação | Caminho |
|------|---------|
| Novo Tablet | Menu → Tablets → + |
| Ver Detalhes | Tablets → Lista → Ver |
| Gerar Relatório | Menu → Relatórios |
| Exportar PDF | Relatórios → PDF |
| Exportar Excel | Relatórios → Excel |
| Ver Garantia | Detalhes → Aba Info |
| Ver Senha | Editar → Credenciais |

---

**Guia Rápido V2.0 - Use e abuse dos novos recursos!** 🚀

Dúvidas detalhadas? → **NOVA_VERSAO_V2.md**
Instalação? → **INSTALL_V2.md**
