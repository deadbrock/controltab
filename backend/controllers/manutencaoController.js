import { query, queryOne, execute } from '../database/connection.js';

// Listar todas as manutenções
export const getAllManutencoes = async (req, res) => {
  try {
    const { tablet_id, status: statusFilter } = req.query;
    
    let queryStr = `
      SELECT m.*, t.tombamento, t.modelo, t.localizacao
      FROM manutencoes m
      JOIN tablets t ON m.tablet_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (tablet_id) {
      queryStr += ' AND m.tablet_id = ?';
      params.push(tablet_id);
    }

    if (statusFilter) {
      queryStr += ' AND m.status = ?';
      params.push(statusFilter);
    }

    queryStr += ' ORDER BY m.data_inicio DESC';

    const manutencoes = await query(queryStr, params);

    res.json({
      success: true,
      data: manutencoes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar manutenções',
      error: error.message
    });
  }
};

// Criar nova manutenção
export const createManutencao = async (req, res) => {
  try {
    const {
      tablet_id,
      tipo,
      descricao,
      data_inicio,
      data_conclusao,
      tecnico_responsavel,
      custo,
      status = 'AGENDADA',
      observacoes
    } = req.body;

    // Verificar se o tablet existe
    const tablet = await queryOne('SELECT * FROM tablets WHERE id = ?', [tablet_id]);
    if (!tablet) {
      return res.status(404).json({
        success: false,
        message: 'Tablet não encontrado'
      });
    }

    const result = await execute(`
      INSERT INTO manutencoes (
        tablet_id, tipo, descricao, data_inicio, data_conclusao,
        tecnico_responsavel, custo, status, observacoes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [tablet_id, tipo, descricao, data_inicio, data_conclusao,
        tecnico_responsavel, custo, status, observacoes]);

    // Atualizar status do tablet se necessário
    if (status === 'EM_ANDAMENTO') {
      await execute('UPDATE tablets SET status = "MANUTENCAO" WHERE id = ?', [tablet_id]);
    }

    // Registrar no histórico
    await execute(`
      INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento)
      VALUES (?, 'MANUTENCAO', ?, datetime('now', 'localtime'))
    `, [tablet_id, `Manutenção ${tipo.toLowerCase()} registrada`]);

    res.status(201).json({
      success: true,
      message: 'Manutenção registrada com sucesso',
      data: { id: result.lastID }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar manutenção',
      error: error.message
    });
  }
};

// Atualizar manutenção
export const updateManutencao = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const manutencao = await queryOne('SELECT * FROM manutencoes WHERE id = ?', [id]);
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      });
    }

    const fields = Object.keys(updateData).filter(key => key !== 'id');
    const values = fields.map(field => updateData[field]);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhum campo para atualizar'
      });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id);

    await execute(`UPDATE manutencoes SET ${setClause} WHERE id = ?`, values);

    // Se a manutenção foi concluída, atualizar status do tablet
    if (updateData.status === 'CONCLUIDA') {
      await execute('UPDATE tablets SET status = "ATIVO" WHERE id = ?', [manutencao.tablet_id]);
      
      await execute(`
        INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento)
        VALUES (?, 'MANUTENCAO_CONCLUIDA', 'Manutenção concluída e tablet reativado', datetime('now', 'localtime'))
      `, [manutencao.tablet_id]);
    }

    res.json({
      success: true,
      message: 'Manutenção atualizada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar manutenção',
      error: error.message
    });
  }
};

// Deletar manutenção
export const deleteManutencao = async (req, res) => {
  try {
    const { id } = req.params;

    const manutencao = await queryOne('SELECT * FROM manutencoes WHERE id = ?', [id]);
    if (!manutencao) {
      return res.status(404).json({
        success: false,
        message: 'Manutenção não encontrada'
      });
    }

    await execute('DELETE FROM manutencoes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Manutenção deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar manutenção',
      error: error.message
    });
  }
};
