---
name: gutenberg
description: "Develop, contribute to, and extend the WordPress Gutenberg block editor. Use when working on: (1) Setting up a Gutenberg development environment, (2) Creating custom blocks, (3) Contributing code or design to the Gutenberg repository, (4) Using @wordpress packages, (5) Writing tests for Gutenberg, (6) Working with block.json, theme.json, or the Block API, (7) Building with the WordPress data layer (@wordpress/data), or (8) Extending the block editor."
---

# Gutenberg Development

Gutenberg is the WordPress block editor, a modular approach to content creation where every piece of content is a block.

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm ci` |
| Development build | `npm run dev` |
| Production build | `npm run build` |
| Start local env | `npm run wp-env start` |
| Stop local env | `npm run wp-env stop` |
| Run unit tests | `npm run test:unit` |
| Run e2e tests | `npm run test:e2e` |
| Launch Storybook | `npm run storybook:dev` |
| Lint JS | `npm run lint:js` |
| Lint CSS | `npm run lint:css` |
| Build plugin zip | `npm run build:plugin-zip` |

## Environment Setup

### Prerequisites

- **Node.js v20+** with npm v10 (use [nvm](https://github.com/nvm-sh/nvm) to manage versions)
- **Git** for source control
- **Docker Desktop** for wp-env local environment
- **Python** (required by some npm install scripts)

### Getting Started

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/gutenberg.git
cd gutenberg
git remote add upstream https://github.com/WordPress/gutenberg.git

# Install and build
npm ci
npm run dev  # or npm run build for production
```

### Local WordPress with wp-env

wp-env creates a Docker-based WordPress environment with Gutenberg mounted:

```bash
npm run wp-env start     # Start (http://localhost:8888, admin/password)
npm run wp-env stop      # Stop
npm run wp-env destroy   # Remove completely
```

Access phpMyAdmin at `http://localhost:9000/`.

## Project Structure

```
gutenberg/
├── packages/           # @wordpress npm packages (70+)
│   ├── block-editor/   # Block editor UI and logic
│   ├── blocks/         # Block registration and parsing
│   ├── components/     # Reusable UI components
│   ├── data/           # State management
│   ├── scripts/        # Build tools (wp-scripts)
│   └── ...
├── lib/                # PHP library code
├── docs/               # Documentation
├── test/               # Test utilities
└── phpunit/            # PHP unit tests
```

## Creating Custom Blocks

### Scaffold a New Block

```bash
npx @wordpress/create-block my-block
cd my-block
npm start
```

### Block Structure

```
my-block/
├── block.json          # Block metadata (name, attributes, supports)
├── edit.js             # Editor component
├── save.js             # Frontend render (or null for dynamic)
├── index.js            # Registration
├── style.scss          # Frontend + editor styles
└── editor.scss         # Editor-only styles
```

### block.json Example

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "my-plugin/my-block",
  "title": "My Block",
  "category": "widgets",
  "icon": "smiley",
  "description": "A custom block",
  "supports": {
    "html": false,
    "color": { "background": true, "text": true },
    "spacing": { "margin": true, "padding": true }
  },
  "textdomain": "my-block",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

### Edit Component Pattern

```jsx
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  
  return (
    <div {...blockProps}>
      <RichText
        tagName="p"
        value={attributes.content}
        onChange={(content) => setAttributes({ content })}
        placeholder={__('Enter text...', 'my-block')}
      />
    </div>
  );
}
```

## Key Packages

| Package | Purpose |
|---------|---------|
| `@wordpress/block-editor` | Block editor components (RichText, InnerBlocks, InspectorControls) |
| `@wordpress/blocks` | Block registration, parsing, serialization |
| `@wordpress/components` | UI primitives (Button, TextControl, Panel) |
| `@wordpress/data` | State management (stores, selectors, actions) |
| `@wordpress/element` | React abstraction layer |
| `@wordpress/i18n` | Internationalization |
| `@wordpress/scripts` | Build configuration (wp-scripts) |
| `@wordpress/env` | Local development environment |
| `@wordpress/hooks` | Filter and action system |
| `@wordpress/api-fetch` | REST API requests |

## Data Layer (@wordpress/data)

### Using Selectors

```jsx
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

function MyComponent() {
  const posts = useSelect((select) => {
    return select(coreStore).getEntityRecords('postType', 'post', { per_page: 5 });
  }, []);
  
  return posts ? <PostList posts={posts} /> : <Spinner />;
}
```

### Using Actions

```jsx
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

function SaveButton() {
  const { createSuccessNotice } = useDispatch(noticesStore);
  
  return (
    <Button onClick={() => createSuccessNotice('Saved!')}>
      Save
    </Button>
  );
}
```

## Testing

### Unit Tests (Jest)

```bash
npm run test:unit                    # Run all
npm run test:unit -- path/to/test    # Run specific
npm run test:unit -- --watch         # Watch mode
```

### E2E Tests (Playwright)

```bash
npm run test:e2e                     # Run all
npm run test:e2e -- path/to/spec     # Run specific
npm run test:e2e:debug               # Debug mode
```

### PHP Tests

```bash
npm run test:php                     # Via wp-env
composer run test                    # Direct phpunit
```

## Code Quality

### ESLint & Prettier

Configured via `.eslintrc.js` and `.prettierrc.js`. VS Code settings:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

### TypeScript

Gutenberg uses JSDoc for type checking. Types are validated via `npm run build:package-types`.

## Git Workflow

```bash
# Keep fork updated
git fetch upstream
git checkout trunk
git merge upstream/trunk

# Feature branch
git checkout -b fix/issue-description

# Commit with conventional format
git commit -m "Block Editor: Fix alignment issue in toolbar"

# Push and create PR
git push origin fix/issue-description
```

### Commit Message Format

```
Component: Brief description

Longer explanation if needed.

Fixes #12345
```

Components: Block Editor, Components, Data, Scripts, etc.

## Contributing

### Code Contributions

1. Find issues labeled `Good First Issue` or `Help Wanted`
2. Comment on the issue to claim it
3. Fork, branch, implement, test
4. Submit PR with description and screenshots if UI change
5. Address review feedback

### Design Contributions

- Join `#design` on [Make WordPress Slack](https://make.wordpress.org/chat)
- Look for issues labeled `Needs Design` or `Needs Design Feedback`
- The team uses [Figma](https://www.figma.com/) for collaboration

## Resources

- **Block Editor Handbook**: https://developer.wordpress.org/block-editor/
- **Component Storybook**: https://wordpress.github.io/gutenberg/
- **GitHub Repository**: https://github.com/WordPress/gutenberg
- **Make WordPress Core**: https://make.wordpress.org/core/
- **Slack**: `#core-editor` on Make WordPress Slack
