
export const notFound = (req, res, next) => {
    const error = new Error(`Cannot find ${req.originalUrl}`);
    res.status(404);
    next(error);
}