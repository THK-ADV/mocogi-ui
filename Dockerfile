FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:stable-alpine
COPY --from=node /app/dist/mocogi-ui /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/public
