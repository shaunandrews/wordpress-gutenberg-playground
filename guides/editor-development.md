# Modifying the Gutenberg Editor

This guide explains how to make changes to the Gutenberg block editor. It uses a document navigation dropdown feature as a detailed example.

## Prerequisites

- Familiarity with React and JavaScript
- Understanding of WordPress data stores (`@wordpress/data`)
- The development environment running (`npm run wp-env start` from `gutenberg/`)

## Editor Architecture Overview

The editor is organized into packages under `gutenberg/packages/`. Key packages include:

| Package | Purpose |
|---------|---------|
| `@wordpress/editor` | Core editor functionality, document handling |
| `@wordpress/block-editor` | Block manipulation, canvas, and toolbars |
| `@wordpress/components` | Reusable UI components (Button, Dropdown, etc.) |
| `@wordpress/data` | State management (Redux-like stores) |
| `@wordpress/core-data` | WordPress entity data (posts, pages, users) |
| `@wordpress/compose` | Higher-order components and React hooks |

Components live in `packages/<package-name>/src/components/`.

## Finding What to Modify

### 1. Use Browser DevTools

1. Open the editor in your browser
2. Right-click the element you want to modify → Inspect
3. Look for class names starting with `editor-`, `block-editor-`, or `components-`
4. Search for those class names in the codebase

### 2. Search the Codebase

```bash
# Find components by class name
cd gutenberg
grep -r "editor-document-bar" packages/

# Find components by functionality
grep -r "openCommandCenter" packages/
```

### 3. Trace the Code

Start from known entry points:
- `packages/editor/src/components/` - Editor-level components
- `packages/block-editor/src/components/` - Block-level components
- `packages/edit-post/src/` - Post editor specific code
- `packages/edit-site/src/` - Site editor specific code

## Making Changes

### Step 1: Locate the Component

Find the component you need to modify. Components are typically in their own directories with:
- `index.js` - Main component code
- `style.scss` - Component styles
- Supporting files (hooks, utilities)

### Step 2: Understand the Existing Code

Before modifying:
1. Read the component's code completely
2. Identify what stores it uses (`useSelect`, `useDispatch`)
3. Note the props it accepts and provides
4. Check for any existing tests

### Step 3: Make Your Changes

Options for modifications:
- **Edit in place**: Modify the existing component directly
- **Extract to new file**: Create new components/hooks for complex additions
- **Add new files**: For significant new functionality

### Step 4: Add Styles

Styles go in `style.scss` files using:
- SCSS with WordPress base-styles mixins
- BEM-like class naming: `.editor-component-name__element`
- WordPress color and spacing variables

### Step 5: Rebuild and Test

```bash
cd gutenberg
npm run build           # Production build
npm run dev             # Development with watch mode
```

Refresh the browser to see changes (or use watch mode for auto-reload).

---

## Example: Document Navigation Dropdown

This example walks through adding a dropdown to the document bar that allows searching and navigating between documents.

### What We Want to Add

- Click the document title in the editor header to open a dropdown
- Show recently modified documents
- Search across posts, pages, and templates
- Click an item to navigate to that document

### Files Involved

```
packages/editor/src/components/document-bar/
├── index.js                        # Modified - wrap button in Dropdown
├── style.scss                      # Modified - add dropdown styles
├── document-navigation-dropdown.js # NEW - dropdown content component
└── use-document-navigation.js      # NEW - data fetching hook
```

### Step-by-Step Implementation

#### 1. Create the Data Hook (`use-document-navigation.js`)

The hook fetches documents using `@wordpress/core-data`:

