#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo "WordPress Gutenberg Playground Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments
SETUP_CALYPSO=false
for arg in "$@"; do
    case $arg in
        --with-calypso)
            SETUP_CALYPSO=true
            ;;
        --help)
            echo "Usage: ./setup.sh [options]"
            echo ""
            echo "Options:"
            echo "  --with-calypso   Also set up WP-Calypso"
            echo "  --help           Show this help message"
            exit 0
            ;;
    esac
done

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

# Check yarn (needed for Calypso)
if [ "$SETUP_CALYPSO" = true ]; then
    if ! command -v yarn &> /dev/null; then
        echo -e "${YELLOW}Warning: Yarn is not installed.${NC}"
        echo "Installing yarn via corepack..."
        corepack enable
        corepack prepare yarn@stable --activate
    fi
    YARN_VERSION=$(yarn --version 2>/dev/null || echo "not found")
    echo -e "${GREEN}✓${NC} Yarn is installed ($YARN_VERSION)"
fi

# Gutenberg setup
echo ""
echo -e "${BLUE}Setting up Gutenberg...${NC}"
cd "$SCRIPT_DIR/gutenberg"

echo "Installing Gutenberg dependencies..."
npm install

echo ""
echo "Building Gutenberg..."
npm run build

echo ""
echo "Starting wp-env..."
npm run wp-env start

cd "$SCRIPT_DIR"

# Calypso setup
if [ "$SETUP_CALYPSO" = true ]; then
    echo ""
    echo -e "${BLUE}Setting up WP-Calypso...${NC}"

    # Check hosts file
    if ! grep -q "calypso.localhost" /etc/hosts 2>/dev/null; then
        echo -e "${YELLOW}Warning: calypso.localhost not found in /etc/hosts${NC}"
        echo "Calypso requires this entry to work. Please run:"
        echo -e "${YELLOW}  sudo sh -c 'echo \"127.0.0.1 calypso.localhost\" >> /etc/hosts'${NC}"
        echo ""
    else
        echo -e "${GREEN}✓${NC} calypso.localhost configured in /etc/hosts"
    fi

    # Clone if needed
    if [ ! -d "$SCRIPT_DIR/calypso" ]; then
        echo "Cloning WP-Calypso repository..."
        git clone https://github.com/Automattic/wp-calypso.git "$SCRIPT_DIR/calypso"
    else
        echo -e "${GREEN}✓${NC} Calypso directory already exists"
    fi

    cd "$SCRIPT_DIR/calypso"

    # Pin Node version with Volta if available
    if command -v volta &> /dev/null; then
        echo "Pinning Node 22.9.0 with Volta..."
        volta pin node@22.9.0
        volta install node@22.9.0
    fi

    # Install dependencies
    echo ""
    echo "Installing Calypso dependencies (this may take 5-15 minutes)..."
    yarn install || {
        echo -e "${YELLOW}Postinstall failed, trying with skip-build...${NC}"
        yarn install --mode=skip-build
        yarn run build-packages
    }

    cd "$SCRIPT_DIR"
fi

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
echo "To stop WordPress:"
echo "  cd gutenberg && npm run wp-env stop"
echo ""

if [ "$SETUP_CALYPSO" = true ]; then
    echo "Calypso: http://calypso.localhost:3000"
    echo ""
    echo "To start Calypso:"
    echo "  cd calypso && yarn start:debug"
    echo ""
    echo -e "${YELLOW}Note:${NC} Calypso requires yarn start:debug (not yarn start)"
    echo "due to webpack memory requirements."
    echo ""
fi
