# Profile Gravatar Section Redesign

This document explains the redesign of the Gravatar section on the Dashboard profile page (`/me/profile`), demonstrating Calypso development patterns including feature flags, SCSS styling, and component composition.

## Overview

The original Gravatar section had several visual issues:
- Disconnected elements (avatar at top, explanation text at bottom)
- Dense, text-heavy explanation with multiple links
- Awkwardly positioned branding logo

The redesign consolidates everything into a unified visual block.

## Feature Flag

The redesign is gated behind `me/profile-gravatar-redesign`:

```json
// config/development.json
"me/profile-gravatar-redesign": true

// config/production.json
"me/profile-gravatar-redesign": false
```

Toggle via URL: `?flags=me/profile-gravatar-redesign` or `?flags=-me/profile-gravatar-redesign`

## Files Modified

| File | Purpose |
|------|---------|
| `config/development.json` | Feature flag (enabled) |
| `config/production.json` | Feature flag (disabled) |
| `client/dashboard/me/profile-gravatar/index.tsx` | Main component with conditional rendering |
| `client/dashboard/me/profile-gravatar/style.scss` | New stylesheet for redesigned section |
| `client/dashboard/me/profile-gravatar/edit-gravatar.tsx` | Added `showAvatarPreview` prop |
| `client/dashboard/me/profile-gravatar/gravatar-logo.tsx` | Added `size` prop |

## Implementation Details

### 1. Feature Flag Check

```typescript
import { isEnabled } from '@automattic/calypso-config';

const isRedesignEnabled = isEnabled( 'me/profile-gravatar-redesign' );
```

### 2. Conditional Rendering

The component renders different UI based on the flag:

```tsx
{ isRedesignEnabled ? (
    <div className="gravatar-profile-redesign">
        {/* New unified design */}
    </div>
) : (
    <SectionHeader ... />  {/* Original design */}
) }
```

### 3. Form Field Exclusion

The DataForm uses a different field set when redesigned (excluding the avatar field since it's shown in the custom section):

```typescript
const form: Form = {
    fields: [ 'avatar_URL', 'display_name', 'user_URL', 'description' ],
};

const formRedesign: Form = {
    fields: [ 'display_name', 'user_URL', 'description' ],  // No avatar_URL
};

// In render:
<DataForm form={ isRedesignEnabled ? formRedesign : form } ... />
```

### 4. Styling with SCSS Tokens

Created `style.scss` using WordPress design tokens:

```scss
@import '@wordpress/base-styles/variables';

.gravatar-profile-redesign {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $grid-unit-15;
    background: rgba( 56, 88, 233, 0.06 );  // Subtle Gravatar blue
    border-radius: $radius-medium;
    padding: $grid-unit-15;
    margin-top: $grid-unit-10;
    box-sizing: border-box;
    max-width: 100%;
    overflow: hidden;
}

.gravatar-profile-redesign__avatar-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 56px;
    height: 56px;
}

.gravatar-profile-redesign__logo-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 22px;
    height: 22px;
    background: var( --color-surface, #fff );
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 2px rgba( 0, 0, 0, 0.1 );
}
```

**Key styling decisions:**
- Use `$grid-unit-*` tokens for all spacing
- Use `$radius-medium` for border radius
- Use CSS custom properties (`var(--color-surface)`) with fallbacks
- Don't override font sizes - let defaults apply
- Use `min-width: 0` and `overflow: hidden` on flex children to prevent overflow

### 5. Component Props for Flexibility

Added props to child components for reuse:

```typescript
// gravatar-logo.tsx
interface GravatarLogoProps {
    size?: number;
}

export default function GravatarLogo( { size = 24 }: GravatarLogoProps ) { ... }

// edit-gravatar.tsx
interface EditGravatarProps {
    avatarUrl: string;
    userEmail: string;
    isEmailVerified?: boolean;
    showAvatarPreview?: boolean;  // New prop
}
```

## Design Result

The redesigned section combines:
- **Avatar (56px)** with Gravatar logo badge overlapping bottom-right
- **Description text** explaining Gravatar integration
- **"What is Gravatar?" link** for users who want to learn more
- **"Update avatar" button** on the right side

All contained in a subtle blue-tinted rounded container that visually connects the elements.

## Lessons Learned

1. **Always use SCSS files** - Inline styles are harder to maintain and don't follow Calypso conventions

2. **Use WordPress tokens** - `$grid-unit-*`, `$radius-*`, and CSS custom properties ensure consistency

3. **Don't override font sizes** - Let the defaults apply unless there's a specific design requirement

4. **Feature flags require restart** - Config changes aren't picked up by hot reload

5. **Dashboard vs Classic** - The Dashboard (`my.localhost:3000`) uses different components and patterns than classic Calypso (`calypso.localhost:3000`)

6. **Flex overflow** - Always add `min-width: 0` and consider `overflow: hidden` on flex children to prevent content from breaking out of containers
