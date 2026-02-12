import { query, queryOne, execute } from '../database/connection.js';

// Listar todas as trocas
export const getAllTrocas = async (req, res) => {
  try {
    const trocas = await query(`
      SELECT 
        tr.*,
        ta.tombamento as tablet_antigo_tombamento,
        ta.modelo as tablet_antigo_modelo,
        tn.tombamento as tablet_novo_tombamento,
        tn.modelo as tablet_novo_modelo
      FROM trocas tr
      JOIN tablets ta ON tr.tablet_antigo_id = ta.id
      LEFT JOIN tablets tn ON tr.tablet_novo_id = tn.id
      ORDER BY tr.data_troca DESC
    `);

    res.json({
      success: true,
      data: trocas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar trocas',
      error: error.message
    });
  }
};

// Criar nova troca
export const createTroca = async (req, res) => {
  try {
    const {
      tablet_antigo_id,
      tablet_novo_id,
      motivo,
      descricao_detalhada,
      data_troca,
      responsavel
    } = req.body;

    // Verificar se o tablet antigo existe
    const tabletAntigo = await queryOne('SELECT * FROM tablets WHERE id = ?', [tablet_antigo_id]);
    if (!tabletAntigo) {
      return res.status(404).json({
        success: false,
        message: 'Tablet antigo não encontrado'
      });
    }

    // Se fornecido, verificar se o tablet novo existe
    if (tablet_novo_id) {
      const tabletNovo = await queryOne('SELECT * FROM tablets WHERE id = ?', [tablet_novo_id]);
      if (!tabletNovo) {
        return res.status(404).json({
          success: false,
          message: 'Tablet novo não encontrado'
        });
      }
    }

    const result = await execute(`
      INSERT INTO trocas (
        tablet_antigo_id, tablet_novo_id, motivo, descricao_detalhada, data_troca, responsavel
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [tablet_antigo_id, tablet_novo_id, motivo, descricao_detalhada, data_troca, responsavel]);

    // Atualizar status do tablet antigo
    await execute('UPDATE tablets SET status = \'SUBSTITUIDO\' WHERE id = ?', [tablet_antigo_id]);

    // Registrar no histórico
    await execute(`
      INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento, usuario)
      VALUES (?, 'TROCA', ?, CURRENT_TIMESTAMP, ?)
    `, [tablet_antigo_id, `Tablet substituído - ${motivo}`, responsavel]);

    if (tablet_novo_id) {
      await execute(`
        INSERT INTO historico_uso (tablet_id, evento, descricao, data_evento, usuario)
        VALUES (?, 'ATIVACAO', 'Tablet ativado em substituição', CURRENT_TIMESTAMP, ?)
      `, [tablet_novo_id, responsavel]);
    }

    res.status(201).json({
      success: true,
      message: 'Troca registrada com sucesso',
      data: { id: result.lastID }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar troca',
      error: error.message
    });
  }
};

// Buscar troca por ID
export const getTrocaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const troca = await queryOne(`
      SELECT 
        tr.*,
        ta.tombamento as tablet_antigo_tombamento,
        ta.modelo as tablet_antigo_modelo,
        ta.imei as tablet_antigo_imei,
        tn.tombamento as tablet_novo_tombamento,
        tn.modelo as tablet_novo_modelo,
        tn.imei as tablet_novo_imei
      FROM trocas tr
      JOIN tablets ta ON tr.tablet_antigo_id = ta.id
      LEFT JOIN tablets tn ON tr.tablet_novo_id = tn.id
      WHERE tr.id = ?
    `, [id]);

    if (!troca) {
      return res.status(404).json({
        success: false,
        message: 'Troca não encontrada'
      });
    }

    res.json({
      success: true,
      data: troca
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar troca',
      error: error.message
    });
  }
};

// Deletar troca
export const deleteTroca = async (req, res) => {
  try {
    const { id } = req.params;

    const troca = await queryOne('SELECT * FROM trocas WHERE id = ?', [id]);
    if (!troca) {
      return res.status(404).json({
        success: false,
        message: 'Troca não encontrada'
      });
    }

    await execute('DELETE FROM trocas WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Troca deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar troca',
      error: error.message
    });
  }
};
