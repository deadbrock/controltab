# 📱 ControlTab - Sistema de Gestão de Tablets

Sistema completo para gestão e controle de tablets utilizados para batida de ponto eletrônico, com controle de tombamento, manutenções, falhas e trocas de equipamentos.

## 🎯 Funcionalidades

### 📊 Dashboard
- Visão geral de todos os tablets
- Estatísticas em tempo real (ativos, em manutenção, inativos)
- Gráficos de distribuição por região (Norte/Nordeste)
- Gráficos de status dos equipamentos
- Últimas atividades do sistema

### 💻 Gestão de Tablets
- Cadastro completo de tablets
- Registro de informações técnicas (SO, IMEI, número de série)
- Controle detalhado de localização (região, estado, cidade, endereço)
- Gestão por cliente
- Tombamento patrimonial
- Status do equipamento (Ativo, Manutenção, Inativo, Substituído)
- Histórico completo de cada equipamento
- Filtros avançados (por cliente, região, status)

### 🔧 Controle de Manutenções
- Registro de manutenções preventivas e corretivas
- Agendamento de manutenções
- Controle de técnicos responsáveis
- Registro de custos
- Status da manutenção (Agendada, Em Andamento, Concluída)

### ⚠️ Gestão de Falhas
- Registro de falhas e problemas
- Classificação por severidade (Baixa, Média, Alta, Crítica)
- Acompanhamento do status (Aberta, Em Análise, Resolvida)
- Registro de soluções aplicadas
- Histórico de falhas por equipamento

### 🔄 Controle de Trocas
- Registro de substituição de equipamentos
- Motivo da troca
- Rastreabilidade completa
- Histórico de trocas
- Desativação automática do tablet substituído

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** - Banco de dados
- **Better-SQLite3** - Driver SQLite de alta performance

### Frontend
- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP
- **React Router** - Roteamento

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- Navegador web moderno

## 🚀 Instalação

### 1. Clone o repositório (se aplicável)
```bash
cd controltab
```

### 2. Instale as dependências
```bash
npm run install:all
```

Este comando irá instalar as dependências do projeto raiz, backend e frontend.

## ▶️ Como Executar

### Se já tinha tablets cadastrados, execute a migração primeiro:
```bash
cd backend
npm run migrate
cd ..
```

### Executar Backend e Frontend simultaneamente
```bash
npm run dev
```

### Ou executar separadamente:

#### Backend (porta 3000)
```bash
cd backend
npm run dev
```

#### Frontend (porta 5173)
```bash
cd frontend
npm run dev
```

## 🌐 Acessar o Sistema

Após iniciar o sistema, acesse:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 📚 Estrutura do Projeto

