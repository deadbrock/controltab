import React, { useState } from 'react';
import { FileText, Download, FileSpreadsheet, Filter } from 'lucide-react';

const Relatorios = () => {
  const [filtros, setFiltros] = useState({
    regiao: '',
    status: '',
    cliente: '',
    data_inicio: '',
    data_fim: ''
  });

  const handleExport = (tipo, formato) => {
    let url = `/api/export/${tipo}/${formato}?`;
    
    if (filtros.regiao) url += `regiao=${filtros.regiao}&`;
    if (filtros.status) url += `status=${filtros.status}&`;
    if (filtros.cliente) url += `cliente=${filtros.cliente}&`;
    if (filtros.data_inicio) url += `data_inicio=${filtros.data_inicio}&`;
    if (filtros.data_fim) url += `data_fim=${filtros.data_fim}&`;

    window.open(url, '_blank');
  };

  const relatorios = [
    {
      titulo: 'Relatório Geral de Tablets',
      descricao: 'Lista completa de todos os tablets cadastrados com informações detalhadas',
      icone: FileText,
      cor: 'bg-blue-500',
      tipos: [
        { nome: 'PDF', formato: 'pdf', tipo: 'tablets' },
        { nome: 'Excel', formato: 'excel', tipo: 'tablets' }
      ]
    },
    {
      titulo: 'Relatório de Falhas',
      descricao: 'Histórico completo de falhas registradas com severidade e status',
      icone: FileText,
      cor: 'bg-red-500',
      tipos: [
        { nome: 'Excel', formato: 'excel', tipo: 'falhas' }
      ]
    },
    {
      titulo: 'Relatório de Manutenções',
      descricao: 'Todas as manutenções realizadas com custos e técnicos responsáveis',
      icone: FileText,
      cor: 'bg-yellow-500',
      tipos: [
        { nome: 'Excel', formato: 'excel', tipo: 'manutencoes' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-2">Exporte dados em PDF ou Excel</p>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <h3 className="font-medium text-gray-900">Filtros de Exportação</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="label">Região</label>
            <select
              value={filtros.regiao}
              onChange={(e) => setFiltros({ ...filtros, regiao: e.target.value })}
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
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              <option value="ATIVO">Ativo</option>
              <option value="MANUTENCAO">Manutenção</option>
              <option value="INATIVO">Inativo</option>
            </select>
          </div>

          <div>
            <label className="label">Cliente</label>
            <input
              type="text"
              value={filtros.cliente}
              onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
              className="input"
              placeholder="Nome do cliente"
            />
          </div>

          <div>
            <label className="label">Data Início</label>
            <input
              type="date"
              value={filtros.data_inicio}
              onChange={(e) => setFiltros({ ...filtros, data_inicio: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Data Fim</label>
            <input
              type="date"
              value={filtros.data_fim}
              onChange={(e) => setFiltros({ ...filtros, data_fim: e.target.value })}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Lista de Relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatorios.map((relatorio, index) => {
          const Icon = relatorio.icone;
          return (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className={`${relatorio.cor} p-3 rounded-lg inline-block mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {relatorio.titulo}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                {relatorio.descricao}
              </p>

              <div className="flex gap-2">
                {relatorio.tipos.map((tipo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExport(tipo.tipo, tipo.formato)}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm"
                  >
                    {tipo.formato === 'pdf' ? (
                      <FileText size={16} />
                    ) : (
                      <FileSpreadsheet size={16} />
                    )}
                    {tipo.nome}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Informações Adicionais */}
      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Download className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Dicas de Exportação</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use os filtros acima para personalizar seus relatórios</li>
              <li>• PDFs são ideais para visualização e impressão</li>
              <li>• Excel permite análise e manipulação dos dados</li>
              <li>• Os relatórios incluem todos os tablets não substituídos por padrão</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
