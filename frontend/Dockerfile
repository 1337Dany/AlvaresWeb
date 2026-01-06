# build
FROM node:20-alpine AS build
WORKDIR /app

COPY spa/package*.json ./
RUN npm install

COPY spa/ .
RUN npm run build

# nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
