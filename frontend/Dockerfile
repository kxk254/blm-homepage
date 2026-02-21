FROM node:20-alpine AS build

WORKDIR /frontend
COPY frontend/package*.json ./ 
RUN npm install
COPY frontend/ .
RUN npm run build && npm run export

# Nginx stage
FROM nginx:alpine 

RUN rm -rf /etc/nginx/conf.d/default.conf 

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/out/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]
