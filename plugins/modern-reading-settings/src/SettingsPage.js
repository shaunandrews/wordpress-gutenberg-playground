/**
 * WordPress dependencies
 */
import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import {
	Button,
	Card,
	CardHeader,
	CardBody,
	CardDivider,
	Spinner,
	Notice,
	TextControl,
	SelectControl,
	ToggleControl,
	RangeControl,
	ExternalLink,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
	__experimentalHeading as Heading,
	__experimentalText as Text,
	__experimentalVStack as VStack,
} from '@wordpress/components';

/**
 * Homepage illustration that changes based on selection.
 */
const HomepageIllustration = ( { isStaticPage } ) => (
	<svg
		className="mrs-homepage-illustration"
		viewBox="0 0 120 80"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{ isStaticPage ? (
			<g>
				<rect
					x="35"
					y="10"
					width="50"
					height="60"
					rx="4"
					fill="#fff"
					stroke="var(--wp-admin-theme-color, #3858e9)"
					strokeWidth="2"
				/>
				<line x1="45" y1="25" x2="75" y2="25" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
				<line x1="45" y1="35" x2="70" y2="35" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
				<line x1="45" y1="45" x2="72" y2="45" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
				<line x1="45" y1="55" x2="65" y2="55" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
			</g>
		) : (
			<g>
				<rect x="45" y="8" width="45" height="30" rx="3" fill="var(--wp-components-color-gray-100, #f0f0f0)" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="1.5" />
				<rect x="38" y="18" width="45" height="30" rx="3" fill="var(--wp-components-color-gray-50, #fafafa)" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="1.5" />
				<rect x="30" y="28" width="45" height="35" rx="3" fill="#fff" stroke="var(--wp-admin-theme-color, #3858e9)" strokeWidth="2" />
				<line x1="38" y1="40" x2="65" y2="40" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
				<line x1="38" y1="50" x2="58" y2="50" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
			</g>
		) }
	</svg>
);

/**
 * Search engine illustration that changes based on visibility.
 */
const SearchEngineIllustration = ( { isHidden } ) => (
	<svg
		className="mrs-search-illustration"
		viewBox="0 0 120 80"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		{ /* Magnifying glass */ }
		<circle
			cx="50"
			cy="35"
			r="20"
			fill="#fff"
			stroke={ isHidden ? 'var(--wp-components-color-gray-300, #ddd)' : 'var(--wp-admin-theme-color, #3858e9)' }
			strokeWidth="2"
		/>
		<line
			x1="64"
			y1="49"
			x2="78"
			y2="63"
			stroke={ isHidden ? 'var(--wp-components-color-gray-300, #ddd)' : 'var(--wp-admin-theme-color, #3858e9)' }
			strokeWidth="3"
			strokeLinecap="round"
		/>
		{ /* Document lines inside magnifier */ }
		<line x1="40" y1="30" x2="60" y2="30" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
		<line x1="40" y1="38" x2="55" y2="38" stroke="var(--wp-components-color-gray-300, #ddd)" strokeWidth="2" strokeLinecap="round" />
		{ isHidden && (
			<g>
				{ /* X mark over the magnifier */ }
				<line x1="35" y1="20" x2="65" y2="50" stroke="var(--wp-components-color-gray-400, #ccc)" strokeWidth="3" strokeLinecap="round" />
				<line x1="65" y1="20" x2="35" y2="50" stroke="var(--wp-components-color-gray-400, #ccc)" strokeWidth="3" strokeLinecap="round" />
			</g>
		) }
	</svg>
);

