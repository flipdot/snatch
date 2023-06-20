FROM node:20-alpine as build
USER node
WORKDIR /home/node

COPY --chown=node package.json package-lock.json ./
RUN npm ci

COPY --chown=node . ./
RUN npm run build

FROM ghcr.io/nikeee/docker-nginx-spa:latest
WORKDIR /app

COPY --from=build /home/node/dist /app