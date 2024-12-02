# Use a imagem oficial do Node.js como base
FROM node:22.11.0

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo package.json e package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos do projeto para o container
COPY . .

# Exponha a porta que será usada pelo aplicativo
EXPOSE 4000

# Comando para iniciar o aplicativo
CMD ["npm", "start"]
