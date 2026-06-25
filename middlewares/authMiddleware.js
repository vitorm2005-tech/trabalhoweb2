const jwt = require('jsonwebtoken');
const JWT_SECRET = 'seu_secret_super_seguro_123';

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) return res.redirect('/login');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // injeta os dados do payload (id, email, role)
        next();
    } catch (err) {
        res.clearCookie('auth_token');
        return res.redirect('/login');
    }
};

exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).send('Acesso Negado: Seu Role não tem permissão para esta página.');
        }
        next();
    };
};