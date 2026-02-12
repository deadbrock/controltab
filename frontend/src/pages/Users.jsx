import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Shield, User } from 'lucide-react';
import axios from 'axios';
import UserModal from '../components/UserModal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await axios.delete(`/api/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert(error.response?.data?.message || 'Erro ao deletar usuário');
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Digite a nova senha (mínimo 6 caracteres):');
    
    if (!newPassword) return;
    
    if (newPassword.length < 6) {
      alert('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      await axios.post(`/api/users/${id}/reset-password`, { newPassword });
      alert('Senha resetada com sucesso!');
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      alert(error.response?.data?.message || 'Erro ao resetar senha');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedUser(null);
    loadUsers();
  };

  const getRoleBadge = (role) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600 mt-2">Gerencie os usuários do sistema</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      {/* Lista de Usuários */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Nenhum usuário encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <div key={user.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      {user.role === 'admin' ? (
                        <Shield className="text-primary-600" size={24} />
                      ) : (
                        <User className="text-primary-600" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <span className={`badge ${getRoleBadge(user.role)}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                    <span className={`badge ${user.active ? 'badge-success' : 'badge-danger'}`}>
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="flex md:flex-col gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <Edit size={18} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    className="btn-secondary flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Resetar Senha
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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
        <UserModal
          user={selectedUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Users;
