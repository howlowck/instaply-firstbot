<#
This file contains commands (run one at a time and either in the PowerShell 
ISE or a PowerShell prompt) that build the bot container.


#>
# CD
cd C:\Code\instaply-firstbot

git pull

docker build -t bot-image .

docker images

# Run it (not required)
docker run -d -p 8080:80 --name bot-cntr bot-image 

# Check the containers
docker ps -a

# Connect to it to see the filesystem (not required)
docker exec -it bot-cntr /bin/bash

# Cleanup
docker stop bot-cntr
docker rm bot-cntr
# docker rmi bot-image

# login to my Azure Container Registry
docker login karcontainers-microsoft.azurecr.io -u karcontainers -p C/4/+jKi+++/+rqm//lsd/bCx0T/ECFC


# Create an alias of the image in your registry
docker tag bot-image karcontainers-microsoft.azurecr.io/samples/bot-image

# Push the image to your registry
docker push karcontainers-microsoft.azurecr.io/samples/bot-image

# Delete local tags and images
docker rmi bot-image
docker rmi karcontainers-microsoft.azurecr.io/samples/bot-image
docker images

docker run -d -p 8080:80 --name bot-cntr bot-image 
docker run -d -p 8080:80 --name bot-cntr karcontainers-microsoft.azurecr.io/samples/bot-image  

docker inspect -f "{{ .NetworkSettings.Networks.nat.IPAddress }}" my-site


# Clean up
docker stop my-site
docker rm my-site
docker ps -a

docker rmi nanoserver
docker rmi karcontainers-microsoft.azurecr.io/samples/iis-site

docker images

docker rmi karcontainers-microsoft.azurecr.io/samples/nanoserver

# Clean up
docker logout karcontainers-microsoft.azurecr.io/samples/nanoserver

docker rm demo2
docker ps -a

docker rmi iis-site
docker rmi nanoserver
docker rmi microsoft/nanoserver
docker rmi karcontainers-microsoft.azurecr.io/samples/nanoserver
docker images

