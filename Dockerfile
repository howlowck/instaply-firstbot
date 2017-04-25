FROM node
MAINTAINER Kevin Remde

#RUN apt-get install -y software-properties-common python
#RUN add-apt-repository ppa:chris-lea/node.js
#RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
#RUN apt-get update
#RUN apt-get install -y nodejs
#RUN apt-get install -y nodejs=0.6.12~dfsg1-1ubuntu1

ENV PORT=80
EXPOSE 80
RUN mkdir /var/www

ADD ./ var/www/

CMD ["/usr/local/bin/node", "/var/www/app.js"] 
