import React, { useState, useEffect } from 'react';
import { Plus, Calendar, User, DollarSign, X } from 'lucide-react';
import { manutencoesAPI, tabletsAPI } from '../services/api';
import ManutencaoModal from '../components/ManutencaoModal';

const Manutencoes = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedManutencao, setSelectedManutencao] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadManutencoes();
  }, [filterStatus]);

  const loadManutencoes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterStatus) params.status = filterStatus;
      
      const response = await manutencoesAPI.getAll(params);
      setManutencoes(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erro ao carregar manutenções:', error);
      setManutencoes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta manutenção?')) return;

    try {
      await manutencoesAPI.delete(id);
      loadManutencoes();
    } catch (error) {
      console.error('Erro ao deletar manutenção:', error);
      alert('Erro ao deletar manutenção');
    }
  };

  const handleEdit = (manutencao) => {
    setSelectedManutencao(manutencao);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedManutencao(null);
    loadManutencoes();
  };

  const getStatusBadge = (status) => {
    const badges = {
      AGENDADA: 'badge-info',
      EM_ANDAMENTO: 'badge-warning',
      CONCLUIDA: 'badge-success',
      CANCELADA: 'badge-gray'
    };
    return badges[status] || 'badge-gray';
  };

  const getTipoBadge = (tipo) => {
    const badges = {
      PREVENTIVA: 'bg-blue-100 text-blue-800',
      CORRETIVA: 'bg-yellow-100 text-yellow-800',
      TROCA_PECAS: 'bg-purple-100 text-purple-800'
    };
    return badges[tipo] || 'badge-gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manutenções</h1>
          <p className="text-gray-600 mt-2">Gerencie as manutenções dos tablets</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Manutenção
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input max-w-xs"
          >
            <option value="">Todos</option>
            <option value="AGENDADA">Agendada</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          {filterStatus && (
            <button
              onClick={() => setFilterStatus('')}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <X size={16} />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Manutenções */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : manutencoes.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhuma manutenção encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {manutencoes.map((manutencao) => (
            <div key={manutencao.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {manutencao.tombamento} - {manutencao.modelo}
                    </h3>
                    <span className={`badge ${getTipoBadge(manutencao.tipo)}`}>
                      {manutencao.tipo.replace('_', ' ')}
                    </span>
                    <span className={`badge ${getStatusBadge(manutencao.status)}`}>
                      {manutencao.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{manutencao.descricao}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <div>
                        <span className="text-gray-500">Início:</span>
                        <p className="text-gray-900">{new Date(manutencao.data_inicio).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    
                    {manutencao.data_conclusao && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <div>
                          <span className="text-gray-500">Conclusão:</span>
                          <p className="text-gray-900">{new Date(manutencao.data_conclusao).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    )}
                    
                    {manutencao.tecnico_responsavel && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={16} />
                        <div>
                          <span className="text-gray-500">Técnico:</span>
                          <p className="text-gray-900">{manutencao.tecnico_responsavel}</p>
                        </div>
                      </div>
                    )}
                    
                    {manutencao.custo && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign size={16} />
                        <div>
                          <span className="text-gray-500">Custo:</span>
                          <p className="text-gray-900">R$ {manutencao.custo.toFixed(2)}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Local: {manutencao.localizacao}
                  </p>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => handleEdit(manutencao)}
                    className="btn-secondary text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(manutencao.id)}
                    className="btn-danger text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ManutencaoModal
          manutencao={selectedManutencao}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Manutencoes;
