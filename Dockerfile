FROM node:20.16-alpine3.20 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:production

FROM nginx:1.26.2-alpine
COPY --from=node /app/dist/mocogi-ui/browser /usr/share/nginx/html
RUN mkdir /usr/share/nginx/html/public
