# Dockerfile para Railway (Backend)
FROM node:18-alpine

WORKDIR /app

# Copiar package files
COPY backend/package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código
COPY backend/ ./

# Expor porta
EXPOSE 3000

# Iniciar aplicação
CMD ["npm", "start"]
