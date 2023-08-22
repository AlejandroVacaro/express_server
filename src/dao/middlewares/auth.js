export const checkUserAuthenticated = (req, res, next) => {
    if (req.session?.userInfo) {
        next();
    } else {
        res.redirect("/login");
    }
};

export const showLoginView = (req, res, next) => {
    if (req.session?.userInfo) {
        res.redirect("/home");
    } else {
        next();
    }
};