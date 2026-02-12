import { query, queryOne, execute } from '../database/connection.js';

// Listar todos os tablets
export const getAllTablets = async (req, res) => {
  try {
    const { status: statusFilter, regiao, cliente, search } = req.query;
    
    let queryStr = 'SELECT * FROM tablets WHERE 1=1';
    const params = [];

    if (statusFilter) {
      queryStr += ' AND status = ?';
      params.push(statusFilter);
    }

    if (regiao) {
      queryStr += ' AND regiao = ?';
      params.push(regiao);
    }

    if (cliente) {
      queryStr += ' AND cliente LIKE ?';
      params.push(`%${cliente}%`);
    }

    if (search) {
      queryStr += ' AND (tombamento LIKE ? OR modelo LIKE ? OR localizacao LIKE ? OR imei LIKE ? OR cliente LIKE ? OR cidade LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam, searchParam, searchParam);
    }

    queryStr += ' ORDER BY created_at DESC';

    const tablets = await query(queryStr, params);

    res.json({
      success: true,
      data: tablets,
      total: tablets.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tablets',
      error: error.message
    });
  }
};

// Buscar tablet por ID
export const getTabletById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tablet = await queryOne('SELECT * FROM tablets WHERE id = ?', [id]);

    if (!tablet) {
      return res.status(404).json({
        success: false,
        message: 'Tablet não encontrado'
      });
    }

    // Buscar informações adicionais
    const manutencoes = await query('SELECT * FROM manutencoes WHERE tablet_id = ? ORDER BY data_inicio DESC', [id]);
    const falhas = await query('SELECT * FROM falhas WHERE tablet_id = ? ORDER BY data_ocorrencia DESC', [id]);
    const historico = await query('SELECT * FROM historico_uso WHERE tablet_id = ? ORDER BY data_evento DESC LIMIT 50', [id]);
    const trocas = await query('SELECT * FROM trocas WHERE tablet_antigo_id = ? OR tablet_novo_id = ? ORDER BY data_troca DESC', [id, id]);

    res.json({
      success: true,
      data: {
        ...tablet,
        manutencoes,
        falhas,
        historico,
        trocas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar tablet',
      error: error.message
    });
  }
};

// Criar novo tablet
export const createTablet = async (req, res) => {
  try {
    const {
      tombamento,
      modelo,
      fabricante,
      sistema_operacional,
      versao_so,
      imei,
      numero_serie,
      regiao,
      estado,
      cidade,
      endereco,
      cliente,
      localizacao,
      status = 'ATIVO',
      data_aquisicao,
      valor_aquisicao,
      fornecedor,
      numero_nota_fiscal,
      garantia_ate,
      apolice_seguro,
      email_conta,
      senha_email,
      senha_tablet,
      numero_telefone,
      operadora,
      observacoes
    } = req.body;

    // Converter strings vazias para null (PostgreSQL não aceita '' em campos DATE/NUMERIC)
    const normalizeValue = (value) => (value === '' || value === null || value === undefined) ? null : value;

    const result = await execute(`
      INSERT INTO tablets (
        tombamento, modelo, fabricante, sistema_operacional, versao_so,
        imei, numero_serie, regiao, estado, cidade, endereco, cliente, localizacao, 
        status, data_aquisicao, valor_aquisicao, fornecedor, numero_nota_fiscal,
        garantia_ate, apolice_seguro, email_conta, senha_email, senha_tablet,
        numero_telefone, operadora, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [tombamento, modelo, fabricante, sistema_operacional, versao_so,
        imei, numero_serie, regiao, estado, cidade, endereco, cliente, localizacao, 
        status, normalizeValue(data_aquisicao), normalizeValue(valor_aquisicao), fornecedor, numero_nota_fiscal,
        normalizeValue(garantia_ate), apolice_seguro, email_conta, senha_email, senha_tablet,
        numero_telefone, operadora, observacoes]);

    // Registrar no histórico
    await execute(`
      INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento)
      VALUES (?, 'CADASTRO', 'Tablet cadastrado no sistema', CURRENT_TIMESTAMP)
    `, [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Tablet cadastrado com sucesso',
      data: { id: result.lastID }
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        message: 'Já existe um tablet com este tombamento, IMEI ou número de série'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao cadastrar tablet',
      error: error.message
    });
  }
};

// Atualizar tablet
export const updateTablet = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar se o tablet existe
    const tablet = await queryOne('SELECT * FROM tablets WHERE id = ?', [id]);
    if (!tablet) {
      return res.status(404).json({
        success: false,
        message: 'Tablet não encontrado'
      });
    }

    // Converter strings vazias para null (PostgreSQL não aceita '' em campos DATE/NUMERIC)
    const normalizeValue = (value) => (value === '' || value === null || value === undefined) ? null : value;
    const dateFields = ['data_aquisicao', 'garantia_ate'];
    const numericFields = ['valor_aquisicao'];

    // Construir query de atualização
    const fields = Object.keys(updateData).filter(key => key !== 'id');
    const values = fields.map(field => {
      if (dateFields.includes(field) || numericFields.includes(field)) {
        return normalizeValue(updateData[field]);
      }
      return updateData[field];
    });
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id);

    await execute(`
      UPDATE tablets 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, values);

    // Registrar no histórico
    await execute(`
      INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento)
      VALUES (?, 'ATUALIZACAO', 'Dados do tablet atualizados', CURRENT_TIMESTAMP)
    `, [id]);

    res.json({
      success: true,
      message: 'Tablet atualizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar tablet',
      error: error.message
    });
  }
};

