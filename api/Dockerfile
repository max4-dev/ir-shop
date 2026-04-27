FROM node:20-alpine AS build
WORKDIR /opt/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:20-alpine
WORKDIR /opt/app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/node_modules/.prisma ./node_modules/.prisma
COPY ./prisma ./prisma

COPY start.sh ./start.sh
RUN chmod +x start.sh

CMD ["./start.sh"]