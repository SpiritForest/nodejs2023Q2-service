FROM node:18-alpine

COPY . /app/

WORKDIR /app

RUN npm ci && npm cache clean --force

CMD [ "npm", "run", "start:dev" ]