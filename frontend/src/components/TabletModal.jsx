import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { tabletsAPI } from '../services/api';

const TabletModal = ({ tablet, onClose }) => {
  const [formData, setFormData] = useState({
    tombamento: '',
    modelo: '',
    fabricante: '',
    sistema_operacional: '',
    versao_so: '',
    imei: '',
    numero_serie: '',
    regiao: 'NORTE',
    estado: '',
    cidade: '',
    endereco: '',
    cliente: '',
    localizacao: '',
    status: 'ATIVO',
    data_aquisicao: '',
    valor_aquisicao: '',
    fornecedor: '',
    numero_nota_fiscal: '',
    garantia_ate: '',
    apolice_seguro: '',
    email_conta: '',
    senha_email: '',
    senha_tablet: '',
    numero_telefone: '',
    operadora: '',
    observacoes: ''
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tablet) {
      setFormData({
        tombamento: tablet.tombamento || '',
        modelo: tablet.modelo || '',
        fabricante: tablet.fabricante || '',
        sistema_operacional: tablet.sistema_operacional || '',
        versao_so: tablet.versao_so || '',
        imei: tablet.imei || '',
        numero_serie: tablet.numero_serie || '',
        regiao: tablet.regiao || 'NORTE',
        estado: tablet.estado || '',
        cidade: tablet.cidade || '',
        endereco: tablet.endereco || '',
        cliente: tablet.cliente || '',
        localizacao: tablet.localizacao || '',
        status: tablet.status || 'ATIVO',
        data_aquisicao: tablet.data_aquisicao ? tablet.data_aquisicao.split('T')[0] : '',
        valor_aquisicao: tablet.valor_aquisicao || '',
        fornecedor: tablet.fornecedor || '',
        numero_nota_fiscal: tablet.numero_nota_fiscal || '',
        garantia_ate: tablet.garantia_ate ? tablet.garantia_ate.split('T')[0] : '',
        apolice_seguro: tablet.apolice_seguro || '',
        email_conta: tablet.email_conta || '',
        senha_email: tablet.senha_email || '',
        senha_tablet: tablet.senha_tablet || '',
        numero_telefone: tablet.numero_telefone || '',
        operadora: tablet.operadora || '',
        observacoes: tablet.observacoes || ''
      });
    }
  }, [tablet]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tablet) {
        await tabletsAPI.update(tablet.id, formData);
      } else {
        await tabletsAPI.create(formData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar tablet:', error);
      alert(error.response?.data?.message || 'Erro ao salvar tablet');
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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {tablet ? 'Editar Tablet' : 'Novo Tablet'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Tombamento *</label>
              <input
                type="text"
                name="tombamento"
                value={formData.tombamento}
                onChange={handleChange}
                required
                className="input"
                placeholder="TB-001"
              />
            </div>

            <div>
              <label className="label">Modelo *</label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                required
                className="input"
                placeholder="iPad Pro 11"
              />
            </div>

            <div>
              <label className="label">Fabricante *</label>
              <input
                type="text"
                name="fabricante"
                value={formData.fabricante}
                onChange={handleChange}
                required
                className="input"
                placeholder="Apple"
              />
            </div>

            <div>
              <label className="label">Sistema Operacional *</label>
              <input
                type="text"
                name="sistema_operacional"
                value={formData.sistema_operacional}
                onChange={handleChange}
                required
                className="input"
                placeholder="iOS, Android, Windows"
              />
            </div>

            <div>
              <label className="label">Versão do SO</label>
              <input
                type="text"
                name="versao_so"
                value={formData.versao_so}
                onChange={handleChange}
                className="input"
                placeholder="16.5"
              />
            </div>

            <div>
              <label className="label">IMEI *</label>
              <input
                type="text"
                name="imei"
                value={formData.imei}
                onChange={handleChange}
                required
                className="input"
                placeholder="123456789012345"
              />
            </div>

            <div>
              <label className="label">Número de Série *</label>
              <input
                type="text"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                required
                className="input"
                placeholder="ABC123XYZ"
              />
            </div>

            <div>
              <label className="label">Região *</label>
              <select
                name="regiao"
                value={formData.regiao}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="NORTE">Norte</option>
                <option value="NORDESTE">Nordeste</option>
              </select>
            </div>

            <div>
              <label className="label">Estado (UF) *</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                className="input"
              >
                <option value="">Selecione o estado</option>
                <optgroup label="Região Norte">
                  <option value="AC">Acre</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="PA">Pará</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="TO">Tocantins</option>
                </optgroup>
                <optgroup label="Região Nordeste">
                  <option value="AL">Alagoas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="MA">Maranhão</option>
                  <option value="PB">Paraíba</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="SE">Sergipe</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="label">Cidade *</label>
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
                className="input"
                placeholder="Manaus"
              />
            </div>

            <div>
              <label className="label">Endereço</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="input"
                placeholder="Rua, número, bairro"
              />
            </div>

            <div>
              <label className="label">Cliente *</label>
              <input
                type="text"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                required
                className="input"
                placeholder="Nome do cliente/empresa"
              />
            </div>

            <div>
              <label className="label">Localização (Referência) *</label>
              <input
                type="text"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                required
                className="input"
                placeholder="Ex: Recepção, Setor Produção, Unidade Centro"
              />
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
                <option value="ATIVO">Ativo</option>
                <option value="MANUTENCAO">Manutenção</option>
                <option value="INATIVO">Inativo</option>
                <option value="SUBSTITUIDO">Substituído</option>
              </select>
            </div>

          <div>
            <label className="label">Data de Aquisição *</label>
            <input
              type="date"
              name="data_aquisicao"
              value={formData.data_aquisicao}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          </div>

          {/* Informações Financeiras e Garantia */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informações Financeiras e Garantia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Valor de Aquisição (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  name="valor_aquisicao"
                  value={formData.valor_aquisicao}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="label">Fornecedor</label>
                <input
                  type="text"
                  name="fornecedor"
                  value={formData.fornecedor}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nome da loja/fornecedor"
                />
              </div>

              <div>
                <label className="label">Número da Nota Fiscal</label>
                <input
                  type="text"
                  name="numero_nota_fiscal"
                  value={formData.numero_nota_fiscal}
                  onChange={handleChange}
                  className="input"
                  placeholder="NF-12345"
                />
              </div>

              <div>
                <label className="label">Garantia Até</label>
                <input
                  type="date"
                  name="garantia_ate"
                  value={formData.garantia_ate}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Apólice de Seguro</label>
                <input
                  type="text"
                  name="apolice_seguro"
                  value={formData.apolice_seguro}
                  onChange={handleChange}
                  className="input"
                  placeholder="Número da apólice"
                />
              </div>
            </div>
          </div>

          {/* Credenciais e Acesso */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Credenciais e Acesso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email da Conta</label>
                <input
                  type="email"
                  name="email_conta"
                  value={formData.email_conta}
                  onChange={handleChange}
                  className="input"
                  placeholder="tablet001@empresa.com"
                />
              </div>

              <div>
                <label className="label">Senha do Email</label>
                <div className="relative">
                  <input
                    type={showPasswords ? "text" : "password"}
                    name="senha_email"
                    value={formData.senha_email}
                    onChange={handleChange}
                    className="input pr-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="label">Senha do Tablet (Desbloqueio)</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  name="senha_tablet"
                  value={formData.senha_tablet}
                  onChange={handleChange}
                  className="input"
                  placeholder="PIN ou senha"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPasswords"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="showPasswords" className="text-sm text-gray-700 cursor-pointer">
                  Mostrar senhas
                </label>
              </div>
            </div>
          </div>

          {/* Telefone/Chip */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Telefone/Chip (se aplicável)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Número de Telefone</label>
                <input
                  type="text"
                  name="numero_telefone"
                  value={formData.numero_telefone}
                  onChange={handleChange}
                  className="input"
                  placeholder="(92) 99999-9999"
                />
              </div>

              <div>
                <label className="label">Operadora</label>
                <input
                  type="text"
                  name="operadora"
                  value={formData.operadora}
                  onChange={handleChange}
                  className="input"
                  placeholder="Claro, Vivo, Tim..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="label">Observações</label>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows="3"
              className="input"
              placeholder="Informações adicionais sobre o tablet"
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

export default TabletModal;
