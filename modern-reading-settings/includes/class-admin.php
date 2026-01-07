<?php
/**
 * Admin functionality for Modern Reading Settings.
 *
 * @package Modern_Reading_Settings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Admin class.
 */
class MRS_Admin {

	/**
	 * Singleton instance.
	 *
	 * @var MRS_Admin|null
	 */
	protected static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return MRS_Admin
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
		add_action( 'admin_menu', array( $this, 'modify_admin_menu' ), 100 );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
	}

	/**
	 * Modify admin menu to replace default Reading page.
	 */
	public function modify_admin_menu() {
		// Remove the default Reading submenu.
		remove_submenu_page( 'options-general.php', 'options-reading.php' );

		// Add our custom Reading submenu.
		add_options_page(
			__( 'Reading Settings', 'modern-reading-settings' ),
			__( 'Reading', 'modern-reading-settings' ),
			'manage_options',
			'modern-reading-settings',
			array( $this, 'render_page' )
		);
	}

	/**
	 * Render the settings page.
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Permission denied.', 'modern-reading-settings' ) );
		}
		require_once MRS_PLUGIN_DIR . 'admin/settings-page.php';
	}

	/**
	 * Enqueue admin assets.
	 *
	 * @param string $hook The current admin page hook.
	 */
	public function enqueue_assets( $hook ) {
		if ( 'settings_page_modern-reading-settings' !== $hook ) {
			return;
		}

		$asset_file = MRS_PLUGIN_DIR . 'build/index.asset.php';
		if ( ! file_exists( $asset_file ) ) {
			return;
		}

		$asset = require $asset_file;

		// Enqueue WordPress components styles.
		wp_enqueue_style( 'wp-components' );

		// Enqueue plugin scripts.
		wp_enqueue_script(
			'modern-reading-settings',
			MRS_PLUGIN_URL . 'build/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		// Enqueue plugin styles.
		if ( file_exists( MRS_PLUGIN_DIR . 'build/style-index.css' ) ) {
			wp_enqueue_style(
				'modern-reading-settings',
				MRS_PLUGIN_URL . 'build/style-index.css',
				array( 'wp-components' ),
				$asset['version']
			);
		}

		// Get published pages for the dropdown.
		$pages      = get_pages( array( 'post_status' => 'publish' ) );
		$pages_list = array_map(
			function ( $page ) {
				return array(
					'id'    => $page->ID,
					'title' => $page->post_title,
				);
			},
			$pages ? $pages : array()
		);

		wp_localize_script(
			'modern-reading-settings',
			'mrsData',
			array(
				'pages' => $pages_list,
				'nonce' => wp_create_nonce( 'wp_rest' ),
			)
		);
	}
}
