FROM node
MAINTAINER Kevin Remde

ENV PORT=80
ENV BOT_APPID=bbe9d614-b6f3-4a47-908e-8a075587ea6c
ENV BOT_PASSWORD=rfphya54gvea2bHKedbZTqe
ENV BOT_DIRECTLINE_SECRET=HBLaNtdtCzU.cwA.RK8.TE29_PdtZNY4MgxHCljL06zZIQyXEGtuH_DNGjUhzg8
ENV INSTAPLY_MESSAGE_POST_ENDPOINT=
ENV INSTAPLY_MESSAGE_POST_TOKEN= 
 
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