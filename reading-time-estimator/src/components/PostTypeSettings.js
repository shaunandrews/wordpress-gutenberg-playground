/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Panel, PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

/**
 * Post Type Settings Component
 */
const PostTypeSettings = ( { settings, updateSetting, postTypes } ) => {
	const togglePostType = ( postTypeName, enabled ) => {
		const currentTypes = settings.enabled_post_types || [];
		let newTypes;

		if ( enabled ) {
			// Add post type if not already present.
			newTypes = currentTypes.includes( postTypeName )
				? currentTypes
				: [ ...currentTypes, postTypeName ];
		} else {
			// Remove post type.
			newTypes = currentTypes.filter( ( type ) => type !== postTypeName );
		}

		updateSetting( 'enabled_post_types', newTypes );
	};

	return (
		<Panel>
			<PanelBody title={ __( 'Enabled Post Types', 'reading-time-estimator' ) } initialOpen={ true }>
				<p style={ { marginTop: 0, marginBottom: '16px', color: 'var(--wp-components-color-foreground)' } }>
					{ __( 'Choose which post types should display reading time.', 'reading-time-estimator' ) }
				</p>
				{ postTypes.map( ( postType ) => (
					<PanelRow key={ postType.name }>
						<ToggleControl
							label={ postType.label }
							checked={ settings.enabled_post_types?.includes( postType.name ) || false }
							onChange={ ( enabled ) => togglePostType( postType.name, enabled ) }
						/>
					</PanelRow>
				) ) }
			</PanelBody>
		</Panel>
	);
};

export default PostTypeSettings;
