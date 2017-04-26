# CD
cd C:\Code\instaply-firstbot\Docker

docker build -t app-image .

docker images

# Run it
# docker run -d -p 8000:8000 --name my-app-cntr my-app-image ping -t localhost  
docker run -d -it -p 8080:80 --name app-cntr app-image /bin/bash


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

# Try running it locally, requiring it to be pulled from the registry
docker run -d -p 8080:80 --name app-cntr karcontainers-microsoft.azurecr.io/samples/app-image  
docker exec -it app-cntr /bin/bash



# Clean up
# Delete local tags and images
docker rmi app-image
docker rmi karcontainers-microsoft.azurecr.io/samples/app-image
docker ps -a
docker images

# log out
docker logout karcontainers-microsoft.azurecr.io


