import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { manutencoesAPI, tabletsAPI } from '../services/api';

const ManutencaoModal = ({ manutencao, onClose }) => {
  const [formData, setFormData] = useState({
    tablet_id: '',
    tipo: 'PREVENTIVA',
    descricao: '',
    data_inicio: '',
    data_conclusao: '',
    tecnico_responsavel: '',
    custo: '',
    status: 'AGENDADA',
    observacoes: ''
  });
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTablets();
    if (manutencao) {
      setFormData({
        tablet_id: manutencao.tablet_id || '',
        tipo: manutencao.tipo || 'PREVENTIVA',
        descricao: manutencao.descricao || '',
        data_inicio: manutencao.data_inicio ? manutencao.data_inicio.split('T')[0] : '',
        data_conclusao: manutencao.data_conclusao ? manutencao.data_conclusao.split('T')[0] : '',
        tecnico_responsavel: manutencao.tecnico_responsavel || '',
        custo: manutencao.custo || '',
        status: manutencao.status || 'AGENDADA',
        observacoes: manutencao.observacoes || ''
      });
    }
  }, [manutencao]);

  const loadTablets = async () => {
    try {
      const response = await tabletsAPI.getAll();
      setTablets(response.data.data.filter(t => t.status !== 'SUBSTITUIDO'));
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
        custo: formData.custo ? parseFloat(formData.custo) : null
      };

      if (manutencao) {
        await manutencoesAPI.update(manutencao.id, data);
      } else {
        await manutencoesAPI.create(data);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar manutenção:', error);
      alert(error.response?.data?.message || 'Erro ao salvar manutenção');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {manutencao ? 'Editar Manutenção' : 'Nova Manutenção'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Tablet *</label>
            <select
              name="tablet_id"
              value={formData.tablet_id}
              onChange={handleChange}
              required
              className="input"
              disabled={!!manutencao}
            >
              <option value="">Selecione um tablet</option>
              {tablets.map(tablet => (
                <option key={tablet.id} value={tablet.id}>
                  {tablet.tombamento} - {tablet.modelo} ({tablet.localizacao})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tipo *</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="PREVENTIVA">Preventiva</option>
                <option value="CORRETIVA">Corretiva</option>
                <option value="TROCA_PECAS">Troca de Peças</option>
              </select>
            </div>

            <div>
              <label className="label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="AGENDADA">Agendada</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Descrição *</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows="3"
              className="input"
              placeholder="Descreva o problema ou a manutenção necessária"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Data de Início *</label>
              <input
                type="date"
                name="data_inicio"
                value={formData.data_inicio}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label className="label">Data de Conclusão</label>
              <input
                type="date"
                name="data_conclusao"
                value={formData.data_conclusao}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Técnico Responsável</label>
              <input
                type="text"
                name="tecnico_responsavel"
                value={formData.tecnico_responsavel}
                onChange={handleChange}
                className="input"
                placeholder="Nome do técnico"
              />
            </div>

            <div>
              <label className="label">Custo (R$)</label>
              <input
                type="number"
                step="0.01"
                name="custo"
                value={formData.custo}
                onChange={handleChange}
                className="input"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="label">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="2"
              className="input"
              placeholder="Informações adicionais"
            ></textarea>
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
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManutencaoModal;
