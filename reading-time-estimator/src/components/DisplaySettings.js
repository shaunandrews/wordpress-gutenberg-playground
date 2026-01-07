/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Panel, PanelBody, PanelRow, ToggleControl, SelectControl } from '@wordpress/components';

/**
 * Display Settings Component
 */
const DisplaySettings = ( { settings, updateSetting } ) => {
	return (
		<Panel>
			<PanelBody title={ __( 'Display Options', 'reading-time-estimator' ) } initialOpen={ true }>
				<PanelRow>
					<ToggleControl
						label={ __( 'Show Icon', 'reading-time-estimator' ) }
						help={ __( 'Display a book icon (📖) before the reading time.', 'reading-time-estimator' ) }
						checked={ settings.show_icon }
						onChange={ ( value ) => updateSetting( 'show_icon', value ) }
					/>
				</PanelRow>

				<PanelRow>
					<SelectControl
						label={ __( 'Rounding Preference', 'reading-time-estimator' ) }
						help={ __( 'How to round the reading time calculation.', 'reading-time-estimator' ) }
						value={ settings.rounding }
						options={ [
							{ label: __( 'Round to Nearest', 'reading-time-estimator' ), value: 'round' },
							{ label: __( 'Round Up', 'reading-time-estimator' ), value: 'ceil' },
							{ label: __( 'Round Down', 'reading-time-estimator' ), value: 'floor' },
						] }
						onChange={ ( value ) => updateSetting( 'rounding', value ) }
					/>
				</PanelRow>
			</PanelBody>
		</Panel>
	);
};

export default DisplaySettings;
