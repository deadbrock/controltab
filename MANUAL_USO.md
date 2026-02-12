# 📖 Manual de Uso - ControlTab

Guia completo para utilizar o sistema de gestão de tablets.

## 📋 Índice

1. [Introdução](#introdução)
2. [Acessando o Sistema](#acessando-o-sistema)
3. [Dashboard](#dashboard)
4. [Gestão de Tablets](#gestão-de-tablets)
5. [Manutenções](#manutenções)
6. [Falhas](#falhas)
7. [Trocas](#trocas)
8. [Dicas e Boas Práticas](#dicas-e-boas-práticas)

---

## Introdução

O **ControlTab** é um sistema desenvolvido para facilitar a gestão de tablets utilizados para controle de ponto eletrônico, permitindo:
- Controlar mais de 30 tablets nas regiões Norte e Nordeste
- Registrar e acompanhar manutenções
- Documentar falhas e soluções
- Gerenciar trocas de equipamentos
- Manter histórico completo de cada tablet

---

## Acessando o Sistema

1. Abra seu navegador (Chrome, Firefox, Edge)
2. Acesse: `http://localhost:5173`
3. A tela inicial (Dashboard) será exibida

### Navegação

O menu lateral contém as principais seções:
- 🏠 **Dashboard** - Visão geral
- 💻 **Tablets** - Gestão de equipamentos
- 🔧 **Manutenções** - Controle de manutenções
- ⚠️ **Falhas** - Registro de problemas
- 🔄 **Trocas** - Substituições de tablets

No mobile, clique no ícone ☰ (menu hambúrguer) para acessar o menu.

---

## Dashboard

A tela inicial apresenta uma visão geral do sistema:

### Cards de Estatísticas
- **Total de Tablets**: Quantidade total cadastrada
- **Tablets Ativos**: Equipamentos em uso
- **Em Manutenção**: Tablets sendo reparados
- **Falhas Abertas**: Problemas pendentes

💡 **Dica**: Clique em qualquer card para ir diretamente à tela correspondente.

### Gráficos

**Status dos Tablets**
- Visualização em barras dos tablets por status
- Cores diferentes para cada status

**Distribuição por Região**
- Gráfico de pizza mostrando Norte vs Nordeste
- Percentuais automáticos

**Tablets por Localização**
- Tabela com quantidade de tablets por cidade
- Ordenado por quantidade (maior → menor)

**Últimas Atividades**
- Histórico das 10 últimas ações no sistema
- Cadastros, manutenções, trocas, etc.

---

## Gestão de Tablets

### Listando Tablets

Na tela **Tablets**, você verá todos os equipamentos cadastrados.

**Filtros Disponíveis:**
- **Buscar**: Digite tombamento, modelo, IMEI ou localização
- **Status**: Filtre por Ativo, Manutenção, Inativo ou Substituído
- **Região**: Norte ou Nordeste

💡 **Dica**: Use o botão "Limpar" para remover todos os filtros.

### Cadastrando um Novo Tablet

1. Clique no botão **"+ Novo Tablet"**
2. Preencha os campos obrigatórios (*):

**Informações Básicas:**
- **Tombamento**: Código de identificação patrimonial (ex: TB-001)
- **Modelo**: Modelo do tablet (ex: iPad Pro 11, Galaxy Tab S8)
- **Fabricante**: Marca (ex: Apple, Samsung)

**Informações Técnicas:**
- **Sistema Operacional**: iOS, Android, Windows
- **Versão do SO**: Versão do sistema (ex: 16.5)
- **IMEI**: Número IMEI de 15 dígitos
- **Número de Série**: Número de série do fabricante

**Localização:**
- **Localização**: Cidade e estado (ex: Manaus - AM)
- **Região**: Norte ou Nordeste

**Status e Outros:**
- **Status**: Ativo (padrão), Manutenção, Inativo ou Substituído
- **Data de Aquisição**: Data de compra do equipamento
- **Observações**: Informações adicionais (opcional)

3. Clique em **"Salvar"**

✅ O tablet será cadastrado e aparecerá na listagem.

### Visualizando Detalhes de um Tablet

1. Na lista de tablets, clique no botão **"Ver"**
2. Você verá uma tela com abas:

**Aba Informações:**
- Detalhes técnicos completos
- Localização
- Observações

**Aba Manutenções:**
- Histórico de todas as manutenções realizadas
- Status de cada manutenção
- Custos e técnicos responsáveis

**Aba Falhas:**
- Todas as falhas registradas
- Severidade e status
- Soluções aplicadas

**Aba Trocas:**
- Histórico de substituições
- Motivos das trocas

**Aba Histórico:**
- Todos os eventos relacionados ao tablet
- Cronologia completa de ações

### Editando um Tablet

1. Na lista de tablets, clique no botão **"Editar"**
2. Modifique os campos necessários
3. Clique em **"Salvar"**

⚠️ **Atenção**: IMEI e Número de Série devem ser únicos.

### Excluindo um Tablet

1. Na lista de tablets, clique no botão **"Excluir"**
2. Confirme a exclusão

⚠️ **Atenção**: Esta ação não pode ser desfeita e excluirá também todo o histórico relacionado.

---

## Manutenções

### Registrando uma Manutenção

1. Acesse a tela **Manutenções**
2. Clique em **"+ Nova Manutenção"**
3. Preencha os dados:

**Campos Obrigatórios:**
- **Tablet**: Selecione o tablet na lista
- **Tipo**: Preventiva, Corretiva ou Troca de Peças
- **Descrição**: Descreva a manutenção necessária
- **Data de Início**: Quando a manutenção começará
- **Status**: Agendada, Em Andamento, Concluída ou Cancelada

**Campos Opcionais:**
- **Data de Conclusão**: Quando foi finalizada
- **Técnico Responsável**: Nome do técnico
- **Custo**: Valor em reais (ex: 150.00)
- **Observações**: Informações adicionais

4. Clique em **"Salvar"**

### Status das Manutenções

**🔵 Agendada**
- Manutenção planejada, ainda não iniciada

**🟡 Em Andamento**
- Manutenção sendo realizada
- Tablet será marcado como "Em Manutenção"

**🟢 Concluída**
- Manutenção finalizada
- Tablet volta ao status "Ativo"

**⚫ Cancelada**
- Manutenção cancelada

### Atualizando uma Manutenção

1. Na lista de manutenções, clique em **"Editar"**
2. Atualize o status ou outros campos
3. Salve as alterações

💡 **Dica**: Ao marcar como "Concluída", o tablet voltará automaticamente ao status "Ativo".

### Filtrando Manutenções

Use o filtro de **Status** para ver apenas:
- Manutenções agendadas
- Manutenções em andamento
- Manutenções concluídas
- Manutenções canceladas

---

## Falhas

### Registrando uma Falha

1. Acesse a tela **Falhas**
2. Clique em **"+ Nova Falha"**
3. Preencha os dados:

**Campos Obrigatórios:**
- **Tablet**: Selecione o tablet
- **Tipo de Falha**: Descrição breve (ex: "Tela quebrada", "Bateria viciada")
- **Descrição**: Detalhes da falha
- **Severidade**: Baixa, Média, Alta ou Crítica
- **Data de Ocorrência**: Quando a falha foi detectada
- **Status**: Aberta, Em Análise, Resolvida ou Não Resolvida

**Campo Opcional:**
- **Solução**: Descreva como foi resolvida (preencher quando resolver)

4. Clique em **"Salvar"**

### Classificação de Severidade

**🔵 Baixa**
- Problema menor, não afeta uso do tablet
- Ex: Risco leve na tela

**🟡 Média**
- Problema afeta parcialmente o uso
- Ex: Botão com mau contato

**🟠 Alta**
- Problema sério, uso comprometido
- Ex: Bateria descarrega rápido

**🔴 Crítica**
- Tablet inutilizável
- Ex: Tela totalmente quebrada, não liga

### Resolvendo uma Falha

1. Clique em **"Editar"** na falha
2. Altere o status para "Resolvida"
3. Preencha o campo **"Solução"** explicando como foi resolvida
4. Salve

### Filtrando Falhas

Use os filtros para visualizar:
- **Por Status**: Abertas, Em Análise, Resolvidas
- **Por Severidade**: Críticas, Altas, Médias, Baixas

---

## Trocas

### Registrando uma Troca de Tablet

Use esta função quando um tablet precisar ser substituído por outro.

1. Acesse a tela **Trocas**
2. Clique em **"+ Registrar Troca"**
3. Preencha os dados:

**Tablet a ser Substituído:**
- Selecione o tablet que será desativado
- Pode estar em qualquer status (Ativo, Manutenção, Inativo)

**Novo Tablet (Opcional):**
- Selecione o tablet que entrará no lugar
- Somente tablets ativos são listados
- Deixe em branco se apenas desativar o antigo

**Motivo da Troca:**
- Motivo principal (ex: "Defeito irreparável", "Perda", "Roubo")

**Descrição Detalhada:**
- Detalhes sobre a troca, circunstâncias, etc.

**Data da Troca:**
- Quando ocorreu a substituição

**Responsável:**
- Nome de quem autorizou/realizou a troca

4. Clique em **"Registrar Troca"**

### O que Acontece ao Registrar uma Troca?

1. ❌ Tablet antigo: Status alterado para **"SUBSTITUÍDO"**
2. ✅ Tablet novo: Continua **"ATIVO"** (se selecionado)
3. 📝 Histórico é registrado em ambos os tablets
4. 📊 Troca aparece na lista de trocas

⚠️ **Atenção**: Esta ação não pode ser desfeita facilmente. O tablet substituído ficará marcado como tal no sistema.

### Visualizando Histórico de Trocas

A tela de Trocas mostra:
- 🔴 Tablet substituído (em vermelho)
- 🟢 Novo tablet (em verde)
- Motivo da troca
- Data e responsável
- Descrição detalhada

---

## Dicas e Boas Práticas

### 📊 Organização

1. **Use Tombamento Padronizado**
   - Ex: TB-001, TB-002, TB-003
   - Facilita identificação rápida

2. **Preencha a Localização Completa**
   - Ex: "Manaus - AM - Unidade Centro"
   - Ajuda na gestão regional

3. **Mantenha IMEI e Número de Série Corretos**
   - Essencial para garantias e rastreamento

### 🔧 Manutenções

1. **Registre Manutenções Preventivas**
   - Programe revisões periódicas
   - Evita problemas futuros

2. **Documente Custos**
   - Preencha o campo de custo
   - Ajuda no controle orçamentário

3. **Atualize o Status**
   - Mantenha sempre atualizado
   - Facilita acompanhamento

### ⚠️ Falhas

1. **Registre Falhas Imediatamente**
   - Não espere acumular problemas
   - Histórico detalhado ajuda na análise

2. **Classifique Severidade Corretamente**
   - Crítica: ação imediata necessária
   - Baixa: pode aguardar manutenção programada

3. **Sempre Preencha a Solução**
   - Cria base de conhecimento
   - Ajuda em problemas futuros similares

### 🔄 Trocas

1. **Documente Bem o Motivo**
   - Ajuda na análise de durabilidade
   - Justifica substituições

2. **Verifique Antes de Confirmar**
   - Ação irreversível
   - Tablet fica marcado como substituído

### 📱 Uso Geral

1. **Use os Filtros**
   - Facilita encontrar informações
   - Economiza tempo

2. **Consulte o Dashboard Regularmente**
   - Visão rápida da situação
   - Identifica problemas rapidamente

3. **Mantenha Dados Atualizados**
   - Sistema só é útil com dados corretos
   - Atualize sempre que houver mudanças

### 🎯 Indicadores de Atenção

**Falhas Críticas Abertas**
- Priorize resolução imediata
- Pode indicar necessidade de troca

**Muitas Manutenções no Mesmo Tablet**
- Pode indicar problema recorrente
- Considere substituição

**Tablets Inativos por Muito Tempo**
- Verifique se podem voltar ao uso
- Ou registre troca formal

---

## 🆘 Problemas Comuns e Soluções

### Não Consigo Cadastrar Tablet

**Erro: "Já existe um tablet com este tombamento/IMEI"**
- Verifique se já não foi cadastrado
- Use outro código de tombamento
- Confirme o IMEI correto

### Tablet Não Aparece na Lista

**Possíveis causas:**
- Filtro ativo (clique em "Limpar")
- Tablet marcado como substituído
- Erro na busca (tente buscar por outro campo)

### Não Consigo Editar Manutenção

**Verifique:**
- Se o tablet ainda existe
- Se há conexão com o servidor
- Tente recarregar a página

### Status Não Atualiza

**Solução:**
- Recarregue a página (F5)
- Verifique se salvou as alterações
- Confira o console do navegador (F12)

---

## 📞 Suporte Técnico

Se encontrar algum problema não listado aqui:

1. Verifique os logs no terminal do servidor
2. Confira se backend e frontend estão rodando
3. Teste em outro navegador
4. Limpe o cache do navegador

---

**Sistema desenvolvido para facilitar sua gestão de tablets!** 🚀

Qualquer dúvida, consulte este manual ou entre em contato com o suporte técnico.
