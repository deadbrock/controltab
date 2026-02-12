# 📊 Exemplos de Dados para Teste

Use estes exemplos para popular o sistema e testar as funcionalidades.

## 📱 Tablets

### Tablet 1 - Manaus
```
Tombamento: TB-001
Modelo: iPad Pro 11
Fabricante: Apple
Sistema Operacional: iOS
Versão SO: 16.5
IMEI: 123456789012345
Número de Série: DMXABCDEF123
Região: NORTE
Estado: AM
Cidade: Manaus
Endereço: Av. Torquato Tapajós, 1500 - Flores
Cliente: Empresa ABC Ltda
Localização: Recepção Principal
Status: ATIVO
Data de Aquisição: 2024-01-15
Observações: Tablet para recepção principal
```

### Tablet 2 - Belém
```
Tombamento: TB-002
Modelo: Galaxy Tab S8
Fabricante: Samsung
Sistema Operacional: Android
Versão SO: 13
IMEI: 234567890123456
Número de Série: R9XYBCD456789
Região: NORTE
Estado: PA
Cidade: Belém
Endereço: Rua dos Tamoios, 350 - Centro
Cliente: Indústria XYZ S.A.
Localização: Setor Produção - Linha 1
Status: ATIVO
Data de Aquisição: 2024-01-20
Observações: Usado na área de produção
```

### Tablet 3 - Fortaleza
```
Tombamento: TB-003
Modelo: iPad 9
Fabricante: Apple
Sistema Operacional: iOS
Versão SO: 15.8
IMEI: 345678901234567
Número de Série: FMXBCDEFG456
Região: NORDESTE
Estado: CE
Cidade: Fortaleza
Endereço: Shopping Center Norte - Loja 205
Cliente: Comércio Costa e Silva
Localização: Caixa de Atendimento
Status: MANUTENCAO
Data de Aquisição: 2023-11-10
Observações: Apresentou problema na bateria
```

### Tablet 4 - Salvador
```
Tombamento: TB-004
Modelo: Lenovo Tab M10
Fabricante: Lenovo
Sistema Operacional: Android
Versão SO: 11
IMEI: 456789012345678
Número de Série: LV123XYZ789
Região: NORDESTE
Estado: BA
Cidade: Salvador
Endereço: Av. Tancredo Neves, 2915 - Caminho das Árvores
Cliente: Empresa DEF Serviços
Localização: Sala RH - Ponto Backup
Status: ATIVO
Data de Aquisição: 2024-02-01
Observações: Tablet de backup
```

### Tablet 5 - Porto Velho
```
Tombamento: TB-005
Modelo: Surface Go 3
Fabricante: Microsoft
Sistema Operacional: Windows
Versão SO: 11 Pro
IMEI: 567890123456789
Número de Série: MS456DEF789
Região: NORTE
Estado: RO
Cidade: Porto Velho
Endereço: Rua José de Alencar, 2873
Cliente: Grupo GHI Logística
Localização: Portaria de Entrada
Status: ATIVO
Data de Aquisição: 2024-01-05
Observações: Controle de entrada de funcionários
```

## 🔧 Manutenções

### Manutenção 1 (TB-003)
```
Tablet: TB-003 - iPad 9
Tipo: CORRETIVA
Descrição: Substituição de bateria devido a vício. Bateria inchada, necessita troca imediata.
Data de Início: 2024-02-08
Data de Conclusão: 2024-02-10
Técnico Responsável: João Silva
Custo: 350.00
Status: CONCLUIDA
Observações: Bateria original Apple instalada. Garantia de 3 meses.
```

### Manutenção 2 (TB-001)
```
Tablet: TB-001 - iPad Pro 11
Tipo: PREVENTIVA
Descrição: Revisão geral preventiva de 6 meses. Limpeza interna, atualização de sistema.
Data de Início: 2024-02-05
Data de Conclusão: 2024-02-05
Técnico Responsável: Maria Santos
Custo: 80.00
Status: CONCLUIDA
Observações: Tablet em perfeitas condições
```

### Manutenção 3 (TB-002)
```
Tablet: TB-002 - Galaxy Tab S8
Tipo: PREVENTIVA
Descrição: Manutenção preventiva trimestral agendada
Data de Início: 2024-02-15
Status: AGENDADA
Observações: Agendar com antecedência
```

## ⚠️ Falhas

### Falha 1 (TB-003)
```
Tablet: TB-003 - iPad 9
Tipo de Falha: Bateria viciada
Descrição: Bateria descarrega muito rápido, durando apenas 2 horas. Tablet também está esquentando mais que o normal.
Severidade: ALTA
Data de Ocorrência: 2024-02-07
Status: RESOLVIDA
Solução: Bateria substituída por uma nova original. Problema resolvido completamente.
```

