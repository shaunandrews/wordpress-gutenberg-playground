# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo for testing paired changes to WordPress core and Gutenberg together. It contains:
- `wordpress-develop/` - WordPress core (separate git repo, cloned from fork)
- `gutenberg/` - Gutenberg plugin (separate git repo, cloned from official)
- `calypso/` - WP-Calypso (separate git repo, optional)
- `plugins/` - Custom example plugins for this playground

## Repository Structure

The main repos (`gutenberg/`, `wordpress-develop/`, `calypso/`) are **separate git repositories** cloned into this directory. They are listed in `.gitignore` and not tracked by the monorepo.

| Repo | Origin | Upstream | Push Access |
|------|--------|----------|-------------|
| `gutenberg/` | WordPress/gutenberg | - | Direct (contributor) |
| `wordpress-develop/` | shaunandrews/wordpress-develop | WordPress/wordpress-develop | Fork (PRs for review) |
| `calypso/` | Automattic/wp-calypso | - | Direct (Automattic) |

## Git Workflow

**IMPORTANT**: Before committing or pushing changes in any repo, always pull the latest changes first:

```bash
./update-repos.sh              # Update all repos
./update-repos.sh calypso      # Update specific repo
```

This prevents pushing branches that are behind the remote.

## Development Commands

All commands run from the `gutenberg/` directory unless noted.

### Quick Start

```bash
./setup.sh                    # First-time setup (clones repos, builds, starts wp-env)
./setup.sh --with-calypso     # Include Calypso setup
./dev.sh                      # Run all dev servers at once
./dev.sh --with-calypso       # Include Calypso dev server
./dev.sh --stop               # Stop all dev servers and wp-env
```

### Environment (requires Docker)
```bash
npm run wp-env start          # Start environment
npm run wp-env stop           # Stop environment
npm run wp-env destroy        # Full reset
```

Access: http://localhost:8888 (admin: `admin`/`password`)

### Development Servers

Run `./dev.sh` from the repo root to start all dev servers concurrently:
- Gutenberg (`npm run dev`)
- All plugins in `plugins/` that have a `start` script
- Calypso (optional, with `--with-calypso` flag)

The script auto-detects plugins, installs missing dependencies, and provides colored output with prefixes for each server. Press Ctrl+C to stop all servers.

### Building

**Gutenberg** (from `gutenberg/`):
```bash
npm install                   # Install dependencies
npm run build                 # Production build
npm run dev                   # Development with watch
```

**WordPress Core** (from `wordpress-develop/`):
```bash
npm install                   # Install dependencies
npm run build                 # Build to wordpress-develop/build/
```

### Testing

**JavaScript** (from `gutenberg/`):
```bash
npm run test:unit                                    # All unit tests
npm run test:unit -- --testNamePattern="<TestName>" # Specific test
npm run test:unit <path_to_test_directory>          # Directory
```

**PHP (requires wp-env running):**
```bash
vendor/bin/phpunit <path_to_test_file.php>          # Specific file
vendor/bin/phpunit <path_to_test_directory>/        # Directory
```

**E2E (requires wp-env running):**
```bash
npm run test:e2e                                    # All E2E tests
npm run test:e2e -- <path_to_test_file.spec.js>    # Specific test
npm run test:e2e -- --headed                        # With browser visible
```

### Linting/Formatting
```bash
npm run format                # Fix JS formatting
npm run lint:js               # Check JS linting
vendor/bin/phpcbf <file.php>  # Fix PHP standards
vendor/bin/phpcs              # Check PHP standards
```

## Key Directories

- `/plugins/` - Custom example plugins for this playground
- `/gutenberg/packages/` - Gutenberg JavaScript packages (each has README.md)
- `/gutenberg/lib/` - Gutenberg PHP code
- `/gutenberg/lib/compat/wordpress-X.Y/` - Version-specific features
- `/wordpress-develop/src/` - WordPress core source
- `/wordpress-develop/build/` - Built WordPress (used by wp-env)
- `/calypso/client/` - Calypso React application source
- `/calypso/packages/` - Calypso shared packages

## Architecture

### wp-env Configuration

The wp-env setup uses configuration files to map local directories into the WordPress Docker environment:

