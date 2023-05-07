# !/bin/bash

# Variables
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
container_name=member
dbname=member_g

if ! command -v docker &> /dev/null
then
    echo -e "${RED} docker could not be found"
    exit
fi

# Make sure no old containers are running
echo -e "${BLUE} Stopping old containers..."
docker stop $container_name
docker rm $container_name

# Create Container

if [ ! "$(docker ps -q -f name=project_g)" ]; then
    echo -e "Creating new container...${NC}"
    docker run -d --rm --name $container_name            \
        -e MYSQL_ROOT_PASSWORD=123456                    \
        -e MYSQL_USER=anji                               \
        -e MYSQL_PASSWORD=123456                         \
        -e MYSQL_DATABASE=$dbname                      	 \
        -p 3309:3306                                     \
        --volume project_g:/var/lib/mysql             	 \
        mysql:latest
fi

# Check if container is up and running
if [ "$( docker container inspect -f '{{.State.Status}}' $container_name )" == "running" ]; 
then
		echo -e "${GREEN}${container_name} is running..."
		echo -e "Copy the following to your .env file:"
		echo -e "\"mysql://anji:123456@localhost:3309/${dbname}\""
else
		echo -e "${RED}project_g is not running!!"
		exit
fi