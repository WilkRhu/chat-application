# Etapa de build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20 AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY --from=build /app/node_modules ./node_modules

COPY package*.json ./

ENV NODE_ENV=prod

EXPOSE 3001
EXPOSE 3002


CMD ["node", "dist/main"]
