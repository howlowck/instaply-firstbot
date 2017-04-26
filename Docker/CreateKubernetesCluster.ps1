# From https://docs.microsoft.com/en-us/azure/container-service/container-service-kubernetes-walkthrough
# This assumes you have the Azure CLI 2.0 installed on Linux (Bash on Windows works great!)
# Instructions for Azure CLI install: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli#windows
# Create the Resource Group
RESOURCE_GROUP=RG-karkuber
LOCATION=westus
az group create --name=$RESOURCE_GROUP --location=$LOCATION

# Create the cluster
DNS_PREFIX=karkuber
CLUSTER_NAME=karkubercluster
az acs create --orchestrator-type=kubernetes --resource-group $RESOURCE_GROUP --name=$CLUSTER_NAME --dns-prefix=$DNS_PREFIX --generate-ssh-keys

# Install the kubernetes client 
sudo az acs kubernetes install-cli

# download the master Kubernetes cluster configuration to the ~/.kube/config file
az acs kubernetes get-credentials --resource-group=$RESOURCE_GROUP --name=$CLUSTER_NAME

# Get the nodes
kubectl get nodes

# Start a simple container
kubectl run nginx --image nginx

# see the running container
kubectl get pods

# To expose the service to the world, create a Kubernetes Service of type LoadBalancer:
kubectl expose deployments nginx --port=80 --type=LoadBalancer

# Run the following command to watch the service change from pending to display an external IP address:
watch 'kubectl get svc'
# Browse to the address when you have one.  

# To see the Kubernetes web interface, you can use:
kubectl proxy
# This command runs a simple authenticated proxy on localhost, 
# which you can use to view the Kubernetes web UI running on 
# http://localhost:8001/ui

# From:https://kubernetes.io/docs/tasks/web-ui-dashboard/#deploying-the-dashboard-ui
# The Dashboard UI is not deployed by default. (But I found I didn't need to do this.)
# To deploy it, run the following command:
kubectl create -f https://rawgit.com/kubernetes/dashboard/master/src/deploy/kubernetes-dashboard.yaml

# You may access the UI directly via the Kubernetes master apiserver. 
# Open a browser and navigate to https://<kubernetes-master>/ui, 
# where <kubernetes-master>

# Get the name of your nginx pods
kubectl get pods

# Create a Secret for accessing the private docker registry
kubectl create secret docker-registry myregistrykey --docker-server=karcontainers-microsoft.azurecr.io --docker-username=karcontainers --docker-password=C/4/+jKi+++/+rqm//lsd/bCx0T/ECFC --docker-email=kevin@remde.net