```javascript
/**
 * WordPress dependencies
 */
import { useState, useEffect, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { useDebounce } from '@wordpress/compose';
import { decodeEntities } from '@wordpress/html-entities';
import { post, page, layout, symbolFilled } from '@wordpress/icons';

/**
 * Hook that returns debounced search value.
 */
function useDebouncedValue( value ) {
    const [ debouncedValue, setDebouncedValue ] = useState( '' );
    const debounced = useDebounce( setDebouncedValue, 250 );

    useEffect( () => {
        debounced( value );
        return () => debounced.cancel();
    }, [ debounced, value ] );

    return debouncedValue;
}

/**
 * Icons and labels for each post type.
 */
const POST_TYPE_ICONS = {
    post,
    page,
    wp_template: layout,
    wp_template_part: symbolFilled,
};

const POST_TYPE_LABELS = {
    post: 'Post',
    page: 'Page',
    wp_template: 'Template',
    wp_template_part: 'Template Part',
};

/**
 * Hook for fetching documents for navigation.
 */
export default function useDocumentNavigation( searchQuery = '' ) {
    const debouncedSearch = useDebouncedValue( searchQuery );

    // Check theme and permissions for template access
    const { isBlockBasedTheme, canCreateTemplate } = useSelect( ( select ) => {
        return {
            isBlockBasedTheme:
                select( coreStore ).getCurrentTheme()?.is_block_theme,
            canCreateTemplate: select( coreStore ).canUser( 'create', {
                kind: 'postType',
                name: 'wp_template',
            } ),
        };
    }, [] );

    // Determine which post types to query
    const postTypesToQuery = useMemo( () => {
        const types = [ 'post', 'page' ];
        if ( isBlockBasedTheme && canCreateTemplate ) {
            types.push( 'wp_template', 'wp_template_part' );
        }
        return types;
    }, [ isBlockBasedTheme, canCreateTemplate ] );

    // Query parameters for recent items
    const recentQuery = useMemo( () => ( {
        per_page: 5,
        orderby: 'modified',
        order: 'desc',
        status: [ 'publish', 'future', 'draft', 'pending', 'private' ],
    } ), [] );

    // Fetch recent items
    const { recentPosts, recentPages, isLoadingRecent } = useSelect(
        ( select ) => {
            const { getEntityRecords, hasFinishedResolution } =
                select( coreStore );

            const posts = getEntityRecords( 'postType', 'post', recentQuery );
            const pages = getEntityRecords( 'postType', 'page', recentQuery );

            const isLoading =
                ! hasFinishedResolution( 'getEntityRecords', [
                    'postType', 'post', recentQuery,
                ] ) ||
                ! hasFinishedResolution( 'getEntityRecords', [
                    'postType', 'page', recentQuery,
                ] );

            return {
                recentPosts: posts ?? [],
                recentPages: pages ?? [],
                isLoadingRecent: isLoading,
            };
        },
        [ recentQuery ]
    );

    // Format records for display
    const formatRecords = ( records, postType ) => {
        return records.map( ( record ) => ( {
            id: record.id,
            postType,
            title: record.title?.rendered
                ? decodeEntities( record.title.rendered )
                : record.title?.raw || '(no title)',
            icon: POST_TYPE_ICONS[ postType ],
            typeLabel: POST_TYPE_LABELS[ postType ],
        } ) );
    };

    // Build combined recent items list
    const recentItems = useMemo( () => {
        if ( debouncedSearch ) return [];

        const allRecent = [
            ...recentPosts.map( ( r ) => ( { ...r, postType: 'post' } ) ),
            ...recentPages.map( ( r ) => ( { ...r, postType: 'page' } ) ),
        ];

        // Sort by modified date and take top 10
        allRecent.sort(
            ( a, b ) => new Date( b.modified ) - new Date( a.modified )
        );

        return allRecent.slice( 0, 10 ).map( ( record ) => ( {
            id: record.id,
            postType: record.postType,
            title: record.title?.rendered
                ? decodeEntities( record.title.rendered )
                : record.title?.raw || '(no title)',
            icon: POST_TYPE_ICONS[ record.postType ],
            typeLabel: POST_TYPE_LABELS[ record.postType ],
        } ) );
    }, [ debouncedSearch, recentPosts, recentPages ] );

    return {
        recentItems,
        searchResults: { posts: [], pages: [], templates: [], templateParts: [] },
        isLoading: isLoadingRecent,
        hasSearch: !! debouncedSearch,
    };
}
```

**Key patterns used:**
- `useSelect` for reading from stores
- `getEntityRecords` for fetching WordPress entities
- `hasFinishedResolution` for loading states
- `useMemo` for expensive computations
- Debouncing for search input

#### 2. Create the Dropdown Component (`document-navigation-dropdown.js`)

