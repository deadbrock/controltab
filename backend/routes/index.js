import express from 'express';
import * as tabletController from '../controllers/tabletController.js';
import * as manutencaoController from '../controllers/manutencaoController.js';
import * as falhaController from '../controllers/falhaController.js';
import * as trocaController from '../controllers/trocaController.js';
import * as relatorioController from '../controllers/relatorioController.js';
import * as exportController from '../controllers/exportController.js';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Rotas de Autenticação (públicas)
router.post('/auth/login', authController.login);

// Rotas protegidas (requerem autenticação)
router.get('/auth/profile', authenticateToken, authController.getProfile);
router.put('/auth/change-password', authenticateToken, authController.changePassword);

// Rotas de Usuários (apenas admin)
router.get('/users', authenticateToken, requireAdmin, userController.getAllUsers);
router.post('/users', authenticateToken, requireAdmin, userController.createUser);
router.put('/users/:id', authenticateToken, requireAdmin, userController.updateUser);
router.delete('/users/:id', authenticateToken, requireAdmin, userController.deleteUser);
router.post('/users/:id/reset-password', authenticateToken, requireAdmin, userController.resetUserPassword);

// Rotas de Tablets (requerem autenticação)
router.get('/tablets', authenticateToken, tabletController.getAllTablets);
router.get('/tablets/statistics', authenticateToken, tabletController.getStatistics);
router.get('/tablets/:id', authenticateToken, tabletController.getTabletById);
router.post('/tablets', authenticateToken, tabletController.createTablet);
router.put('/tablets/:id', authenticateToken, tabletController.updateTablet);
router.delete('/tablets/:id', authenticateToken, tabletController.deleteTablet);

// Rotas de Manutenções (requerem autenticação)
router.get('/manutencoes', authenticateToken, manutencaoController.getAllManutencoes);
router.post('/manutencoes', authenticateToken, manutencaoController.createManutencao);
router.put('/manutencoes/:id', authenticateToken, manutencaoController.updateManutencao);
router.delete('/manutencoes/:id', authenticateToken, manutencaoController.deleteManutencao);

// Rotas de Falhas (requerem autenticação)
router.get('/falhas', authenticateToken, falhaController.getAllFalhas);
router.post('/falhas', authenticateToken, falhaController.createFalha);
router.put('/falhas/:id', authenticateToken, falhaController.updateFalha);
router.delete('/falhas/:id', authenticateToken, falhaController.deleteFalha);

// Rotas de Trocas (apenas admin pode criar/deletar)
router.get('/trocas', authenticateToken, trocaController.getAllTrocas);
router.get('/trocas/:id', authenticateToken, trocaController.getTrocaById);
router.post('/trocas', authenticateToken, requireAdmin, trocaController.createTroca);
router.delete('/trocas/:id', authenticateToken, requireAdmin, trocaController.deleteTroca);

// Rotas de Relatórios (requerem autenticação)
router.get('/relatorios/geral', authenticateToken, relatorioController.relatorioGeral);
router.get('/relatorios/falhas', authenticateToken, relatorioController.relatorioFalhas);
router.get('/relatorios/manutencoes', authenticateToken, relatorioController.relatorioManutencoes);
router.get('/relatorios/clientes', authenticateToken, relatorioController.relatorioPorCliente);
router.get('/relatorios/garantias', authenticateToken, relatorioController.relatorioGarantias);
router.get('/relatorios/financeiro', authenticateToken, relatorioController.relatorioFinanceiro);

// Rotas de Exportação (apenas admin)
router.get('/export/tablets/pdf', authenticateToken, requireAdmin, exportController.exportTabletsPDF);
router.get('/export/tablets/excel', authenticateToken, requireAdmin, exportController.exportTabletsExcel);
router.get('/export/falhas/excel', authenticateToken, requireAdmin, exportController.exportFalhasExcel);
router.get('/export/manutencoes/excel', authenticateToken, requireAdmin, exportController.exportManutencoesExcel);

export default router;
