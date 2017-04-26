FROM node
MAINTAINER Kevin Remde

ENV PORT=80
EXPOSE 80
RUN mkdir /var/www

ADD ./ var/www/

CMD ["/usr/local/bin/node", "/var/www/app.js"] 