# build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# runtime stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx config: proxy /api to backend (we rely on k8s service name)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
