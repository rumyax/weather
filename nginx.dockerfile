FROM node:24.6.0-alpine3.22 as client
WORKDIR /client/
COPY ./client/package*.json ./
RUN npm ci
COPY ./client/ ./
RUN npm run build

FROM nginx:alpine3.22 as nginx
COPY ./nginx.conf /etc/nginx/
COPY --from=client /client/dist/ /usr/share/nginx/html/
ENTRYPOINT nginx -g "daemon off;"
