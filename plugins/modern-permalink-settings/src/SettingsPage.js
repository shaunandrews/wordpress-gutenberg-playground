/**
 * WordPress dependencies
 */
import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardDivider,
	Spinner,
	Notice,
	TextControl,
	RadioControl,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	__experimentalVStack as VStack,
} from '@wordpress/components';

/**
 * Permalink preview illustration - unique for each structure type.
 */
const PermalinkIllustration = ( { selectedOption } ) => {
	const illustrations = {
		// Plain: Question mark with ID number
		plain: (
			<g>
				<rect x="30" y="20" width="60" height="45" rx="3" fill="#fff" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" />
				<text x="60" y="38" textAnchor="middle" fill="var(--wp-components-color-gray-400, #999)" fontSize="16" fontWeight="bold">?p=</text>
				<text x="60" y="54" textAnchor="middle" fill="var(--wp-components-color-gray-600, #666)" fontSize="14" fontFamily="monospace">123</text>
			</g>
		),
		// Day and name: Calendar with day grid
		day_name: (
			<g>
				<rect x="30" y="18" width="60" height="50" rx="3" fill="#fff" stroke="var(--wp-admin-theme-color, #3858e9)" strokeWidth="2" />
				<rect x="30" y="18" width="60" height="14" rx="3" fill="var(--wp-admin-theme-color, #3858e9)" />
				<circle cx="42" cy="25" r="2" fill="#fff" />
				<circle cx="78" cy="25" r="2" fill="#fff" />
				{ /* Day grid */ }
				{ [0, 1, 2, 3, 4].map( ( row ) =>
					[0, 1, 2, 3, 4, 5, 6].map( ( col ) => (
						<rect
							key={ `${ row }-${ col }` }
							x={ 34 + col * 7.5 }
							y={ 36 + row * 6 }
							width="5"
							height="4"
							rx="1"
							fill={ row === 1 && col === 3 ? 'var(--wp-admin-theme-color, #3858e9)' : 'var(--wp-components-color-gray-200, #e0e0e0)' }
						/>
					) )
				) }
			</g>
		),
		// Month and name: Calendar with month view
		month_name: (
			<g>
				<rect x="30" y="18" width="60" height="50" rx="3" fill="#fff" stroke="var(--wp-admin-theme-color, #3858e9)" strokeWidth="2" />
				<rect x="30" y="18" width="60" height="14" rx="3" fill="var(--wp-admin-theme-color, #3858e9)" />
				<circle cx="42" cy="25" r="2" fill="#fff" />
				<circle cx="78" cy="25" r="2" fill="#fff" />
				{ /* Month blocks */ }
				{ [0, 1, 2].map( ( row ) =>
					[0, 1, 2, 3].map( ( col ) => (
						<rect
							key={ `${ row }-${ col }` }
							x={ 35 + col * 13 }
							y={ 38 + row * 9 }
							width="10"
							height="6"
							rx="1"
							fill={ row === 0 && col === 0 ? 'var(--wp-admin-theme-color, #3858e9)' : 'var(--wp-components-color-gray-200, #e0e0e0)' }
						/>
					) )
				) }
			</g>
		),
		// Numeric: Archive boxes with numbers
		numeric: (
			<g>
				{ /* Archive boxes */ }
				<rect x="25" y="25" width="25" height="35" rx="2" fill="var(--wp-components-color-gray-100, #f0f0f0)" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="1.5" />
				<rect x="47" y="20" width="25" height="40" rx="2" fill="#fff" stroke="var(--wp-admin-theme-color, #3858e9)" strokeWidth="2" />
				<rect x="69" y="28" width="25" height="32" rx="2" fill="var(--wp-components-color-gray-100, #f0f0f0)" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="1.5" />
				{ /* Numbers */ }
				<text x="37.5" y="47" textAnchor="middle" fill="var(--wp-components-color-gray-400, #999)" fontSize="10" fontFamily="monospace">01</text>
				<text x="59.5" y="44" textAnchor="middle" fill="var(--wp-admin-theme-color, #3858e9)" fontSize="12" fontWeight="bold" fontFamily="monospace">42</text>
				<text x="81.5" y="48" textAnchor="middle" fill="var(--wp-components-color-gray-400, #999)" fontSize="10" fontFamily="monospace">99</text>
			</g>
		),
		// Post name: Clean document with slug
		post_name: (
			<g>
				<rect x="32" y="15" width="56" height="50" rx="3" fill="#fff" stroke="var(--wp-admin-theme-color, #3858e9)" strokeWidth="2" />
				{ /* Document lines */ }
				<line x1="40" y1="28" x2="80" y2="28" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
				<line x1="40" y1="36" x2="72" y2="36" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
				<line x1="40" y1="44" x2="76" y2="44" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
				{ /* Slug badge */ }
				<rect x="38" y="50" width="44" height="12" rx="6" fill="var(--wp-admin-theme-color, #3858e9)" />
				<text x="60" y="59" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="monospace">/my-post/</text>
			</g>
		),
		// Custom: Building blocks / puzzle
		custom: (
			<g>
				{ /* Building blocks */ }
				<rect x="28" y="40" width="20" height="20" rx="2" fill="var(--wp-admin-theme-color, #3858e9)" />
				<rect x="50" y="40" width="20" height="20" rx="2" fill="var(--wp-components-color-accent, #3858e9)" opacity="0.6" />
				<rect x="72" y="40" width="20" height="20" rx="2" fill="var(--wp-components-color-gray-300, #ddd)" strokeDasharray="3 2" stroke="var(--wp-components-color-gray-400, #999)" strokeWidth="1.5" fill="none" />
				<rect x="39" y="22" width="20" height="16" rx="2" fill="var(--wp-admin-theme-color, #3858e9)" opacity="0.8" />
				<rect x="61" y="22" width="20" height="16" rx="2" fill="var(--wp-components-color-gray-200, #e0e0e0)" />
				{ /* Percent signs on blocks */ }
				<text x="38" y="53" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="monospace">%</text>
				<text x="60" y="53" textAnchor="middle" fill="#fff" fontSize="8" fontFamily="monospace">%</text>
				<text x="49" y="33" textAnchor="middle" fill="#fff" fontSize="7" fontFamily="monospace">%</text>
			</g>
		),
	};

	return (
		<svg
			className="mps-permalink-illustration"
			viewBox="0 0 120 80"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			{ illustrations[ selectedOption ] || illustrations.post_name }
		</svg>
	);
};

