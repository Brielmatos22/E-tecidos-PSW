const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

function unauthorized(res) {
  return res.status(401).json({ message: "Autenticação necessária." });
}

async function authenticate(req, res, next) {
  const authorization = req.get("authorization") ?? "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) return unauthorized(res);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.tipo !== payload.tipo) return unauthorized(res);

    if (user.tipo === "fisica" || user.tipo === "juridica") {
      const accountModel = user.tipo === "fisica" ? prisma.accountPhysical : prisma.accountLegal;
      const account = await accountModel.findUnique({
        where: { id: user.contaId },
        select: { status: true },
      });
      if (!account || account.status !== "ativa") {
        return res.status(403).json({ message: "A conta está suspensa ou indisponível." });
      }
    }

    req.user = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      contaId: user.contaId,
      permissoes: user.permissoes,
    };
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      return unauthorized(res);
    }
    return next(error);
  }
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user?.permissoes?.includes(permission)) {
      return res.status(403).json({ message: "Você não tem permissão para esta operação." });
    }
    return next();
  };
}

function optionalAuthenticate(req, res, next) {
  if (!req.get("authorization")) return next();
  return authenticate(req, res, next);
}

module.exports = { authenticate, optionalAuthenticate, requirePermission };
