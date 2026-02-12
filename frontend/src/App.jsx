import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tablets from './pages/Tablets';
import TabletDetail from './pages/TabletDetail';
import Manutencoes from './pages/Manutencoes';
import Falhas from './pages/Falhas';
import Trocas from './pages/Trocas';
import Relatorios from './pages/Relatorios';
import Users from './pages/Users';

// Componente para proteger rotas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// Componente para rotas admin
const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/tablets" element={
          <PrivateRoute>
            <Layout>
              <Tablets />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/tablets/:id" element={
          <PrivateRoute>
            <Layout>
              <TabletDetail />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/manutencoes" element={
          <PrivateRoute>
            <Layout>
              <Manutencoes />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/falhas" element={
          <PrivateRoute>
            <Layout>
              <Falhas />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/trocas" element={
          <PrivateRoute>
            <Layout>
              <Trocas />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="/relatorios" element={
          <AdminRoute>
            <Layout>
              <Relatorios />
            </Layout>
          </AdminRoute>
        } />
        
        <Route path="/usuarios" element={
          <AdminRoute>
            <Layout>
              <Users />
            </Layout>
          </AdminRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
