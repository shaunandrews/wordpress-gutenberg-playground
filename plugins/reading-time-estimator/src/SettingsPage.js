/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Notice,
	Spinner,
	Flex,
	FlexItem,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import GeneralSettings from './components/GeneralSettings';
import PostTypeSettings from './components/PostTypeSettings';
import DisplaySettings from './components/DisplaySettings';
import Preview from './components/Preview';

/**
 * Settings Page Component
 */
const SettingsPage = () => {
	const [settings, setSettings] = useState( null );
	const [postTypes, setPostTypes] = useState( [] );
	const [isLoading, setIsLoading] = useState( true );
	const [isSaving, setIsSaving] = useState( false );
	const [notice, setNotice] = useState( null );

	// Load initial settings and post types.
	useEffect( () => {
		Promise.all( [
			apiFetch( { path: '/reading-time-estimator/v1/settings' } ),
			apiFetch( { path: '/reading-time-estimator/v1/post-types' } ),
		] )
			.then( ( [ settingsData, postTypesData ] ) => {
				setSettings( settingsData );
				setPostTypes( postTypesData );
				setIsLoading( false );
			} )
			.catch( ( error ) => {
				console.error( 'Error loading settings:', error );
				setNotice( {
					status: 'error',
					message: __( 'Failed to load settings.', 'reading-time-estimator' ),
				} );
				setIsLoading( false );
			} );
	}, [] );

	// Update a specific setting.
	const updateSetting = ( key, value ) => {
		setSettings( ( prev ) => ( {
			...prev,
			[ key ]: value,
		} ) );
	};

	// Save settings to server.
	const saveSettings = () => {
		setIsSaving( true );
		setNotice( null );

		apiFetch( {
			path: '/reading-time-estimator/v1/settings',
			method: 'POST',
			data: settings,
		} )
			.then( ( response ) => {
				setNotice( {
					status: 'success',
					message: response.message || __( 'Settings saved successfully!', 'reading-time-estimator' ),
				} );
				setIsSaving( false );
			} )
			.catch( ( error ) => {
				console.error( 'Error saving settings:', error );
				setNotice( {
					status: 'error',
					message: __( 'Failed to save settings.', 'reading-time-estimator' ),
				} );
				setIsSaving( false );
			} );
	};

	if ( isLoading ) {
		return (
			<div className="reading-time-settings-loading">
				<Spinner />
				<p>{ __( 'Loading settings...', 'reading-time-estimator' ) }</p>
			</div>
		);
	}

	return (
		<div className="reading-time-settings">
			<h1>{ __( 'Reading Time Estimator Settings', 'reading-time-estimator' ) }</h1>

			{ notice && (
				<Notice
					status={ notice.status }
					onRemove={ () => setNotice( null ) }
					isDismissible
				>
					{ notice.message }
				</Notice>
			) }

			<Flex gap={ 4 } align="flex-start" wrap>
				<FlexItem style={ { flex: '1 1 60%', minWidth: '300px' } }>
					<Card>
						<CardHeader>
							<h2>{ __( 'Settings', 'reading-time-estimator' ) }</h2>
						</CardHeader>
						<CardBody>
							<GeneralSettings
								settings={ settings }
								updateSetting={ updateSetting }
							/>

							<div style={ { marginTop: '24px' } }>
								<PostTypeSettings
									settings={ settings }
									updateSetting={ updateSetting }
									postTypes={ postTypes }
								/>
							</div>

							<div style={ { marginTop: '24px' } }>
								<DisplaySettings
									settings={ settings }
									updateSetting={ updateSetting }
								/>
							</div>
						</CardBody>
						<CardFooter>
							<Button
								variant="primary"
								onClick={ saveSettings }
								isBusy={ isSaving }
								disabled={ isSaving }
							>
								{ isSaving
									? __( 'Saving...', 'reading-time-estimator' )
									: __( 'Save Settings', 'reading-time-estimator' ) }
							</Button>
						</CardFooter>
					</Card>
				</FlexItem>

				<FlexItem style={ { flex: '1 1 35%', minWidth: '250px' } }>
					<Preview settings={ settings } />
				</FlexItem>
			</Flex>
		</div>
	);
};

export default SettingsPage;
