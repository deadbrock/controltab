import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeftRight, User, Calendar } from 'lucide-react';
import { trocasAPI } from '../services/api';
import TrocaModal from '../components/TrocaModal';

const Trocas = () => {
  const [trocas, setTrocas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    loadTrocas();
  }, []);

  const loadTrocas = async () => {
    try {
      setLoading(true);
      const response = await trocasAPI.getAll();
      setTrocas(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Erro ao carregar trocas:', error);
      setTrocas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este registro de troca?')) return;

    try {
      await trocasAPI.delete(id);
      loadTrocas();
    } catch (error) {
      console.error('Erro ao deletar troca:', error);
      alert('Erro ao deletar troca');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    loadTrocas();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trocas de Tablets</h1>
          <p className="text-gray-600 mt-2">Histórico de substituições de equipamentos</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Registrar Troca
        </button>
      </div>

      {/* Lista de Trocas */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : trocas.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhuma troca registrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {trocas.map((troca) => (
            <div key={troca.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <ArrowLeftRight className="text-primary-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">{troca.motivo}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-red-800 block mb-2">Tablet Substituído</span>
                      <p className="text-sm text-gray-900 font-medium">{troca.tablet_antigo_tombamento}</p>
                      <p className="text-sm text-gray-600">{troca.tablet_antigo_modelo}</p>
                    </div>
                    
                    {troca.tablet_novo_tombamento && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-green-800 block mb-2">Novo Tablet</span>
                        <p className="text-sm text-gray-900 font-medium">{troca.tablet_novo_tombamento}</p>
                        <p className="text-sm text-gray-600">{troca.tablet_novo_modelo}</p>
                      </div>
                    )}
                  </div>

                  {troca.descricao_detalhada && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{troca.descricao_detalhada}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{new Date(troca.data_troca).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{troca.responsavel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => handleDelete(troca.id)}
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
        <TrocaModal onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Trocas;
