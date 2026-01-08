<?php
/**
 * Admin Class
 *
 * Handles admin menu and settings page.
 *
 * @package Reading_Time_Estimator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Admin class.
 */
class RTE_Admin {

	/**
	 * Instance of this class.
	 *
	 * @var object
	 */
	protected static $instance = null;

	/**
	 * Initialize the class.
	 */
	private function __construct() {
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
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
	 * Add admin menu item.
	 */
	public function add_admin_menu() {
		add_options_page(
			__( 'Reading Time Settings', 'reading-time-estimator' ),
			__( 'Reading Time', 'reading-time-estimator' ),
			'manage_options',
			'reading-time-estimator',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Render settings page.
	 */
	public function render_settings_page() {
		require_once RTE_PLUGIN_DIR . 'admin/settings-page.php';
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_admin_assets( $hook ) {
		// Only load on our settings page.
		if ( 'settings_page_reading-time-estimator' !== $hook ) {
			return;
		}

		// Enqueue WordPress components styles.
		wp_enqueue_style( 'wp-components' );

		// Check if build files exist.
		$asset_file = RTE_PLUGIN_DIR . 'build/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		// Enqueue our compiled JavaScript.
		wp_enqueue_script(
			'reading-time-estimator-admin',
			RTE_PLUGIN_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Enqueue our styles.
		wp_enqueue_style(
			'reading-time-estimator-admin',
			RTE_PLUGIN_URL . 'build/index.css',
			array( 'wp-components' ),
			$asset['version']
		);

		// Pass initial data to JavaScript.
		$settings = get_option( 'rte_settings', array() );
		wp_localize_script(
			'reading-time-estimator-admin',
			'rteData',
			array(
				'apiUrl'   => rest_url( 'reading-time-estimator/v1' ),
				'nonce'    => wp_create_nonce( 'wp_rest' ),
				'settings' => $settings,
			)
		);
	}
}
