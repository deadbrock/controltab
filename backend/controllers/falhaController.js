import { query, queryOne, execute } from '../database/connection.js';

// Listar todas as falhas
export const getAllFalhas = async (req, res) => {
  try {
    const { tablet_id, status, severidade } = req.query;
    
    let query = `
      SELECT f.*, t.tombamento, t.modelo, t.localizacao
      FROM falhas f
      JOIN tablets t ON f.tablet_id = t.id
      WHERE 1=1
    `;
    const params = [];

    if (tablet_id) {
      query += ' AND f.tablet_id = ?';
      params.push(tablet_id);
    }

    if (status) {
      query += ' AND f.status = ?';
      params.push(status);
    }

    if (severidade) {
      query += ' AND f.severidade = ?';
      params.push(severidade);
    }

    query += ' ORDER BY f.data_ocorrencia DESC';

    const falhas = await query(query, params);

    res.json({
      success: true,
      data: falhas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar falhas',
      error: error.message
    });
  }
};

// Criar nova falha
export const createFalha = async (req, res) => {
  try {
    const {
      tablet_id,
      tipo_falha,
      descricao,
      severidade,
      data_ocorrencia,
      status = 'ABERTA',
      solucao
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
      INSERT INTO falhas (
        tablet_id, tipo_falha, descricao, severidade, data_ocorrencia, status, solucao
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [tablet_id, tipo_falha, descricao, severidade, data_ocorrencia, status, solucao]);

    // Registrar no histórico
    await execute(`
      INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento)
      VALUES (?, 'FALHA', ?, datetime('now', 'localtime'))
    `, [tablet_id, `Falha registrada: ${tipo_falha}`]);

    res.status(201).json({
      success: true,
      message: 'Falha registrada com sucesso',
      data: { id: result.lastID }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar falha',
      error: error.message
    });
  }
};

// Atualizar falha
export const updateFalha = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const falha = await queryOne('SELECT * FROM falhas WHERE id = ?', [id]);
    if (!falha) {
      return res.status(404).json({
        success: false,
        message: 'Falha não encontrada'
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

    await execute(`UPDATE falhas SET ${setClause} WHERE id = ?`, values);

    // Registrar no histórico se a falha foi resolvida
    if (updateData.status === 'RESOLVIDA') {
      await execute(`
        INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento)
        VALUES (?, 'FALHA_RESOLVIDA', 'Falha resolvida', datetime('now', 'localtime'))
      `, [falha.tablet_id]);
    }

    res.json({
      success: true,
      message: 'Falha atualizada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar falha',
      error: error.message
    });
  }
};

// Deletar falha
export const deleteFalha = async (req, res) => {
  try {
    const { id } = req.params;

    const falha = await queryOne('SELECT * FROM falhas WHERE id = ?', [id]);
    if (!falha) {
      return res.status(404).json({
        success: false,
        message: 'Falha não encontrada'
      });
    }

    await execute('DELETE FROM falhas WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Falha deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar falha',
      error: error.message
    });
  }
};
