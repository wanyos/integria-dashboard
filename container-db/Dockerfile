FROM mysql:latest

# Configuración de entorno
ENV MYSQL_ROOT_PASSWORD=root1712@fll

# Crear directorio para los scripts SQL
RUN mkdir -p /sql

# Copiar archivos a ubicaciones correctas
COPY wrapper.sql /docker-entrypoint-initdb.d/
COPY files/structure-integria.sql /sql/
COPY files/datos.sql /sql/

# Asegurar permisos (opcional pero recomendado)
RUN chmod -R 755 /sql

# Exponer el puerto de MySQL
EXPOSE 3306
