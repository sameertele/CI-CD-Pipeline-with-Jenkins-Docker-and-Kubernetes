FROM node:18-alpine

WORKDIR / CI-CD-Pipeline-with-Jenkins-Docker-and-Kubernetes

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]