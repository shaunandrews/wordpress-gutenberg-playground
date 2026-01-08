<?php
/**
 * Admin class for Modern Permalink Settings.
 *
 * @package ModernPermalinkSettings
 */

namespace ModernPermalinkSettings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Admin
 *
 * Handles admin menu and asset loading.
 */
class Admin {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu_page' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Add admin menu page.
	 */
	public function add_menu_page() {
		add_options_page(
			__( 'Permalinks', 'modern-permalink-settings' ),
			__( 'Permalinks', 'modern-permalink-settings' ),
			'manage_options',
			'modern-permalink-settings',
			array( $this, 'render_page' ),
			30
		);
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook The current admin page hook.
	 */
	public function enqueue_assets( $hook ) {
		if ( 'settings_page_modern-permalink-settings' !== $hook ) {
			return;
		}

		$asset_file = MPS_PLUGIN_DIR . 'build/index.asset.php';

		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = include $asset_file;

		wp_enqueue_script(
			'modern-permalink-settings',
			MPS_PLUGIN_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'modern-permalink-settings',
			MPS_PLUGIN_URL . 'build/style-index.css',
			array( 'wp-components' ),
			$asset['version']
		);

		// Localize script with data.
		wp_localize_script(
			'modern-permalink-settings',
			'mpsData',
			array(
				'homeUrl'          => home_url(),
				'structureOptions' => Settings::get_structure_options(),
				'availableTags'    => Settings::get_available_tags(),
				'nonce'            => wp_create_nonce( 'wp_rest' ),
			)
		);
	}

	/**
	 * Render the settings page.
	 */
	public function render_page() {
		include MPS_PLUGIN_DIR . 'admin/settings-page.php';
	}
}
