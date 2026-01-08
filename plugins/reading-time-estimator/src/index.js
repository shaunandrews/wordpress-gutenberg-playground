/**
 * WordPress dependencies
 */
import { render } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SettingsPage from './SettingsPage';
import './style.scss';

/**
 * Initialize the settings page.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const root = document.getElementById( 'reading-time-settings-root' );

	if ( root ) {
		render( <SettingsPage />, root );
	}
} );
