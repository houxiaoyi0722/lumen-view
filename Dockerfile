FROM nginx:1.24
COPY dist/ /usr/share/nginx/html/view/
COPY dist/index.html /usr/share/nginx/html/index.html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
