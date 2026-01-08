# WordPress Gutenberg Playground

A development environment for prototyping WordPress plugins and testing changes to WordPress core and Gutenberg. Create plugins to explore concepts, then modify core or Gutenberg as needed—all in one easy-to-run monorepo.

## Features

- **Prototype plugins quickly** — Create plugins in `plugins/` to explore concepts and ideas
- **Modify WordPress core** — Custom changes in `wordpress-develop/`
- **Modify Gutenberg** — Custom plugin changes in `gutenberg/`
- **Develop with Calypso** — Optional WP-Calypso integration for WordPress.com admin development
- **Pre-configured wp-env** — Everything linked together, ready to run
- Example plugin (`reading-time-estimator/`) demonstrating modern WordPress patterns

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (running)
- [Node.js](https://nodejs.org/) (LTS version recommended, v18+)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/) (required for Calypso, installed via corepack if missing)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/wordpress-gutenberg-playground.git
cd wordpress-gutenberg-playground

# Run the setup script
./setup.sh

# Or include Calypso (for WordPress.com admin development)
./setup.sh --with-calypso
```

Or manually:

```bash
# Install Gutenberg dependencies
cd gutenberg
npm install

# Build Gutenberg
npm run build

# Start the environment
npm run wp-env start
```

## Access

Once running:

- **WordPress site**: http://localhost:8888
- **WordPress admin**: http://localhost:8888/wp-admin
- **Username**: `admin`
- **Password**: `password`

## Project Structure

```
wordpress-gutenberg-playground/
├── gutenberg/              # Gutenberg plugin (separate git repo)
├── wordpress-develop/      # WordPress core (separate git repo, forked)
├── calypso/                # WP-Calypso (separate git repo, optional)
├── plugins/                # Custom prototype plugins
│   └── reading-time-estimator/  # Example plugin
├── docs/                   # Custom documentation
├── setup.sh                # Initial setup script
├── dev.sh                  # Run all dev servers
├── update-repos.sh         # Pull latest from all repos
├── PLUGIN-SETUP.md         # Guide for creating plugins
└── README.md
```

The main repos (`gutenberg/`, `wordpress-develop/`, `calypso/`) are **separate git repositories** cloned into this directory. They're listed in `.gitignore` and not tracked by the monorepo.

## Development Workflow

### Starting Development

The easiest way to start developing is with the `dev.sh` script, which runs all dev servers concurrently:

```bash
./dev.sh                    # Start Gutenberg + all plugins
./dev.sh --with-calypso     # Also start Calypso
./dev.sh --stop             # Stop all servers and wp-env
```

This auto-detects plugins in `plugins/`, installs missing dependencies, and provides colored output with prefixes for each server. Press Ctrl+C to stop all servers.

### Manual Control

From the `gutenberg/` directory:

```bash
npm run wp-env start        # Start the WordPress environment
npm run wp-env stop         # Stop the environment
npm run dev                 # Start Gutenberg dev server only
```

### Rebuilding After Changes

For Gutenberg JavaScript/React changes:

```bash
cd gutenberg
npm run build
# Or for continuous rebuilding during development:
npm run dev
```

For WordPress PHP changes, no rebuild is needed - changes are reflected immediately.

### Accessing WP-CLI

```bash
cd gutenberg
npm run wp-env run cli wp <command>
```

## Creating Plugins

This playground is designed for quickly spinning up plugins to explore concepts and prototype ideas. Plugins live in the `plugins/` directory and are mapped into WordPress via `gutenberg/.wp-env.override.json`.

**Quick start:**

```bash
# 1. Create plugin directory with main file
mkdir plugins/my-plugin
cat > plugins/my-plugin/my-plugin.php << 'EOF'
<?php
/**
 * Plugin Name: My Plugin
 * Description: A quick prototype.
 */
EOF

# 2. Add to gutenberg/.wp-env.override.json mappings:
#    "wp-content/plugins/my-plugin": "../plugins/my-plugin"

# 3. Restart wp-env and activate
cd gutenberg
npm run wp-env stop && npm run wp-env start
npm run wp-env run cli wp plugin activate my-plugin
```

For plugins with React-based admin UIs using `@wordpress/components`, see the complete guide in **[PLUGIN-SETUP.md](PLUGIN-SETUP.md)**.

The `plugins/reading-time-estimator/` directory contains a full reference implementation demonstrating modern WordPress plugin patterns.

## WP-Calypso Integration

[WP-Calypso](https://github.com/Automattic/wp-calypso) is the React-based admin interface that powers WordPress.com. This playground optionally includes Calypso for developers working on the WordPress.com admin experience.

### Why Include Calypso?

- **Test Dashboard changes** — Develop WordPress.com Dashboard features alongside core WordPress changes
- **Unified environment** — Run Calypso, Gutenberg, and WordPress core together
- **Cross-project prototyping** — Useful for Automattic developers working across the ecosystem

### Setting Up Calypso

```bash
# During initial setup
./setup.sh --with-calypso

# Or add to existing setup
git clone https://github.com/Automattic/wp-calypso.git calypso
cd calypso && yarn install
```

**Required:** Add `calypso.localhost` to your hosts file:

```bash
sudo sh -c 'echo "127.0.0.1 calypso.localhost" >> /etc/hosts'
```

### Running Calypso

```bash
# With dev.sh (recommended)
./dev.sh --with-calypso

# Or manually
cd calypso && yarn start:debug
```

Access Calypso at: http://calypso.localhost:3000

**Note:** Calypso uses `yarn start:debug` instead of `yarn start` due to webpack memory requirements.

## Custom Features

### Mock Data Seeding

Quickly populate your WordPress site with realistic mock content using the included seeding script:

```bash
./seed-mock-data.sh
```

**Features:**

- **Three site topics**: Small Band, Coffee Shop, or Local Organization — each with themed content
- **Configurable volume**: Small (5 posts), Medium (15 posts), or Large (30 posts)
- **Complete content**: Creates pages, posts, comments, and featured images
- **Reset option**: Clear all existing content before generating new data

The script requires wp-env to be running. It uses WP-CLI to create content directly in WordPress.

**Example usage:**

1. Start wp-env: `cd gutenberg && npm run wp-env start`
2. Run the script: `./seed-mock-data.sh`
3. Choose a topic (e.g., "Coffee Shop")
4. Choose a volume (e.g., "Medium")
5. Confirm to generate content

To reset all content without generating new data, select "Reset all content" from the main menu.

## Configuration

The `wp-env` configuration in `gutenberg/.wp-env.override.json` maps:

- WordPress core from `wordpress-develop/build/`
- Custom plugins from `plugins/`

This allows WordPress core changes, Gutenberg changes, and prototype plugins to work together seamlessly.

## Troubleshooting

### Docker Issues

Make sure Docker Desktop is running before starting the environment.

```bash
# Check Docker is running
docker info
```

### Port Conflicts

If port 8888 is in use, you can modify the port in `gutenberg/.wp-env.json` or create a local override.

### Clean Restart

```bash
cd gutenberg
npm run wp-env destroy
npm run wp-env start
```

### Rebuild Everything

```bash
cd gutenberg
npm run wp-env clean all
npm install
npm run build
npm run wp-env start
```

## Syncing with Upstream

The repos in this monorepo are full git clones with remotes already configured. Use the update script to pull the latest changes:

```bash
./update-repos.sh              # Update all repos
./update-repos.sh gutenberg    # Update specific repo
./update-repos.sh calypso      # Update Calypso only
```

Or manually:

```bash
cd gutenberg && git pull origin trunk
cd wordpress-develop && git pull upstream trunk
cd calypso && git pull origin trunk
```

**Important:** Always pull before pushing to avoid conflicts with remote branches.

## License

The WordPress and Gutenberg code is licensed under GPL-2.0-or-later.
