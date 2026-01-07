/**
 * Feed settings component.
 */

import { __ } from '@wordpress/i18n';
import {
	Panel,
	PanelBody,
	PanelRow,
	TextControl,
	RadioControl,
	ExternalLink,
} from '@wordpress/components';

const FeedSettings = ( { settings, updateSetting } ) => {
	return (
		<Panel>
			<PanelBody
				title={ __( 'Syndication Feeds', 'modern-reading-settings' ) }
				initialOpen={ true }
			>
				<PanelRow>
					<TextControl
						label={ __(
							'Syndication feeds show the most recent',
							'modern-reading-settings'
						) }
						help={ __( 'items', 'modern-reading-settings' ) }
						type="number"
						min={ 1 }
						value={ settings.posts_per_rss }
						onChange={ ( value ) =>
							updateSetting(
								'posts_per_rss',
								parseInt( value, 10 ) || 1
							)
						}
					/>
				</PanelRow>

				<PanelRow>
					<RadioControl
						label={ __(
							'For each post in a feed, include',
							'modern-reading-settings'
						) }
						selected={ String( settings.rss_use_excerpt ) }
						options={ [
							{
								label: __(
									'Full text',
									'modern-reading-settings'
								),
								value: '0',
							},
							{
								label: __(
									'Excerpt',
									'modern-reading-settings'
								),
								value: '1',
							},
						] }
						onChange={ ( value ) =>
							updateSetting(
								'rss_use_excerpt',
								parseInt( value, 10 )
							)
						}
					/>
				</PanelRow>

				<p className="mrs-description">
					<ExternalLink href="https://developer.wordpress.org/advanced-administration/wordpress/feeds/">
						{ __(
							'Learn more about feeds',
							'modern-reading-settings'
						) }
					</ExternalLink>
				</p>
			</PanelBody>
		</Panel>
	);
};

export default FeedSettings;
