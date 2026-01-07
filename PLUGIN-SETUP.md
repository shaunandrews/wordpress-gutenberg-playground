# Creating Plugins in this Playground

This playground makes it easy to create WordPress plugins for exploring concepts and prototyping new ideas. Plugins live at the repo root and are automatically mapped into the WordPress environment.

## Quick Start: Create a New Plugin

### 1. Create the Plugin Directory

```bash
mkdir my-plugin
cd my-plugin
```

### 2. Create the Main Plugin File

Create `my-plugin.php`:

```php
<?php
/**
 * Plugin Name: My Plugin
 * Description: A quick prototype plugin.
 * Version: 1.0.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Your plugin code here.
```

### 3. Map the Plugin to wp-env

Edit `gutenberg/.wp-env.override.json` and add your plugin to the mappings:

```json
{
  "core": "../wordpress-develop/src",
  "mappings": {
    "wp-content/plugins/gutenberg": "../gutenberg",
    "wp-content/plugins/my-plugin": "../my-plugin"
  }
}
```

### 4. Restart wp-env

```bash
cd gutenberg
npm run wp-env stop
npm run wp-env start
```

### 5. Activate the Plugin

```bash
npm run wp-env run cli wp plugin activate my-plugin
```

Or activate via **Plugins** in the WordPress admin (http://localhost:8888/wp-admin).

---

## Adding React-Based Admin UI

For plugins with modern admin interfaces using `@wordpress/components`:

### 1. Initialize npm and Install Dependencies

```bash
cd my-plugin
npm init -y
npm install @wordpress/scripts --save-dev
npm install @wordpress/element @wordpress/components @wordpress/api-fetch @wordpress/i18n
```

### 2. Add Build Scripts to package.json

```json
{
  "scripts": {
    "build": "wp-scripts build",
    "start": "wp-scripts start"
  }
}
```

### 3. Create the React Entry Point

Create `src/index.js`:

```javascript
import { render } from '@wordpress/element';
import { Card, CardBody, Button } from '@wordpress/components';

function App() {
    return (
        <Card>
            <CardBody>
                <h2>My Plugin Settings</h2>
                <Button variant="primary">Save</Button>
            </CardBody>
        </Card>
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('my-plugin-root');
    if (root) {
        render(<App />, root);
    }
});
```

### 4. Enqueue the Script in PHP

Add to your main plugin file:

```php
add_action('admin_menu', function() {
    add_options_page(
        'My Plugin',
        'My Plugin',
        'manage_options',
        'my-plugin',
        function() {
            echo '<div class="wrap"><div id="my-plugin-root"></div></div>';
        }
    );
});

add_action('admin_enqueue_scripts', function($hook) {
    if ('settings_page_my-plugin' !== $hook) {
        return;
    }

    $asset_file = plugin_dir_path(__FILE__) . 'build/index.asset.php';
    if (!file_exists($asset_file)) {
        return;
    }

    $asset = require $asset_file;

    wp_enqueue_style('wp-components');
    wp_enqueue_script(
        'my-plugin-admin',
        plugin_dir_url(__FILE__) . 'build/index.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
});
```

### 5. Build and Access

```bash
npm run build      # Production build
npm run start      # Development with auto-rebuild
```

Then visit **Settings > My Plugin** in the admin.

---

## Plugin Types by Complexity

### Minimal (PHP only)

For quick experiments that don't need a UI:

```
my-plugin/
└── my-plugin.php
```

### With Admin Settings (React)

For prototypes with modern WordPress-style settings pages:

```
my-plugin/
├── my-plugin.php
├── package.json
├── src/
│   └── index.js
└── build/           # Generated
```

### Full Plugin Structure

For more complete plugins (like the reading-time-estimator example):

```
my-plugin/
├── my-plugin.php           # Main plugin file
├── package.json
├── includes/               # PHP classes
│   └── class-settings.php  # REST API, settings logic
├── admin/                  # Admin interface
│   └── class-admin.php     # Menu & asset loading
├── src/                    # React components
│   ├── index.js
│   └── components/
└── build/                  # Generated
```

---

## Common Patterns

### REST API Endpoint

```php
add_action('rest_api_init', function() {
    register_rest_route('my-plugin/v1', '/settings', [
        'methods'  => 'GET',
        'callback' => function() {
            return get_option('my_plugin_settings', []);
        },
        'permission_callback' => function() {
            return current_user_can('manage_options');
        },
    ]);
});
```

### Fetch in React

```javascript
import apiFetch from '@wordpress/api-fetch';

const settings = await apiFetch({ path: '/my-plugin/v1/settings' });
```

### WordPress Components

Common components from `@wordpress/components`:

- **Layout**: `Card`, `Panel`, `PanelBody`, `Flex`, `FlexItem`
- **Forms**: `TextControl`, `SelectControl`, `ToggleControl`, `Button`
- **Feedback**: `Notice`, `Spinner`

Always use WordPress design tokens for styling:

```css
.my-component {
    color: var(--wp-components-color-foreground);
    background: var(--wp-components-color-background);
    border-color: var(--wp-admin-theme-color);
}
```

---

## Development Workflow

### PHP Changes

Take effect immediately—just refresh the page.

### JavaScript/React Changes

Require a rebuild:

```bash
cd my-plugin
npm run build        # One-time build
npm run start        # Watch mode (auto-rebuild)
```

### Checking Logs

```bash
# View WordPress debug log
cd gutenberg
npm run wp-env run cli cat /var/www/html/wp-content/debug.log

# Enable debug mode (add to wp-config.php via wp-env)
npm run wp-env run cli wp config set WP_DEBUG true --raw
npm run wp-env run cli wp config set WP_DEBUG_LOG true --raw
```

---

## Reference Example

The `reading-time-estimator/` plugin is a complete example demonstrating:

- ✅ Modern React admin UI with `@wordpress/components`
- ✅ REST API integration for settings
- ✅ WordPress design tokens
- ✅ Live preview functionality
- ✅ Clean plugin architecture

Browse its source code for patterns and best practices.

---

## Access Information

| Resource | URL |
|----------|-----|
| WordPress Site | http://localhost:8888 |
| WordPress Admin | http://localhost:8888/wp-admin |
| Test Site | http://localhost:8889 |

**Login**: `admin` / `password`

---

## Troubleshooting

### Plugin Not Appearing

1. Check mapping in `gutenberg/.wp-env.override.json`
2. Restart wp-env: `cd gutenberg && npm run wp-env stop && npm run wp-env start`
3. Verify plugin file has valid header comment

### React Page Not Loading

1. Run `npm run build` in your plugin directory
2. Check that `build/index.js` exists
3. Check browser console for errors

### wp-env Not Starting

1. Ensure Docker Desktop is running
2. Try `npm run wp-env destroy` then `npm run wp-env start`
3. Check for port conflicts on 8888/8889