const SettingsPage = () => {
	const [ hasEdits, setHasEdits ] = useState( false );
	const [ localSettings, setLocalSettings ] = useState( null );
	const [ notice, setNotice ] = useState( null );

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
		setNotice( null );
	}, [] );

	const saveSettings = async () => {
		setNotice( null );
		try {
			await saveEntityRecord( 'root', 'site', localSettings );
			setNotice( { status: 'success', message: __( 'Settings saved.', 'modern-reading-settings' ) } );
			setHasEdits( false );
		} catch ( error ) {
			setNotice( { status: 'error', message: error.message || __( 'Failed to save.', 'modern-reading-settings' ) } );
		}
	};

	if ( isLoading || ! localSettings ) {
		return (
			<div className="mrs-loading">
				<Spinner />
				<Text>{ __( 'Loading...', 'modern-reading-settings' ) }</Text>
			</div>
		);
	}

	const pageOptions = [
		{ label: __( '— Select —', 'modern-reading-settings' ), value: 0 },
		...pages.map( ( p ) => ( {
			label: p.title || __( '(no title)', 'modern-reading-settings' ),
			value: p.id,
		} ) ),
	];

	const isStaticPage = localSettings.show_on_front === 'page';
	const showPageWarning =
		isStaticPage &&
		localSettings.page_on_front === localSettings.page_for_posts &&
		localSettings.page_on_front !== 0;

	const isSearchHidden = localSettings.blog_public === 0 || localSettings.blog_public === '0';

	return (
		<div className="mrs-settings">
			<header className="mrs-settings__header">
				<Heading level={ 1 }>{ __( 'Reading Settings', 'modern-reading-settings' ) }</Heading>
				<Button
					variant="primary"
					onClick={ saveSettings }
					isBusy={ isSaving }
					disabled={ isSaving || ! hasEdits }
				>
					{ isSaving ? __( 'Saving...', 'modern-reading-settings' ) : __( 'Save Changes', 'modern-reading-settings' ) }
				</Button>
			</header>

			<div className="mrs-settings__content">
				{ notice && (
					<Notice status={ notice.status } isDismissible onRemove={ () => setNotice( null ) }>
						{ notice.message }
					</Notice>
				) }

				<VStack spacing={ 4 }>
				{ /* Card 1: Content Display */ }
				<Card>
					<CardHeader>
						<Heading level={ 3 }>{ __( 'Content Display', 'modern-reading-settings' ) }</Heading>
					</CardHeader>
					<CardBody>
						<div className="mrs-homepage-section">
							<div className="mrs-homepage-section__illustration">
								<HomepageIllustration isStaticPage={ isStaticPage } />
							</div>
							<div className="mrs-homepage-section__controls">
								<VStack spacing={ 3 }>
									<ToggleGroupControl
										label={ __( 'Homepage', 'modern-reading-settings' ) }
										value={ localSettings.show_on_front }
										onChange={ ( value ) => updateSetting( 'show_on_front', value ) }
										isBlock
										__nextHasNoMarginBottom
										__next40pxDefaultSize
									>
										<ToggleGroupControlOption value="posts" label={ __( 'Latest posts', 'modern-reading-settings' ) } />
										<ToggleGroupControlOption value="page" label={ __( 'Static page', 'modern-reading-settings' ) } />
									</ToggleGroupControl>
									<Text className="mrs-help-text">
										{ isStaticPage
											? __( 'Your homepage will show a specific page you choose. Great for landing pages or custom welcome content.', 'modern-reading-settings' )
											: __( 'Your homepage will show your most recent blog posts in reverse chronological order.', 'modern-reading-settings' ) }
									</Text>
								</VStack>

								{ isStaticPage && (
									<div className="mrs-page-selects">
										<SelectControl
											label={ __( 'Homepage', 'modern-reading-settings' ) }
											value={ localSettings.page_on_front }
											options={ pageOptions }
											onChange={ ( value ) => updateSetting( 'page_on_front', parseInt( value, 10 ) ) }
											__nextHasNoMarginBottom
										/>
										<SelectControl
											label={ __( 'Posts page', 'modern-reading-settings' ) }
											value={ localSettings.page_for_posts }
											options={ pageOptions }
											onChange={ ( value ) => updateSetting( 'page_for_posts', parseInt( value, 10 ) ) }
											__nextHasNoMarginBottom
										/>
										{ showPageWarning && (
											<Notice status="warning" isDismissible={ false }>
												{ __( 'These should be different pages.', 'modern-reading-settings' ) }
											</Notice>
										) }
									</div>
								) }
							</div>
						</div>
					</CardBody>
					<CardDivider />
					<CardBody>
						<RangeControl
							label={ __( 'Posts per page', 'modern-reading-settings' ) }
							help={ __( 'Number of posts shown on blog and archive pages.', 'modern-reading-settings' ) }
							value={ localSettings.posts_per_page }
							onChange={ ( value ) => updateSetting( 'posts_per_page', value ) }
							min={ 1 }
							max={ 50 }
							marks={ [
								{ value: 5, label: '5' },
								{ value: 10, label: '10' },
								{ value: 20, label: '20' },
								{ value: 50, label: '50' },
							] }
							__nextHasNoMarginBottom
						/>
					</CardBody>
				</Card>

				{ /* Card 2: RSS Feed */ }
				<Card>
					<CardHeader>
						<VStack spacing={ 1 }>
							<Heading level={ 3 }>{ __( 'RSS Feed', 'modern-reading-settings' ) }</Heading>
							<Text className="mrs-help-text">
								{ __( 'Let readers subscribe using apps like Feedly or Inoreader.', 'modern-reading-settings' ) }{ ' ' }
								<ExternalLink href="https://developer.wordpress.org/advanced-administration/wordpress/feeds/">
									{ __( 'Learn more', 'modern-reading-settings' ) }
								</ExternalLink>
							</Text>
						</VStack>
					</CardHeader>
					<CardBody>
						<div className="mrs-rss-controls">
								<TextControl
									label={ __( 'Feed length', 'modern-reading-settings' ) }
									help={ __( 'Number of recent posts', 'modern-reading-settings' ) }
									type="number"
									min={ 1 }
									max={ 100 }
									placeholder={ __( '10', 'modern-reading-settings' ) }
									value={ localSettings.posts_per_rss }
									onChange={ ( value ) => updateSetting( 'posts_per_rss', parseInt( value, 10 ) || 1 ) }
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								/>

								<ToggleGroupControl
									label={ __( 'Feed content', 'modern-reading-settings' ) }
									help={ localSettings.rss_use_excerpt
										? __( 'Only the excerpt is included.', 'modern-reading-settings' )
										: __( 'Entire post content is included.', 'modern-reading-settings' ) }
									value={ localSettings.rss_use_excerpt ? '1' : '0' }
									onChange={ ( value ) => updateSetting( 'rss_use_excerpt', value === '1' ? 1 : 0 ) }
									isBlock
									__nextHasNoMarginBottom
									__next40pxDefaultSize
								>
									<ToggleGroupControlOption value="0" label={ __( 'Full text', 'modern-reading-settings' ) } />
									<ToggleGroupControlOption value="1" label={ __( 'Excerpt', 'modern-reading-settings' ) } />
								</ToggleGroupControl>
						</div>
					</CardBody>
				</Card>

				{ /* Card 3: Search Engines */ }
				<Card>
					<CardHeader>
						<Heading level={ 3 }>{ __( 'Search Engines', 'modern-reading-settings' ) }</Heading>
					</CardHeader>
					<CardBody>
						<div className="mrs-search-section">
							<div className="mrs-search-section__illustration">
								<SearchEngineIllustration isHidden={ isSearchHidden } />
							</div>
							<div className="mrs-search-section__controls">
								<VStack spacing={ 3 }>
									<ToggleControl
										__nextHasNoMarginBottom
										label={ __( 'Discourage search engines from indexing this site', 'modern-reading-settings' ) }
										checked={ isSearchHidden }
										onChange={ ( checked ) => updateSetting( 'blog_public', checked ? 0 : 1 ) }
									/>
									<Text className="mrs-help-text">
										{ isSearchHidden
											? __( 'A "noindex" tag will be added to your site. Search engines like Google and Bing are requested not to index your pages, but this is only a suggestion—they may still appear in search results.', 'modern-reading-settings' )
											: __( 'Your site is fully visible to search engines and can appear in search results. This is recommended for most public sites.', 'modern-reading-settings' ) }
									</Text>
								</VStack>
							</div>
						</div>
					</CardBody>
				</Card>
				</VStack>
			</div>
		</div>
	);
};

export default SettingsPage;
