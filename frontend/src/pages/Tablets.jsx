import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Filter, Eye, Edit, Trash2, X } from 'lucide-react';
import { tabletsAPI } from '../services/api';
import TabletModal from '../components/TabletModal';

const Tablets = () => {
  const [searchParams] = useSearchParams();
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTablet, setSelectedTablet] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    regiao: '',
    cliente: '',
    search: ''
  });

  useEffect(() => {
    loadTablets();
  }, [filters]);

  const loadTablets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.regiao) params.regiao = filters.regiao;
      if (filters.search) params.search = filters.search;

      const response = await tabletsAPI.getAll(params);
      setTablets(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erro ao carregar tablets:', error);
      setTablets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este tablet?')) return;

    try {
      await tabletsAPI.delete(id);
      loadTablets();
    } catch (error) {
      console.error('Erro ao deletar tablet:', error);
      alert('Erro ao deletar tablet');
    }
  };

  const handleEdit = (tablet) => {
    setSelectedTablet(tablet);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTablet(null);
    loadTablets();
  };

  const getStatusBadge = (status) => {
    const badges = {
      ATIVO: 'badge-success',
      MANUTENCAO: 'badge-warning',
      INATIVO: 'badge-danger',
      SUBSTITUIDO: 'badge-gray'
    };
    return badges[status] || 'badge-gray';
  };

  const clearFilters = () => {
    setFilters({ status: '', regiao: '', cliente: '', search: '' });
  };

  const hasActiveFilters = filters.status || filters.regiao || filters.cliente || filters.search;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tablets</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os tablets cadastrados</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Tablet
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="label">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tombamento, modelo, cliente..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input pl-10"
              />
            </div>
          </div>
          <div>
            <label className="label">Cliente</label>
            <input
              type="text"
              placeholder="Nome do cliente"
              value={filters.cliente}
              onChange={(e) => setFilters({ ...filters, cliente: e.target.value })}
              className="input"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
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
            <label className="label">Região</label>
            <select
              value={filters.regiao}
              onChange={(e) => setFilters({ ...filters, regiao: e.target.value })}
              className="input"
            >
              <option value="">Todas</option>
              <option value="NORTE">Norte</option>
              <option value="NORDESTE">Nordeste</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Tablets */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : tablets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhum tablet encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tablets.map((tablet) => (
            <div key={tablet.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{tablet.tombamento}</h3>
                    <span className={`badge ${getStatusBadge(tablet.status)}`}>
                      {tablet.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                    <p><span className="font-medium">Modelo:</span> {tablet.modelo}</p>
                    <p><span className="font-medium">Fabricante:</span> {tablet.fabricante}</p>
                    <p><span className="font-medium">SO:</span> {tablet.sistema_operacional} {tablet.versao_so}</p>
                    <p><span className="font-medium">IMEI:</span> {tablet.imei}</p>
                    <p><span className="font-medium">Cliente:</span> {tablet.cliente}</p>
                    <p><span className="font-medium">Local:</span> {tablet.cidade} - {tablet.estado}</p>
                    <p><span className="font-medium">Localização:</span> {tablet.localizacao}</p>
                    <p><span className="font-medium">Região:</span> {tablet.regiao}</p>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <Link
                    to={`/tablets/${tablet.id}`}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Eye size={18} />
                    Ver
                  </Link>
                  <button
                    onClick={() => handleEdit(tablet)}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(tablet.id)}
                    className="btn-danger flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
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
        <TabletModal
          tablet={selectedTablet}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Tablets;
