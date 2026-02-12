import { query, queryOne, execute } from '../database/connection.js';

// Relatório Geral de Tablets
export const relatorioGeral = async (req, res) => {
  try {
    const { regiao, status: statusFilter, cliente } = req.query;
    
    let queryStr = 'SELECT * FROM tablets WHERE 1=1';
    const params = [];

    if (regiao) {
      queryStr += ' AND regiao = ?';
      params.push(regiao);
    }

    if (statusFilter) {
      queryStr += ' AND status = ?';
      params.push(statusFilter);
    }

    if (cliente) {
      queryStr += ' AND cliente LIKE ?';
      params.push(`%${cliente}%`);
    }

    queryStr += ' ORDER BY cliente, cidade, tombamento';

    const tablets = await query(queryStr, params);

    // Estatísticas gerais
    const stats = {
      total: tablets.length,
      valor_total: tablets.reduce((sum, t) => sum + (t.valor_aquisicao || 0), 0),
      por_status: {},
      por_regiao: {},
      por_cliente: {},
      com_garantia: 0,
      com_seguro: 0
    };

    const hoje = new Date().toISOString().split('T')[0];

    tablets.forEach(tablet => {
      // Por status
      stats.por_status[tablet.status] = (stats.por_status[tablet.status] || 0) + 1;
      
      // Por região
      stats.por_regiao[tablet.regiao] = (stats.por_regiao[tablet.regiao] || 0) + 1;
      
      // Por cliente
      stats.por_cliente[tablet.cliente] = (stats.por_cliente[tablet.cliente] || 0) + 1;
      
      // Com garantia ativa
      if (tablet.garantia_ate && tablet.garantia_ate >= hoje) {
        stats.com_garantia++;
      }
      
      // Com seguro
      if (tablet.apolice_seguro) {
        stats.com_seguro++;
      }
    });

    res.json({
      success: true,
      data: {
        tablets,
        estatisticas: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório geral',
      error: error.message
    });
  }
};

// Relatório de Falhas
export const relatorioFalhas = async (req, res) => {
  try {
    const { severidade, status: statusFilter, data_inicio, data_fim } = req.query;
    
    let queryStr = `
      SELECT f.*, t.tombamento, t.modelo, t.cliente, t.localizacao
      FROM falhas f
      JOIN tablets t ON f.tablet_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (severidade) {
      queryStr += ' AND f.severidade = ?';
      params.push(severidade);
    }

    if (statusFilter) {
      queryStr += ' AND f.status = ?';
      params.push(statusFilter);
    }

    if (data_inicio) {
      queryStr += ' AND f.data_ocorrencia >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      queryStr += ' AND f.data_ocorrencia <= ?';
      params.push(data_fim);
    }

    queryStr += ' ORDER BY f.data_ocorrencia DESC';

    const falhas = await query(queryStr, params);

    // Estatísticas de falhas
    const stats = {
      total: falhas.length,
      por_severidade: {},
      por_status: {},
      por_tipo: {},
      tablets_afetados: new Set()
    };

    falhas.forEach(falha => {
      stats.por_severidade[falha.severidade] = (stats.por_severidade[falha.severidade] || 0) + 1;
      stats.por_status[falha.status] = (stats.por_status[falha.status] || 0) + 1;
      stats.por_tipo[falha.tipo_falha] = (stats.por_tipo[falha.tipo_falha] || 0) + 1;
      stats.tablets_afetados.add(falha.tablet_id);
    });

    stats.tablets_afetados = stats.tablets_afetados.size;

    res.json({
      success: true,
      data: {
        falhas,
        estatisticas: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório de falhas',
      error: error.message
    });
  }
};

// Relatório de Manutenções
export const relatorioManutencoes = async (req, res) => {
  try {
    const { tipo, status: statusFilter, data_inicio, data_fim } = req.query;
    
    let queryStr = `
      SELECT m.*, t.tombamento, t.modelo, t.cliente, t.localizacao
      FROM manutencoes m
      JOIN tablets t ON m.tablet_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (tipo) {
      queryStr += ' AND m.tipo = ?';
      params.push(tipo);
    }

    if (statusFilter) {
      queryStr += ' AND m.status = ?';
      params.push(statusFilter);
    }

    if (data_inicio) {
      queryStr += ' AND m.data_inicio >= ?';
      params.push(data_inicio);
    }

    if (data_fim) {
      queryStr += ' AND m.data_inicio <= ?';
      params.push(data_fim);
    }

    queryStr += ' ORDER BY m.data_inicio DESC';

    const manutencoes = await query(queryStr, params);

    // Estatísticas de manutenções
    const stats = {
      total: manutencoes.length,
      custo_total: manutencoes.reduce((sum, m) => sum + (m.custo || 0), 0),
      por_tipo: {},
      por_status: {},
      tempo_medio: 0,
      tablets_afetados: new Set()
    };

    let tempoTotal = 0;
    let comTempoDefinido = 0;

    manutencoes.forEach(manutencao => {
      stats.por_tipo[manutencao.tipo] = (stats.por_tipo[manutencao.tipo] || 0) + 1;
      stats.por_status[manutencao.status] = (stats.por_status[manutencao.status] || 0) + 1;
      stats.tablets_afetados.add(manutencao.tablet_id);

      // Calcular tempo médio
      if (manutencao.data_inicio && manutencao.data_conclusao) {
        const inicio = new Date(manutencao.data_inicio);
        const fim = new Date(manutencao.data_conclusao);
        const dias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
        tempoTotal += dias;
        comTempoDefinido++;
      }
    });

    stats.tablets_afetados = stats.tablets_afetados.size;
    stats.tempo_medio = comTempoDefinido > 0 ? Math.round(tempoTotal / comTempoDefinido) : 0;

    res.json({
      success: true,
      data: {
        manutencoes,
        estatisticas: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório de manutenções',
      error: error.message
    });
  }
};

// Relatório por Cliente
export const relatorioPorCliente = async (req, res) => {
  try {
    const clientes = await query(`
      SELECT 
        cliente,
        COUNT(*) as total_tablets,
        SUM(CASE WHEN status = 'ATIVO' THEN 1 ELSE 0 END) as ativos,
        SUM(CASE WHEN status = 'MANUTENCAO' THEN 1 ELSE 0 END) as manutencao,
        SUM(CASE WHEN status = 'INATIVO' THEN 1 ELSE 0 END) as inativos,
        SUM(valor_aquisicao) as valor_total,
        GROUP_CONCAT(DISTINCT cidade) as cidades,
        GROUP_CONCAT(DISTINCT estado) as estados
      FROM tablets
      WHERE status != 'SUBSTITUIDO'
      GROUP BY cliente
      ORDER BY total_tablets DESC
    `);

    // Para cada cliente, buscar falhas e manutenções
    for (let cliente of clientes) {
      const falhas = await queryOne(`
        SELECT COUNT(*) as total
        FROM falhas f
        JOIN tablets t ON f.tablet_id = t.id
        WHERE t.cliente = ? AND f.status = 'ABERTA'
      `, [cliente.cliente]);

      const manutencoes = await queryOne(`
        SELECT COUNT(*) as total
        FROM manutencoes m
        JOIN tablets t ON m.tablet_id = t.id
        WHERE t.cliente = ? AND m.status IN ('AGENDADA', 'EM_ANDAMENTO')
      `, [cliente.cliente]);

      cliente.falhas_abertas = falhas.total;
      cliente.manutencoes_pendentes = manutencoes.total;
    }

    res.json({
      success: true,
      data: clientes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório por cliente',
      error: error.message
    });
  }
};

// Relatório de Garantias
export const relatorioGarantias = async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];
    const daquiA30Dias = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const tablets = await query(`
      SELECT *
      FROM tablets
      WHERE garantia_ate IS NOT NULL
      ORDER BY garantia_ate ASC
    `);

    const stats = {
      total_com_garantia: tablets.length,
      garantia_ativa: 0,
      garantia_vencida: 0,
      vence_30_dias: 0,
      tablets_vencendo: []
    };

    tablets.forEach(tablet => {
      if (tablet.garantia_ate >= hoje) {
        stats.garantia_ativa++;
        if (tablet.garantia_ate <= daquiA30Dias) {
          stats.vence_30_dias++;
          stats.tablets_vencendo.push(tablet);
        }
      } else {
        stats.garantia_vencida++;
      }
    });

    res.json({
      success: true,
      data: {
        tablets,
        estatisticas: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório de garantias',
      error: error.message
    });
  }
};

