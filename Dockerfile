# Frontend Dockerfile
FROM node:14-alpine as build

WORKDIR /app

COPY package.json ./


FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
