# 使用 Node.js 的基礎映像檔
FROM node:22.14.0 AS build

# disable strict SSL
RUN npm config set strict-ssl false

# install pnpm
RUN npm install -g pnpm 
RUN pnpm config set strict-ssl false

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json 到容器內的工作目錄
COPY ["package.json", "package-lock.json*", "./"]

# 安裝相依套件
RUN pnpm install

# 複製所有專案檔案到容器內的工作目錄
COPY . .

# 建立指定環境的網頁檔案
RUN pnpm run build

# 使用 Nginx 的基礎映像檔
FROM nginx:stable-alpine AS final

# docker run 指定 backend url
ENV VITE_RESOURCE_URL=NULL

# 將 Vue.js 網頁檔案複製到 Nginx 的預設網站目錄
COPY --from=build /app/dist /usr/share/nginx/html

# 將 nginx conf.d 檔案複製到 /etc/nginx/conf.d
COPY default.conf /etc/nginx/conf.d

# Expose 容器的 80 連接埠
EXPOSE 80
