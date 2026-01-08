# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a monorepo for testing paired changes to WordPress core and Gutenberg together. It contains:
- `wordpress-develop/` - WordPress core (with custom changes)
- `gutenberg/` - Gutenberg plugin (with custom changes)
- `wp-env/` - Configuration linking both together

The custom "Writing Guidance" feature adds settings to Settings > Writing for content expectations and goals, exposed via REST API at `/wp-json/wp/v2/settings`.

## Development Commands

All commands run from the `gutenberg/` directory unless noted.

### Quick Start

```bash
./setup.sh                    # First-time setup (install deps, build, start wp-env)
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
```bash
npm install                   # Install dependencies
npm run build                 # Production build
npm run dev                   # Development with watch
```

### Testing

**JavaScript:**
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
- `/packages/` - Gutenberg JavaScript packages (each has README.md)
- `/lib/` - Gutenberg PHP code
- `/lib/compat/wordpress-X.Y/` - Version-specific features (new PHP features go here)
- `/phpunit/` - PHP tests
- `/docs/` - Documentation

## Architecture

### wp-env Configuration

The wp-env setup uses configuration files to map local directories into the WordPress Docker environment:

- **Main config**: `gutenberg/.wp-env.json` - Base configuration
- **Override config**: `gutenberg/.wp-env.override.json` - Custom mappings (IMPORTANT: must be in `gutenberg/` directory, not `wp-env/`)

The override file maps WordPress core from `wordpress-develop/src` and allows adding custom plugins:

```json
{
  "core": "../wordpress-develop/src",
  "mappings": {
    "wp-content/plugins/gutenberg": "../gutenberg",
    "wp-content/plugins/your-plugin": "../your-plugin"
  }
}
```

**Important**: After modifying `.wp-env.override.json`, you must restart wp-env:
```bash
cd gutenberg
npm run wp-env stop
npm run wp-env start
```

WordPress PHP changes take effect immediately. Gutenberg JS/React changes require `npm run build` or running `npm run dev` for auto-rebuild.

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

## Custom Feature: Writing Guidance

Files modified in `wordpress-develop/src/`:
- `wp-admin/options-writing.php` - UI with textarea fields
- `wp-admin/options.php` - Options allowlist
- `wp-includes/option.php` - Registration with REST API exposure

Options: `wp_writing_guidance_expectations`, `wp_writing_guidance_goals`

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
