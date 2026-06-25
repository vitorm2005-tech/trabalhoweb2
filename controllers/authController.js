const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'seu_secret_super_seguro_123';
const GABARITO = { pergunta1: 'node', pergunta2: 'mvc' };

exports.register = async (req, res) => {
    try {
        const { email, password, p1, p2 } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.render('cadastro', { error: 'E-mail já cadastrado.' });

        // CRITÉRIO: Regra de pontuação para definição de Roles
        let acertos = 0;
        if (p1 && p1.toLowerCase().trim() === GABARITO.pergunta1) acertos++;
        if (p2 && p2.toLowerCase().trim() === GABARITO.pergunta2) acertos++;

        let role = 'junior';
        if (acertos === 1) role = 'pleno';
        if (acertos === 2) role = 'senior';

        await User.create({ email, password, role });
        res.redirect('/login');
    } catch (err) {
        res.render('cadastro', { error: 'Erro ao cadastrar usuário.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.render('login', { error: 'Credenciais inválidas.' });
        }

        // CRITÉRIO: Role, ID e Email armazenados no payload do JWT
        const payload = { id: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        // CRITÉRIO: Cookie configurado para durar 1 hora (3600000 ms)
        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 3600000, 
            secure: false
        });

        res.redirect('/dashboard');
    } catch (err) {
        res.render('login', { error: 'Erro no servidor.' });
    }
};

// CRITÉRIO: Utilizando apenas POST para a ação de logout
exports.logout = (req, res) => {
    res.clearCookie('auth_token');
    return res.redirect('/login');
};