# 1. Node.js イメージを使う
FROM node:20-alpine AS build

# 作業ディレクトリ
WORKDIR /app

# package.json と lock ファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリのソースをコピー
COPY . .

# 本番用にビルド
RUN npm run build

# 2. 軽量なサーバーで配信
FROM nginx:alpine

# ビルドしたファイルを nginx の公開ディレクトリにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# ポート開放
EXPOSE 80

# Nginx 起動
CMD ["nginx", "-g", "daemon off;"]
