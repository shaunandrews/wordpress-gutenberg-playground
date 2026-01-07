<?php
/**
 * Reading Time Class
 *
 * Handles reading time calculation and display.
 *
 * @package Reading_Time_Estimator
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Reading Time class.
 */
class RTE_Reading_Time {

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
		add_filter( 'the_content', array( $this, 'add_reading_time_to_content' ) );
		add_shortcode( 'reading_time', array( $this, 'reading_time_shortcode' ) );
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
	 * Calculate reading time for content.
	 *
	 * @param string $content Post content.
	 * @return int Reading time in minutes.
	 */
	public function calculate_reading_time( $content ) {
		$settings = get_option( 'rte_settings', array() );
		$words_per_minute = isset( $settings['words_per_minute'] ) ? $settings['words_per_minute'] : 200;
		$rounding = isset( $settings['rounding'] ) ? $settings['rounding'] : 'round';

		// Strip HTML tags and count words.
		$text = wp_strip_all_tags( $content );
		$word_count = str_word_count( $text );

		// Calculate reading time.
		$reading_time = $word_count / $words_per_minute;

		// Apply rounding.
		switch ( $rounding ) {
			case 'ceil':
				$reading_time = ceil( $reading_time );
				break;
			case 'floor':
				$reading_time = floor( $reading_time );
				break;
			case 'round':
			default:
				$reading_time = round( $reading_time );
				break;
		}

		// Minimum 1 minute.
		return max( 1, $reading_time );
	}

	/**
	 * Format reading time for display.
	 *
	 * @param int $minutes Reading time in minutes.
	 * @return string Formatted reading time.
	 */
	public function format_reading_time( $minutes ) {
		$settings = get_option( 'rte_settings', array() );
		$custom_label = isset( $settings['custom_label'] ) ? $settings['custom_label'] : __( 'Reading time: ', 'reading-time-estimator' );
		$show_icon = isset( $settings['show_icon'] ) ? $settings['show_icon'] : true;

		$icon = $show_icon ? '📖 ' : '';

		/* translators: %d: number of minutes */
		$time_text = sprintf( _n( '%d minute', '%d minutes', $minutes, 'reading-time-estimator' ), $minutes );

		return sprintf(
			'<div class="reading-time-display">%s%s%s</div>',
			$icon,
			esc_html( $custom_label ),
			esc_html( $time_text )
		);
	}

	/**
	 * Add reading time to post content.
	 *
	 * @param string $content Post content.
	 * @return string Modified content.
	 */
	public function add_reading_time_to_content( $content ) {
		// Only add to singular posts/pages.
		if ( ! is_singular() ) {
			return $content;
		}

		$settings = get_option( 'rte_settings', array() );
		$display_location = isset( $settings['display_location'] ) ? $settings['display_location'] : 'before';
		$enabled_post_types = isset( $settings['enabled_post_types'] ) ? $settings['enabled_post_types'] : array( 'post', 'page' );

		// Check if current post type is enabled.
		if ( ! in_array( get_post_type(), $enabled_post_types, true ) ) {
			return $content;
		}

		// Don't add for manual placement.
		if ( 'manual' === $display_location ) {
			return $content;
		}

		$reading_time = $this->calculate_reading_time( $content );
		$reading_time_html = $this->format_reading_time( $reading_time );

		// Add reading time based on location setting.
		switch ( $display_location ) {
			case 'before':
				$content = $reading_time_html . $content;
				break;
			case 'after':
				$content = $content . $reading_time_html;
				break;
			case 'both':
				$content = $reading_time_html . $content . $reading_time_html;
				break;
		}

		return $content;
	}

	/**
	 * Shortcode for manual placement.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string Reading time HTML.
	 */
	public function reading_time_shortcode( $atts ) {
		global $post;

		if ( ! $post ) {
			return '';
		}

		$reading_time = $this->calculate_reading_time( $post->post_content );
		return $this->format_reading_time( $reading_time );
	}
}
