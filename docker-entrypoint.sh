#!/bin/sh
set -e

# Si no hay un package.json en /app, todavía no existe un proyecto Angular -> lo creamos
if [ ! -f "package.json" ]; then
  echo "No se encontró un proyecto Angular en /app. Generando uno nuevo con 'ng new'..."
  ng new front-cotizacion --directory . --routing --style=css --skip-git --force
fi

# Instala (o verifica) las dependencias
npm install

# Ejecuta el comando final que se le pasó al contenedor
# (por defecto: ng serve, definido en el CMD del Dockerfile)
exec "$@"