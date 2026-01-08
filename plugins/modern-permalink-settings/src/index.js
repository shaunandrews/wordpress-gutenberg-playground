/**
 * WordPress dependencies
 */
import { createRoot } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SettingsPage from './SettingsPage';
import './style.scss';

// Mount the app.
const container = document.getElementById( 'mps-root' );
if ( container ) {
	const root = createRoot( container );
	root.render( <SettingsPage /> );
}
