FROM  nginx:latest
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./server.crt /etc/nginx/server.crt
COPY ./server.csr /etc/nginx/server.csr
COPY ./server.key /etc/nginx/server.key

RUN chmod 755 -R /var
RUN chmod 400 /etc/nginx/server.key
