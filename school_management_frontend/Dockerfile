# 1. Build aşaması
FROM node:20 AS build
WORKDIR /app

# package.json ve package-lock.json kopyala
COPY package*.json ./
RUN npm install

# tüm frontend dosyalarını kopyala ve build et
COPY . .
RUN npm run build

# 2. Serve aşaması (nginx ile)
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# build çıktılarını nginx'in root'una kopyala
COPY --from=build /app/build .

# nginx default.conf ayarı ekleyebilirsin
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
