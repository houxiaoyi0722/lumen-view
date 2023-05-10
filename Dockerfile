FROM nginx:1.24
COPY dist/ /usr/share/nginx/html/dist/
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
