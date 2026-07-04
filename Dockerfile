FROM node:alpine AS builder
WORKDIR /build
RUN npm install -g html-minifier-terser
COPY .minifier.json build.js index.html tips.txt ./
RUN node build.js && html-minifier-terser --config-file .minifier.json built.html -o built.html

FROM nginx:alpine-slim
COPY --from=builder /build/built.html /usr/share/nginx/html/index.html
COPY 404.html /usr/share/nginx/html/404.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
