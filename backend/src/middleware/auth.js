const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const { createToken } = require("../utils/authToken");

const TOKEN_REFRESH_THRESHOLD_SECONDS = 60 * 60;

function unauthorized(res) {
  return res.status(401).json({ message: "Autenticação necessária." });
}

async function authenticate(req, res, next) {
  const authorization = (req.get("authorization") ?? "").trim();
  const bearerMatch = authorization.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch) return unauthorized(res);

  try {
    const payload = jwt.verify(bearerMatch[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    if (
      !payload
      || typeof payload !== "object"
      || typeof payload.sub !== "string"
      || !["admin", "fisica", "juridica"].includes(payload.tipo)
      || typeof payload.exp !== "number"
    ) return unauthorized(res);

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
    if (typeof payload.exp === "number") {
      const remainingLifetime = payload.exp - Math.floor(Date.now() / 1000);
      if (remainingLifetime <= TOKEN_REFRESH_THRESHOLD_SECONDS) {
        res.set("X-Access-Token", createToken(req.user));
      }
    }
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