### Falha 2 (TB-001)
```
Tablet: TB-001 - iPad Pro 11
Tipo de Falha: Touch screen intermitente
Descrição: Touch screen ocasionalmente para de responder no canto superior direito. Necessário reiniciar para voltar ao normal.
Severidade: MEDIA
Data de Ocorrência: 2024-02-10
Status: EM_ANALISE
Solução: 
```

### Falha 3 (TB-004)
```
Tablet: TB-004 - Lenovo Tab M10
Tipo de Falha: Risco na tela
Descrição: Pequeno risco superficial na tela, não afeta o uso
Severidade: BAIXA
Data de Ocorrência: 2024-02-09
Status: ABERTA
Solução: 
```

### Falha 4 (TB-002)
```
Tablet: TB-002 - Galaxy Tab S8
Tipo de Falha: Botão de volume travado
Descrição: Botão de aumentar volume está travado e não responde. Volume só pode ser ajustado por software.
Severidade: MEDIA
Data de Ocorrência: 2024-02-11
Status: ABERTA
Solução: 
```

## 🔄 Trocas

### Troca 1
```
Tablet Antigo: TB-999 (criar primeiro)
  - Modelo: iPad 8
  - Localização: Manaus - AM
  - Status: (será alterado para SUBSTITUIDO)

Tablet Novo: TB-001
  - iPad Pro 11

Motivo: Tela completamente quebrada
Descrição Detalhada: Tablet caiu de altura de 1,5m resultando em tela completamente quebrada e inutilizável. Custo de reparo seria maior que o valor do equipamento. Decisão de substituir por modelo mais novo.
Data da Troca: 2024-01-15
Responsável: Carlos Mendes
```

## 📝 Roteiro de Testes Completo

### 1. Teste de Cadastro de Tablets

1. Cadastre os 5 tablets listados acima
2. Verifique se aparecem no dashboard
3. Teste os filtros (Norte/Nordeste, Status)
4. Faça uma busca por "iPad"

### 2. Teste de Manutenções

1. Cadastre as 3 manutenções listadas
2. Observe que o TB-003 muda para status "Em Manutenção" ao criar manutenção "Em Andamento"
3. Atualize a manutenção 3 para "Em Andamento"
4. Verifique se o tablet mudou de status
5. Marque como "Concluída" e veja o tablet voltar para "Ativo"

### 3. Teste de Falhas

1. Cadastre as 4 falhas listadas
2. Teste os filtros de severidade
3. Edite a Falha 2 e adicione uma solução
4. Marque como "Resolvida"
5. Verifique o histórico no detalhe do tablet

### 4. Teste de Trocas

1. Primeiro, cadastre um tablet "TB-999" (iPad 8 antigo)
2. Registre uma troca do TB-999 pelo TB-001
3. Verifique que o TB-999 ficou como "SUBSTITUÍDO"
4. Veja o histórico em ambos os tablets
5. Confira na tela de Trocas

### 5. Teste do Dashboard

1. Após cadastrar todos os dados, volte ao Dashboard
2. Verifique os números nos cards
3. Observe os gráficos atualizados
4. Confira a tabela de localização
5. Veja as últimas atividades

### 6. Teste de Detalhes do Tablet

1. Acesse o detalhe do TB-003
2. Navegue pelas abas:
   - Informações
   - Manutenções (deve ter 1)
   - Falhas (deve ter 1)
   - Histórico (várias entradas)
3. Verifique todas as informações

## 🎯 Cenários de Uso Real

### Cenário 1: Novo Tablet Chegou
1. Cadastrar tablet com todos os dados
2. Status: ATIVO
3. Criar entrada no histórico automática

### Cenário 2: Tablet Apresentou Problema
1. Registrar falha (severidade alta se urgente)
2. Criar manutenção corretiva
3. Status muda para "Em Manutenção"
4. Após conserto, atualizar falha para "Resolvida"
5. Concluir manutenção
6. Tablet volta ao status "Ativo"

### Cenário 3: Manutenção Preventiva
1. Agendar manutenção preventiva
2. Status: "Agendada"
3. No dia, mudar para "Em Andamento"
4. Ao finalizar, marcar como "Concluída"

### Cenário 4: Tablet Irreparável
1. Registrar falha crítica
2. Criar manutenção corretiva
3. Constatar que não tem reparo
4. Registrar troca
5. Tablet antigo fica "Substituído"
6. Novo tablet entra como "Ativo"

## 💡 Dicas para População de Dados

### IMEI
- Sempre 15 dígitos
- Pode ser numérico sequencial para testes: 111111111111111, 222222222222222, etc.

### Número de Série
- Formato varia por fabricante
- Para testes, use formato: MARCA+NUMERO (ex: APPLE12345)

### Datas
- Use datas recentes para testes
- Data de aquisição: últimos 6 meses
- Datas de manutenção: últimos 30 dias

### Custos
- Manutenção preventiva: R$ 50 - R$ 150
- Manutenção corretiva simples: R$ 150 - R$ 400
- Troca de peças grandes: R$ 300 - R$ 800

---

**Use estes dados para testar todas as funcionalidades do sistema!** 🚀
