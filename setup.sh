#!/bin/bash

set -e

echo "========================================"
echo "WordPress Gutenberg Playground Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed.${NC}"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}Error: Docker is not running.${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi
echo -e "${GREEN}✓${NC} Docker is installed and running"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    echo "Please install Node.js: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js is installed ($NODE_VERSION)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    echo "npm should come with Node.js. Please reinstall Node.js."
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓${NC} npm is installed ($NPM_VERSION)"

echo ""
echo "Installing Gutenberg dependencies..."
cd gutenberg
npm install

echo ""
echo "Building Gutenberg..."
npm run build

echo ""
echo "Starting wp-env..."
npm run wp-env start

echo ""
echo "========================================"
echo -e "${GREEN}Setup complete!${NC}"
echo "========================================"
echo ""
echo "WordPress site:  http://localhost:8888"
echo "WordPress admin: http://localhost:8888/wp-admin"
echo "Username: admin"
echo "Password: password"
echo ""
echo "To stop the environment:"
echo "  cd gutenberg && npm run wp-env stop"
echo ""
