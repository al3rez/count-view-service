#!/usr/bin/env bash

green=`tput setaf 2`
reset=`tput sgr0`

echo "cleaning up ... ${green}done${reset}"
docker stop `docker ps -aq` &> /dev/null
docker rm `docker ps -aq` &> /dev/null
echo "running containers ... ${green}done${reset}"
docker-compose up -d &> /dev/null