```javascript
/**
 * WordPress dependencies
 */
import { useState, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import {
    SearchControl,
    MenuGroup,
    MenuItem,
    Spinner,
    __experimentalText as Text,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/icons';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import useDocumentNavigation from './use-document-navigation';
import { store as editorStore } from '../../store';

/**
 * Navigation item component.
 */
function NavigationItem( { item, onNavigate } ) {
    return (
        <MenuItem
            className="editor-document-bar__navigation-item"
            onClick={ () => onNavigate( item ) }
            icon={ <Icon icon={ item.icon } size={ 20 } /> }
        >
            <span className="editor-document-bar__navigation-item-content">
                <span className="editor-document-bar__navigation-item-title">
                    { item.title }
                </span>
                <span className="editor-document-bar__navigation-item-type">
                    { item.typeLabel }
                </span>
            </span>
        </MenuItem>
    );
}

/**
 * Document navigation dropdown content component.
 */
export default function DocumentNavigationDropdown( { onClose } ) {
    const [ search, setSearch ] = useState( '' );

    const { recentItems, isLoading, hasSearch } =
        useDocumentNavigation( search );

    // Get navigation callback from editor settings
    const { onNavigateToEntityRecord } = useSelect( ( select ) => {
        return {
            onNavigateToEntityRecord:
                select( editorStore ).getEditorSettings()
                    .onNavigateToEntityRecord,
        };
    }, [] );

    // Handle navigation to a document
    const handleNavigate = useCallback(
        ( item ) => {
            const { id, postType } = item;

            // Use navigation callback if available (site editor)
            if ( onNavigateToEntityRecord ) {
                onNavigateToEntityRecord( { postId: id, postType } );
            } else {
                // Fall back to URL navigation (post editor)
                document.location = addQueryArgs( 'post.php', {
                    post: id,
                    action: 'edit',
                } );
            }

            onClose();
        },
        [ onNavigateToEntityRecord, onClose ]
    );

    return (
        <div className="editor-document-bar__navigation-dropdown">
            <div className="editor-document-bar__navigation-search">
                <SearchControl
                    __nextHasNoMarginBottom
                    value={ search }
                    onChange={ setSearch }
                    placeholder={ __( 'Search documents...' ) }
                />
            </div>

            <div className="editor-document-bar__navigation-results">
                { isLoading && (
                    <div className="editor-document-bar__navigation-loading">
                        <Spinner />
                    </div>
                ) }

                { ! isLoading && ! hasSearch && recentItems.length > 0 && (
                    <MenuGroup label={ __( 'Recent' ) }>
                        { recentItems.map( ( item ) => (
                            <NavigationItem
                                key={ `${ item.postType }-${ item.id }` }
                                item={ item }
                                onNavigate={ handleNavigate }
                            />
                        ) ) }
                    </MenuGroup>
                ) }

                { ! isLoading && ! hasSearch && recentItems.length === 0 && (
                    <div className="editor-document-bar__navigation-empty">
                        <Text>{ __( 'No recent documents' ) }</Text>
                    </div>
                ) }
            </div>
        </div>
    );
}
```

**Key patterns used:**
- `@wordpress/components` for UI elements
- `@wordpress/i18n` for translatable strings
- Callback pattern for navigation handling
- Conditional rendering for loading/empty states

#### 3. Modify the Parent Component (`index.js`)

Update imports:

```javascript
// Add to existing imports
import { Dropdown } from '@wordpress/components';

// Add internal import
import DocumentNavigationDropdown from './document-navigation-dropdown';

// Remove this import (no longer needed)
// import { store as commandsStore } from '@wordpress/commands';
```

Remove the command center dispatch:

```javascript
// Remove this line
// const { open: openCommandCenter } = useDispatch( commandsStore );
```

Replace the Button with a Dropdown:

```javascript
// Before: Simple button that opens command center
<Button
    className="editor-document-bar__command"
    onClick={ () => openCommandCenter() }
    size="compact"
>
    {/* ... button content ... */}
</Button>

// After: Dropdown with navigation content
<Dropdown
    className="editor-document-bar__dropdown"
    contentClassName="editor-document-bar__dropdown-content"
    popoverProps={ {
        placement: 'bottom',
        offset: 8,
    } }
    focusOnMount
    renderToggle={ ( { isOpen, onToggle } ) => (
        <Button
            className="editor-document-bar__command"
            onClick={ onToggle }
            aria-expanded={ isOpen }
            size="compact"
        >
            {/* ... same button content ... */}
        </Button>
    ) }
    renderContent={ ( { onClose } ) => (
        <DocumentNavigationDropdown onClose={ onClose } />
    ) }
/>
```

#### 4. Add Styles (`style.scss`)

```scss
// Required imports at the top of the file
@use "@wordpress/base-styles/breakpoints" as *;
@use "@wordpress/base-styles/colors" as *;
@use "@wordpress/base-styles/mixins" as *;
@use "@wordpress/base-styles/variables" as *;

// Document navigation dropdown styles
.editor-document-bar__dropdown-content {
    width: 320px;
    max-height: 400px;
    overflow: hidden;
}

.editor-document-bar__navigation-dropdown {
    display: flex;
    flex-direction: column;
    max-height: 400px;
}

.editor-document-bar__navigation-search {
    padding: $grid-unit-15;
    border-bottom: 1px solid $gray-200;

    .components-search-control {
        margin: 0;
    }
}

.editor-document-bar__navigation-results {
    overflow-y: auto;
    flex: 1;
    padding: $grid-unit-10 0;

    .components-menu-group + .components-menu-group {
        border-top: 1px solid $gray-200;
        padding-top: $grid-unit-10;
        margin-top: $grid-unit-10;
    }

    .components-menu-group__label {
        padding: $grid-unit-05 $grid-unit-15;
        color: $gray-700;
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
}

.editor-document-bar__navigation-item {
    &.components-button.components-menu-item__button {
        height: auto;
        padding: $grid-unit-10 $grid-unit-15;
        gap: $grid-unit-10;
    }

    .components-menu-item__item {
        min-width: 0;
    }
}

.editor-document-bar__navigation-item-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    min-width: 0;
    flex: 1;
}

.editor-document-bar__navigation-item-title {
    color: $gray-900;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
}

.editor-document-bar__navigation-item-type {
    color: $gray-600;
    font-size: 11px;
}

.editor-document-bar__navigation-loading,
.editor-document-bar__navigation-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $grid-unit-30;
    color: $gray-700;
}
```

