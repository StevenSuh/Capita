FROM node:alpine as builder
WORKDIR "/app"
RUN mkdir shared
COPY ./shared ./shared
RUN mkdir client

WORKDIR "/app/client"
COPY ./client/package.json ./
RUN yarn
COPY ./client .
RUN yarn build

FROM nginx
EXPOSE 8080
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
