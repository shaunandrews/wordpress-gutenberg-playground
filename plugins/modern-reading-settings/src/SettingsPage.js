/**
 * Main Settings Page component.
 */

import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as noticesStore } from '@wordpress/notices';
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Spinner,
	Notice,
} from '@wordpress/components';

import HomepageSettings from './components/HomepageSettings';
import PaginationSettings from './components/PaginationSettings';
import FeedSettings from './components/FeedSettings';
import VisibilitySettings from './components/VisibilitySettings';

const SettingsPage = () => {
	const [ hasEdits, setHasEdits ] = useState( false );
	const [ localSettings, setLocalSettings ] = useState( null );
	const [ saveError, setSaveError ] = useState( null );
	const [ saveSuccess, setSaveSuccess ] = useState( false );

	// Fetch site settings from core-data.
	const { settings, isLoading, isSaving, pages } = useSelect( ( select ) => {
		const { getEntityRecord, hasFinishedResolution, isSavingEntityRecord } =
			select( coreStore );

		const siteSettings = getEntityRecord( 'root', 'site' );
		const isResolving = ! hasFinishedResolution( 'getEntityRecord', [
			'root',
			'site',
		] );

		return {
			settings: siteSettings,
			isLoading: isResolving,
			isSaving: isSavingEntityRecord( 'root', 'site' ),
			pages: window.mrsData?.pages || [],
		};
	}, [] );

	// Initialize local settings when fetched.
	useEffect( () => {
		if ( settings && ! localSettings ) {
			setLocalSettings( {
				show_on_front: settings.show_on_front,
				page_on_front: settings.page_on_front,
				page_for_posts: settings.page_for_posts,
				posts_per_page: settings.posts_per_page,
				posts_per_rss: settings.posts_per_rss,
				rss_use_excerpt: settings.rss_use_excerpt,
				blog_public: settings.blog_public,
			} );
		}
	}, [ settings, localSettings ] );

	const { saveEntityRecord } = useDispatch( coreStore );

	const updateSetting = useCallback( ( key, value ) => {
		setLocalSettings( ( prev ) => ( { ...prev, [ key ]: value } ) );
		setHasEdits( true );
		setSaveError( null );
		setSaveSuccess( false );
	}, [] );

	const saveSettings = async () => {
		setSaveError( null );
		setSaveSuccess( false );

		try {
			await saveEntityRecord( 'root', 'site', localSettings );
			setSaveSuccess( true );
			setHasEdits( false );
		} catch ( error ) {
			setSaveError(
				error.message ||
					__( 'Failed to save settings.', 'modern-reading-settings' )
			);
		}
	};

	if ( isLoading || ! localSettings ) {
		return (
			<div className="mrs-loading">
				<Spinner />
				<p>
					{ __( 'Loading settings...', 'modern-reading-settings' ) }
				</p>
			</div>
		);
	}

	return (
		<div className="mrs-settings">
			<h1>{ __( 'Reading Settings', 'modern-reading-settings' ) }</h1>

			{ saveError && (
				<Notice
					status="error"
					isDismissible
					onRemove={ () => setSaveError( null ) }
				>
					{ saveError }
				</Notice>
			) }

			{ saveSuccess && (
				<Notice
					status="success"
					isDismissible
					onRemove={ () => setSaveSuccess( false ) }
				>
					{ __( 'Settings saved.', 'modern-reading-settings' ) }
				</Notice>
			) }

			<Card>
				<CardHeader>
					<h2>
						{ __( 'Content Display', 'modern-reading-settings' ) }
					</h2>
				</CardHeader>
				<CardBody>
					<HomepageSettings
						settings={ localSettings }
						updateSetting={ updateSetting }
						pages={ pages }
					/>
					<PaginationSettings
						settings={ localSettings }
						updateSetting={ updateSetting }
					/>
					<FeedSettings
						settings={ localSettings }
						updateSetting={ updateSetting }
					/>
					<VisibilitySettings
						settings={ localSettings }
						updateSetting={ updateSetting }
					/>
				</CardBody>
				<CardFooter>
					<Button
						variant="primary"
						onClick={ saveSettings }
						isBusy={ isSaving }
						disabled={ isSaving || ! hasEdits }
					>
						{ isSaving
							? __(
									'Saving...',
									'modern-reading-settings'
							  )
							: __(
									'Save Changes',
									'modern-reading-settings'
							  ) }
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default SettingsPage;
