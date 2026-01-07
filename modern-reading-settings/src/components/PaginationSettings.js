/**
 * Pagination settings component.
 */

import { __ } from '@wordpress/i18n';
import { Panel, PanelBody, PanelRow, TextControl } from '@wordpress/components';

const PaginationSettings = ( { settings, updateSetting } ) => {
	return (
		<Panel>
			<PanelBody
				title={ __( 'Blog Pages', 'modern-reading-settings' ) }
				initialOpen={ true }
			>
				<PanelRow>
					<TextControl
						label={ __(
							'Blog pages show at most',
							'modern-reading-settings'
						) }
						help={ __( 'posts', 'modern-reading-settings' ) }
						type="number"
						min={ 1 }
						value={ settings.posts_per_page }
						onChange={ ( value ) =>
							updateSetting(
								'posts_per_page',
								parseInt( value, 10 ) || 1
							)
						}
					/>
				</PanelRow>
			</PanelBody>
		</Panel>
	);
};

export default PaginationSettings;
