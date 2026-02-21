FROM node:18-alpine 

WORKDIR /frontend
COPY package*.json ./ 
RUN npm install
COPY . .
RUN num run build


