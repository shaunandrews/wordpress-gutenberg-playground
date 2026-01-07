---
name: wordpress-core
description: "Develop plugins and contribute to WordPress Core. Use when working on: (1) Plugin architecture and hooks, (2) REST API endpoints, (3) Custom post types and taxonomies, (4) Settings and options, (5) User roles and capabilities, (6) Database operations, (7) Scheduled tasks (wp_cron), or (8) Admin pages and menus."
---

# WordPress Core Development

WordPress is a modular CMS built on hooks (actions and filters) that allow extending and modifying behavior without changing core files.

## Quick Reference

| Task | Function/Hook |
|------|---------------|
| Add action | `add_action('hook_name', 'callback', $priority, $args)` |
| Add filter | `add_filter('hook_name', 'callback', $priority, $args)` |
| Register CPT | `register_post_type('name', $args)` |
| Register taxonomy | `register_taxonomy('name', 'post_type', $args)` |
| Register REST route | `register_rest_route('namespace/v1', '/path', $args)` |
| Register setting | `register_setting('group', 'name', $args)` |
| Add admin page | `add_menu_page(...)` or `add_submenu_page(...)` |
| Schedule event | `wp_schedule_event(time(), 'hourly', 'hook')` |
| Set transient | `set_transient('key', $value, $expiration)` |

## Hooks System

WordPress uses two types of hooks:

### Actions

Execute code at specific points:

```php
// Register hook
add_action('init', 'my_init_function');
add_action('save_post', 'my_save_handler', 10, 2);

// Callback
function my_save_handler($post_id, $post) {
    if (wp_is_post_autosave($post_id)) return;
    // Handle save
}

// Trigger custom action
do_action('my_plugin_event', $arg1, $arg2);
```

### Filters

Modify data as it passes through:

```php
// Register filter
add_filter('the_content', 'my_content_filter');
add_filter('wp_insert_post_data', 'modify_post_data', 10, 2);

// Callback (must return value)
function my_content_filter($content) {
    return $content . '<p>Appended text</p>';
}

// Apply custom filter
$value = apply_filters('my_plugin_filter', $default, $context);
```

### Key Hooks

| Hook | Type | When |
|------|------|------|
| `init` | Action | After WP loads, before headers |
| `admin_init` | Action | Admin area initialization |
| `wp_enqueue_scripts` | Action | Frontend script/style enqueueing |
| `admin_enqueue_scripts` | Action | Admin script/style enqueueing |
| `save_post` | Action | Post is saved |
| `the_content` | Filter | Post content display |
| `rest_api_init` | Action | REST API initialization |
| `plugins_loaded` | Action | All plugins loaded |

## REST API

### Registering Endpoints

```php
add_action('rest_api_init', function() {
    register_rest_route('my-plugin/v1', '/items', [
        'methods'             => WP_REST_Server::READABLE, // GET
        'callback'            => 'get_items',
        'permission_callback' => '__return_true', // Public
    ]);

    register_rest_route('my-plugin/v1', '/items/(?P<id>\d+)', [
        'methods'             => WP_REST_Server::EDITABLE, // POST, PUT, PATCH
        'callback'            => 'update_item',
        'permission_callback' => function() {
            return current_user_can('edit_posts');
        },
        'args' => [
            'id' => [
                'required'          => true,
                'validate_callback' => function($param) {
                    return is_numeric($param);
                },
            ],
            'title' => [
                'type'              => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);
});

function get_items($request) {
    $per_page = $request->get_param('per_page') ?? 10;
    // Return data or WP_Error
    return new WP_REST_Response(['items' => []], 200);
}

function update_item($request) {
    $id = $request['id'];
    $title = $request['title'];

    // Update logic

    return rest_ensure_response(['success' => true]);
}
```

### Schema Definition

```php
register_rest_route('my-plugin/v1', '/items', [
    'methods'  => 'GET',
    'callback' => 'get_items',
    'permission_callback' => '__return_true',
    'schema'   => function() {
        return [
            '$schema'    => 'http://json-schema.org/draft-04/schema#',
            'title'      => 'item',
            'type'       => 'object',
            'properties' => [
                'id'    => ['type' => 'integer'],
                'title' => ['type' => 'string'],
            ],
        ];
    },
]);
```

