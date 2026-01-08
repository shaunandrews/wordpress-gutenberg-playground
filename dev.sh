#!/bin/bash

# Run all development servers for the WordPress Gutenberg Playground

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Parse arguments
START_CALYPSO=false
SKIP_ENV_CHECK=false
STOP_SERVERS=false
for arg in "$@"; do
    case $arg in
        --with-calypso)
            START_CALYPSO=true
            ;;
        --skip-env)
            SKIP_ENV_CHECK=true
            ;;
        --stop)
            STOP_SERVERS=true
            ;;
        --help)
            echo "Usage: ./dev.sh [options]"
            echo ""
            echo "Starts all development servers for the playground."
            echo ""
            echo "Options:"
            echo "  --with-calypso   Also start WP-Calypso dev server"
            echo "  --skip-env       Skip wp-env startup check"
            echo "  --stop           Stop all dev servers and wp-env"
            echo "  --help           Show this help message"
            echo ""
            echo "Servers started:"
            echo "  - Gutenberg (npm run dev)"
            echo "  - All plugins in plugins/ with package.json"
            echo "  - Calypso (optional, with --with-calypso)"
            exit 0
            ;;
    esac
done

# Stop mode
if [ "$STOP_SERVERS" = true ]; then
    echo -e "${YELLOW}Stopping all dev servers...${NC}"

    # Kill wp-scripts processes (Gutenberg and plugin dev servers)
    if pgrep -f "wp-scripts start" > /dev/null 2>&1; then
        echo "Stopping plugin dev servers..."
        pkill -f "wp-scripts start" 2>/dev/null || true
    fi

    if pgrep -f "node ./bin/dev.mjs" > /dev/null 2>&1; then
        echo "Stopping Gutenberg dev server..."
        pkill -f "node ./bin/dev.mjs" 2>/dev/null || true
    fi

    # Kill Calypso if running
    if pgrep -f "calypso.*start" > /dev/null 2>&1; then
        echo "Stopping Calypso..."
        pkill -f "calypso.*start" 2>/dev/null || true
    fi

    # Stop wp-env
    if docker ps --format '{{.Names}}' 2>/dev/null | grep -q "wordpress"; then
        echo "Stopping wp-env..."
        cd "$SCRIPT_DIR/gutenberg"
        npm run wp-env stop
        cd "$SCRIPT_DIR"
    fi

    echo -e "${GREEN}All servers stopped.${NC}"
    exit 0
fi

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down dev servers...${NC}"
    # Kill all background jobs
    jobs -p | xargs -r kill 2>/dev/null
    wait 2>/dev/null
    echo -e "${GREEN}All servers stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Check if wp-env is running
if [ "$SKIP_ENV_CHECK" = false ]; then
    echo -e "${BLUE}Checking wp-env status...${NC}"
    cd "$SCRIPT_DIR/gutenberg"

    if ! docker ps --format '{{.Names}}' 2>/dev/null | grep -q "wordpress"; then
        echo -e "${YELLOW}wp-env is not running. Starting it...${NC}"
        npm run wp-env start
    else
        echo -e "${GREEN}wp-env is already running${NC}"
    fi

    cd "$SCRIPT_DIR"
fi

echo ""
echo -e "${GREEN}========================================"
echo "Starting Development Servers"
echo -e "========================================${NC}"
echo ""

# Array to track PIDs
declare -a PIDS=()

# Function to run a dev server with colored prefix
run_server() {
    local name="$1"
    local dir="$2"
    local cmd="$3"
    local color="$4"

    echo -e "${color}Starting ${name}...${NC}"
    cd "$dir"
    $cmd 2>&1 | sed "s/^/${color}[${name}]${NC} /" &
    PIDS+=($!)
    cd "$SCRIPT_DIR"
}

# Start Gutenberg dev server
run_server "Gutenberg" "$SCRIPT_DIR/gutenberg" "npm run dev" "$BLUE"

# Start plugin dev servers
# Find all plugins with package.json and a start script
for plugin_dir in "$SCRIPT_DIR/plugins"/*/; do
    if [ -f "$plugin_dir/package.json" ]; then
        plugin_name=$(basename "$plugin_dir")

        # Check if the plugin has a start script
        if grep -q '"start"' "$plugin_dir/package.json" 2>/dev/null; then
            # Check if node_modules exists
            if [ ! -d "$plugin_dir/node_modules" ]; then
                echo -e "${YELLOW}Installing dependencies for ${plugin_name}...${NC}"
                cd "$plugin_dir"
                npm install
                cd "$SCRIPT_DIR"
            fi

            run_server "$plugin_name" "$plugin_dir" "npm run start" "$CYAN"
        fi
    fi
done

# Start Calypso if requested
if [ "$START_CALYPSO" = true ]; then
    if [ -d "$SCRIPT_DIR/calypso" ]; then
        run_server "Calypso" "$SCRIPT_DIR/calypso" "yarn start:debug" "$MAGENTA"
    else
        echo -e "${RED}Warning: Calypso directory not found. Run setup.sh --with-calypso first.${NC}"
    fi
fi

echo ""
echo -e "${GREEN}========================================"
echo "All servers started!"
echo -e "========================================${NC}"
echo ""
echo "WordPress: http://localhost:8888"
echo "Admin:     http://localhost:8888/wp-admin (admin/password)"
if [ "$START_CALYPSO" = true ] && [ -d "$SCRIPT_DIR/calypso" ]; then
    echo "Calypso:   http://calypso.localhost:3000"
fi
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo ""

# Wait for all background processes
wait
