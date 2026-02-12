import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import { exportAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Relatorios = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    regiao: '',
    status: '',
    cliente: '',
    tipo: '',
    severidade: '',
    data_inicio: '',
    data_fim: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (type, format) => {
    if (!isAdmin()) {
      alert('Apenas administradores podem exportar relatórios');
      return;
    }

    setLoading(true);
    try {
      let response;
      let filename;
      const params = {};

      // Adicionar filtros não vazios
      Object.keys(filters).forEach(key => {
        if (filters[key]) params[key] = filters[key];
      });

      switch (type) {
        case 'tablets':
          if (format === 'pdf') {
            response = await exportAPI.tabletsPDF(params);
            filename = `relatorio-tablets-${Date.now()}.pdf`;
          } else {
            response = await exportAPI.tabletsExcel(params);
            filename = `relatorio-tablets-${Date.now()}.xlsx`;
          }
          break;
        case 'falhas':
          if (format === 'pdf') {
            response = await exportAPI.falhasPDF(params);
            filename = `relatorio-falhas-${Date.now()}.pdf`;
          } else {
            response = await exportAPI.falhasExcel(params);
            filename = `relatorio-falhas-${Date.now()}.xlsx`;
          }
          break;
        case 'manutencoes':
          if (format === 'pdf') {
            response = await exportAPI.manutencoesPDF(params);
            filename = `relatorio-manutencoes-${Date.now()}.pdf`;
          } else {
            response = await exportAPI.manutencoesExcel(params);
            filename = `relatorio-manutencoes-${Date.now()}.xlsx`;
          }
          break;
      }

      downloadFile(response.data, filename);
      alert('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert('Erro ao exportar relatório: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      regiao: '',
      status: '',
      cliente: '',
      tipo: '',
      severidade: '',
      data_inicio: '',
      data_fim: ''
    });
  };

  if (!isAdmin()) {
    return (
      <div className="card text-center py-12">
        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
        <p className="text-gray-600">Apenas administradores podem acessar os relatórios</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-2">Exporte relatórios em PDF ou Excel</p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Filtros</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Limpar filtros
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="label">Região</label>
            <select
              name="regiao"
              value={filters.regiao}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Todas</option>
              <option value="NORTE">Norte</option>
              <option value="NORDESTE">Nordeste</option>
            </select>
          </div>
          <div>
            <label className="label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Todos</option>
              <option value="ATIVO">Ativo</option>
              <option value="MANUTENCAO">Manutenção</option>
              <option value="INATIVO">Inativo</option>
              <option value="SUBSTITUIDO">Substituído</option>
            </select>
          </div>
          <div>
            <label className="label">Cliente</label>
            <input
              type="text"
              name="cliente"
              value={filters.cliente}
              onChange={handleFilterChange}
              className="input"
              placeholder="Nome do cliente"
            />
          </div>
          <div>
            <label className="label">Tipo (Manutenções)</label>
            <select
              name="tipo"
              value={filters.tipo}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Todos</option>
              <option value="PREVENTIVA">Preventiva</option>
              <option value="CORRETIVA">Corretiva</option>
              <option value="ATUALIZACAO">Atualização</option>
            </select>
          </div>
          <div>
            <label className="label">Severidade (Falhas)</label>
            <select
              name="severidade"
              value={filters.severidade}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Todas</option>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICA">Crítica</option>
            </select>
          </div>
          <div>
            <label className="label">Data Início</label>
            <input
              type="date"
              name="data_inicio"
              value={filters.data_inicio}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
          <div>
            <label className="label">Data Fim</label>
            <input
              type="date"
              name="data_fim"
              value={filters.data_fim}
              onChange={handleFilterChange}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Relatórios Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Relatório de Tablets */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FileText className="text-primary-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tablets</h3>
              <p className="text-sm text-gray-600">Relatório geral de tablets</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleExport('tablets', 'pdf')}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              {loading ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <button
              onClick={() => handleExport('tablets', 'excel')}
              disabled={loading}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <FileSpreadsheet size={18} />
              {loading ? 'Exportando...' : 'Exportar Excel'}
            </button>
          </div>
        </div>

        {/* Relatório de Falhas */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <FileText className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Falhas</h3>
              <p className="text-sm text-gray-600">Relatório de falhas registradas</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleExport('falhas', 'pdf')}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              {loading ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <button
              onClick={() => handleExport('falhas', 'excel')}
              disabled={loading}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <FileSpreadsheet size={18} />
              {loading ? 'Exportando...' : 'Exportar Excel'}
            </button>
          </div>
        </div>

        {/* Relatório de Manutenções */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <FileText className="text-yellow-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Manutenções</h3>
              <p className="text-sm text-gray-600">Relatório de manutenções</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleExport('manutencoes', 'pdf')}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              {loading ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <button
              onClick={() => handleExport('manutencoes', 'excel')}
              disabled={loading}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <FileSpreadsheet size={18} />
              {loading ? 'Exportando...' : 'Exportar Excel'}
            </button>
          </div>
        </div>
      </div>

      {/* Informação */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Download className="text-blue-600 flex-shrink-0" size={24} />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Dicas para Exportação</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use os filtros acima para personalizar os relatórios</li>
              <li>• PDF é ideal para visualização e impressão</li>
              <li>• Excel permite análise e manipulação dos dados</li>
              <li>• Os relatórios incluem todas as informações detalhadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
