# Usa una imagen base de Node.js para construir la aplicación
FROM node:22-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para construir la aplicación
COPY package*.json ./
COPY index.html ./ 
COPY src ./src
COPY vite.config.* ./
COPY public ./public
COPY .env.production ./ 

# Instala las dependencias y construye la aplicación
RUN npm install
RUN npm run build

# Usa una imagen base de Nginx para servir los archivos estáticos
FROM nginx:alpine

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos generados por Vite al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80 para servir la aplicación
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]