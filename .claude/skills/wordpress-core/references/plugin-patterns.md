# WordPress Plugin Patterns

Common patterns and architectures for WordPress plugin development.

## Table of Contents

1. [OOP Plugin Architecture](#oop-plugin-architecture)
2. [Singleton Pattern](#singleton-pattern)
3. [Service Container](#service-container)
4. [AJAX Handlers](#ajax-handlers)
5. [Admin Notices](#admin-notices)
6. [Activation & Deactivation](#activation--deactivation)
7. [Uninstall Routine](#uninstall-routine)
8. [Autoloading](#autoloading)

## OOP Plugin Architecture

### Main Plugin Class

```php
<?php
/**
 * Plugin Name: My Plugin
 * Version: 1.0.0
 */

namespace MyPlugin;

if (!defined('ABSPATH')) exit;

final class Plugin {
    private static $instance = null;
    private $settings;
    private $api;

    public static function instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->define_constants();
        $this->includes();
        $this->init_hooks();
    }

    private function define_constants() {
        define('MY_PLUGIN_VERSION', '1.0.0');
        define('MY_PLUGIN_PATH', plugin_dir_path(__FILE__));
        define('MY_PLUGIN_URL', plugin_dir_url(__FILE__));
    }

    private function includes() {
        require_once MY_PLUGIN_PATH . 'includes/class-settings.php';
        require_once MY_PLUGIN_PATH . 'includes/class-api.php';
    }

    private function init_hooks() {
        add_action('init', [$this, 'init']);
        add_action('admin_init', [$this, 'admin_init']);

        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
    }

    public function init() {
        $this->settings = new Settings();
        $this->api = new API();
    }

    public function admin_init() {
        // Admin initialization
    }

    public function activate() {
        // Activation logic
        flush_rewrite_rules();
    }

    public function deactivate() {
        // Deactivation logic
        flush_rewrite_rules();
    }

    // Prevent cloning and unserialization
    private function __clone() {}
    public function __wakeup() {
        throw new \Exception('Cannot unserialize singleton');
    }
}

// Initialize
Plugin::instance();
```

### Settings Class

```php
<?php
namespace MyPlugin;

class Settings {
    private $option_name = 'my_plugin_settings';

    public function __construct() {
        add_action('admin_menu', [$this, 'add_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('rest_api_init', [$this, 'register_rest_settings']);
    }

    public function add_menu() {
        add_options_page(
            __('My Plugin Settings', 'my-plugin'),
            __('My Plugin', 'my-plugin'),
            'manage_options',
            'my-plugin',
            [$this, 'render_page']
        );
    }

    public function register_settings() {
        register_setting($this->option_name, $this->option_name, [
            'sanitize_callback' => [$this, 'sanitize'],
        ]);
    }

    public function register_rest_settings() {
        register_setting($this->option_name, $this->option_name, [
            'show_in_rest' => [
                'schema' => [
                    'type'       => 'object',
                    'properties' => [
                        'enabled' => ['type' => 'boolean'],
                        'limit'   => ['type' => 'integer'],
                    ],
                ],
            ],
        ]);
    }

    public function get($key = null, $default = null) {
        $options = get_option($this->option_name, []);
        if (null === $key) return $options;
        return $options[$key] ?? $default;
    }

    public function set($key, $value) {
        $options = $this->get();
        $options[$key] = $value;
        return update_option($this->option_name, $options);
    }

    public function sanitize($input) {
        $sanitized = [];
        if (isset($input['enabled'])) {
            $sanitized['enabled'] = (bool) $input['enabled'];
        }
        if (isset($input['limit'])) {
            $sanitized['limit'] = absint($input['limit']);
        }
        return $sanitized;
    }

    public function render_page() {
        include MY_PLUGIN_PATH . 'admin/views/settings.php';
    }
}
```

### API Class

```php
<?php
namespace MyPlugin;

class API {
    private $namespace = 'my-plugin/v1';

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {
        register_rest_route($this->namespace, '/items', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_items'],
                'permission_callback' => [$this, 'get_items_permission'],
            ],
            [
                'methods'             => \WP_REST_Server::CREATABLE,
                'callback'            => [$this, 'create_item'],
                'permission_callback' => [$this, 'create_item_permission'],
                'args'                => $this->get_item_args(),
            ],
        ]);

        register_rest_route($this->namespace, '/items/(?P<id>\d+)', [
            [
                'methods'             => \WP_REST_Server::READABLE,
                'callback'            => [$this, 'get_item'],
                'permission_callback' => [$this, 'get_items_permission'],
            ],
            [
                'methods'             => \WP_REST_Server::EDITABLE,
                'callback'            => [$this, 'update_item'],
                'permission_callback' => [$this, 'update_item_permission'],
                'args'                => $this->get_item_args(),
            ],
            [
                'methods'             => \WP_REST_Server::DELETABLE,
                'callback'            => [$this, 'delete_item'],
                'permission_callback' => [$this, 'delete_item_permission'],
            ],
        ]);
    }

    private function get_item_args() {
        return [
            'title' => [
                'type'              => 'string',
                'required'          => true,
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'content' => [
                'type'              => 'string',
                'sanitize_callback' => 'wp_kses_post',
            ],
        ];
    }

    public function get_items_permission() {
        return true; // Public
    }

    public function create_item_permission() {
        return current_user_can('publish_posts');
    }

    public function update_item_permission($request) {
        return current_user_can('edit_post', $request['id']);
    }

    public function delete_item_permission($request) {
        return current_user_can('delete_post', $request['id']);
    }

    public function get_items($request) {
        // Implementation
        return rest_ensure_response([]);
    }

    public function get_item($request) {
        $id = $request['id'];
        // Implementation
        return rest_ensure_response(['id' => $id]);
    }

    public function create_item($request) {
        // Implementation
        return rest_ensure_response(['id' => 1], 201);
    }

    public function update_item($request) {
        // Implementation
        return rest_ensure_response(['updated' => true]);
    }

    public function delete_item($request) {
        // Implementation
        return rest_ensure_response(['deleted' => true]);
    }
}
```

## Singleton Pattern

When you need exactly one instance:

```php
class MySingleton {
    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Initialize
    }

    private function __clone() {}
    public function __wakeup() {}
}
```

## Service Container

For dependency injection:

```php
class Container {
    private $services = [];
    private $instances = [];

    public function register($name, callable $factory) {
        $this->services[$name] = $factory;
    }

    public function get($name) {
        if (!isset($this->instances[$name])) {
            if (!isset($this->services[$name])) {
                throw new \Exception("Service not found: $name");
            }
            $this->instances[$name] = $this->services[$name]($this);
        }
        return $this->instances[$name];
    }
}

// Usage
$container = new Container();
$container->register('settings', fn($c) => new Settings());
$container->register('api', fn($c) => new API($c->get('settings')));

$api = $container->get('api');
```

## AJAX Handlers

### PHP Handler

```php
class Ajax_Handler {
    public function __construct() {
        // Logged-in users
        add_action('wp_ajax_my_action', [$this, 'handle']);
        // Non-logged-in users (if needed)
        add_action('wp_ajax_nopriv_my_action', [$this, 'handle']);
    }

    public function handle() {
        // Verify nonce
        if (!check_ajax_referer('my_plugin_nonce', 'nonce', false)) {
            wp_send_json_error(['message' => 'Invalid nonce'], 403);
        }

        // Check capability
        if (!current_user_can('edit_posts')) {
            wp_send_json_error(['message' => 'Unauthorized'], 403);
        }

        // Process request
        $data = sanitize_text_field($_POST['data'] ?? '');

        // Do something
        $result = $this->process($data);

        if (is_wp_error($result)) {
            wp_send_json_error([
                'message' => $result->get_error_message()
            ], 400);
        }

        wp_send_json_success(['result' => $result]);
    }

    private function process($data) {
        // Implementation
        return $data;
    }
}
```

### JavaScript

```js
jQuery(document).ready(function($) {
    $('#my-button').on('click', function() {
        $.ajax({
            url: myPluginData.ajaxUrl,
            type: 'POST',
            data: {
                action: 'my_action',
                nonce: myPluginData.nonce,
                data: 'value'
            },
            success: function(response) {
                if (response.success) {
                    console.log(response.data.result);
                } else {
                    console.error(response.data.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', error);
            }
        });
    });
});
```

## Admin Notices

```php
class Admin_Notices {
    private $notices = [];

    public function __construct() {
        add_action('admin_notices', [$this, 'display_notices']);
    }

    public function add($message, $type = 'info', $dismissible = true) {
        $this->notices[] = [
            'message'     => $message,
            'type'        => $type, // error, warning, success, info
            'dismissible' => $dismissible,
        ];
    }

    public function display_notices() {
        foreach ($this->notices as $notice) {
            $class = 'notice notice-' . $notice['type'];
            if ($notice['dismissible']) {
                $class .= ' is-dismissible';
            }
            printf(
                '<div class="%s"><p>%s</p></div>',
                esc_attr($class),
                esc_html($notice['message'])
            );
        }
    }

    // Persistent notices (stored in transient)
    public function add_persistent($message, $type = 'info') {
        $notices = get_transient('my_plugin_notices') ?: [];
        $notices[] = ['message' => $message, 'type' => $type];
        set_transient('my_plugin_notices', $notices, 60);
    }

    public function display_persistent_notices() {
        $notices = get_transient('my_plugin_notices');
        if (!$notices) return;

        foreach ($notices as $notice) {
            printf(
                '<div class="notice notice-%s is-dismissible"><p>%s</p></div>',
                esc_attr($notice['type']),
                esc_html($notice['message'])
            );
        }

        delete_transient('my_plugin_notices');
    }
}
```

## Activation & Deactivation

```php
class Activator {
    public static function activate() {
        // Check requirements
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            deactivate_plugins(plugin_basename(__FILE__));
            wp_die('This plugin requires PHP 7.4 or higher.');
        }

        // Create tables
        self::create_tables();

        // Add capabilities
        self::add_capabilities();

        // Set default options
        self::set_defaults();

        // Schedule cron
        if (!wp_next_scheduled('my_plugin_cron')) {
            wp_schedule_event(time(), 'daily', 'my_plugin_cron');
        }

        // Clear permalinks
        flush_rewrite_rules();

        // Set activation flag
        set_transient('my_plugin_activated', true, 60);
    }

    private static function create_tables() {
        global $wpdb;
        $charset_collate = $wpdb->get_charset_collate();
        $table = $wpdb->prefix . 'my_plugin_data';

        $sql = "CREATE TABLE $table (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            data longtext NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id)
        ) $charset_collate;";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta($sql);
    }

    private static function add_capabilities() {
        $admin = get_role('administrator');
        $admin->add_cap('manage_my_plugin');
    }

    private static function set_defaults() {
        if (false === get_option('my_plugin_settings')) {
            add_option('my_plugin_settings', [
                'enabled' => true,
                'limit'   => 10,
            ]);
        }
    }
}

class Deactivator {
    public static function deactivate() {
        // Clear scheduled hooks
        wp_clear_scheduled_hook('my_plugin_cron');

        // Clear permalinks
        flush_rewrite_rules();
    }
}

register_activation_hook(__FILE__, [Activator::class, 'activate']);
register_deactivation_hook(__FILE__, [Deactivator::class, 'deactivate']);
```

## Uninstall Routine

Create `uninstall.php` in plugin root:

```php
<?php
// Exit if not uninstalling
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// Delete options
delete_option('my_plugin_settings');

// Delete all post meta
delete_post_meta_by_key('my_plugin_meta');

// Delete user meta
delete_metadata('user', 0, 'my_plugin_user_meta', '', true);

// Drop custom tables
global $wpdb;
$wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}my_plugin_data");

// Clear transients
delete_transient('my_plugin_cache');
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_my_plugin_%'");

// Remove capabilities
$admin = get_role('administrator');
$admin->remove_cap('manage_my_plugin');

// Clear scheduled hooks
wp_clear_scheduled_hook('my_plugin_cron');

// Clear rewrite rules
flush_rewrite_rules();
```

## Autoloading

### Composer PSR-4

```json
{
    "autoload": {
        "psr-4": {
            "MyPlugin\\": "includes/"
        }
    }
}
```

### Simple Autoloader

```php
spl_autoload_register(function($class) {
    $prefix = 'MyPlugin\\';
    $base_dir = __DIR__ . '/includes/';

    // Does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    // Get the relative class name
    $relative_class = substr($class, $len);

    // Replace namespace separators with directory separators
    // Convert CamelCase to kebab-case
    $file = $base_dir . 'class-' . strtolower(
        preg_replace('/([a-z])([A-Z])/', '$1-$2',
            str_replace('\\', '/', $relative_class)
        )
    ) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});
```
