import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Wrench, AlertTriangle, ArrowLeftRight, Activity } from 'lucide-react';
import { tabletsAPI } from '../services/api';

const TabletDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tablet, setTablet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    loadTablet();
  }, [id]);

  const loadTablet = async () => {
    try {
      const response = await tabletsAPI.getById(id);
      setTablet(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar tablet:', error);
      alert('Tablet não encontrado');
      navigate('/tablets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tablet) return null;

  const getStatusBadge = (status) => {
    const badges = {
      ATIVO: 'badge-success',
      MANUTENCAO: 'badge-warning',
      INATIVO: 'badge-danger',
      SUBSTITUIDO: 'badge-gray',
      AGENDADA: 'badge-info',
      EM_ANDAMENTO: 'badge-warning',
      CONCLUIDA: 'badge-success',
      CANCELADA: 'badge-gray',
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
      MEDIA: 'badge-warning',
      ALTA: 'badge-danger',
      CRITICA: 'badge-danger'
    };
    return badges[severidade] || 'badge-gray';
  };

  const tabs = [
    { id: 'info', label: 'Informações', icon: Activity },
    { id: 'manutencoes', label: 'Manutenções', icon: Wrench, count: tablet.manutencoes?.length },
    { id: 'falhas', label: 'Falhas', icon: AlertTriangle, count: tablet.falhas?.length },
    { id: 'trocas', label: 'Trocas', icon: ArrowLeftRight, count: tablet.trocas?.length },
    { id: 'historico', label: 'Histórico', icon: Calendar, count: tablet.historico?.length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/tablets')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tablet.tombamento}</h1>
            <p className="text-gray-600 mt-2">{tablet.modelo} - {tablet.fabricante}</p>
          </div>
          <span className={`badge text-lg ${getStatusBadge(tablet.status)}`}>
            {tablet.status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informações Técnicas</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sistema Operacional</dt>
                  <dd className="text-sm text-gray-900 mt-1">{tablet.sistema_operacional} {tablet.versao_so}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">IMEI</dt>
                  <dd className="text-sm text-gray-900 mt-1">{tablet.imei}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Número de Série</dt>
                  <dd className="text-sm text-gray-900 mt-1">{tablet.numero_serie}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Data de Aquisição</dt>
                  <dd className="text-sm text-gray-900 mt-1">
                    {new Date(tablet.data_aquisicao).toLocaleDateString('pt-BR')}
                  </dd>
                </div>
                {tablet.numero_telefone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                    <dd className="text-sm text-gray-900 mt-1">{tablet.numero_telefone} {tablet.operadora && `(${tablet.operadora})`}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informações Financeiras</h3>
              <dl className="space-y-3">
                {tablet.valor_aquisicao && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Valor de Aquisição</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      R$ {Number(tablet.valor_aquisicao).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                )}
                {tablet.fornecedor && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fornecedor</dt>
                    <dd className="text-sm text-gray-900 mt-1">{tablet.fornecedor}</dd>
                  </div>
                )}
                {tablet.numero_nota_fiscal && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nota Fiscal</dt>
                    <dd className="text-sm text-gray-900 mt-1">{tablet.numero_nota_fiscal}</dd>
                  </div>
                )}
                {tablet.garantia_ate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Garantia Até</dt>
                    <dd className="text-sm text-gray-900 mt-1">
                      {new Date(tablet.garantia_ate).toLocaleDateString('pt-BR')}
                      {new Date(tablet.garantia_ate) > new Date() && (
                        <span className="ml-2 badge-success">Ativa</span>
                      )}
                      {new Date(tablet.garantia_ate) <= new Date() && (
                        <span className="ml-2 badge-danger">Vencida</span>
                      )}
                    </dd>
                  </div>
                )}
                {tablet.apolice_seguro && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Seguro</dt>
                    <dd className="text-sm text-gray-900 mt-1">{tablet.apolice_seguro}</dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🔐 Credenciais</h3>
              <dl className="space-y-3">
                {tablet.email_conta && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email da Conta</dt>
                    <dd className="text-sm text-gray-900 mt-1 font-mono">{tablet.email_conta}</dd>
                  </div>
                )}
                {tablet.senha_email && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Senha do Email</dt>
                    <dd className="text-sm text-gray-900 mt-1 font-mono">••••••••</dd>
                  </div>
                )}
                {tablet.senha_tablet && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Senha do Tablet</dt>
                    <dd className="text-sm text-gray-900 mt-1 font-mono">••••••••</dd>
                  </div>
                )}
                {!tablet.email_conta && !tablet.senha_email && !tablet.senha_tablet && (
                  <p className="text-sm text-gray-500">Nenhuma credencial cadastrada</p>
                )}
              </dl>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Localização e Cliente
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                  <dd className="text-sm text-gray-900 mt-1 font-semibold">{tablet.cliente}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Região</dt>
                  <dd className="text-sm text-gray-900 mt-1">{tablet.regiao}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="text-sm text-gray-900 mt-1">{tablet.estado}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cidade</dt>
                  <dd className="text-sm text-gray-900 mt-1">{tablet.cidade}</dd>
                </div>
                {tablet.endereco && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Endereço</dt>
                    <dd className="text-sm text-gray-900 mt-1">{tablet.endereco}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Localização/Setor</dt>
                  <dd className="text-sm text-gray-900 mt-1">{tablet.localizacao}</dd>
                </div>
              </dl>
            </div>

            {tablet.observacoes && (
              <div className="card md:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Observações</h3>
                <p className="text-sm text-gray-700">{tablet.observacoes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'manutencoes' && (
          <div className="space-y-4">
            {tablet.manutencoes?.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Nenhuma manutenção registrada</p>
              </div>
            ) : (
              tablet.manutencoes?.map((manutencao) => (
                <div key={manutencao.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900">{manutencao.tipo}</h4>
                      <p className="text-sm text-gray-600 mt-1">{manutencao.descricao}</p>
                    </div>
                    <span className={`badge ${getStatusBadge(manutencao.status)}`}>
                      {manutencao.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Início:</span>
                      <p className="text-gray-900">{new Date(manutencao.data_inicio).toLocaleDateString('pt-BR')}</p>
                    </div>
                    {manutencao.data_conclusao && (
                      <div>
                        <span className="text-gray-500">Conclusão:</span>
                        <p className="text-gray-900">{new Date(manutencao.data_conclusao).toLocaleDateString('pt-BR')}</p>
                      </div>
                    )}
                    {manutencao.tecnico_responsavel && (
                      <div>
                        <span className="text-gray-500">Técnico:</span>
                        <p className="text-gray-900">{manutencao.tecnico_responsavel}</p>
                      </div>
                    )}
                    {manutencao.custo && (
                      <div>
                        <span className="text-gray-500">Custo:</span>
                        <p className="text-gray-900">R$ {manutencao.custo.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'falhas' && (
          <div className="space-y-4">
            {tablet.falhas?.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Nenhuma falha registrada</p>
              </div>
            ) : (
              tablet.falhas?.map((falha) => (
                <div key={falha.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{falha.tipo_falha}</h4>
                        <span className={`badge ${getSeveridadeBadge(falha.severidade)}`}>
                          {falha.severidade}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{falha.descricao}</p>
                    </div>
                    <span className={`badge ${getStatusBadge(falha.status)}`}>
                      {falha.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Data: {new Date(falha.data_ocorrencia).toLocaleString('pt-BR')}
                  </div>
                  {falha.solucao && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">Solução:</span>
                      <p className="text-sm text-green-700 mt-1">{falha.solucao}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'trocas' && (
          <div className="space-y-4">
            {tablet.trocas?.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Nenhuma troca registrada</p>
              </div>
            ) : (
              tablet.trocas?.map((troca) => (
                <div key={troca.id} className="card">
                  <h4 className="font-bold text-gray-900 mb-2">{troca.motivo}</h4>
                  <p className="text-sm text-gray-600 mb-4">{troca.descricao_detalhada}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Data da Troca:</span>
                      <p className="text-gray-900">{new Date(troca.data_troca).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Responsável:</span>
                      <p className="text-gray-900">{troca.responsavel}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'historico' && (
          <div className="space-y-3">
            {tablet.historico?.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500">Nenhum histórico registrado</p>
              </div>
            ) : (
              tablet.historico?.map((item) => (
                <div key={item.id} className="card">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{item.evento}</h4>
                        {item.usuario && (
                          <span className="text-sm text-gray-500">por {item.usuario}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{item.descricao}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(item.data_evento).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabletDetail;
