# CD
cd C:\Code\instaply-firstbot

docker build -t app-image .

docker images

# Run it
# docker run -d -p 8000:8000 --name my-app-cntr my-app-image ping -t localhost  
docker run -d -p 8080:80 --name app-cntr app-image 


# Check the containers
docker ps -a

# Connect to it to see the filesystem
docker exec -it app-cntr /bin/bash

docker stop app-cntr
docker rm app-cntr
docker rmi app-image

# login to my Azure Container Registry
docker login karcontainers-microsoft.azurecr.io -u karcontainers -p C/4/+jKi+++/+rqm//lsd/bCx0T/ECFC


# Create an alias of the image in your registry
docker tag app-image karcontainers-microsoft.azurecr.io/samples/app-image

# Push the image to your registry
docker push karcontainers-microsoft.azurecr.io/samples/app-image

# Delete local tags and images
docker rmi app-image
docker rmi karcontainers-microsoft.azurecr.io/samples/app-image
docker images

docker run -d -p 8080:80 --name app-cntr app-image 
docker run -d -p 8080:80 --name app-cntr karcontainers-microsoft.azurecr.io/samples/app-image  

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

