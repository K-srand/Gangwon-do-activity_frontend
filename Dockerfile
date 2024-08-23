# Frontend Dockerfile
FROM node:14-alpine as build

# 사용자 디렉토리 설정
WORKDIR /app

# npm 캐시 디렉토리를 사용자 디렉토리로 설정
RUN npm config set cache /app/.npm

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
