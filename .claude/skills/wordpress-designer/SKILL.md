---
name: wordpress-designer
description: Build consistent WordPress admin interfaces using official @wordpress/components and design tokens. Use when creating UI screens, dashboards, settings pages, or any interface that should feel native to WordPress admin. Covers component selection, proper token usage for colors/spacing/typography, and composition patterns to avoid visual inconsistency.
---

# WordPress Designer

Build WordPress-native interfaces using official components and design tokens from `@wordpress/components` and `@wordpress/theme`.

## Core Principles

1. **Use semantic tokens, not raw values** - Always use CSS custom properties like `--wp--preset--color--primary` instead of hex codes
2. **Compose from official components** - Prefer `Card`, `Button`, `Panel` over custom elements
3. **Follow density patterns** - Use consistent spacing with token-based gaps and padding
4. **Respect the theme system** - Interfaces should adapt to light/dark modes automatically

## Quick Reference

### Component Import Pattern
```jsx
import { 
  Button, Card, CardBody, CardHeader, CardFooter,
  Panel, PanelBody, PanelRow,
  Flex, FlexItem, FlexBlock,
  TextControl, SelectControl, ToggleControl,
  Notice, Spinner, Icon
} from '@wordpress/components';
```

### Design Token Pattern
```css
/* Use semantic tokens from @wordpress/theme */
.my-component {
  background: var(--wp-admin-theme-color);
  color: var(--wp-admin-theme-color-darker-10);
  padding: var(--wp-admin-padding);
  border-radius: var(--wp-admin-radius-sm);
}
```

## Component Selection Guide

| Need | Use Component | Avoid |
|------|---------------|-------|
| Primary action | `<Button variant="primary">` | Custom styled buttons |
| Container | `<Card>` with `<CardBody>` | Plain `<div>` with borders |
| Settings section | `<Panel>` with `<PanelBody>` | Custom accordions |
| Layout | `<Flex>`, `<HStack>`, `<VStack>` | Manual flexbox CSS |
| Form fields | `<TextControl>`, `<SelectControl>` | Native `<input>`, `<select>` |
| Feedback | `<Notice>`, `<Snackbar>` | Custom alert divs |
| Loading | `<Spinner>` | Custom spinners |

## Token Categories

### Colors
- **Backgrounds**: `--wp-admin-theme-color`, `--wp-components-color-background`
- **Text**: `--wp-components-color-foreground`, `--wp-components-color-foreground-inverted`
- **Borders**: `--wp-components-color-gray-200`, `--wp-components-color-gray-300`
- **States**: `--wp-components-color-accent` (hover/focus)

### Spacing (use via component props or CSS)
- `2xs`: 2px | `xs`: 4px | `sm`: 8px | `md`: 12px | `lg`: 16px | `xl`: 24px

### Typography
- Use `<Heading>` and `<Text>` components for consistent typography
- Font sizes: `--wp-components-font-size-x-small` through `--wp-components-font-size-x-large`

## Composition Patterns

### Settings Page Structure
```jsx
<Panel>
  <PanelBody title="Section Name" initialOpen>
    <PanelRow>
      <TextControl label="Setting" value={val} onChange={setVal} />
    </PanelRow>
    <PanelRow>
      <ToggleControl label="Enable feature" checked={on} onChange={setOn} />
    </PanelRow>
  </PanelBody>
</Panel>
```

### Card-Based Layout
```jsx
<Card>
  <CardHeader>
    <Heading level={3}>Title</Heading>
  </CardHeader>
  <CardBody>
    {/* Content */}
  </CardBody>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

### Data Display with Flex
```jsx
<Flex gap={4} wrap>
  {items.map(item => (
    <FlexItem key={item.id}>
      <Card size="small">
        <CardBody>{item.name}</CardBody>
      </Card>
    </FlexItem>
  ))}
</Flex>
```

## Common Anti-Patterns

**DON'T:**
- Use arbitrary colors like `#3858e9` - use `var(--wp-admin-theme-color)` instead
- Create custom form inputs - use `TextControl`, `SelectControl`, etc.
- Add inline styles for spacing - use `<Spacer>` or Flex gaps
- Build custom modals - use `<Modal>` from @wordpress/components
- Use `px` values directly - prefer token-based spacing

**DO:**
- Import and use official components
- Apply design tokens via CSS custom properties
- Use `__next40pxDefaultSize` prop on buttons for modern sizing
- Wrap interactive areas with proper focus management

## Detailed References

For comprehensive component APIs and token values:
- **Components**: See [references/components.md](references/components.md) for full component list with props
- **Design Tokens**: See [references/tokens.md](references/tokens.md) for complete token reference
- **Patterns**: See [references/patterns.md](references/patterns.md) for complex UI recipes