- **Main config**: `gutenberg/.wp-env.json` - Base configuration
- **Override config**: `gutenberg/.wp-env.override.json` - Custom mappings

The override file maps WordPress core from the **build** directory and custom plugins:

```json
{
  "core": "../wordpress-develop/build",
  "mappings": {
    "wp-content/plugins/gutenberg-experiments-page": "../plugins/gutenberg-experiments-page",
    "wp-content/plugins/modern-reading-settings": "../plugins/modern-reading-settings",
    "wp-content/plugins/reading-time-estimator": "../plugins/reading-time-estimator"
  }
}
```

**Important**: After modifying `.wp-env.override.json`, you must restart wp-env:
```bash
cd gutenberg
npm run wp-env stop
npm run wp-env start
```

**WordPress Core changes**: Edit files in `wordpress-develop/src/`, then run `npm run build` in `wordpress-develop/`. Changes appear after rebuild.

**Gutenberg JS/React changes**: Run `npm run build` or `npm run dev` for auto-rebuild.

### Adding Custom Plugins

Custom plugins live in the `plugins/` directory at the repo root. To add a new plugin:

1. Create your plugin directory in `plugins/` (e.g., `plugins/my-plugin/`)
2. Add mapping to `gutenberg/.wp-env.override.json`:
   ```json
   "wp-content/plugins/my-plugin": "../plugins/my-plugin"
   ```
3. Restart wp-env (see above)
4. Activate via WP-CLI: `npm run wp-env run cli wp plugin activate my-plugin`

### WP-CLI Commands

Run WordPress CLI commands from the `gutenberg/` directory:

```bash
npm run wp-env run cli wp plugin list              # List all plugins
npm run wp-env run cli wp plugin activate <name>   # Activate a plugin
npm run wp-env run cli wp post list                # List posts
npm run wp-env run cli wp option get <name>        # Get option value
```

## Example Plugin: Reading Time Estimator

Located at `plugins/reading-time-estimator/`, this is a complete example WordPress plugin demonstrating:

- **Modern WordPress Components**: React-based admin UI using `@wordpress/components`
- **Design Tokens**: Proper use of WordPress CSS custom properties (`--wp-admin-theme-color`, `--wp-components-color-*`)
- **REST API**: Custom endpoints for settings management
- **Build System**: Uses `@wordpress/scripts` for compilation
- **Live Preview**: Interactive settings with real-time preview

### Building the Plugin

```bash
cd plugins/reading-time-estimator
npm install                   # Install dependencies
npm run build                 # Production build
npm run start                 # Development with watch
```

### Plugin Architecture

```
plugins/reading-time-estimator/
├── reading-time-estimator.php    # Main plugin file
├── includes/                      # PHP classes
│   ├── class-settings.php        # REST API & settings
│   └── class-reading-time.php    # Core functionality
├── admin/                         # Admin interface
│   ├── class-admin.php           # Menu & asset loading
│   └── settings-page.php         # React mount point
└── src/                          # React components
    ├── index.js                  # Entry point
    ├── SettingsPage.js           # Main component
    └── components/               # Individual settings
```

After building, the plugin is available at Settings > Reading Time in the WordPress admin.

## WP-Calypso

WP-Calypso is the React-based admin interface that powers WordPress.com. It's optional in this playground but useful for Automattic developers working on the WordPress.com Dashboard.

### Setup Requirements

Calypso requires:
- Yarn (installed via corepack if missing)
- `calypso.localhost` in `/etc/hosts`: `sudo sh -c 'echo "127.0.0.1 calypso.localhost" >> /etc/hosts'`

### Building Calypso

```bash
cd calypso
yarn install                  # Install dependencies (can take 5-15 minutes)
yarn start:debug              # Start dev server (uses less memory than yarn start)
```

Access: http://calypso.localhost:3000

### Key Calypso Paths

- `/calypso/client/` - Main React application
- `/calypso/client/my-sites/` - Site management sections
- `/calypso/client/components/` - Shared React components
- `/calypso/packages/` - Shared packages (design system, utilities)

### Calypso Development Notes

- Use `yarn start:debug` instead of `yarn start` due to webpack memory requirements
- Calypso uses its own component library, not `@wordpress/components`
- The `./dev.sh --with-calypso` script handles starting Calypso alongside other dev servers