## Custom Post Types

```php
add_action('init', function() {
    register_post_type('book', [
        'labels' => [
            'name'          => 'Books',
            'singular_name' => 'Book',
            'add_new_item'  => 'Add New Book',
            'edit_item'     => 'Edit Book',
        ],
        'public'       => true,
        'show_in_rest' => true, // Enable Gutenberg & REST API
        'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields'],
        'has_archive'  => true,
        'rewrite'      => ['slug' => 'books'],
        'menu_icon'    => 'dashicons-book',
    ]);
});
```

### Custom Taxonomies

```php
add_action('init', function() {
    register_taxonomy('genre', 'book', [
        'labels' => [
            'name'          => 'Genres',
            'singular_name' => 'Genre',
        ],
        'public'       => true,
        'show_in_rest' => true,
        'hierarchical' => true, // Like categories (false = like tags)
        'rewrite'      => ['slug' => 'genre'],
    ]);
});
```

## Post Meta

```php
// Register for REST API exposure
register_post_meta('post', 'my_meta_key', [
    'show_in_rest'      => true,
    'single'            => true,
    'type'              => 'string',
    'sanitize_callback' => 'sanitize_text_field',
    'auth_callback'     => function() {
        return current_user_can('edit_posts');
    },
]);

// Get/update meta
$value = get_post_meta($post_id, 'my_meta_key', true);
update_post_meta($post_id, 'my_meta_key', $value);
delete_post_meta($post_id, 'my_meta_key');
```

## Settings API

### Register Settings

```php
add_action('admin_init', function() {
    // Register setting
    register_setting('my_plugin_options', 'my_plugin_setting', [
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
        'default'           => '',
        'show_in_rest'      => true, // Expose via REST API
    ]);

    // Add settings section
    add_settings_section(
        'my_section',
        'My Settings Section',
        'section_callback',
        'my-plugin-settings'
    );

    // Add settings field
    add_settings_field(
        'my_field',
        'My Field',
        'field_callback',
        'my-plugin-settings',
        'my_section'
    );
});

function section_callback() {
    echo '<p>Section description</p>';
}

function field_callback() {
    $value = get_option('my_plugin_setting');
    echo '<input type="text" name="my_plugin_setting" value="' . esc_attr($value) . '">';
}
```

### Settings Page

```php
add_action('admin_menu', function() {
    add_options_page(
        'My Plugin Settings',    // Page title
        'My Plugin',             // Menu title
        'manage_options',        // Capability
        'my-plugin-settings',    // Slug
        'render_settings_page'   // Callback
    );
});

function render_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('my_plugin_options');
            do_settings_sections('my-plugin-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
```

## User Capabilities

### Check Capabilities

```php
if (current_user_can('manage_options')) {
    // User is admin
}

if (current_user_can('edit_post', $post_id)) {
    // User can edit this specific post
}
```

### Custom Capabilities

```php
// On plugin activation
function my_plugin_activate() {
    $admin = get_role('administrator');
    $admin->add_cap('manage_my_plugin');
}
register_activation_hook(__FILE__, 'my_plugin_activate');

// On plugin deactivation
function my_plugin_deactivate() {
    $admin = get_role('administrator');
    $admin->remove_cap('manage_my_plugin');
}
register_deactivation_hook(__FILE__, 'my_plugin_deactivate');
```

## Scheduled Tasks (wp_cron)

```php
// Schedule on activation
register_activation_hook(__FILE__, function() {
    if (!wp_next_scheduled('my_plugin_daily_task')) {
        wp_schedule_event(time(), 'daily', 'my_plugin_daily_task');
    }
});

// Hook the task
add_action('my_plugin_daily_task', function() {
    // Do scheduled work
});

// Clear on deactivation
register_deactivation_hook(__FILE__, function() {
    wp_clear_scheduled_hook('my_plugin_daily_task');
});

// Custom schedule interval
add_filter('cron_schedules', function($schedules) {
    $schedules['five_minutes'] = [
        'interval' => 300,
        'display'  => 'Every 5 Minutes',
    ];
    return $schedules;
});
```

## Transients (Caching)