// Deletar tablet
export const deleteTablet = async (req, res) => {
  try {
    const { id } = req.params;

    const tablet = await queryOne('SELECT * FROM tablets WHERE id = ?', [id]);
    if (!tablet) {
      return res.status(404).json({
        success: false,
        message: 'Tablet não encontrado'
      });
    }

    await execute('DELETE FROM tablets WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Tablet deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar tablet',
      error: error.message
    });
  }
};

// Obter estatísticas
export const getStatistics = async (req, res) => {
  try {
    const [
      totalRow,
      ativosRow,
      manutencaoRow,
      inativosRow,
      substituidosRow,
      norteRow,
      nordesteRow,
      falhasRow,
      manutencoesRow
    ] = await Promise.all([
      queryOne('SELECT COUNT(*) as count FROM tablets'),
      queryOne('SELECT COUNT(*) as count FROM tablets WHERE status = \'ATIVO\''),
      queryOne('SELECT COUNT(*) as count FROM tablets WHERE status = \'MANUTENCAO\''),
      queryOne('SELECT COUNT(*) as count FROM tablets WHERE status = \'INATIVO\''),
      queryOne('SELECT COUNT(*) as count FROM tablets WHERE status = \'SUBSTITUIDO\''),
      queryOne('SELECT COUNT(*) as count FROM tablets WHERE regiao = \'NORTE\''),
      queryOne('SELECT COUNT(*) as count FROM tablets WHERE regiao = \'NORDESTE\''),
      queryOne('SELECT COUNT(*) as count FROM falhas WHERE status = \'ABERTA\''),
      queryOne('SELECT COUNT(*) as count FROM manutencoes WHERE status IN (\'AGENDADA\', \'EM_ANDAMENTO\')')
    ]);

    const stats = {
      total: totalRow.count,
      ativos: ativosRow.count,
      manutencao: manutencaoRow.count,
      inativos: inativosRow.count,
      substituidos: substituidosRow.count,
      norte: norteRow.count,
      nordeste: nordesteRow.count,
      falhas_abertas: falhasRow.count,
      manutencoes_pendentes: manutencoesRow.count
    };

    // Tablets por localização
    const porLocalizacao = await query(`
      SELECT localizacao, COUNT(*) as quantidade 
      FROM tablets 
      WHERE status != 'SUBSTITUIDO'
      GROUP BY localizacao 
      ORDER BY quantidade DESC
    `);

    // Últimas atividades
    const ultimasAtividades = await query(`
      SELECT h.*, t.tombamento, t.modelo
      FROM historico_uso h
      JOIN tablets t ON h.tablet_id = t.id
      ORDER BY h.data_evento DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        stats,
        porLocalizacao,
        ultimasAtividades
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar estatísticas',
      error: error.message
    });
  }
};
