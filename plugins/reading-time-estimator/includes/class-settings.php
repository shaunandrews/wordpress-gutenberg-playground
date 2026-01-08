<?php
/**
 * Settings Class
 *
 * Handles plugin settings and REST API endpoints.
 *
 * @package Reading_Time_Estimator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Settings class.
 */
class RTE_Settings {

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
		add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
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
	 * Register REST API routes.
	 */
	public function register_rest_routes() {
		// Get settings endpoint.
		register_rest_route(
			'reading-time-estimator/v1',
			'/settings',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_settings' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			)
		);

		// Update settings endpoint.
		register_rest_route(
			'reading-time-estimator/v1',
			'/settings',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'update_settings' ),
				'permission_callback' => array( $this, 'permissions_check' ),
				'args'                => $this->get_settings_schema(),
			)
		);

		// Get post types endpoint.
		register_rest_route(
			'reading-time-estimator/v1',
			'/post-types',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get_post_types' ),
				'permission_callback' => array( $this, 'permissions_check' ),
			)
		);
	}

	/**
	 * Check permissions for REST API requests.
	 *
	 * @return bool
	 */
	public function permissions_check() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get settings via REST API.
	 *
	 * @return WP_REST_Response
	 */
	public function get_settings() {
		$settings = get_option( 'rte_settings', $this->get_default_settings() );
		return new WP_REST_Response( $settings, 200 );
	}

	/**
	 * Update settings via REST API.
	 *
	 * @param WP_REST_Request $request Request object.
	 * @return WP_REST_Response
	 */
	public function update_settings( $request ) {
		$settings = array(
			'words_per_minute'   => $request->get_param( 'words_per_minute' ),
			'display_location'   => $request->get_param( 'display_location' ),
			'custom_label'       => $request->get_param( 'custom_label' ),
			'enabled_post_types' => $request->get_param( 'enabled_post_types' ),
			'show_icon'          => $request->get_param( 'show_icon' ),
			'rounding'           => $request->get_param( 'rounding' ),
		);

		update_option( 'rte_settings', $settings );

		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Settings saved successfully!', 'reading-time-estimator' ),
				'data'    => $settings,
			),
			200
		);
	}

	/**
	 * Get available post types via REST API.
	 *
	 * @return WP_REST_Response
	 */
	public function get_post_types() {
		$post_types = get_post_types(
			array(
				'public' => true,
			),
			'objects'
		);

		$formatted_types = array();
		foreach ( $post_types as $post_type ) {
			$formatted_types[] = array(
				'name'  => $post_type->name,
				'label' => $post_type->label,
			);
		}

		return new WP_REST_Response( $formatted_types, 200 );
	}

	/**
	 * Get default settings.
	 *
	 * @return array
	 */
	public function get_default_settings() {
		return array(
			'words_per_minute'   => 200,
			'display_location'   => 'before',
			'custom_label'       => __( 'Reading time: ', 'reading-time-estimator' ),
			'enabled_post_types' => array( 'post', 'page' ),
			'show_icon'          => true,
			'rounding'           => 'round',
		);
	}

	/**
	 * Get settings schema for REST API validation.
	 *
	 * @return array
	 */
	private function get_settings_schema() {
		return array(
			'words_per_minute'   => array(
				'type'              => 'integer',
				'required'          => true,
				'minimum'           => 1,
				'maximum'           => 1000,
				'sanitize_callback' => 'absint',
			),
			'display_location'   => array(
				'type'              => 'string',
				'required'          => true,
				'enum'              => array( 'before', 'after', 'both', 'manual' ),
				'sanitize_callback' => 'sanitize_text_field',
			),
			'custom_label'       => array(
				'type'              => 'string',
				'required'          => true,
				'sanitize_callback' => 'sanitize_text_field',
			),
			'enabled_post_types' => array(
				'type'              => 'array',
				'required'          => true,
				'items'             => array(
					'type' => 'string',
				),
			),
			'show_icon'          => array(
				'type'     => 'boolean',
				'required' => true,
			),
			'rounding'           => array(
				'type'              => 'string',
				'required'          => true,
				'enum'              => array( 'round', 'ceil', 'floor' ),
				'sanitize_callback' => 'sanitize_text_field',
			),
		);
	}
}
