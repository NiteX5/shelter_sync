# 1. Etapa de dependencias: Instala node_modules
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2. Etapa de construcción: Compila el proyecto
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Este comando ejecuta 'next build', que requiere 'output: standalone' en next.config.js
RUN npm run build

# 3. Etapa de ejecución (Runner): La imagen final y ligera
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
# Crear usuario de sistema para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar solo los archivos necesarios desde la etapa builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

# El comando final para iniciar el servidor optimizado
CMD ["node", "server.js"]
