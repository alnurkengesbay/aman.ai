#!/bin/bash

# ================================
# Aman AI Deployment Script
# ================================

set -e

echo "🚀 Starting Aman AI deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Update system
echo -e "${YELLOW}1. Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Install Docker if not exists
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}2. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo -e "${GREEN}2. Docker already installed${NC}"
fi

# 3. Install Docker Compose if not exists
if ! command -v docker-compose &> /dev/null; then
    echo -e "${YELLOW}3. Installing Docker Compose...${NC}"
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo -e "${GREEN}3. Docker Compose already installed${NC}"
fi

# 4. Create app directory
echo -e "${YELLOW}4. Setting up application directory...${NC}"
mkdir -p /opt/aman-ai
cd /opt/aman-ai

# 5. Copy environment file
if [ -f .env.production ]; then
    cp .env.production .env
fi

# 6. Build and start containers
echo -e "${YELLOW}5. Building and starting containers...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# 7. Wait for database
echo -e "${YELLOW}6. Waiting for database to be ready...${NC}"
sleep 10

# 8. Run migrations
echo -e "${YELLOW}7. Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T frontend npx prisma db push

# 9. Seed database
echo -e "${YELLOW}8. Seeding database...${NC}"
docker-compose -f docker-compose.prod.yml exec -T frontend npm run db:seed || true

# Done
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "🌐 Frontend: http://89.218.178.215"
echo "🔌 Backend API: http://89.218.178.215:8000"
echo ""
echo "Test accounts:"
echo "  - patient@test.com / test123"
echo "  - doctor@test.com / test123"
echo "  - admin@test.com / test123"


