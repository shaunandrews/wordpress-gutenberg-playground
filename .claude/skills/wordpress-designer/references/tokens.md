# WordPress Design Tokens Reference

Complete reference for design tokens from `@wordpress/theme` and WordPress core styles.

## Table of Contents
1. [Token Architecture](#token-architecture)
2. [Color Tokens](#color-tokens)
3. [Spacing Tokens](#spacing-tokens)
4. [Typography Tokens](#typography-tokens)
5. [Border Tokens](#border-tokens)
6. [Elevation Tokens](#elevation-tokens)
7. [Admin Theme Colors](#admin-theme-colors)
8. [Usage Examples](#usage-examples)

---

## Token Architecture

WordPress uses a tiered token system:

1. **Primitive tokens** - Raw values (internal, don't use directly)
2. **Semantic tokens** - Purpose-driven names (use these!)

Token naming pattern:
```
--wpds-<type>-<property>-<target>[-<modifier>]
```

- **type**: `color`, `dimension`, `border`, `elevation`, `font`
- **property**: `bg`, `fg`, `stroke`, `padding`, `gap`, `radius`, `size`, `family`
- **target**: `surface`, `interactive`, `content`, `track`, `thumb`, `focus`
- **modifier**: `2xs`, `xs`, `sm`, `md`, `lg`, `xl` or state/tone modifiers

---

## Color Tokens

### Background Colors

```css
/* Surface backgrounds */
--wpds-color-bg-surface-neutral                    /* Default surface */
--wpds-color-bg-surface-neutral-weak               /* Subtle surface */
--wpds-color-bg-surface-neutral-strong             /* Emphasized surface */

/* Interactive backgrounds */
--wpds-color-bg-interactive-neutral                /* Default button bg */
--wpds-color-bg-interactive-neutral-active         /* Hover/active state */
--wpds-color-bg-interactive-brand-strong           /* Primary action bg */
--wpds-color-bg-interactive-brand-strong-active    /* Primary hover */

/* Status backgrounds */
--wpds-color-bg-surface-success-weak               /* Success notice bg */
--wpds-color-bg-surface-error-weak                 /* Error notice bg */
--wpds-color-bg-surface-warning-weak               /* Warning notice bg */
--wpds-color-bg-surface-info-weak                  /* Info notice bg */
```

### Foreground Colors (Text & Icons)

```css
/* Content colors */
--wpds-color-fg-content-neutral                    /* Default text */
--wpds-color-fg-content-neutral-weak               /* Secondary/muted text */
--wpds-color-fg-content-neutral-strong             /* Emphasized text */

/* Interactive colors */
--wpds-color-fg-interactive-neutral                /* Default link/action */
--wpds-color-fg-interactive-neutral-active         /* Hover state */
--wpds-color-fg-interactive-brand                  /* Brand accent */
--wpds-color-fg-interactive-brand-active           /* Brand hover */

/* Status colors */
--wpds-color-fg-content-success                    /* Success text */
--wpds-color-fg-content-error                      /* Error text */
--wpds-color-fg-content-warning                    /* Warning text */
--wpds-color-fg-content-info                       /* Info text */
```

### Stroke Colors (Borders & Outlines)

```css
/* Neutral strokes */
--wpds-color-stroke-surface-neutral                /* Default border */
--wpds-color-stroke-surface-neutral-weak           /* Subtle border */
--wpds-color-stroke-surface-neutral-strong         /* Emphasized border */

/* Interactive strokes */
--wpds-color-stroke-interactive-neutral            /* Interactive border */
--wpds-color-stroke-interactive-neutral-active     /* Hover border */

/* Focus */
--wpds-color-stroke-focus-brand                    /* Focus ring color */
```

### Color Tone Modifiers

For color tokens with status meaning:

| Tone | Use Case |
|------|----------|
| `neutral` | Default, no semantic meaning |
| `brand` | Primary actions, brand accent |
| `success` | Positive, completed, saved |
| `info` | Informational, system messages |
| `caution` | Low severity warning |
| `warning` | Higher severity, needs attention |
| `error` | Errors, destructive, failures |

### Color Emphasis Modifiers

| Emphasis | Description |
|----------|-------------|
| (default) | Normal emphasis |
| `strong` | Higher contrast, prominent |
| `weak` | Subtle, muted |

### Color State Modifiers

| State | Description |
|-------|-------------|
| (default) | Idle state |
| `active` | Hover, pressed, selected |
| `disabled` | Unavailable |

---

## Spacing Tokens

### Primitive Spacing Scale

```css
--wpds-dimension-spacing-2xs    /* 2px */
--wpds-dimension-spacing-xs     /* 4px */
--wpds-dimension-spacing-sm     /* 8px */
--wpds-dimension-spacing-md     /* 12px */
--wpds-dimension-spacing-lg     /* 16px */
--wpds-dimension-spacing-xl     /* 24px */
--wpds-dimension-spacing-2xl    /* 32px */
--wpds-dimension-spacing-3xl    /* 40px */
```

### Semantic Spacing

```css
/* Padding for surfaces/containers */
--wpds-dimension-padding-surface-2xs
--wpds-dimension-padding-surface-xs
--wpds-dimension-padding-surface-sm
--wpds-dimension-padding-surface-md
--wpds-dimension-padding-surface-lg
--wpds-dimension-padding-surface-xl

/* Gap between elements */
--wpds-dimension-gap-surface-2xs
--wpds-dimension-gap-surface-xs
--wpds-dimension-gap-surface-sm
--wpds-dimension-gap-surface-md
--wpds-dimension-gap-surface-lg
--wpds-dimension-gap-surface-xl

/* Interactive element padding */
--wpds-dimension-padding-interactive-sm
--wpds-dimension-padding-interactive-md
--wpds-dimension-padding-interactive-lg
```

### Density Modes

ThemeProvider accepts `density` prop affecting spacing:

| Density | Use Case |
|---------|----------|
| `default` | Standard interfaces |
| `compact` | Data tables, dashboards |
| `comfortable` | Modals, focused experiences |

---

## Typography Tokens

### Font Family

```css
--wpds-font-family-sans         /* System sans-serif stack */
--wpds-font-family-mono         /* Monospace for code */
```

### Font Size

```css
--wpds-font-size-2xs            /* 10px */
--wpds-font-size-xs             /* 11px */
--wpds-font-size-sm             /* 12px */
--wpds-font-size-md             /* 13px - body default */
--wpds-font-size-lg             /* 14px */
--wpds-font-size-xl             /* 16px */
--wpds-font-size-2xl            /* 20px */
--wpds-font-size-3xl            /* 24px */
--wpds-font-size-4xl            /* 32px */
```

### Line Height

```css
--wpds-font-line-height-2xs
--wpds-font-line-height-xs
--wpds-font-line-height-sm
--wpds-font-line-height-md      /* 1.4 - body default */
--wpds-font-line-height-lg
--wpds-font-line-height-xl
```

### Font Weight

```css
--wpds-font-weight-regular      /* 400 */
--wpds-font-weight-medium       /* 500 */
--wpds-font-weight-semibold     /* 600 */
--wpds-font-weight-bold         /* 700 */
```

---

## Border Tokens

### Border Radius

```css
--wpds-border-radius-2xs        /* 2px */
--wpds-border-radius-xs         /* 3px */
--wpds-border-radius-sm         /* 4px */
--wpds-border-radius-md         /* 6px */
--wpds-border-radius-lg         /* 8px */
--wpds-border-radius-xl         /* 12px */
--wpds-border-radius-full       /* 9999px - pill shape */
```

### Border Width

```css
--wpds-border-width-sm          /* 1px */
--wpds-border-width-md          /* 2px */
--wpds-border-width-lg          /* 3px */
```

---

## Elevation Tokens

Box shadows for depth:

```css
--wpds-elevation-0              /* No shadow */
--wpds-elevation-1              /* Subtle lift */
--wpds-elevation-2              /* Card default */
--wpds-elevation-3              /* Dropdown/popover */
--wpds-elevation-4              /* Modal */
--wpds-elevation-5              /* Highest emphasis */
```

---

## Admin Theme Colors

Legacy WordPress admin colors (still widely used):

```css
/* Primary brand color */
--wp-admin-theme-color                    /* Default: #007cba */
--wp-admin-theme-color-darker-10
--wp-admin-theme-color-darker-20

/* Component colors */
--wp-components-color-accent              /* Interactive accent */
--wp-components-color-accent-darker-10
--wp-components-color-accent-darker-20

/* Grays */
--wp-components-color-gray-100            /* Lightest */
--wp-components-color-gray-200
--wp-components-color-gray-300
--wp-components-color-gray-400
--wp-components-color-gray-500
--wp-components-color-gray-600
--wp-components-color-gray-700
--wp-components-color-gray-800
--wp-components-color-gray-900            /* Darkest */

/* Semantic */
--wp-components-color-background          /* Page background */
--wp-components-color-foreground          /* Default text */
--wp-components-color-foreground-inverted /* Light on dark */
```

---

## Usage Examples

### Basic Component Styling

```css
.my-card {
  background: var(--wpds-color-bg-surface-neutral);
  border: 1px solid var(--wpds-color-stroke-surface-neutral);
  border-radius: var(--wpds-border-radius-md);
  padding: var(--wpds-dimension-padding-surface-md);
}

.my-card-title {
  font-size: var(--wpds-font-size-lg);
  font-weight: var(--wpds-font-weight-semibold);
  color: var(--wpds-color-fg-content-neutral-strong);
  margin-bottom: var(--wpds-dimension-gap-surface-sm);
}

.my-card-text {
  font-size: var(--wpds-font-size-md);
  color: var(--wpds-color-fg-content-neutral);
}
```

### Interactive States

```css
.my-button {
  background: var(--wpds-color-bg-interactive-brand-strong);
  color: var(--wpds-color-fg-content-neutral-strong);
  padding: var(--wpds-dimension-padding-interactive-md);
  border-radius: var(--wpds-border-radius-sm);
}

.my-button:hover {
  background: var(--wpds-color-bg-interactive-brand-strong-active);
}

.my-button:focus {
  outline: 2px solid var(--wpds-color-stroke-focus-brand);
  outline-offset: 2px;
}
```

### Status Messaging

```css
.notice-success {
  background: var(--wpds-color-bg-surface-success-weak);
  border-left: 4px solid var(--wpds-color-stroke-surface-success-strong);
  color: var(--wpds-color-fg-content-success);
}

.notice-error {
  background: var(--wpds-color-bg-surface-error-weak);
  border-left: 4px solid var(--wpds-color-stroke-surface-error-strong);
  color: var(--wpds-color-fg-content-error);
}
```

### ThemeProvider Usage

```jsx
import { ThemeProvider } from '@wordpress/theme';

// Default theme
<ThemeProvider>
  <App />
</ThemeProvider>

// Custom brand color
<ThemeProvider color={{ primary: '#0073aa' }}>
  <App />
</ThemeProvider>

// Dark mode (based on bg color)
<ThemeProvider color={{ bg: '#1e1e1e' }}>
  <DarkModeSection />
</ThemeProvider>

// Compact density for data-heavy UI
<ThemeProvider density="compact">
  <DataTable />
</ThemeProvider>
```

### theme.json Integration

For WordPress themes, tokens map to theme.json presets:

```json
{
  "version": 3,
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#007cba", "name": "Primary" },
        { "slug": "secondary", "color": "#6c757d", "name": "Secondary" }
      ]
    },
    "spacing": {
      "spacingSizes": [
        { "slug": "sm", "size": "8px", "name": "Small" },
        { "slug": "md", "size": "16px", "name": "Medium" },
        { "slug": "lg", "size": "24px", "name": "Large" }
      ]
    },
    "typography": {
      "fontSizes": [
        { "slug": "small", "size": "13px", "name": "Small" },
        { "slug": "medium", "size": "16px", "name": "Medium" },
        { "slug": "large", "size": "20px", "name": "Large" }
      ]
    }
  }
}
```

These generate CSS custom properties:
```css
--wp--preset--color--primary
--wp--preset--color--secondary
--wp--preset--spacing--sm
--wp--preset--spacing--md
--wp--preset--font-size--small
--wp--preset--font-size--medium
```
