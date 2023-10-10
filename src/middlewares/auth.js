//Controla si el usuario esta autenticado
export const checkUserAuthenticated = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect("/");
    }
};

//Muestra la vista de login si el usuario no esta autenticado
export const showLoginView = (req, res, next) => {
    if (req.user) {
        res.redirect("/home");
    } else {
        next();
    }
};

//Controla el rol del usuario
export const checkUserRole = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        }   else {
            res.json({ status: 'error', message: 'No tienes permisos para realizar esta acción' });
        }   
    }
}
 