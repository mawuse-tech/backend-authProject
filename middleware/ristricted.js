//authorization middleware

export const restrict = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user.role) {
            const error = new Error('please log in');
            error.statusCode = 403;
            next(error)
        };

        if (!allowedRoles.includes(req.user.role)) {
            const error = new Error('you are not authorized');
            error.statusCode = 403;
            next(error)
        };
        next()

        } catch (error) {
            return next(error)
        }
    }
}