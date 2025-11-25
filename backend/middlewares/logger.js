const loggerMiddleware = (req, res, next) => {
    const now = new Date().toISOString();
    // Registra el método, la ruta y la hora de la solicitud
    console.log(`[${now}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
};

module.exports = loggerMiddleware;