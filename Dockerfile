# Use imagem oficial do Node.js
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependências
COPY package.json package-lock.json* ./

# Instale dependências de produção
RUN npm install --production

# Copie o restante da aplicação
COPY . .

# Gere o Prisma Client
RUN npx prisma generate

# Compile o projeto
RUN npm run build

# Exponha a porta padrão do NestJS
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]