<?php
/**
 * Plugin Name: Reading Time Estimator
 * Plugin URI: https://example.com/reading-time-estimator
 * Description: Displays estimated reading time for posts and pages with a beautiful admin interface using WordPress components.
 * Version: 1.0.0
 * Author: Your Name
 * Author URI: https://example.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: reading-time-estimator
 * Domain Path: /languages
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Define plugin constants.
define( 'RTE_VERSION', '1.0.0' );
define( 'RTE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'RTE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'RTE_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main Reading Time Estimator class.
 */
class Reading_Time_Estimator {

	/**
	 * Instance of this class.
	 *
	 * @var object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin.
	 */
	private function __construct() {
		$this->load_dependencies();
		$this->init_hooks();
	}

	/**
	 * Return an instance of this class.
	 *
	 * @return object A single instance of this class.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Load required dependencies.
	 */
	private function load_dependencies() {
		require_once RTE_PLUGIN_DIR . 'includes/class-settings.php';
		require_once RTE_PLUGIN_DIR . 'includes/class-reading-time.php';

		if ( is_admin() ) {
			require_once RTE_PLUGIN_DIR . 'admin/class-admin.php';
		}
	}

	/**
	 * Initialize hooks.
	 */
	private function init_hooks() {
		// Initialize settings.
		RTE_Settings::get_instance();

		// Initialize reading time display.
		RTE_Reading_Time::get_instance();

		// Initialize admin if in admin area.
		if ( is_admin() ) {
			RTE_Admin::get_instance();
		}

		// Activation hook.
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
	}

	/**
	 * Plugin activation callback.
	 */
	public function activate() {
		// Set default options if they don't exist.
		if ( false === get_option( 'rte_settings' ) ) {
			$defaults = array(
				'words_per_minute'    => 200,
				'display_location'    => 'before',
				'custom_label'        => __( 'Reading time: ', 'reading-time-estimator' ),
				'enabled_post_types'  => array( 'post', 'page' ),
				'show_icon'           => true,
				'rounding'            => 'round',
			);
			add_option( 'rte_settings', $defaults );
		}
	}
}

/**
 * Initialize the plugin.
 */
function reading_time_estimator_init() {
	return Reading_Time_Estimator::get_instance();
}

// Start the plugin.
reading_time_estimator_init();