/**
 * Tag chip component for available structure tags.
 */
const TagChip = ( { tag, description, onClick } ) => (
	<button
		type="button"
		className="mps-tag-chip"
		onClick={ () => onClick( tag ) }
		title={ description }
	>
		{ tag }
	</button>
);

const SettingsPage = () => {
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ hasEdits, setHasEdits ] = useState( false );
	const [ notice, setNotice ] = useState( null );

	const [ permalinkStructure, setPermalinkStructure ] = useState( '' );
	const [ customStructure, setCustomStructure ] = useState( '' );
	const [ categoryBase, setCategoryBase ] = useState( '' );
	const [ tagBase, setTagBase ] = useState( '' );
	const [ selectedOption, setSelectedOption ] = useState( 'plain' );

	const homeUrl = window.mpsData?.homeUrl || 'https://example.com';
	const structureOptions = window.mpsData?.structureOptions || {};
	const availableTags = window.mpsData?.availableTags || {};

	// Load current settings.
	useEffect( () => {
		const loadSettings = async () => {
			try {
				const response = await apiFetch( { path: '/wp/v2/settings' } );
				const structure = response.permalink_structure || '';

				setPermalinkStructure( structure );
				setCategoryBase( response.category_base || '' );
				setTagBase( response.tag_base || '' );

				// Determine which option is selected.
				let foundOption = 'custom';
				for ( const [ key, option ] of Object.entries( structureOptions ) ) {
					if ( key !== 'custom' && option.value === structure ) {
						foundOption = key;
						break;
					}
				}
				setSelectedOption( foundOption );

				if ( foundOption === 'custom' ) {
					setCustomStructure( structure );
				}

				setIsLoading( false );
			} catch ( error ) {
				setNotice( {
					status: 'error',
					message: error.message || __( 'Failed to load settings.', 'modern-permalink-settings' ),
				} );
				setIsLoading( false );
			}
		};

		loadSettings();
	}, [ structureOptions ] );

	const handleOptionChange = useCallback( ( option ) => {
		setSelectedOption( option );
		setHasEdits( true );
		setNotice( null );

		if ( option === 'custom' ) {
			setPermalinkStructure( customStructure );
		} else {
			setPermalinkStructure( structureOptions[ option ]?.value || '' );
		}
	}, [ customStructure, structureOptions ] );

	const handleCustomStructureChange = useCallback( ( value ) => {
		setCustomStructure( value );
		setPermalinkStructure( value );
		setSelectedOption( 'custom' );
		setHasEdits( true );
		setNotice( null );
	}, [] );

	const handleTagClick = useCallback( ( tag ) => {
		// Add a leading slash if the structure doesn't end with one
		const separator = customStructure.endsWith( '/' ) || customStructure === '' ? '' : '/';
		const newStructure = customStructure + separator + tag + '/';
		setCustomStructure( newStructure );
		setPermalinkStructure( newStructure );
		setSelectedOption( 'custom' );
		setHasEdits( true );
		setNotice( null );
	}, [ customStructure ] );

	const handleCategoryBaseChange = useCallback( ( value ) => {
		setCategoryBase( value );
		setHasEdits( true );
		setNotice( null );
	}, [] );

	const handleTagBaseChange = useCallback( ( value ) => {
		setTagBase( value );
		setHasEdits( true );
		setNotice( null );
	}, [] );

	const saveSettings = async () => {
		setIsSaving( true );
		setNotice( null );

		try {
			await apiFetch( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: {
					permalink_structure: permalinkStructure,
					category_base: categoryBase,
					tag_base: tagBase,
				},
			} );

			setNotice( {
				status: 'success',
				message: __( 'Permalink settings saved.', 'modern-permalink-settings' ),
			} );
			setHasEdits( false );
		} catch ( error ) {
			setNotice( {
				status: 'error',
				message: error.message || __( 'Failed to save settings.', 'modern-permalink-settings' ),
			} );
		}

		setIsSaving( false );
	};

	// Build radio options.
	const radioOptions = Object.entries( structureOptions ).map( ( [ key, option ] ) => ( {
		label: (
			<div className="mps-structure-option">
				<span className="mps-structure-option__label">{ option.label }</span>
				{ option.example && (
					<code className="mps-structure-option__example">{ option.example }</code>
				) }
			</div>
		),
		value: key,
	} ) );

	if ( isLoading ) {
		return (
			<div className="mps-loading">
				<Spinner />
				<Text>{ __( 'Loading...', 'modern-permalink-settings' ) }</Text>
			</div>
		);
	}

	const currentExample = selectedOption === 'custom'
		? homeUrl + customStructure.replace( '%postname%', 'sample-post' ).replace( '%year%', new Date().getFullYear() ).replace( '%monthnum%', String( new Date().getMonth() + 1 ).padStart( 2, '0' ) ).replace( '%day%', String( new Date().getDate() ).padStart( 2, '0' ) ).replace( '%post_id%', '123' )
		: structureOptions[ selectedOption ]?.example || homeUrl + '/?p=123';

	return (
		<div className="mps-settings">
			<header className="mps-settings__header">
				<Heading level={ 1 }>{ __( 'Permalinks', 'modern-permalink-settings' ) }</Heading>
				<Button
					variant="primary"
					onClick={ saveSettings }
					isBusy={ isSaving }
					disabled={ isSaving || ! hasEdits }
				>
					{ isSaving ? __( 'Saving...', 'modern-permalink-settings' ) : __( 'Save Changes', 'modern-permalink-settings' ) }
				</Button>
			</header>

			<div className="mps-settings__content">
				{ notice && (
					<Notice status={ notice.status } isDismissible onRemove={ () => setNotice( null ) }>
						{ notice.message }
					</Notice>
				) }

				<VStack spacing={ 4 }>
					{ /* Card 1: Permalink Structure */ }
					<Card>
						<CardHeader>
							<VStack spacing={ 1 }>
								<Heading level={ 3 }>{ __( 'Structure', 'modern-permalink-settings' ) }</Heading>
								<Text className="mps-help-text">
									{ __( 'Choose how your post URLs are formatted. Clean URLs help with SEO and readability.', 'modern-permalink-settings' ) }
								</Text>
							</VStack>
						</CardHeader>
						<CardBody>
							<div className="mps-structure-section">
								<div className="mps-structure-section__illustration">
									<PermalinkIllustration selectedOption={ selectedOption } />
								</div>
								<div className="mps-structure-section__controls">
									<RadioControl
										selected={ selectedOption }
										options={ radioOptions }
										onChange={ handleOptionChange }
										className="mps-structure-radio"
									/>
								</div>
							</div>
						</CardBody>
						{ selectedOption === 'custom' && (
							<>
								<CardDivider />
								<CardBody>
									<VStack spacing={ 3 }>
										<TextControl
											label={ __( 'Custom structure', 'modern-permalink-settings' ) }
											value={ customStructure }
											onChange={ handleCustomStructureChange }
											placeholder="/%postname%/"
											autoComplete="off"
											__nextHasNoMarginBottom
											__next40pxDefaultSize
										/>
										<div className="mps-tags">
											<Text className="mps-tags__label">
												{ __( 'Available tags:', 'modern-permalink-settings' ) }
											</Text>
											<div className="mps-tags__list">
												{ Object.entries( availableTags ).map( ( [ tag, description ] ) => (
													<TagChip
														key={ tag }
														tag={ tag }
														description={ description }
														onClick={ handleTagClick }
													/>
												) ) }
											</div>
										</div>
									</VStack>
								</CardBody>
							</>
						) }
						<CardDivider />
						<CardBody>
							<div className="mps-preview">
								<Text className="mps-preview__label">
									{ __( 'Preview:', 'modern-permalink-settings' ) }
								</Text>
								<code className="mps-preview__url">{ currentExample }</code>
							</div>
						</CardBody>
					</Card>

					{ /* Card 2: Optional Settings */ }
					<Card>
						<CardHeader>
							<VStack spacing={ 1 }>
								<Heading level={ 3 }>{ __( 'Optional', 'modern-permalink-settings' ) }</Heading>
								<Text className="mps-help-text">
									{ __( 'Customize the base slug for category and tag archives.', 'modern-permalink-settings' ) }
								</Text>
							</VStack>
						</CardHeader>
						<CardBody>
							<div className="mps-optional-controls">
								<TextControl
									label={ __( 'Category base', 'modern-permalink-settings' ) }
									help={ categoryBase ? `${ homeUrl }/${ categoryBase }/uncategorized/` : __( 'Leave empty to use default (category)', 'modern-permalink-settings' ) }
									value={ categoryBase }
									onChange={ handleCategoryBaseChange }
									placeholder="category"
									autoComplete="off"
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
								<TextControl
									label={ __( 'Tag base', 'modern-permalink-settings' ) }
									help={ tagBase ? `${ homeUrl }/${ tagBase }/example-tag/` : __( 'Leave empty to use default (tag)', 'modern-permalink-settings' ) }
									value={ tagBase }
									onChange={ handleTagBaseChange }
									placeholder="tag"
									autoComplete="off"
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>
							</div>
						</CardBody>
					</Card>
				</VStack>
			</div>
		</div>
	);
};

export default SettingsPage;
