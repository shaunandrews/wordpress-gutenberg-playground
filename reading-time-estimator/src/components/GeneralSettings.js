/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Panel, PanelBody, PanelRow, TextControl, SelectControl } from '@wordpress/components';

/**
 * General Settings Component
 */
const GeneralSettings = ( { settings, updateSetting } ) => {
	return (
		<Panel>
			<PanelBody title={ __( 'General Settings', 'reading-time-estimator' ) } initialOpen={ true }>
				<PanelRow>
					<TextControl
						label={ __( 'Words Per Minute', 'reading-time-estimator' ) }
						help={ __( 'Average reading speed. Default is 200 words per minute.', 'reading-time-estimator' ) }
						type="number"
						value={ settings.words_per_minute }
						onChange={ ( value ) => updateSetting( 'words_per_minute', parseInt( value, 10 ) ) }
						min={ 1 }
						max={ 1000 }
					/>
				</PanelRow>

				<PanelRow>
					<SelectControl
						label={ __( 'Display Location', 'reading-time-estimator' ) }
						help={ __( 'Where to display the reading time on your posts.', 'reading-time-estimator' ) }
						value={ settings.display_location }
						options={ [
							{ label: __( 'Before Content', 'reading-time-estimator' ), value: 'before' },
							{ label: __( 'After Content', 'reading-time-estimator' ), value: 'after' },
							{ label: __( 'Both Before and After', 'reading-time-estimator' ), value: 'both' },
							{ label: __( 'Manual (use shortcode)', 'reading-time-estimator' ), value: 'manual' },
						] }
						onChange={ ( value ) => updateSetting( 'display_location', value ) }
					/>
				</PanelRow>

				<PanelRow>
					<TextControl
						label={ __( 'Custom Label', 'reading-time-estimator' ) }
						help={ __( 'Text to display before the reading time.', 'reading-time-estimator' ) }
						value={ settings.custom_label }
						onChange={ ( value ) => updateSetting( 'custom_label', value ) }
					/>
				</PanelRow>
			</PanelBody>
		</Panel>
	);
};

export default GeneralSettings;
