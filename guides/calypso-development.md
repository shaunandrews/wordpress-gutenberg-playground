# Developing with WP-Calypso

This guide explains how to set up and develop with WP-Calypso, Automattic's React-powered WordPress.com frontend. Calypso runs alongside WordPress Core and Gutenberg in this playground.

## What is Calypso?

Calypso is the modern JavaScript-based interface for WordPress.com. Key facts:

- **Standalone React app**: Not a WordPress plugin - it's a separate single-page application
- **Connects to WordPress.com**: Talks to `public-api.wordpress.com`, not your local WordPress
- **Requires WordPress.com auth**: You need a WordPress.com account to use it
- **For sandbox testing**: Automattic employees can connect to their developer sandbox

## Prerequisites

Before starting, ensure you have:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | 22.9.0 | `node --version` |
| Yarn | 4.x | `yarn --version` |
| Git | 2.x+ | `git --version` |
| Docker | 20.x+ | `docker --version` |

### Node Version Management

Calypso requires Node 22.9.0, while Gutenberg uses Node 20.x. Use a version manager to switch between them.

**Using Volta (recommended for this repo):**

```bash
# Volta automatically switches versions based on package.json
volta install node@22.9.0
```

**Using nvm:**

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.zshrc

# Install Node for Calypso
nvm install 22.9.0

# Switch to Calypso's Node version
cd calypso && nvm use
```

### Hosts File Configuration

Calypso must run on `calypso.localhost` - authentication fails on any other domain.

```bash
# Add to /etc/hosts (requires sudo)
sudo sh -c 'echo "127.0.0.1 calypso.localhost" >> /etc/hosts'

# Verify
ping -c 1 calypso.localhost
# Should show "64 bytes from 127.0.0.1"
```

---

## Setup

### 1. Clone the Repository

```bash
cd /Users/shaun/Developer/Projects/wordpress-gutenberg-playground
git clone https://github.com/Automattic/wp-calypso.git calypso
```

### 2. Install Dependencies

```bash
cd calypso
yarn install
```

This takes 5-15 minutes on first run. If the postinstall script fails with TypeScript errors, try:

```bash
yarn install --mode=skip-build
yarn run build-packages
```

### 3. Start the Development Server

**Important:** Calypso's webpack build requires more memory than Node's default heap size.

```bash
# Recommended - uses 6GB heap
yarn start:debug

# Alternative - manually set heap size
NODE_OPTIONS='--max-old-space-size=8192' yarn start
```

Wait for "Server running at http://calypso.localhost:3000" (first build takes 3-5 minutes).

### 4. Access and Authenticate

1. Open http://calypso.localhost:3000
2. Log in with your WordPress.com credentials
3. Your sites/sandbox should appear after authentication

---

## Development Commands

All commands run from the `calypso/` directory.

### Starting Development

| Command | Description |
|---------|-------------|
| `yarn start:debug` | Start with 6GB heap (recommended) |
| `yarn start` | Start (may need `NODE_OPTIONS`) |
| `SECTION_LIMIT=reader yarn start` | Build only specific section (faster, less memory) |
| `yarn storybook:start` | Start Storybook component library (port 6006) |

### Building

| Command | Description |
|---------|-------------|
| `yarn build` | Production build |
| `yarn build-packages` | Build internal packages only |
| `yarn run distclean` | Clean all build artifacts |

### Testing

| Command | Description |
|---------|-------------|
| `yarn test-client` | Client-side unit tests |
| `yarn test-client:watch` | Client tests in watch mode |
| `yarn test-client <filename>` | Test specific file |

### Code Quality

| Command | Description |
|---------|-------------|
| `yarn lint` | Run all linters |
| `yarn lint:js` | JavaScript/TypeScript linting |
| `yarn typecheck` | TypeScript type checking |
| `yarn format` | Auto-format code |

---

## Architecture Overview

### Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18+ |
| State | Redux + Redux Toolkit |
| Routing | React Router / page.js |
| Styling | Sass/SCSS + CSS Modules |
| Bundler | Webpack 5 |
| Server | Express.js (SSR) |
| Types | TypeScript (partial) |

### Key Directories

```
calypso/
├── client/                    # Main React application
│   ├── boot/                  # App initialization
│   ├── components/            # Shared React components
│   ├── layout/                # Page layouts
│   ├── my-sites/              # Site management views
│   ├── reader/                # Reader feature
│   └── state/                 # Redux state management
├── packages/                  # Internal shared packages
│   ├── calypso-products/
│   ├── components/
│   └── ...
├── server/                    # Express server for SSR
├── apps/                      # Standalone applications
└── docs/                      # Documentation
```

### Data Flow

```
User Action → React Component → Redux Action → API Call → Redux Reducer → Component Update
                                     ↓
                           WordPress.com REST API
                           (public-api.wordpress.com)
