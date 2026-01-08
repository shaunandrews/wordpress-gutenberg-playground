/**
 * Modern Reading Settings entry point.
 */

import { createRoot } from '@wordpress/element';
import SettingsPage from './SettingsPage';
import './style.scss';

document.addEventListener( 'DOMContentLoaded', () => {
	const root = document.getElementById( 'modern-reading-settings-root' );
	if ( root ) {
		createRoot( root ).render( <SettingsPage /> );
	}
} );
