<?php
/**
 * Plugin Name: Gutenberg Experiments Page
 * Description: A modern card-based UI for the Gutenberg experiments settings page.
 * Version: 1.0.0
 * Author: WordPress Contributors
 * License: GPL-2.0-or-later
 * Text Domain: gutenberg-experiments-page
 *
 * @package gutenberg-experiments-page
 */

defined( 'ABSPATH' ) || exit;

/**
 * Get all experiment definitions with their metadata.
 *
 * @return array Array of experiment definitions.
 */
function gep_get_experiment_definitions() {
	return array(
		array(
			'id'          => 'gutenberg-block-experiments',
			'name'        => __( 'Experimental Blocks', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables experimental blocks on a rolling basis as they are developed.', 'gutenberg-experiments-page' ),
			'warning'     => __( 'These blocks may have significant changes during development that cause validation errors and display issues.', 'gutenberg-experiments-page' ),
			'category'    => 'blocks',
			'icon'        => 'blockDefault',
		),
		array(
			'id'          => 'gutenberg-form-blocks',
			'name'        => __( 'Form & Input Blocks', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables new blocks to allow building forms.', 'gutenberg-experiments-page' ),
			'warning'     => __( 'You are likely to experience UX issues that are being addressed.', 'gutenberg-experiments-page' ),
			'category'    => 'blocks',
			'icon'        => 'postComments',
		),
		array(
			'id'          => 'gutenberg-grid-interactivity',
			'name'        => __( 'Grid Interactivity', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables enhancements to the Grid block that let you move and resize items in the editor canvas.', 'gutenberg-experiments-page' ),
			'category'    => 'blocks',
			'icon'        => 'grid',
		),
		array(
			'id'          => 'gutenberg-no-tinymce',
			'name'        => __( 'Disable TinyMCE', 'gutenberg-experiments-page' ),
			'description' => __( 'Disables the TinyMCE and Classic block.', 'gutenberg-experiments-page' ),
			'category'    => 'blocks',
			'icon'        => 'cancelCircleFilled',
		),
		array(
			'id'          => 'gutenberg-media-processing',
			'name'        => __( 'Client-side Media Processing', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables client-side media processing to leverage the browser\'s capabilities to handle tasks like image resizing and compression.', 'gutenberg-experiments-page' ),
			'category'    => 'editor',
			'icon'        => 'image',
		),
		array(
			'id'          => 'gutenberg-sync-collaboration',
			'name'        => __( 'Real-time Collaboration', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables live collaboration and offline persistence between peers.', 'gutenberg-experiments-page' ),
			'category'    => 'editor',
			'icon'        => 'people',
		),
		array(
			'id'          => 'gutenberg-color-randomizer',
			'name'        => __( 'Color Randomizer', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables the Global Styles color randomizer in the Site Editor; a utility that lets you mix the current color palette pseudo-randomly.', 'gutenberg-experiments-page' ),
			'category'    => 'editor',
			'icon'        => 'color',
		),
		array(
			'id'          => 'gutenberg-quick-edit-dataviews',
			'name'        => __( 'Quick Edit', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables access to a Quick Edit panel in the Site Editor Pages experience.', 'gutenberg-experiments-page' ),
			'category'    => 'editor',
			'icon'        => 'pencil',
		),
		array(
			'id'          => 'gutenberg-dataviews-media-modal',
			'name'        => __( 'New Media Modal', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables a new media modal experience powered by Data Views for improved media library management.', 'gutenberg-experiments-page' ),
			'category'    => 'editor',
			'icon'        => 'gallery',
		),
		array(
			'id'          => 'gutenberg-full-page-client-side-navigation',
			'name'        => __( 'Full-page Client-side Navigation', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables full-page client-side navigation, powered by the Interactivity API.', 'gutenberg-experiments-page' ),
			'category'    => 'advanced',
			'icon'        => 'globe',
		),
		array(
			'id'          => 'gutenberg-content-only-pattern-insertion',
			'name'        => __( 'Content-only Patterns', 'gutenberg-experiments-page' ),
			'description' => __( 'When patterns are inserted, default to a simplified content only mode for editing pattern content.', 'gutenberg-experiments-page' ),
			'category'    => 'advanced',
			'icon'        => 'layout',
		),
		array(
			'id'          => 'gutenberg-content-only-inspector-fields',
			'name'        => __( 'Content-only Inspector Fields', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables editable inspector fields (media, links, alt text, etc.) in the content-only pattern editing interface.', 'gutenberg-experiments-page' ),
			'category'    => 'advanced',
			'requires'    => 'gutenberg-content-only-pattern-insertion',
			'icon'        => 'settings',
		),
		array(
			'id'          => 'gutenberg-workflow-palette',
			'name'        => __( 'Workflow Palette', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables the Workflow Palette for running workflows composed of abilities, from a unified interface.', 'gutenberg-experiments-page' ),
			'category'    => 'editor',
			'icon'        => 'tool',
		),
		array(
			'id'          => 'gutenberg-customizable-navigation-overlays',
			'name'        => __( 'Customizable Navigation Overlays', 'gutenberg-experiments-page' ),
			'description' => __( 'Enables custom mobile overlay design and content control for Navigation blocks, allowing you to create flexible, professional menu experiences.', 'gutenberg-experiments-page' ),
			'category'    => 'editor',
			'icon'        => 'navigation',
		),
		array(
			'id'          => 'gutenberg-hide-blocks-based-on-screen-size',
			'name'        => __( 'Hide Blocks by Screen Size', 'gutenberg-experiments-page' ),
			'description' => __( 'Extends block visibility block supports with responsive design controls for hiding blocks based on screen size.', 'gutenberg-experiments-page' ),
			'category'    => 'advanced',
			'icon'        => 'mobile',
		),
		array(
			'id'          => 'active_templates',
			'name'        => __( 'Template Activation', 'gutenberg-experiments-page' ),
			'description' => __( 'Allows multiple templates of the same type to be created, of which one can be active at a time.', 'gutenberg-experiments-page' ),
			'warning'     => __( 'When you deactivate this experiment, it is best to delete all created templates except for the active ones.', 'gutenberg-experiments-page' ),
			'category'    => 'advanced',
			'learnMore'   => 'https://github.com/WordPress/gutenberg/issues/66950',
			'icon'        => 'layout',
		),
	);
}

/**
 * Get category labels for experiment categories.
 *
 * @return array Array of category labels.
 */
function gep_get_experiment_category_labels() {
	return array(
		'blocks'   => array(
			'label' => __( 'Blocks', 'gutenberg-experiments-page' ),
			'icon'  => 'blockDefault',
		),
		'editor'   => array(
			'label' => __( 'Editor', 'gutenberg-experiments-page' ),
			'icon'  => 'pencil',
		),
		'advanced' => array(
			'label' => __( 'Advanced', 'gutenberg-experiments-page' ),
			'icon'  => 'settings',
		),
	);
}

/**
 * Register REST API routes for experiments.
 */
function gep_register_rest_routes() {
	register_rest_route(
		'gutenberg-experiments-page/v1',
		'/experiments',
		array(
			array(
				'methods'             => 'GET',
				'callback'            => 'gep_rest_get_experiments',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
			),
			array(
				'methods'             => 'POST',
				'callback'            => 'gep_rest_update_experiment',
				'permission_callback' => function () {
					return current_user_can( 'manage_options' );
				},
				'args'                => array(
					'id'      => array(
						'type'              => 'string',
						'required'          => true,
						'sanitize_callback' => 'sanitize_text_field',
					),
					'enabled' => array(
						'type'     => 'boolean',
						'required' => true,
					),
				),
			),
		)
	);
}
add_action( 'rest_api_init', 'gep_register_rest_routes' );

/**
 * REST API callback to get all experiments.
 *
 * @return WP_REST_Response
 */
function gep_rest_get_experiments() {
	$definitions    = gep_get_experiment_definitions();
	$options        = get_option( 'gutenberg-experiments', array() );
	$category_order = array_keys( gep_get_experiment_category_labels() );

	$experiments = array();
	foreach ( $definitions as $experiment ) {
		$id = $experiment['id'];

		// Handle active_templates special case.
		if ( 'active_templates' === $id ) {
			$enabled = function_exists( 'gutenberg_is_experiment_enabled' )
				? gutenberg_is_experiment_enabled( 'active_templates' )
				: false;
		} else {
			$enabled = ! empty( $options[ $id ] );
		}

		$experiments[] = array(
			'id'          => $id,
			'name'        => $experiment['name'],
			'description' => $experiment['description'],
			'warning'     => isset( $experiment['warning'] ) ? $experiment['warning'] : null,
			'category'    => $experiment['category'],
			'requires'    => isset( $experiment['requires'] ) ? $experiment['requires'] : null,
			'learnMore'   => isset( $experiment['learnMore'] ) ? $experiment['learnMore'] : null,
			'icon'        => isset( $experiment['icon'] ) ? $experiment['icon'] : 'plugins',
			'enabled'     => $enabled,
		);
	}

	return new WP_REST_Response(
		array(
			'experiments'   => $experiments,
			'categories'    => gep_get_experiment_category_labels(),
			'categoryOrder' => $category_order,
		),
		200
	);
}

/**
 * REST API callback to update an experiment.
 *
 * @param WP_REST_Request $request Request object.
 * @return WP_REST_Response
 */
function gep_rest_update_experiment( $request ) {
	$id      = $request->get_param( 'id' );
	$enabled = $request->get_param( 'enabled' );

	// Validate the experiment ID.
	$definitions = gep_get_experiment_definitions();
	$valid_ids   = array_column( $definitions, 'id' );
	if ( ! in_array( $id, $valid_ids, true ) ) {
		return new WP_REST_Response(
			array(
				'success' => false,
				'message' => __( 'Invalid experiment ID.', 'gutenberg-experiments-page' ),
			),
			400
		);
	}

	// Handle active_templates special case.
	if ( 'active_templates' === $id ) {
		if ( $enabled ) {
			if ( function_exists( 'gutenberg_get_migrated_active_templates' ) ) {
				update_option( 'active_templates', gutenberg_get_migrated_active_templates() );
			}
		} else {
			delete_option( 'active_templates' );
		}
	} else {
		$options = get_option( 'gutenberg-experiments', array() );
		if ( $enabled ) {
			$options[ $id ] = 1;
		} else {
			unset( $options[ $id ] );
		}
		update_option( 'gutenberg-experiments', $options );
	}

	return new WP_REST_Response(
		array(
			'success' => true,
			'message' => __( 'Setting saved.', 'gutenberg-experiments-page' ),
			'id'      => $id,
			'enabled' => $enabled,
		),
		200
	);
}

/**
 * Replace Gutenberg's experiments submenu with our own.
 *
 * This removes the default experiments page and re-adds it with our React-based callback.
 * Runs at priority 99 to ensure Gutenberg's menu (priority 9) has already been registered.
 */
function gep_replace_experiments_menu() {
	// Remove Gutenberg's callback action.
	// The hook name format is: {parent_slug}_page_{menu_slug}
	remove_action( 'gutenberg_page_gutenberg-experiments', 'the_gutenberg_experiments' );

	// Remove Gutenberg's default experiments submenu entry.
	remove_submenu_page( 'gutenberg', 'gutenberg-experiments' );

	// Re-add it with our callback.
	add_submenu_page(
		'gutenberg',
		__( 'Experiments Settings', 'gutenberg-experiments-page' ),
		__( 'Experiments', 'gutenberg-experiments-page' ),
		'manage_options',
		'gutenberg-experiments',
		'gep_render_experiments_page'
	);
}
add_action( 'admin_menu', 'gep_replace_experiments_menu', 99 );

/**
 * Render the experiments page.
 *
 * This function renders the React app container for the experiments page.
 */
function gep_render_experiments_page() {
	?>
	<div class="wrap">
		<div id="gutenberg-experiments-page-root"></div>
	</div>
	<?php
}

/**
 * Enqueue scripts and styles for the experiments page.
 *
 * @param string $hook The current admin page hook.
 */
function gep_enqueue_scripts( $hook ) {
	if ( 'gutenberg_page_gutenberg-experiments' !== $hook ) {
		return;
	}

	$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = require $asset_file;

	wp_enqueue_script(
		'gutenberg-experiments-page',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_enqueue_style(
		'gutenberg-experiments-page',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array( 'wp-components' ),
		$asset['version']
	);

	wp_set_script_translations( 'gutenberg-experiments-page', 'gutenberg-experiments-page' );
}
add_action( 'admin_enqueue_scripts', 'gep_enqueue_scripts' );
