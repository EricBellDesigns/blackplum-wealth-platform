#!/bin/bash

echo "=== Checking Docker status ==="
sudo systemctl status docker | head -20

echo -e "\n=== Checking Docker containers ==="
sudo docker ps -a

echo -e "\n=== Finding app directory ==="
find /home -name "docker-compose.yml" -type f 2>/dev/null

echo -e "\n=== Checking current directory ==="
pwd
ls -la

echo -e "\n=== Looking for the app in common locations ==="
ls -la /home/ubuntu/ 2>/dev/null || echo "/home/ubuntu not found"
ls -la /home/ec2-user/ 2>/dev/null || echo "/home/ec2-user not found"
ls -la /opt/ 2>/dev/null
ls -la /var/www/ 2>/dev/null

echo -e "\n=== Checking if docker-compose is installed ==="
which docker-compose || echo "docker-compose not found"
docker-compose version 2>/dev/null || echo "docker-compose not working"

echo -e "\n=== Checking system resources ==="
df -h
free -m

echo -e "\n=== Recent Docker logs (if any containers exist) ==="
sudo docker logs $(sudo docker ps -aq | head -1) --tail=50 2>/dev/null || echo "No container logs available" 