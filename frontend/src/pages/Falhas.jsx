import React, { useState, useEffect } from 'react';
import { Plus, AlertTriangle, X } from 'lucide-react';
import { falhasAPI } from '../services/api';
import FalhaModal from '../components/FalhaModal';

const Falhas = () => {
  const [falhas, setFalhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFalha, setSelectedFalha] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    severidade: ''
  });

  useEffect(() => {
    loadFalhas();
  }, [filters]);

  const loadFalhas = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.severidade) params.severidade = filters.severidade;
      
      const response = await falhasAPI.getAll(params);
      setFalhas(response.data.data || []);
    } catch (error) {
      console.error('Erro ao carregar falhas:', error);
      setFalhas([]); // Array vazio em caso de erro
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta falha?')) return;

    try {
      await falhasAPI.delete(id);
      loadFalhas();
    } catch (error) {
      console.error('Erro ao deletar falha:', error);
      alert('Erro ao deletar falha');
    }
  };

  const handleEdit = (falha) => {
    setSelectedFalha(falha);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedFalha(null);
    loadFalhas();
  };

  const getStatusBadge = (status) => {
    const badges = {
      ABERTA: 'badge-danger',
      EM_ANALISE: 'badge-warning',
      RESOLVIDA: 'badge-success',
      NAO_RESOLVIDA: 'badge-gray'
    };
    return badges[status] || 'badge-gray';
  };

  const getSeveridadeBadge = (severidade) => {
    const badges = {
      BAIXA: 'badge-info',
      MEDIA: 'bg-yellow-100 text-yellow-800',
      ALTA: 'bg-orange-100 text-orange-800',
      CRITICA: 'bg-red-600 text-white'
    };
    return badges[severidade] || 'badge-gray';
  };

  const clearFilters = () => {
    setFilters({ status: '', severidade: '' });
  };

  const hasActiveFilters = filters.status || filters.severidade;

  // Garantir que falhas seja sempre um array
  const falhasList = Array.isArray(falhas) ? falhas : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Falhas</h1>
          <p className="text-gray-600 mt-2">Registre e acompanhe falhas nos tablets</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Falha
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-medium text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <X size={16} />
              Limpar
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              <option value="ABERTA">Aberta</option>
              <option value="EM_ANALISE">Em Análise</option>
              <option value="RESOLVIDA">Resolvida</option>
              <option value="NAO_RESOLVIDA">Não Resolvida</option>
            </select>
          </div>
          <div>
            <label className="label">Severidade</label>
            <select
              value={filters.severidade}
              onChange={(e) => setFilters({ ...filters, severidade: e.target.value })}
              className="input"
            >
              <option value="">Todas</option>
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
              <option value="CRITICA">Crítica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Falhas */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : falhasList.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhuma falha encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {falhasList.map((falha) => (
            <div key={falha.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h3 className="text-lg font-bold text-gray-900">
                      {falha.tombamento} - {falha.modelo}
                    </h3>
                    <span className={`badge ${getSeveridadeBadge(falha.severidade)}`}>
                      {falha.severidade}
                    </span>
                    <span className={`badge ${getStatusBadge(falha.status)}`}>
                      {falha.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-1">
                      <AlertTriangle size={18} className="text-red-500" />
                      {falha.tipo_falha}
                    </h4>
                    <p className="text-gray-700 text-sm">{falha.descricao}</p>
                  </div>

                  {falha.solucao && (
                    <div className="p-3 bg-green-50 rounded-lg mb-3">
                      <span className="text-sm font-medium text-green-800">Solução:</span>
                      <p className="text-sm text-green-700 mt-1">{falha.solucao}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Ocorrência: {new Date(falha.data_ocorrencia).toLocaleString('pt-BR')}</span>
                    <span>Local: {falha.localizacao}</span>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => handleEdit(falha)}
                    className="btn-secondary text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(falha.id)}
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
        <FalhaModal
          falha={selectedFalha}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Falhas;
