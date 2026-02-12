import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tablet, 
  CheckCircle, 
  Wrench, 
  XCircle, 
  MapPin,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';
import { tabletsAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const response = await tabletsAPI.getStatistics();
      setStatistics(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Definir estatísticas vazias em caso de erro
      setStatistics({
        stats: {
          total: 0,
          ativos: 0,
          manutencao: 0,
          inativos: 0,
          substituidos: 0,
          norte: 0,
          nordeste: 0,
          falhasAbertas: 0,
          manutencoesAgendadas: 0
        },
        porLocalizacao: [],
        ultimasAtividades: []
      });
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

  const stats = statistics?.stats || {};
  
  const statusData = [
    { name: 'Ativos', value: stats.ativos || 0, color: '#10b981' },
    { name: 'Manutenção', value: stats.manutencao || 0, color: '#f59e0b' },
    { name: 'Inativos', value: stats.inativos || 0, color: '#ef4444' },
    { name: 'Substituídos', value: stats.substituidos || 0, color: '#6b7280' },
  ];

  const regiaoData = [
    { name: 'Norte', value: stats.norte || 0 },
    { name: 'Nordeste', value: stats.nordeste || 0 },
  ];

  const COLORS = ['#0ea5e9', '#06b6d4'];

  const cards = [
    {
      title: 'Total de Tablets',
      value: stats.total || 0,
      icon: Tablet,
      color: 'bg-blue-500',
      link: '/tablets'
    },
    {
      title: 'Tablets Ativos',
      value: stats.ativos || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      link: '/tablets?status=ATIVO'
    },
    {
      title: 'Em Manutenção',
      value: stats.manutencao || 0,
      icon: Wrench,
      color: 'bg-yellow-500',
      link: '/manutencoes'
    },
    {
      title: 'Falhas Abertas',
      value: stats.falhas_abertas || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      link: '/falhas'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral da gestão de tablets</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status dos Tablets */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={24} className="text-primary-600" />
            Status dos Tablets
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição por Região */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={24} className="text-primary-600" />
            Distribuição por Região
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regiaoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {regiaoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tablets por Localização */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={24} className="text-primary-600" />
          Tablets por Localização
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistics?.porLocalizacao?.map((loc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {loc.localizacao}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {loc.quantidade}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Últimas Atividades */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={24} className="text-primary-600" />
          Últimas Atividades
        </h2>
        <div className="space-y-4">
          {statistics?.ultimasAtividades?.slice(0, 5).map((atividade) => (
            <div key={atividade.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {atividade.tombamento} - {atividade.modelo}
                </p>
                <p className="text-sm text-gray-600 mt-1">{atividade.evento}: {atividade.descricao}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(atividade.data_evento).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
