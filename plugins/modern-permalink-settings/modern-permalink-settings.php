<?php
/**
 * Plugin Name: Modern Permalink Settings
 * Plugin URI: https://developer.wordpress.org
 * Description: A modern, React-based redesign of the WordPress Permalink Settings screen.
 * Version: 1.0.0
 * Author: WordPress Contributors
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: modern-permalink-settings
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */

namespace ModernPermalinkSettings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MPS_VERSION', '1.0.0' );
define( 'MPS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MPS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include required files.
require_once MPS_PLUGIN_DIR . 'includes/class-settings.php';
require_once MPS_PLUGIN_DIR . 'admin/class-admin.php';

/**
 * Initialize the plugin.
 */
function init() {
	// Initialize admin.
	if ( is_admin() ) {
		new Admin();
	}
}
add_action( 'plugins_loaded', __NAMESPACE__ . '\init' );