```php
// Set transient (expires in 1 hour)
set_transient('my_cache_key', $data, HOUR_IN_SECONDS);

// Get transient
$cached = get_transient('my_cache_key');
if (false === $cached) {
    // Cache miss - regenerate
    $cached = expensive_operation();
    set_transient('my_cache_key', $cached, HOUR_IN_SECONDS);
}

// Delete transient
delete_transient('my_cache_key');

// Time constants: MINUTE_IN_SECONDS, HOUR_IN_SECONDS, DAY_IN_SECONDS, WEEK_IN_SECONDS
```

## Database Operations

### Using $wpdb

```php
global $wpdb;

// Select
$results = $wpdb->get_results(
    $wpdb->prepare("SELECT * FROM {$wpdb->posts} WHERE post_type = %s", 'post')
);

// Single value
$count = $wpdb->get_var(
    $wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_status = %s", 'publish')
);

// Insert
$wpdb->insert(
    $wpdb->prefix . 'my_table',
    ['column1' => 'value1', 'column2' => 123],
    ['%s', '%d']
);
$inserted_id = $wpdb->insert_id;

// Update
$wpdb->update(
    $wpdb->prefix . 'my_table',
    ['column1' => 'new_value'],
    ['id' => 123],
    ['%s'],
    ['%d']
);

// Delete
$wpdb->delete(
    $wpdb->prefix . 'my_table',
    ['id' => 123],
    ['%d']
);
```

### Custom Tables

```php
register_activation_hook(__FILE__, function() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'my_table';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta($sql);
});
```

## Plugin Structure

### Basic Plugin

```
my-plugin/
├── my-plugin.php           # Main file with plugin header
└── includes/
    └── class-*.php         # Supporting classes
```

### Plugin with Admin UI

```
my-plugin/
├── my-plugin.php           # Bootstrap and hooks
├── includes/
│   ├── class-settings.php  # Options handling
│   └── class-api.php       # REST endpoints
├── admin/
│   ├── class-admin.php     # Menu registration
│   └── views/              # Admin templates
└── src/                    # React/JS (if using)
    └── index.js
```

### Plugin Header

```php
<?php
/**
 * Plugin Name: My Plugin
 * Plugin URI: https://example.com/my-plugin
 * Description: Short description of the plugin.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL-2.0+
 * Text Domain: my-plugin
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MY_PLUGIN_VERSION', '1.0.0');
define('MY_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('MY_PLUGIN_URL', plugin_dir_url(__FILE__));
```

## Assets (Scripts & Styles)

```php
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'my-plugin-style',
        MY_PLUGIN_URL . 'assets/css/style.css',
        [],
        MY_PLUGIN_VERSION
    );

    wp_enqueue_script(
        'my-plugin-script',
        MY_PLUGIN_URL . 'assets/js/script.js',
        ['jquery'],
        MY_PLUGIN_VERSION,
        true // In footer
    );

    wp_localize_script('my-plugin-script', 'myPluginData', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('my-plugin-nonce'),
    ]);
});

// Admin scripts
add_action('admin_enqueue_scripts', function($hook) {
    if ('settings_page_my-plugin' !== $hook) return;

    wp_enqueue_script('my-plugin-admin', ...);
});
```

## Security

### Nonces

```php
// Create nonce
$nonce = wp_create_nonce('my_action');

// Verify in form handler
if (!wp_verify_nonce($_POST['_wpnonce'], 'my_action')) {
    wp_die('Security check failed');
}

// In forms
wp_nonce_field('my_action', '_wpnonce');

// REST API (handled automatically with cookie auth)
```

### Sanitization & Escaping

```php
// Sanitize input
$clean = sanitize_text_field($_POST['input']);
$email = sanitize_email($_POST['email']);
$url   = esc_url_raw($_POST['url']);

// Escape output
echo esc_html($text);           // HTML context
echo esc_attr($attribute);      // Attribute context
echo esc_url($url);             // URL context
echo wp_kses_post($html);       // Allow safe HTML
```

## Resources

- **Plugin Handbook**: https://developer.wordpress.org/plugins/
- **REST API Handbook**: https://developer.wordpress.org/rest-api/
- **Code Reference**: https://developer.wordpress.org/reference/
- **Coding Standards**: https://developer.wordpress.org/coding-standards/