```

---

## Code Conventions

Calypso follows specific conventions documented in `.rules/` files:

### React Components

```javascript
// Use @wordpress/element instead of React directly
import { useState, useEffect } from '@wordpress/element';

// Use clsx for class names (not classnames)
import clsx from 'clsx';

// Use i18n-calypso for translations
import { useTranslate } from 'i18n-calypso';
```

### Styling

```scss
// Write full class names (no BEM shortcuts like &__ or &--)
.my-component {
    // ...
}

.my-component__title {
    // ...
}

// Use RTL-friendly properties
margin-inline-start: 16px;  // not margin-left
padding-inline-end: 8px;    // not padding-right
```

### State Management

```javascript
// Use @wordpress/data patterns
import { useSelect, useDispatch } from '@wordpress/data';

// Common stores
import { store as coreStore } from '@wordpress/core-data';
```

---

## Full-Stack Development

### Running All Three Environments

You may want to run WordPress, Gutenberg, and Calypso together:

| Terminal | Directory | Command | Port |
|----------|-----------|---------|------|
| 1 | `gutenberg/` | `npm run wp-env start` | 8888 |
| 2 | `gutenberg/` | `npm run dev` | - |
| 3 | `calypso/` | `yarn start:debug` | 3000 |

**Resource usage:** Running all three requires ~4-6 GB RAM. Use `SECTION_LIMIT` with Calypso to reduce memory.

### When Do You Need What?

| Scenario | WordPress | Gutenberg | Calypso |
|----------|:---------:|:---------:|:-------:|
| Gutenberg blocks | Yes | Yes | No |
| WordPress Core PHP | Yes | No | No |
| Calypso UI | No | No | Yes |
| Testing integration | Yes | Yes | Yes |

---

## Development URLs

| URL | What It Is |
|-----|------------|
| http://localhost:8888 | Local WordPress (wp-env) |
| http://localhost:8888/wp-admin | Local WordPress admin |
| http://calypso.localhost:3000 | Calypso development |
| http://localhost:6006 | Calypso Storybook |

---

## Troubleshooting

### JavaScript Heap Out of Memory

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Fix:** Use `yarn start:debug` or set `NODE_OPTIONS`:

```bash
NODE_OPTIONS='--max-old-space-size=8192' yarn start
```

### Wrong Node Version

```
error engine Unsupported engine
```

**Fix:** Switch to the correct Node version:

```bash
# With Volta
volta install node@22.9.0

# With nvm
nvm use
```

### Only Big "W" Logo Displays

JavaScript failed to load or compile.

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Try `yarn run distclean && yarn install && yarn start:debug`

### Authentication Errors

```
Active Access Token Must Be Used
```

**Fix:**
1. Go to https://wordpress.com and log in
2. Return to http://calypso.localhost:3000
3. Ensure third-party cookies are allowed for `public-api.wordpress.com`

### TypeScript Errors During Install

```
Cannot find module '@automattic/viewport'
```

**Fix:** Build packages separately:

```bash
yarn install --mode=skip-build
yarn run build-packages
```

### baseline-browser-mapping Warning

```
[baseline-browser-mapping] The data in this module is over two months old.
```

**This is harmless.** Just a warning about outdated browser data - doesn't affect functionality.

---

## Faster Development

### Section-Limited Builds

Building only what you need reduces memory and build time:

```bash
# Build only Reader section
SECTION_LIMIT=reader yarn start

# Build multiple sections
SECTION_LIMIT=reader,my-sites yarn start
```

### Storybook for Components

Use Storybook to develop components in isolation:

```bash
yarn storybook:start
# Opens http://localhost:6006
```

---

## Further Reading

- [Calypso Documentation](./calypso/docs/) - Internal docs
- [WordPress.com Developer Resources](https://developer.wordpress.com/)
- [Automattic Field Guide](https://fieldguide.automattic.com/) (Automattic employees)
