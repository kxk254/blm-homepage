FROM node:20-alpine AS build

WORKDIR /frontend
COPY frontend/package*.json ./ 
RUN npm install
COPY frontend/ .
RUN npm run build 

EXPOSE 3000
CMD ["npm","start","--","-H","0.0.0.0"]