// Relatório Financeiro
export const relatorioFinanceiro = async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;

    let queryTablets = 'SELECT * FROM tablets WHERE valor_aquisicao IS NOT NULL';
    let queryManutencoes = 'SELECT * FROM manutencoes WHERE custo IS NOT NULL';
    const params = [];

    if (data_inicio && data_fim) {
      queryTablets += ' AND data_aquisicao BETWEEN ? AND ?';
      queryManutencoes += ' AND data_inicio BETWEEN ? AND ?';
      params.push(data_inicio, data_fim);
    }

    const tablets = await query(queryTablets, params);
    const manutencoes = await query(queryManutencoes, params);

    const stats = {
      investimento_tablets: tablets.reduce((sum, t) => sum + (t.valor_aquisicao || 0), 0),
      custo_manutencoes: manutencoes.reduce((sum, m) => sum + (m.custo || 0), 0),
      total_gasto: 0,
      custo_medio_tablet: 0,
      custo_medio_manutencao: 0,
      por_regiao: {},
      por_cliente: {}
    };

    stats.total_gasto = stats.investimento_tablets + stats.custo_manutencoes;
    stats.custo_medio_tablet = tablets.length > 0 ? stats.investimento_tablets / tablets.length : 0;
    stats.custo_medio_manutencao = manutencoes.length > 0 ? stats.custo_manutencoes / manutencoes.length : 0;

    // Por região
    tablets.forEach(tablet => {
      if (!stats.por_regiao[tablet.regiao]) {
        stats.por_regiao[tablet.regiao] = { tablets: 0, valor: 0 };
      }
      stats.por_regiao[tablet.regiao].tablets++;
      stats.por_regiao[tablet.regiao].valor += tablet.valor_aquisicao || 0;
    });

    // Por cliente
    tablets.forEach(tablet => {
      if (!stats.por_cliente[tablet.cliente]) {
        stats.por_cliente[tablet.cliente] = { tablets: 0, valor: 0 };
      }
      stats.por_cliente[tablet.cliente].tablets++;
      stats.por_cliente[tablet.cliente].valor += tablet.valor_aquisicao || 0;
    });

    res.json({
      success: true,
      data: {
        tablets,
        manutencoes,
        estatisticas: stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório financeiro',
      error: error.message
    });
  }
};
