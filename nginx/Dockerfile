FROM nginx:alpine

RUN rm-rf /usr/share/nginx/html/*

COPY ../html .usr/share/nginx/html 
COPY ../media /usr/share/nginx/media 

EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]