**Styling patterns:**
- Use WordPress spacing variables (`$grid-unit-*`) - see `@wordpress/base-styles/_variables.scss`
- Use WordPress color variables (`$gray-*`) - see `@wordpress/base-styles/_colors.scss`
- Follow BEM-like naming: `.package-component__element--modifier`
- Use breakpoint mixins for responsive design (`@include break-small`, etc.)

**Available spacing variables:**

| Variable | Value |
|----------|-------|
| `$grid-unit-05` | 4px |
| `$grid-unit-10` | 8px |
| `$grid-unit-15` | 12px |
| `$grid-unit-20` | 16px |
| `$grid-unit-30` | 24px |
| `$grid-unit-40` | 32px |

**Note:** These SCSS variables are for Gutenberg's internal components. For standalone plugins, use CSS custom properties instead (`var(--wp-admin-theme-color)`, etc.).

---

## Common Patterns Reference

### Importing WordPress Packages

```javascript
// State management
import { useSelect, useDispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';
import { store as noticesStore } from '@wordpress/notices';

// UI components
import { Button, Dropdown, Spinner } from '@wordpress/components';

// Utilities
import { __ } from '@wordpress/i18n';                    // Translations
import { decodeEntities } from '@wordpress/html-entities';
import { addQueryArgs } from '@wordpress/url';

// React hooks
import { useState, useEffect, useMemo, useCallback } from '@wordpress/element';
import { useDebounce } from '@wordpress/compose';

// Icons
import { post, page, layout } from '@wordpress/icons';
```

### Reading from Data Stores

```javascript
// Simple read
const { postType, postId } = useSelect( ( select ) => {
    return {
        postType: select( editorStore ).getCurrentPostType(),
        postId: select( editorStore ).getCurrentPostId(),
    };
}, [] );

// Reading entities
const posts = useSelect( ( select ) => {
    return select( coreStore ).getEntityRecords( 'postType', 'post', {
        per_page: 10,
        orderby: 'modified',
    } );
}, [] );

// With loading state
const { records, isLoading } = useSelect( ( select ) => {
    const { getEntityRecords, hasFinishedResolution } = select( coreStore );
    const query = { per_page: 10 };

    return {
        records: getEntityRecords( 'postType', 'post', query ) ?? [],
        isLoading: ! hasFinishedResolution( 'getEntityRecords', [
            'postType', 'post', query,
        ] ),
    };
}, [] );
```

### Dispatching Actions

```javascript
import { store as noticesStore } from '@wordpress/notices';

const { savePost } = useDispatch( editorStore );
const { createSuccessNotice, createErrorNotice } = useDispatch( noticesStore );

// Use in handlers
const handleSave = async () => {
    try {
        await savePost();
        createSuccessNotice( __( 'Post saved.' ), {
            type: 'snackbar',
        } );
    } catch ( error ) {
        createErrorNotice( __( 'Saving failed.' ) );
    }
};
```

---

## Troubleshooting

### Changes Not Appearing

1. Run `npm run build` in `gutenberg/`
2. Hard refresh the browser (Cmd+Shift+R)
3. Check the browser console for errors
4. Verify the file was saved

### Import Errors

- Check the package exists: `ls gutenberg/packages/<package-name>`
- Verify the export: check the package's `src/index.js`
- Use `__experimental` prefix for unstable APIs (e.g., `__experimentalText as Text`)

### Experimental APIs

Some components are prefixed with `__experimental` indicating they may change:

```javascript
// Experimental components - API may change
import {
    __experimentalText as Text,
    __experimentalHeading as Heading,
    __experimentalVStack as VStack,
    __experimentalHStack as HStack,
} from '@wordpress/components';
```

Check the component's stability before using in production plugins.

### Store Not Found

- Ensure the store is registered (check package's store setup)
- Verify the store name matches exactly

---

## Further Reading

- [Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Component Reference](https://developer.wordpress.org/block-editor/reference-guides/components/)
- [Data Module Reference](https://developer.wordpress.org/block-editor/reference-guides/data/)
- [Package documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/)
