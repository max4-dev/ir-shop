FROM node:18 as buil
WORKDIR /opt/app
ADD . .
RUN npm ci
RUN npm run migrate:generate
RUN npm run build --prod


FROM node:1
WORKDIR /opt/app
COPY --from=build /opt/app/dist ./dist
ADD *.json ./
ADD ./prisma ./prisma
ADD ./libs ./libs
RUN npm ci --omit=dev
RUN npm run migrate:generate
CMD [ "node", "./dist/src/main.js" ]
