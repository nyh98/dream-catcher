FROM node:20.18.0

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]