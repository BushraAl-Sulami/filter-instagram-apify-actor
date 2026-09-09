FROM node:22-bookworm-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY .actor ./.actor

CMD ["npm", "start"]