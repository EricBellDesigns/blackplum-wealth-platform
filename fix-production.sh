#!/bin/bash

# Fix Production Instance Script
# Run this after SSH'ing into the EC2 instance

echo "=== Checking Docker status ==="
sudo systemctl status docker

echo "=== Starting Docker if needed ==="
sudo systemctl start docker

echo "=== Checking running containers ==="
sudo docker ps -a

echo "=== Navigating to app directory ==="
cd /home/ubuntu/wealth-management-platform-nextjs-main || cd /home/ec2-user/wealth-management-platform-nextjs-main || echo "App directory not found!"

echo "=== Checking for .env file ==="
if [ ! -f .env ]; then
    echo "WARNING: .env file not found! Creating template..."
    cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@db:5432/main
NEXTAUTH_URL=https://investors.davidgiunta.com
NEXTAUTH_SECRET=your-secret-here
JWT_SECRET=your-jwt-secret

# Email configuration
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@investors.davidgiunta.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587

# AWS S3 (if using)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
EOF
    echo "Please edit .env with actual values!"
fi

echo "=== Starting Docker containers ==="
sudo docker-compose down
sudo docker-compose up -d

echo "=== Waiting for containers to start ==="
sleep 10

echo "=== Running migrations ==="
sudo docker-compose exec web knex migrate:latest

echo "=== Checking container logs ==="
sudo docker-compose logs --tail=50

echo "=== Checking if app is responding ==="
curl -I http://localhost:8080 || echo "App not responding on port 8080"

echo "=== Done! ==="
echo "If everything looks good, the app should be accessible at https://investors.davidgiunta.com" 