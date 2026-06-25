exports.getDashboard = (req, res) => res.render('dashboard', { user: req.user });
exports.getPlenoPage = (req, res) => res.render('pagina-pleno', { user: req.user });
exports.getSeniorPage = (req, res) => res.render('pagina-senior', { user: req.user });