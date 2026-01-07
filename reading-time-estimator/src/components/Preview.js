/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Card, CardHeader, CardBody } from '@wordpress/components';

/**
 * Preview Component
 */
const Preview = ( { settings } ) => {
	// Calculate a sample reading time based on ~800 words (4 minutes at 200 wpm).
	const sampleWordCount = 800;
	const readingTime = Math.max( 1, Math.round( sampleWordCount / settings.words_per_minute ) );

	const icon = settings.show_icon ? '📖 ' : '';
	const label = settings.custom_label || 'Reading time: ';
	const timeText = readingTime === 1 ? `${readingTime} minute` : `${readingTime} minutes`;

	return (
		<Card className="preview-card">
			<CardHeader>
				<h2>{ __( 'Preview', 'reading-time-estimator' ) }</h2>
			</CardHeader>
			<CardBody>
				<p style={ { marginTop: 0, marginBottom: '16px', color: 'var(--wp-components-color-foreground)' } }>
					{ __( 'This is how reading time will appear on your posts:', 'reading-time-estimator' ) }
				</p>

				<div
					className="reading-time-preview-display"
					style={ {
						padding: '16px',
						background: 'var(--wp-components-color-background)',
						border: '1px solid var(--wp-components-color-gray-200)',
						borderRadius: '4px',
						fontSize: '14px',
						color: 'var(--wp-components-color-foreground)',
					} }
				>
					{ icon }
					{ label }
					{ timeText }
				</div>

				{ settings.display_location === 'manual' && (
					<p
						style={ {
							marginTop: '16px',
							marginBottom: 0,
							padding: '12px',
							background: 'var(--wp-components-color-gray-100)',
							borderRadius: '4px',
							fontSize: '13px',
							color: 'var(--wp-components-color-foreground)',
						} }
					>
						<strong>{ __( 'Manual placement:', 'reading-time-estimator' ) }</strong>
						<br />
						{ __( 'Use the shortcode ', 'reading-time-estimator' ) }
						<code style={ { padding: '2px 6px', background: 'var(--wp-components-color-gray-200)', borderRadius: '3px' } }>
							[reading_time]
						</code>
						{ __( ' to display reading time anywhere in your content.', 'reading-time-estimator' ) }
					</p>
				) }
			</CardBody>
		</Card>
	);
};

export default Preview;
