const express = require('express');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const { verifyToken, checkRole } = require('./middlewares/authMiddleware');

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ROTAS PÚBLICAS (GET E POST APENAS)
app.get('/cadastro', (req, res) => res.render('cadastro', { error: null }));
app.post('/cadastro', authController.register);

app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', authController.login);

// ROTA DE LOGOUT (POST APENAS)
app.post('/logout', authController.logout);

// ROTAS PROTEGIDAS (GET APENAS)
app.get('/dashboard', verifyToken, dashboardController.getDashboard);
app.get('/pagina-pleno', verifyToken, checkRole(['pleno', 'senior']), dashboardController.getPlenoPage);
app.get('/pagina-senior', verifyToken, checkRole(['senior']), dashboardController.getSeniorPage);

app.get('*', (req, res) => res.redirect('/login'));

sequelize.sync().then(() => {
    app.listen(3000, () => console.log('🚀 Servidor em: http://localhost:3000'));
});