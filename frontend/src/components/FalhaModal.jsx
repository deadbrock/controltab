import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { falhasAPI, tabletsAPI } from '../services/api';

const FalhaModal = ({ falha, onClose }) => {
  const [formData, setFormData] = useState({
    tablet_id: '',
    tipo_falha: '',
    descricao: '',
    severidade: 'MEDIA',
    data_ocorrencia: new Date().toISOString().split('T')[0],
    status: 'ABERTA',
    solucao: ''
  });
  const [tablets, setTablets] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTablets();
    if (falha) {
      setFormData({
        tablet_id: falha.tablet_id || '',
        tipo_falha: falha.tipo_falha || '',
        descricao: falha.descricao || '',
        severidade: falha.severidade || 'MEDIA',
        data_ocorrencia: falha.data_ocorrencia ? falha.data_ocorrencia.split('T')[0] : '',
        status: falha.status || 'ABERTA',
        solucao: falha.solucao || ''
      });
    }
  }, [falha]);

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
      if (falha) {
        await falhasAPI.update(falha.id, formData);
      } else {
        await falhasAPI.create(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar falha:', error);
      alert(error.response?.data?.message || 'Erro ao salvar falha');
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
            {falha ? 'Editar Falha' : 'Nova Falha'}
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
              disabled={!!falha}
            >
              <option value="">Selecione um tablet</option>
              {tablets.map(tablet => (
                <option key={tablet.id} value={tablet.id}>
                  {tablet.tombamento} - {tablet.modelo} ({tablet.localizacao})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Tipo de Falha *</label>
            <input
              type="text"
              name="tipo_falha"
              value={formData.tipo_falha}
              onChange={handleChange}
              required
              className="input"
              placeholder="Ex: Tela quebrada, Bateria viciada, Erro de software"
            />
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
              placeholder="Descreva detalhadamente a falha ocorrida"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Severidade *</label>
              <select
                name="severidade"
                value={formData.severidade}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="CRITICA">Crítica</option>
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
                <option value="ABERTA">Aberta</option>
                <option value="EM_ANALISE">Em Análise</option>
                <option value="RESOLVIDA">Resolvida</option>
                <option value="NAO_RESOLVIDA">Não Resolvida</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Data de Ocorrência *</label>
            <input
              type="date"
              name="data_ocorrencia"
              value={formData.data_ocorrencia}
              onChange={handleChange}
              required
              className="input"
            />
          </div>

          <div>
            <label className="label">Solução</label>
            <textarea
              name="solucao"
              value={formData.solucao}
              onChange={handleChange}
              rows="2"
              className="input"
              placeholder="Descreva a solução aplicada (se houver)"
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

export default FalhaModal;
