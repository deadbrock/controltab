import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';
import { query, queryOne, execute } from '../database/connection.js';

// Exportar Tablets para PDF
export const exportTabletsPDF = async (req, res) => {
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

    queryStr += ' ORDER BY cliente, cidade';

    const tablets = await query(queryStr, params);

    // Criar PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-tablets-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Tablets', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.text(`Total de Tablets: ${tablets.length}`, { align: 'center' });
    doc.moveDown(2);

    // Tabela
    tablets.forEach((tablet, index) => {
      if (index > 0) doc.moveDown(1.5);
      
      // Verificar se precisa de nova página
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(12).font('Helvetica-Bold').text(`${tablet.tombamento} - ${tablet.modelo}`);
      doc.fontSize(9).font('Helvetica');
      doc.text(`Cliente: ${tablet.cliente}`);
      doc.text(`Local: ${tablet.cidade} - ${tablet.estado} (${tablet.regiao})`);
      doc.text(`Status: ${tablet.status}`);
      doc.text(`IMEI: ${tablet.imei}`);
      if (tablet.email_conta) doc.text(`Email: ${tablet.email_conta}`);
      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar PDF',
      error: error.message
    });
  }
};

// Exportar Tablets para Excel
export const exportTabletsExcel = async (req, res) => {
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

    queryStr += ' ORDER BY cliente, cidade';

    const tablets = await query(queryStr, params);

    // Criar Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Tablets');

    // Definir colunas
    worksheet.columns = [
      { header: 'Tombamento', key: 'tombamento', width: 15 },
      { header: 'Modelo', key: 'modelo', width: 20 },
      { header: 'Fabricante', key: 'fabricante', width: 15 },
      { header: 'Cliente', key: 'cliente', width: 25 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Região', key: 'regiao', width: 12 },
      { header: 'Estado', key: 'estado', width: 8 },
      { header: 'Cidade', key: 'cidade', width: 20 },
      { header: 'Localização', key: 'localizacao', width: 25 },
      { header: 'SO', key: 'sistema_operacional', width: 12 },
      { header: 'IMEI', key: 'imei', width: 18 },
      { header: 'Número Série', key: 'numero_serie', width: 18 },
      { header: 'Email', key: 'email_conta', width: 30 },
      { header: 'Telefone', key: 'numero_telefone', width: 15 },
      { header: 'Valor', key: 'valor_aquisicao', width: 12 },
      { header: 'Garantia Até', key: 'garantia_ate', width: 15 },
      { header: 'Data Aquisição', key: 'data_aquisicao', width: 15 }
    ];

    // Estilizar cabeçalho
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0EA5E9' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Adicionar dados
    tablets.forEach(tablet => {
      worksheet.addRow({
        tombamento: tablet.tombamento,
        modelo: tablet.modelo,
        fabricante: tablet.fabricante,
        cliente: tablet.cliente,
        status: tablet.status,
        regiao: tablet.regiao,
        estado: tablet.estado,
        cidade: tablet.cidade,
        localizacao: tablet.localizacao,
        sistema_operacional: tablet.sistema_operacional,
        imei: tablet.imei,
        numero_serie: tablet.numero_serie,
        email_conta: tablet.email_conta || '',
        numero_telefone: tablet.numero_telefone || '',
        valor_aquisicao: tablet.valor_aquisicao || 0,
        garantia_ate: tablet.garantia_ate || '',
        data_aquisicao: tablet.data_aquisicao
      });
    });

    // Formatação de valores
    worksheet.getColumn('valor_aquisicao').numFmt = 'R$ #,##0.00';

    // Configurar resposta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-tablets-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao exportar Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar Excel',
      error: error.message
    });
  }
};

// Exportar Falhas para PDF
export const exportFalhasPDF = async (req, res) => {
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

    // Criar PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-falhas-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Falhas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.text(`Total de Falhas: ${falhas.length}`, { align: 'center' });
    doc.moveDown(2);

    // Tabela
    falhas.forEach((falha, index) => {
      if (index > 0) doc.moveDown(1.5);
      
      // Verificar se precisa de nova página
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(12).font('Helvetica-Bold').text(`${falha.tombamento} - ${falha.tipo_falha}`);
      doc.fontSize(9).font('Helvetica');
      doc.text(`Cliente: ${falha.cliente}`);
      doc.text(`Modelo: ${falha.modelo}`);
      doc.text(`Data: ${new Date(falha.data_ocorrencia).toLocaleDateString('pt-BR')}`);
      doc.text(`Severidade: ${falha.severidade} | Status: ${falha.status}`);
      doc.text(`Descrição: ${falha.descricao}`);
      if (falha.solucao) doc.text(`Solução: ${falha.solucao}`);
      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar PDF de falhas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar PDF de falhas',
      error: error.message
    });
  }
};

