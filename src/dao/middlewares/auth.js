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