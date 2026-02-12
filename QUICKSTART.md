# ⚡ Quick Start - ControlTab

Guia rápido para começar a usar o sistema em 5 minutos!

## 🚀 Instalação Rápida

### 1. Abra o terminal no diretório do projeto

```powershell
cd C:\Users\user\Documents\controltab
```

### 2. Instale todas as dependências

```powershell
npm run install:all
```

⏱️ Aguarde alguns minutos enquanto todas as dependências são instaladas.

### 3. Execute a migração do banco (se já tinha tablets cadastrados)

```powershell
cd backend
npm run migrate
cd ..
```

⚠️ **Pule este passo se é a primeira vez que está instalando!**

### 4. Inicie o sistema

```powershell
npm run dev
```

✅ Pronto! O sistema está rodando!

## 🌐 Acessar

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## 📋 Primeiros Passos

### 1. Abra o navegador

Acesse: http://localhost:5173

### 2. Cadastre seu primeiro tablet

1. Clique em **"Tablets"** no menu lateral
2. Clique no botão **"+ Novo Tablet"**
3. Preencha os dados:
   - Tombamento: `TB-001`
   - Modelo: `iPad Pro 11`
   - Fabricante: `Apple`
   - Sistema Operacional: `iOS`
   - IMEI: `123456789012345`
   - Número de Série: `ABC123XYZ`
   - Região: `Norte`
   - Estado: `AM`
   - Cidade: `Manaus`
   - Cliente: `Empresa ABC`
   - Localização: `Recepção`
   - Data de Aquisição: (escolha uma data)
4. Clique em **"Salvar"**

### 3. Explore o Dashboard

Volte ao **Dashboard** e veja as estatísticas atualizadas!

## 📚 Próximos Passos

- Cadastre mais tablets
- Registre uma manutenção
- Teste o registro de falhas
- Explore os relatórios

## 📖 Documentação Completa

- **README.md** - Documentação técnica completa
- **MANUAL_USO.md** - Manual detalhado de uso
- **EXEMPLOS_DADOS.md** - Dados de exemplo para testes

## 🆘 Problemas?

### Porta 3000 ou 5173 já em uso

**Windows:**
```powershell
# Encontrar processo usando a porta
netstat -ano | findstr :3000
# Matar processo (substitua PID pelo número encontrado)
taskkill /PID <PID> /F
```

### Erro ao instalar dependências

```powershell
# Limpe o cache
npm cache clean --force
# Tente novamente
npm run install:all
```

### Node.js não encontrado

Instale o Node.js 18 ou superior: https://nodejs.org

## 🎯 Comandos Úteis

```powershell
# Instalar tudo
npm run install:all

# Rodar backend e frontend juntos
npm run dev

# Rodar apenas backend
cd backend
npm run dev

# Rodar apenas frontend
cd frontend
npm run dev

# Build para produção (frontend)
cd frontend
npm run build
```

## ✨ Recursos Principais

✅ Dashboard com estatísticas em tempo real
✅ Gestão completa de tablets
✅ Controle de manutenções
✅ Registro de falhas
✅ Histórico de trocas
✅ Filtros e buscas
✅ Interface moderna e responsiva
✅ Gráficos interativos

---

**Pronto para começar! 🚀**

Qualquer dúvida, consulte o **MANUAL_USO.md** para instruções detalhadas.