// Exportar Falhas para Excel
export const exportFalhasExcel = async (req, res) => {
  try {
    const falhas = await query(`
      SELECT f.*, t.tombamento, t.modelo, t.cliente, t.localizacao
      FROM falhas f
      JOIN tablets t ON f.tablet_id = t.id
      ORDER BY f.data_ocorrencia DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Falhas');

    worksheet.columns = [
      { header: 'Data Ocorrência', key: 'data_ocorrencia', width: 18 },
      { header: 'Tombamento', key: 'tombamento', width: 15 },
      { header: 'Modelo', key: 'modelo', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 25 },
      { header: 'Tipo Falha', key: 'tipo_falha', width: 25 },
      { header: 'Descrição', key: 'descricao', width: 40 },
      { header: 'Severidade', key: 'severidade', width: 12 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Solução', key: 'solucao', width: 40 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFEF4444' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    falhas.forEach(falha => {
      worksheet.addRow({
        data_ocorrencia: new Date(falha.data_ocorrencia).toLocaleDateString('pt-BR'),
        tombamento: falha.tombamento,
        modelo: falha.modelo,
        cliente: falha.cliente,
        tipo_falha: falha.tipo_falha,
        descricao: falha.descricao,
        severidade: falha.severidade,
        status: falha.status,
        solucao: falha.solucao || 'Pendente'
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-falhas-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao exportar falhas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar falhas',
      error: error.message
    });
  }
};

// Exportar Manutenções para PDF
export const exportManutencoesPDF = async (req, res) => {
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

    // Criar PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-manutencoes-${Date.now()}.pdf`);
    
    doc.pipe(res);

    // Cabeçalho
    doc.fontSize(20).text('Relatório de Manutenções', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'center' });
    doc.text(`Total de Manutenções: ${manutencoes.length}`, { align: 'center' });
    doc.moveDown(2);

    // Tabela
    manutencoes.forEach((manutencao, index) => {
      if (index > 0) doc.moveDown(1.5);
      
      // Verificar se precisa de nova página
      if (doc.y > 700) {
        doc.addPage();
      }

      doc.fontSize(12).font('Helvetica-Bold').text(`${manutencao.tombamento} - ${manutencao.tipo}`);
      doc.fontSize(9).font('Helvetica');
      doc.text(`Cliente: ${manutencao.cliente}`);
      doc.text(`Modelo: ${manutencao.modelo}`);
      doc.text(`Início: ${new Date(manutencao.data_inicio).toLocaleDateString('pt-BR')}`);
      if (manutencao.data_conclusao) {
        doc.text(`Conclusão: ${new Date(manutencao.data_conclusao).toLocaleDateString('pt-BR')}`);
      }
      doc.text(`Status: ${manutencao.status}`);
      if (manutencao.tecnico_responsavel) doc.text(`Técnico: ${manutencao.tecnico_responsavel}`);
      if (manutencao.custo) doc.text(`Custo: R$ ${parseFloat(manutencao.custo).toFixed(2)}`);
      doc.text(`Descrição: ${manutencao.descricao}`);
      doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    });

    doc.end();
  } catch (error) {
    console.error('Erro ao exportar PDF de manutenções:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar PDF de manutenções',
      error: error.message
    });
  }
};

// Exportar Manutenções para Excel
export const exportManutencoesExcel = async (req, res) => {
  try {
    const manutencoes = await query(`
      SELECT m.*, t.tombamento, t.modelo, t.cliente
      FROM manutencoes m
      JOIN tablets t ON m.tablet_id = t.id
      ORDER BY m.data_inicio DESC
    `);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Manutenções');

    worksheet.columns = [
      { header: 'Data Início', key: 'data_inicio', width: 15 },
      { header: 'Data Conclusão', key: 'data_conclusao', width: 15 },
      { header: 'Tombamento', key: 'tombamento', width: 15 },
      { header: 'Modelo', key: 'modelo', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 25 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Descrição', key: 'descricao', width: 40 },
      { header: 'Técnico', key: 'tecnico_responsavel', width: 25 },
      { header: 'Custo', key: 'custo', width: 12 },
      { header: 'Status', key: 'status', width: 15 }
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF59E0B' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    manutencoes.forEach(manutencao => {
      worksheet.addRow({
        data_inicio: new Date(manutencao.data_inicio).toLocaleDateString('pt-BR'),
        data_conclusao: manutencao.data_conclusao ? new Date(manutencao.data_conclusao).toLocaleDateString('pt-BR') : '',
        tombamento: manutencao.tombamento,
        modelo: manutencao.modelo,
        cliente: manutencao.cliente,
        tipo: manutencao.tipo,
        descricao: manutencao.descricao,
        tecnico_responsavel: manutencao.tecnico_responsavel || '',
        custo: manutencao.custo || 0,
        status: manutencao.status
      });
    });

    worksheet.getColumn('custo').numFmt = 'R$ #,##0.00';

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=relatorio-manutencoes-${Date.now()}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Erro ao exportar manutenções:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar manutenções',
      error: error.message
    });
  }
};
