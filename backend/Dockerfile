FROM node:22-alpine AS dependencies

RUN apk add --no-cache openssl
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY src ./src
RUN npm prune --omit=dev

FROM node:22-alpine AS runtime

RUN apk add --no-cache openssl
ENV NODE_ENV=production
WORKDIR /app

COPY --from=dependencies --chown=node:node /app/package*.json ./
COPY --from=dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=dependencies --chown=node:node /app/prisma ./prisma
COPY --from=dependencies --chown=node:node /app/src ./src

USER node
EXPOSE 3000
CMD ["node", "src/server.js"]
