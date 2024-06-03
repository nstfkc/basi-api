FROM node:18
WORKDIR /app
COPY package-lock.json package.json ./
RUN npm i
COPY . .
RUN  npm run build
CMD node /app/dist/main

