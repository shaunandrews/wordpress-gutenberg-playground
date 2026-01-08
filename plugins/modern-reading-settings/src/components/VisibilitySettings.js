/**
 * Search engine visibility settings component.
 */

import { __ } from '@wordpress/i18n';
import { Panel, PanelBody, PanelRow, ToggleControl } from '@wordpress/components';

const VisibilitySettings = ( { settings, updateSetting } ) => {
	// blog_public: 1 = visible, 0 = discouraged
	const isDiscouraged =
		settings.blog_public === 0 || settings.blog_public === '0';

	return (
		<Panel>
			<PanelBody
				title={ __(
					'Search Engine Visibility',
					'modern-reading-settings'
				) }
				initialOpen={ true }
			>
				<PanelRow>
					<ToggleControl
						label={ __(
							'Discourage search engines from indexing this site',
							'modern-reading-settings'
						) }
						help={ __(
							'It is up to search engines to honor this request.',
							'modern-reading-settings'
						) }
						checked={ isDiscouraged }
						onChange={ ( checked ) =>
							updateSetting( 'blog_public', checked ? 0 : 1 )
						}
					/>
				</PanelRow>
			</PanelBody>
		</Panel>
	);
};

export default VisibilitySettings;
