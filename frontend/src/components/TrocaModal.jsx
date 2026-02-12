import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trocasAPI, tabletsAPI } from '../services/api';

const TrocaModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    tablet_antigo_id: '',
    tablet_novo_id: '',
    motivo: '',
    descricao_detalhada: '',
    data_troca: new Date().toISOString().split('T')[0],
    responsavel: ''
  });
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTablets();
  }, []);

  const loadTablets = async () => {
    try {
      const response = await tabletsAPI.getAll();
      setTablets(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar tablets:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        tablet_novo_id: formData.tablet_novo_id || null
      };

      await trocasAPI.create(data);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar troca:', error);
      alert(error.response?.data?.message || 'Erro ao salvar troca');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const tabletsAtivos = tablets.filter(t => t.status === 'ATIVO' || t.status === 'MANUTENCAO' || t.status === 'INATIVO');
  const tabletsDisponiveis = tablets.filter(t => t.status === 'ATIVO' && t.id !== parseInt(formData.tablet_antigo_id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Registrar Troca de Tablet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Tablet a ser Substituído *</label>
            <select
              name="tablet_antigo_id"
              value={formData.tablet_antigo_id}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Selecione o tablet</option>
              {tabletsAtivos.map(tablet => (
                <option key={tablet.id} value={tablet.id}>
                  {tablet.tombamento} - {tablet.modelo} ({tablet.localizacao}) - {tablet.status}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              O tablet selecionado terá seu status alterado para "SUBSTITUÍDO"
            </p>
          </div>

          <div>
            <label className="label">Novo Tablet (Opcional)</label>
            <select
              name="tablet_novo_id"
              value={formData.tablet_novo_id}
              onChange={handleChange}
              className="input"
            >
              <option value="">Nenhum (apenas desativar o tablet antigo)</option>
              {tabletsDisponiveis.map(tablet => (
                <option key={tablet.id} value={tablet.id}>
                  {tablet.tombamento} - {tablet.modelo} ({tablet.localizacao})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Selecione o tablet que substituirá o antigo (se aplicável)
            </p>
          </div>

          <div>
            <label className="label">Motivo da Troca *</label>
            <input
              type="text"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ex: Defeito irreparável, Perda, Roubo, Atualização"
            />
          </div>

          <div>
            <label className="label">Descrição Detalhada</label>
            <textarea
              name="descricao_detalhada"
              value={formData.descricao_detalhada}
              onChange={handleChange}
              rows="3"
              className="input"
              placeholder="Descreva os detalhes da troca, circunstâncias, etc."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Data da Troca *</label>
              <input
                type="date"
                name="data_troca"
                value={formData.data_troca}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="label">Responsável *</label>
              <input
                type="text"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
                required
                className="input"
                placeholder="Nome do responsável pela troca"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Atenção:</strong> Esta ação alterará o status do tablet antigo para "SUBSTITUÍDO" 
              e registrará a troca no histórico. Esta operação não pode ser desfeita facilmente.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Troca'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrocaModal;
