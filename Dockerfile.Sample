FROM node
MAINTAINER Kevin Remde

ENV PORT=80

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# ADD ./ /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 80
CMD [ "npm", "start" ]
# CMD ["/usr/local/bin/node", "/var/www/app.js"] 