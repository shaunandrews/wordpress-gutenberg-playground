# WordPress Gutenberg Playground

A development environment for prototyping WordPress plugins and testing changes to WordPress core and Gutenberg. Create plugins to explore concepts, then modify core or Gutenberg as needed—all in one easy-to-run monorepo.

## Features

- **Prototype plugins quickly** — Create plugins at the repo root to explore concepts and ideas
- **Modify WordPress core** — Custom changes in `wordpress-develop/`
- **Modify Gutenberg** — Custom plugin changes in `gutenberg/`
- **Pre-configured wp-env** — Everything linked together, ready to run
- Example plugin (`reading-time-estimator/`) demonstrating modern WordPress patterns

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (running)
- [Node.js](https://nodejs.org/) (LTS version recommended, v18+)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/wordpress-gutenberg-playground.git
cd wordpress-gutenberg-playground

# Run the setup script
./setup.sh
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
├── gutenberg/              # Gutenberg plugin (with custom changes)
├── wordpress-develop/      # WordPress core (with custom changes)
├── reading-time-estimator/ # Example plugin (reference implementation)
├── docs/                   # Custom documentation
├── setup.sh                # Setup script
├── PLUGIN-SETUP.md         # Guide for creating plugins
└── README.md
```

## Development Workflow

### Starting the Environment

From the `gutenberg/` directory:

```bash
npm run wp-env start
```

### Stopping the Environment

```bash
npm run wp-env stop
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

This playground is designed for quickly spinning up plugins to explore concepts and prototype ideas. Plugins live at the repo root and are mapped into WordPress via `gutenberg/.wp-env.override.json`.

**Quick start:**

```bash
# 1. Create plugin directory with main file
mkdir my-plugin
cat > my-plugin/my-plugin.php << 'EOF'
<?php
/**
 * Plugin Name: My Plugin
 * Description: A quick prototype.
 */
EOF

# 2. Add to gutenberg/.wp-env.override.json mappings:
#    "wp-content/plugins/my-plugin": "../my-plugin"

# 3. Restart wp-env and activate
cd gutenberg
npm run wp-env stop && npm run wp-env start
npm run wp-env run cli wp plugin activate my-plugin
```

For plugins with React-based admin UIs using `@wordpress/components`, see the complete guide in **[PLUGIN-SETUP.md](PLUGIN-SETUP.md)**.

The `reading-time-estimator/` directory contains a full reference implementation demonstrating modern WordPress plugin patterns.

## Custom Features

### Writing Guidance Settings

This playground includes a custom feature that adds two new fields to **Settings > Writing**:

- **Expectations**: Guidelines for how content should be written
- **Goals**: What the site's content should achieve

These are exposed via the REST API at `/wp-json/wp/v2/settings`.

See [docs/writing-guidance-settings.md](docs/writing-guidance-settings.md) for details.

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

- WordPress core source from `wordpress-develop/src`
- Gutenberg plugin from `gutenberg/`
- Custom plugins from the repo root

This allows custom WordPress core changes, Gutenberg changes, and prototype plugins to work together.

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

This monorepo contains flattened copies of WordPress and Gutenberg. To sync with upstream changes:

### Gutenberg

```bash
# Add upstream as a remote temporarily
cd gutenberg
git init
git remote add upstream https://github.com/WordPress/gutenberg.git
git fetch upstream trunk

# Review and apply changes
git diff upstream/trunk -- .

# Or cherry-pick specific commits
git cherry-pick <commit-hash>

# Clean up
rm -rf .git
```

### WordPress Core

```bash
cd wordpress-develop
git init
git remote add upstream https://github.com/WordPress/wordpress-develop.git
git fetch upstream trunk

# Review and apply changes
git diff upstream/trunk -- .

# Clean up
rm -rf .git
```

## License

The WordPress and Gutenberg code is licensed under GPL-2.0-or-later.
