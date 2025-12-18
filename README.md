# WordPress Gutenberg Playground

A development environment for testing paired changes to WordPress core and Gutenberg together. Both repositories are included as subdirectories in a single monorepo, making it easy to clone and run locally.

## Features

- Custom WordPress core changes in `wordpress-develop/`
- Custom Gutenberg plugin changes in `gutenberg/`
- Pre-configured `wp-env` setup that links both together
- Writing Guidance settings feature (adds content expectations/goals to Settings > Writing)

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
├── wp-env/                 # wp-env configuration
│   └── .wp-env.override.json
├── docs/                   # Custom documentation
├── setup.sh                # Setup script
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

## Custom Features

### Writing Guidance Settings

This playground includes a custom feature that adds two new fields to **Settings > Writing**:

- **Expectations**: Guidelines for how content should be written
- **Goals**: What the site's content should achieve

These are exposed via the REST API at `/wp-json/wp/v2/settings`.

See [docs/writing-guidance-settings.md](docs/writing-guidance-settings.md) for details.

## Configuration

The `wp-env` configuration in `wp-env/.wp-env.override.json` maps:

- WordPress core source from `wordpress-develop/src`
- Gutenberg plugin from `gutenberg/`

This allows both custom WordPress core changes and Gutenberg changes to work together.

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
