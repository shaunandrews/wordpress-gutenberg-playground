# Writing Guidance Settings

## Overview

The Writing Guidance feature adds two new settings to **Settings > Writing** in the WordPress admin. These settings help site administrators provide content guidelines to authors, ensuring consistency and alignment with site goals.

## New Options

### Expectations (`wp_writing_guidance_expectations`)

Describes how content on the site should be written. These expectations help authors stay consistent and aligned with the site's voice, tone, and style.

**Example uses:**
- "Always capitalize 'WordPress'"
- "Use Gravatar instead of custom avatars"
- "Write in a friendly, conversational voice"
- "Avoid unnecessary jargon"

### Goals (`wp_writing_guidance_goals`)

Describes what the site's content should achieve. These goals help authors focus on outcomes like subscriptions, engagement, or product discovery.

**Example uses:**
- "Encourage visitors to subscribe to the newsletter"
- "Mention relevant products when appropriate"
- "Help new visitors understand what this site offers"

## Technical Details

### Files Modified

| File | Purpose |
|------|---------|
| `src/wp-admin/options-writing.php` | UI for the Writing Guidance section with two textarea fields |
| `src/wp-admin/options.php` | Added options to the allowed options list for the writing settings group |
| `src/wp-includes/option.php` | Registered both options with REST API exposure and sanitization |

### Option Registration

Both options are registered in `register_initial_settings()` with:

- **Type:** `string`
- **REST API:** Exposed via `show_in_rest => true`
- **Sanitization:** `sanitize_textarea_field` (plain text, strips tags and encodes special characters)
- **Default:** Empty string

### REST API Access

The options are available via the WordPress REST API Settings endpoint:

```
GET /wp-json/wp/v2/settings
```

Response includes:
```json
{
  "wp_writing_guidance_expectations": "...",
  "wp_writing_guidance_goals": "..."
}
```

### Admin UI Location

The Writing Guidance section appears on **Settings > Writing**, positioned after the default post category/format settings and before the "Post via email" section.

## Usage

1. Navigate to **Settings > Writing** in the WordPress admin
2. Scroll to the **Writing Guidance** section
3. Enter your site's content expectations and goals in the respective textareas
4. Click **Save Changes**

The stored values can then be retrieved programmatically via:

```php
$expectations = get_option( 'wp_writing_guidance_expectations' );
$goals = get_option( 'wp_writing_guidance_goals' );
```

Or via the REST API for use in JavaScript applications or external integrations.
