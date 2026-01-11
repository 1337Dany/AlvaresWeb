FROM nginx:alpine

# Копируем всё из папки spa в корень nginx
COPY spa/ /usr/share/nginx/html/

# Копируем конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80