# Writing Guidance Editor Display

## Overview

The Writing Guidance feature displays content guidelines to authors in the Gutenberg editor's pre-publish panel. This helps authors review site expectations and goals before publishing their content, ensuring alignment with editorial standards.

## User Experience

### When It Appears

The Writing Guidance panel appears in the **pre-publish sidebar** that opens when:
- A user clicks the "Publish" button (or "Schedule" for scheduled posts)
- The post has not yet been published
- At least one of the writing guidance settings has a value (Expectations or Goals)

### Location in Editor

The panel is displayed in the **pre-publish panel**, which is a sidebar that slides in from the right side of the editor. The Writing Guidance section appears:
- After the site card (showing site icon, name, and URL)
- After the upload media section (if applicable)
- Before visibility and scheduling settings
- Before post format, tags, and category panels

### Visual Design

The Writing Guidance panel:
- Uses a collapsible `PanelBody` component that is **initially open** by default
- Displays a help text: "Review these guidelines from your site editors before publishing."
- Shows two sections if both are configured:
  - **Expectations** (in bold) followed by the expectations text
  - **Goals** (in bold) followed by the goals text
- Only displays sections that have content (if only Expectations is set, only that section appears)

## Technical Implementation

### Component Structure

The Writing Guidance display is implemented in:

**File:** `gutenberg/packages/editor/src/components/post-publish-panel/maybe-writing-guidance.js`

```javascript
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
			{/* Help text and sections */}
		</PanelBody>
	);
}
```

### Integration Point

The component is integrated into the pre-publish panel via:

**File:** `gutenberg/packages/editor/src/components/post-publish-panel/prepublish.js`

The `MaybeWritingGuidancePanel` is imported and rendered within `PostPublishPanelPrepublish`:

```javascript
<MaybeUploadMedia />
<MaybeWritingGuidancePanel />
{/* Other panels... */}
```

### Data Fetching

The component uses WordPress's data store to fetch site settings:

- **Store:** `@wordpress/core-data` (`coreStore`)
- **Entity:** `'root'` entity with type `'site'`
- **Settings:** 
  - `wp_writing_guidance_expectations`
  - `wp_writing_guidance_goals`

These settings are fetched via the WordPress REST API Settings endpoint (`/wp-json/wp/v2/settings`) and cached in the editor's data store.

### Conditional Rendering

The component uses smart conditional rendering:

1. **Component-level:** Returns `null` if neither Expectations nor Goals have values
2. **Section-level:** Only renders the Expectations section if `expectations` has a value
3. **Section-level:** Only renders the Goals section if `goals` has a value

This ensures the panel only appears when relevant and doesn't show empty sections.

### Styling

**File:** `gutenberg/packages/editor/src/components/post-publish-panel/style.scss`

The component uses the following CSS classes:

- `.editor-post-publish-panel__writing-guidance-help` - Styles the help text (gray color, margin)
- `.editor-post-publish-panel__writing-guidance-section` - Styles each section (Expectations/Goals) with spacing and text formatting
  - Uses `white-space: pre-line` to preserve line breaks in the textarea content

## Component Flow

1. **Editor Loads:** The pre-publish panel component mounts
2. **Data Fetch:** `useSelect` hook queries the `coreStore` for site settings
3. **Conditional Check:** Component checks if either Expectations or Goals exist
4. **Render Decision:** 
   - If neither exists → returns `null` (component doesn't render)
   - If either exists → renders `PanelBody` with available sections
5. **User Interaction:** Panel is open by default, user can collapse/expand it

## Related Components

- **PostPublishPanelPrepublish:** Parent component that contains the Writing Guidance panel
- **PostPublishPanel:** Main publish panel component that conditionally shows pre-publish or post-publish content
- **PanelBody:** WordPress component used for collapsible sections in the sidebar

## Accessibility

- The panel uses semantic HTML with proper heading structure
- The `PanelBody` component provides keyboard navigation and ARIA attributes
- Text content is properly escaped and sanitized (handled by the REST API)
- The panel is focusable and can be navigated with keyboard

## Internationalization

All user-facing strings are internationalized using `@wordpress/i18n`:
- Panel title: "Writing Guidance"
- Help text: "Review these guidelines from your site editors before publishing."
- Section labels: "Expectations" and "Goals"

## See Also

- [Writing Guidance Settings Documentation](./writing-guidance-settings.md) - Details about configuring the settings in WordPress admin
