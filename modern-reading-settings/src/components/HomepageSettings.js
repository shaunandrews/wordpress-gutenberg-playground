/**
 * Homepage display settings component.
 */

import { __ } from '@wordpress/i18n';
import {
	Panel,
	PanelBody,
	PanelRow,
	RadioControl,
	SelectControl,
	Notice,
} from '@wordpress/components';

const HomepageSettings = ( { settings, updateSetting, pages } ) => {
	const pageOptions = [
		{
			label: __( '— Select —', 'modern-reading-settings' ),
			value: 0,
		},
		...pages.map( ( page ) => ( {
			label: page.title || __( '(no title)', 'modern-reading-settings' ),
			value: page.id,
		} ) ),
	];

	const showWarning =
		settings.show_on_front === 'page' &&
		settings.page_on_front === settings.page_for_posts &&
		settings.page_on_front !== 0;

	return (
		<Panel>
			<PanelBody
				title={ __(
					'Your homepage displays',
					'modern-reading-settings'
				) }
				initialOpen={ true }
			>
				<PanelRow>
					<RadioControl
						selected={ settings.show_on_front }
						options={ [
							{
								label: __(
									'Your latest posts',
									'modern-reading-settings'
								),
								value: 'posts',
							},
							{
								label: __(
									'A static page',
									'modern-reading-settings'
								),
								value: 'page',
							},
						] }
						onChange={ ( value ) =>
							updateSetting( 'show_on_front', value )
						}
					/>
				</PanelRow>

				{ settings.show_on_front === 'page' && (
					<>
						<PanelRow>
							<SelectControl
								label={ __(
									'Homepage',
									'modern-reading-settings'
								) }
								value={ settings.page_on_front }
								options={ pageOptions }
								onChange={ ( value ) =>
									updateSetting(
										'page_on_front',
										parseInt( value, 10 )
									)
								}
							/>
						</PanelRow>
						<PanelRow>
							<SelectControl
								label={ __(
									'Posts page',
									'modern-reading-settings'
								) }
								value={ settings.page_for_posts }
								options={ pageOptions }
								onChange={ ( value ) =>
									updateSetting(
										'page_for_posts',
										parseInt( value, 10 )
									)
								}
							/>
						</PanelRow>

						{ showWarning && (
							<Notice status="warning" isDismissible={ false }>
								{ __(
									'Warning: Homepage and Posts page should not be the same!',
									'modern-reading-settings'
								) }
							</Notice>
						) }
					</>
				) }
			</PanelBody>
		</Panel>
	);
};

export default HomepageSettings;
