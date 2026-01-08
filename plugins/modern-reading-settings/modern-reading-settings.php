<?php
/**
 * Plugin Name: Modern Reading Settings
 * Description: Modernizes the Reading settings page with React and @wordpress/components.
 * Version: 1.0.0
 * Requires at least: 6.4
 * Requires PHP: 7.4
 * Author: WordPress Contributor
 * License: GPL v2 or later
 * Text Domain: modern-reading-settings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MRS_VERSION', '1.0.0' );
define( 'MRS_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MRS_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Main plugin class.
 */
class Modern_Reading_Settings {

	/**
	 * Singleton instance.
	 *
	 * @var Modern_Reading_Settings|null
	 */
	protected static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Modern_Reading_Settings
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		if ( is_admin() ) {
			require_once MRS_PLUGIN_DIR . 'includes/class-admin.php';
			MRS_Admin::get_instance();
		}
	}
}

add_action( 'plugins_loaded', array( 'Modern_Reading_Settings', 'get_instance' ) );
