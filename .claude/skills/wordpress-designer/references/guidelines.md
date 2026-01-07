# WordPress Design Guidelines

Best practices for designing WordPress admin interfaces that are accessible, consistent, and native-feeling.

## Table of Contents

1. [Accessibility Requirements](#accessibility-requirements)
2. [Color & Contrast](#color--contrast)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Forms & Inputs](#forms--inputs)
6. [Buttons & Actions](#buttons--actions)
7. [Links & Navigation](#links--navigation)
8. [Feedback & Status](#feedback--status)
9. [Responsive Design](#responsive-design)
10. [Dark Mode Support](#dark-mode-support)

---

## Accessibility Requirements

WordPress follows WCAG 2.0 Level AA guidelines. All interfaces must meet these standards.

### Contrast Ratios

| Element | Minimum Ratio | Notes |
|---------|---------------|-------|
| Normal text | 4.5:1 | Body text, labels |
| Large text (18px+ bold, 24px+ regular) | 3:1 | Headings |
| UI components | 3:1 | Borders, icons, focus states |
| Disabled elements | No requirement | But should be visually distinct |

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Browser DevTools accessibility panel

### Keyboard Navigation

All interactive elements must be:
- Reachable via Tab key
- Activatable via Enter or Space
- Navigable with Arrow keys (for composite widgets)

```jsx
// DO: Use semantic components with built-in keyboard support
<Button onClick={handleClick}>Save</Button>

// DON'T: Use non-interactive elements for actions
<div onClick={handleClick}>Save</div>
```

### Focus Management

```css
/* Focus states must be MORE visible than hover states */
.component:focus {
  outline: 2px solid var(--wp-admin-theme-color);
  outline-offset: 2px;
}

/* Or use the built-in focus ring token */
.component:focus-visible {
  box-shadow: 0 0 0 var(--wp-admin-border-width-focus) var(--wp-admin-theme-color);
}
```

### Screen Reader Support

- Use semantic HTML elements (`<button>`, `<nav>`, `<main>`)
- Add `aria-label` for icon-only buttons
- Use `<VisuallyHidden>` for screen-reader-only text
- Announce dynamic content changes with live regions

```jsx
// Icon button with accessible label
<Button icon={settings} label="Open settings" />

// Or with VisuallyHidden
<Button>
  <Icon icon={close} />
  <VisuallyHidden>Close dialog</VisuallyHidden>
</Button>
```

---

## Color & Contrast

### Use Semantic Tokens

Never hardcode color values. Always use CSS custom properties.

```css
/* Surface colors */
--wp-admin-theme-color              /* Primary brand */
--wp-components-color-background    /* Page background */
--wp-components-color-foreground    /* Default text */

/* Status colors (via semantic tokens) */
--wpds-color-bg-surface-success-weak
--wpds-color-bg-surface-error-weak
--wpds-color-bg-surface-warning-weak
--wpds-color-bg-surface-info-weak
```

### Color Meaning

| Color Intent | Use Case | Token Pattern |
|--------------|----------|---------------|
| Neutral | Default UI elements | `*-neutral-*` |
| Brand | Primary actions, links | `*-brand-*` |
| Success | Confirmations, saved states | `*-success-*` |
| Warning | Caution, attention needed | `*-warning-*` |
| Error | Errors, destructive actions | `*-error-*` |
| Info | Informational notices | `*-info-*` |

### Don't Rely on Color Alone

Always pair color with another indicator:

```jsx
// DO: Color + icon + text
<Notice status="error">
  <Icon icon={warning} />
  Unable to save: Connection failed
</Notice>

// DON'T: Color alone
<span style={{ color: 'red' }}>Error</span>
```

---

## Typography

### Font Sizes

Use the design system scale. Never use arbitrary pixel values.

| Token | Size | Use Case |
|-------|------|----------|
| `--wpds-font-size-2xs` | 10px | Tiny labels, badges |
| `--wpds-font-size-xs` | 11px | Secondary text, captions |
| `--wpds-font-size-sm` | 12px | Small body text |
| `--wpds-font-size-md` | 13px | Default body text |
| `--wpds-font-size-lg` | 14px | Emphasized body |
| `--wpds-font-size-xl` | 16px | Small headings |
| `--wpds-font-size-2xl` | 20px | Section headings |
| `--wpds-font-size-3xl` | 24px | Page titles |

### Minimum Readable Size

**Body text must be at least 13-14px** for readability. Never go below this for primary content.

### Use Typography Components

```jsx
// DO: Use semantic components
import { __experimentalHeading as Heading, __experimentalText as Text } from '@wordpress/components';

<Heading level={1}>Page Title</Heading>
<Text>Body content</Text>
<Text variant="muted">Secondary information</Text>

// DON'T: Use raw elements with custom styles
<h1 style={{ fontSize: '24px' }}>Page Title</h1>
```

### Font Weights

| Weight | Token | Use |
|--------|-------|-----|
| 400 | `--wpds-font-weight-regular` | Body text |
| 500 | `--wpds-font-weight-medium` | Emphasis |
| 600 | `--wpds-font-weight-semibold` | Subheadings |
| 700 | `--wpds-font-weight-bold` | Headings, strong emphasis |

---

## Spacing & Layout

### Spacing Scale

Use the consistent spacing scale, never arbitrary values.

| Token | Value | Common Use |
|-------|-------|------------|
| `2xs` | 2px | Tight inline spacing |
| `xs` | 4px | Icon-to-text gap |
| `sm` | 8px | Related element gap |
| `md` | 12px | Standard control spacing |
| `lg` | 16px | Section padding |
| `xl` | 24px | Major section gaps |
| `2xl` | 32px | Page-level margins |

### Use Flex for Layout

```jsx
// DO: Use Flex with gap prop
<Flex gap={4} align="center">
  <FlexItem>Label</FlexItem>
  <FlexBlock>
    <TextControl />
  </FlexBlock>
</Flex>

// DON'T: Manual margin/padding
<div style={{ display: 'flex' }}>
  <span style={{ marginRight: '16px' }}>Label</span>
  <input />
</div>
```

### White Space

- Use generous white space to reduce cognitive load
- Group related elements with less space between them
- Separate distinct sections with more space
- Don't cram controls together

### Density Modes

The design system supports different densities:

| Density | Use Case |
|---------|----------|
| `default` | Standard admin pages |
| `compact` | Data tables, dense lists |
| `comfortable` | Focused tasks, modals |

```jsx
<ThemeProvider density="compact">
  <DataTable />
</ThemeProvider>
```

---

## Forms & Inputs

### Always Use Visible Labels

```jsx
// DO: Visible label
<TextControl
  label="Email address"
  value={email}
  onChange={setEmail}
/>

// DON'T: Placeholder as label
<TextControl
  placeholder="Email address"  // Not accessible!
  value={email}
  onChange={setEmail}
/>
```

### Placeholder Text Guidelines

- Use placeholders for format hints: `placeholder="name@example.com"`
- Never use as the only label
- Don't put instructions in placeholders (they disappear on focus)

### Help Text

Use the `help` prop for instructions:

```jsx
<TextControl
  label="API Key"
  help="Find this in your account settings"
  value={apiKey}
  onChange={setApiKey}
/>
```

### Label Associations

Labels must be programmatically associated with inputs:

```jsx
// WordPress components handle this automatically
<TextControl label="Username" />

// For custom inputs, use htmlFor
<label htmlFor="my-input">Username</label>
<input id="my-input" />
```

### Validation & Errors

- Show errors inline near the input
- Use the `Notice` component with `status="error"`
- Don't rely on color alone—include error message text

```jsx
{hasError && (
  <Notice status="error" isDismissible={false}>
    Please enter a valid email address
  </Notice>
)}
```

---

## Buttons & Actions

### Button Text

Use descriptive, action-oriented labels:

```jsx
// DO: Verb + Noun
<Button>Save Settings</Button>
<Button>Create Post</Button>
<Button>Delete Account</Button>

// DON'T: Generic labels
<Button>Submit</Button>
<Button>OK</Button>
<Button>Click Here</Button>
```

### Button Hierarchy

| Variant | Use Case |
|---------|----------|
| `primary` | Main action (one per view) |
| `secondary` | Alternative actions |
| `tertiary` | Low-emphasis actions |
| `link` | Navigation, inline actions |

```jsx
<Flex justify="flex-end" gap={3}>
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save Changes</Button>
</Flex>
```

### Destructive Actions

```jsx
// Use isDestructive for dangerous actions
<Button variant="primary" isDestructive>
  Delete Account
</Button>

// Require confirmation for irreversible actions
const handleDelete = () => {
  if (confirm('This cannot be undone. Continue?')) {
    performDelete();
  }
};
```

### Loading States

```jsx
<Button
  variant="primary"
  isBusy={isSaving}
  disabled={isSaving}
>
  {isSaving ? 'Saving...' : 'Save Settings'}
</Button>
```

### Modern Button Sizing

Use the `__next40pxDefaultSize` prop for consistent 40px height:

```jsx
<Button variant="primary" __next40pxDefaultSize>
  Save
</Button>
```

---

## Links & Navigation

### Link Styling

- Keep underlines on text links (accessibility requirement)
- Use distinct colors for visited vs unvisited states
- Ensure hover and focus states are clearly different

```css
a {
  color: var(--wp-admin-theme-color);
  text-decoration: underline;
}

a:visited {
  color: var(--wp-admin-theme-color-darker-20);
}

a:hover {
  color: var(--wp-admin-theme-color-darker-10);
}

a:focus {
  outline: 2px solid var(--wp-admin-theme-color);
  outline-offset: 2px;
}
```

### Link Text

```jsx
// DO: Descriptive link text
<a href="/docs">Read the documentation</a>

// DON'T: Generic text
<a href="/docs">Click here</a>
<a href="/docs">Learn more</a>  // Acceptable with context
```

### Opening New Windows

Only open links in new tabs when necessary (external links). Always indicate:

```jsx
<Button
  variant="link"
  href="https://external.com"
  target="_blank"
  rel="noopener noreferrer"
>
  External Site
  <Icon icon={external} />
  <VisuallyHidden>(opens in new tab)</VisuallyHidden>
</Button>
```

---

## Feedback & Status

### Notice Types

| Status | Use Case |
|--------|----------|
| `success` | Confirmations, completed actions |
| `error` | Failures, validation errors |
| `warning` | Caution, potential issues |
| `info` | Neutral information |

```jsx
<Notice status="success" isDismissible onRemove={dismiss}>
  Settings saved successfully!
</Notice>
```

### Loading Feedback

Always show loading state for async operations:

```jsx
{isLoading ? (
  <Flex justify="center" style={{ padding: '24px' }}>
    <Spinner />
  </Flex>
) : (
  <Content />
)}
```

### Empty States

Provide helpful empty states:

```jsx
<Card>
  <CardBody style={{ textAlign: 'center', padding: '48px' }}>
    <Icon icon={inbox} size={48} />
    <Heading level={3}>No items yet</Heading>
    <Text variant="muted">Create your first item to get started.</Text>
    <Spacer marginTop={4} />
    <Button variant="primary">Create Item</Button>
  </CardBody>
</Card>
```

### Error States

```jsx
<Card>
  <CardBody>
    <Notice status="error" isDismissible={false}>
      Failed to load data. Please try again.
    </Notice>
    <Spacer marginTop={3} />
    <Button variant="secondary" onClick={retry}>
      Retry
    </Button>
  </CardBody>
</Card>
```

---

## Responsive Design

### Flexible Layouts

Use Flex with `wrap` for responsive grids:

```jsx
<Flex gap={4} wrap>
  {items.map(item => (
    <FlexItem key={item.id} style={{ flex: '1 1 250px', maxWidth: '350px' }}>
      <Card>{item.content}</Card>
    </FlexItem>
  ))}
</Flex>
```

### Don't Assume Screen Size

- Test at various viewport widths
- Avoid fixed widths for containers
- Use relative units and max-width constraints

### Touch Targets

Minimum touch target size: 44x44px for mobile interfaces.

---

## Dark Mode Support

### Use Semantic Tokens

Semantic tokens automatically adapt to dark mode:

```css
/* These adapt automatically */
.element {
  background: var(--wpds-color-bg-surface-neutral);
  color: var(--wpds-color-fg-content-neutral);
  border: 1px solid var(--wpds-color-stroke-surface-neutral);
}
```

### ThemeProvider for Dark Sections

```jsx
// Force dark mode for a section
<ThemeProvider color={{ bg: '#1e1e1e' }}>
  <DarkModeContent />
</ThemeProvider>
```

### Testing

- Test both light and dark modes
- Verify contrast ratios in both modes
- Check that all UI elements are visible

---

## Resources

- [Learn WordPress - UI Best Practices](https://learn.wordpress.org/lesson/ui-best-practices/)
- [WCAG 2.0 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WordPress Accessibility Handbook](https://make.wordpress.org/accessibility/handbook/)
- [WP-Admin Reference](https://wpadmin.bracketspace.com/)
- [Gutenberg Storybook](https://wordpress.github.io/gutenberg/)
