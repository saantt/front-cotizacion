FROM node:12

# Evita que Angular CLI se detenga preguntando sobre analíticas la primera vez que se usa
# (sin esto, "ng new" podría quedarse esperando una respuesta que nunca llega)
ENV NG_CLI_ANALYTICS=false

RUN npm install -g @angular/cli@11

WORKDIR /app

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4200

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]