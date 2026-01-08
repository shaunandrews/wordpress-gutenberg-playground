<?php
/**
 * Settings class for Modern Permalink Settings.
 *
 * @package ModernPermalinkSettings
 */

namespace ModernPermalinkSettings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class Settings
 *
 * Handles permalink settings data and REST API exposure.
 */
class Settings {

	/**
	 * Get permalink structure options.
	 *
	 * @return array
	 */
	public static function get_structure_options() {
		$home_url = home_url();

		return array(
			'plain'      => array(
				'label'   => __( 'Plain', 'modern-permalink-settings' ),
				'value'   => '',
				'example' => $home_url . '/?p=123',
			),
			'day_name'   => array(
				'label'   => __( 'Day and name', 'modern-permalink-settings' ),
				'value'   => '/%year%/%monthnum%/%day%/%postname%/',
				'example' => $home_url . '/' . gmdate( 'Y/m/d' ) . '/sample-post/',
			),
			'month_name' => array(
				'label'   => __( 'Month and name', 'modern-permalink-settings' ),
				'value'   => '/%year%/%monthnum%/%postname%/',
				'example' => $home_url . '/' . gmdate( 'Y/m' ) . '/sample-post/',
			),
			'numeric'    => array(
				'label'   => __( 'Numeric', 'modern-permalink-settings' ),
				'value'   => '/archives/%post_id%',
				'example' => $home_url . '/archives/123',
			),
			'post_name'  => array(
				'label'   => __( 'Post name', 'modern-permalink-settings' ),
				'value'   => '/%postname%/',
				'example' => $home_url . '/sample-post/',
			),
			'custom'     => array(
				'label'   => __( 'Custom', 'modern-permalink-settings' ),
				'value'   => 'custom',
				'example' => '',
			),
		);
	}

	/**
	 * Get available structure tags.
	 *
	 * @return array
	 */
	public static function get_available_tags() {
		return array(
			'%year%'      => __( 'The year of the post (four digits)', 'modern-permalink-settings' ),
			'%monthnum%'  => __( 'Month of the year (two digits)', 'modern-permalink-settings' ),
			'%day%'       => __( 'Day of the month (two digits)', 'modern-permalink-settings' ),
			'%hour%'      => __( 'Hour of the day (two digits)', 'modern-permalink-settings' ),
			'%minute%'    => __( 'Minute of the hour (two digits)', 'modern-permalink-settings' ),
			'%second%'    => __( 'Second of the minute (two digits)', 'modern-permalink-settings' ),
			'%post_id%'   => __( 'The unique ID of the post', 'modern-permalink-settings' ),
			'%postname%'  => __( 'The sanitized post title (slug)', 'modern-permalink-settings' ),
			'%category%'  => __( 'The category slug', 'modern-permalink-settings' ),
			'%author%'    => __( 'The author slug', 'modern-permalink-settings' ),
		);
	}
}