```
controltab/
├── backend/
│   ├── controllers/      # Controladores da API
│   │   ├── tabletController.js
│   │   ├── manutencaoController.js
│   │   ├── falhaController.js
│   │   └── trocaController.js
│   ├── database/         # Configuração do banco
│   │   ├── init.js
│   │   └── controltab.db (criado automaticamente)
│   ├── routes/           # Rotas da API
│   │   └── index.js
│   ├── server.js         # Servidor Express
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   │   ├── Layout.jsx
│   │   │   ├── TabletModal.jsx
│   │   │   ├── ManutencaoModal.jsx
│   │   │   ├── FalhaModal.jsx
│   │   │   └── TrocaModal.jsx
│   │   ├── pages/        # Páginas da aplicação
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tablets.jsx
│   │   │   ├── TabletDetail.jsx
│   │   │   ├── Manutencoes.jsx
│   │   │   ├── Falhas.jsx
│   │   │   └── Trocas.jsx
│   │   ├── services/     # Serviços de API
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Tablets
- `GET /api/tablets` - Listar todos os tablets
- `GET /api/tablets/:id` - Buscar tablet por ID
- `GET /api/tablets/statistics` - Obter estatísticas
- `POST /api/tablets` - Criar novo tablet
- `PUT /api/tablets/:id` - Atualizar tablet
- `DELETE /api/tablets/:id` - Deletar tablet

### Manutenções
- `GET /api/manutencoes` - Listar manutenções
- `POST /api/manutencoes` - Criar manutenção
- `PUT /api/manutencoes/:id` - Atualizar manutenção
- `DELETE /api/manutencoes/:id` - Deletar manutenção

### Falhas
- `GET /api/falhas` - Listar falhas
- `POST /api/falhas` - Criar falha
- `PUT /api/falhas/:id` - Atualizar falha
- `DELETE /api/falhas/:id` - Deletar falha

### Trocas
- `GET /api/trocas` - Listar trocas
- `GET /api/trocas/:id` - Buscar troca por ID
- `POST /api/trocas` - Criar troca
- `DELETE /api/trocas/:id` - Deletar troca

## 💾 Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas:

- **tablets** - Informações dos tablets
- **manutencoes** - Registros de manutenções
- **falhas** - Registros de falhas
- **trocas** - Histórico de trocas
- **historico_uso** - Histórico de eventos

O banco de dados é criado automaticamente na primeira execução em `backend/database/controltab.db`.

## 🎨 Interface

O sistema possui uma interface moderna e responsiva com:
- Design limpo e profissional
- Responsivo (funciona em desktop, tablet e mobile)
- Tema com cores da paleta azul
- Navegação intuitiva
- Formulários validados
- Feedback visual de ações
- Gráficos interativos

## 📱 Recursos por Tela

### Dashboard
- Cards com totais e estatísticas
- Gráfico de barras com status dos tablets
- Gráfico de pizza com distribuição regional
- Tabela de tablets por localização
- Últimas atividades do sistema

### Tablets
- Listagem com filtros (status, região, busca)
- Visualização detalhada de cada tablet
- Cadastro e edição de tablets
- Histórico completo (manutenções, falhas, trocas)
- Exclusão de tablets

### Manutenções
- Registro de manutenções por tablet
- Filtro por status
- Informações de custos e técnicos
- Atualização de status
- Vínculo automático com histórico

### Falhas
- Registro de falhas por severidade
- Filtros por status e severidade
- Registro de soluções
- Rastreamento de problemas
- Alertas visuais por severidade

### Trocas
- Registro de substituições
- Rastreamento de tablet antigo e novo
- Motivos e descrições detalhadas
- Alteração automática de status
- Histórico completo

## 🔒 Segurança

- Validação de dados no backend
- Constraints no banco de dados
- Proteção contra SQL injection
- CORS configurado
- Validação de formulários no frontend

## 📈 Melhorias Futuras

- [ ] Sistema de autenticação e autorização
- [ ] Relatórios em PDF
- [ ] Exportação de dados (Excel/CSV)
- [ ] Notificações por email
- [ ] Backup automático do banco
- [ ] Dashboard com mais métricas
- [ ] Aplicativo mobile
- [ ] Integração com sistema de ponto
- [ ] Sistema de alertas automáticos
- [ ] Multi-tenancy (múltiplas empresas)

## 🐛 Resolução de Problemas

### Erro ao instalar dependências
```bash
# Limpe o cache do npm
npm cache clean --force

# Reinstale
npm run install:all
```

### Porta já em uso
```bash
# Backend (porta 3000)
# Altere a porta em backend/server.js

# Frontend (porta 5173)
# Altere a porta em frontend/vite.config.js
```

### Banco de dados corrompido
```bash
# Delete o arquivo do banco e reinicie
cd backend/database
del controltab.db
cd ../..
npm run dev:backend
```

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Se todas as dependências foram instaladas corretamente
2. Se as portas 3000 e 5173 estão disponíveis
3. Se o Node.js está na versão 18 ou superior
4. Os logs no terminal para identificar erros

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar este projeto.

---

**Desenvolvido para gestão eficiente de tablets de controle de ponto** 🚀
"# controltab" 
