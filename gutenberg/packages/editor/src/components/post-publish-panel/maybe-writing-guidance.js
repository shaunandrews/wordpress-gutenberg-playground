/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { store as coreStore } from '@wordpress/core-data';

function MaybeWritingGuidancePanel() {
	const { expectations, goals } = useSelect( ( select ) => {
		const { getEntityRecord } = select( coreStore );
		const siteSettings = getEntityRecord( 'root', 'site' );

		return {
			expectations: siteSettings?.wp_writing_guidance_expectations,
			goals: siteSettings?.wp_writing_guidance_goals,
		};
	}, [] );

	// Don't render if neither setting has a value.
	if ( ! expectations && ! goals ) {
		return null;
	}

	return (
		<PanelBody initialOpen title={ __( 'Writing Guidance' ) }>
			<p className="editor-post-publish-panel__writing-guidance-help">
				{ __(
					'Review these guidelines from your site editors before publishing.'
				) }
			</p>
			{ expectations && (
				<div className="editor-post-publish-panel__writing-guidance-section">
					<strong>{ __( 'Expectations' ) }</strong>
					<p>{ expectations }</p>
				</div>
			) }
			{ goals && (
				<div className="editor-post-publish-panel__writing-guidance-section">
					<strong>{ __( 'Goals' ) }</strong>
					<p>{ goals }</p>
				</div>
			) }
		</PanelBody>
	);
}

export default MaybeWritingGuidancePanel;
