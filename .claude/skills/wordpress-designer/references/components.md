# WordPress Components Reference

Complete reference for `@wordpress/components` organized by category.

## Table of Contents
1. [Buttons & Actions](#buttons--actions)
2. [Cards & Containers](#cards--containers)
3. [Panels & Accordions](#panels--accordions)
4. [Layout](#layout)
5. [Form Controls](#form-controls)
6. [Feedback & Status](#feedback--status)
7. [Navigation](#navigation)
8. [Overlays](#overlays)
9. [Data Display](#data-display)
10. [Utilities](#utilities)

---

## Buttons & Actions

### Button
Primary interactive element for actions.

```jsx
import { Button } from '@wordpress/components';

// Variants
<Button variant="primary">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="tertiary">Learn more</Button>
<Button variant="link">View details</Button>

// With icon
<Button icon={settings} label="Settings" />
<Button icon={plus}>Add new</Button>

// States
<Button isBusy>Saving...</Button>
<Button isDestructive>Delete</Button>
<Button disabled>Unavailable</Button>

// Sizes
<Button size="default">Normal</Button>
<Button size="compact">Compact</Button>
<Button size="small">Small</Button>
<Button __next40pxDefaultSize>Modern height</Button>
```

**Key Props:**
- `variant`: `'primary'` | `'secondary'` | `'tertiary'` | `'link'`
- `size`: `'default'` | `'compact'` | `'small'`
- `icon`: IconType - renders icon inside button
- `iconPosition`: `'left'` | `'right'`
- `isBusy`: boolean - shows loading state
- `isDestructive`: boolean - red destructive style
- `isPressed`: boolean - toggle pressed state
- `__next40pxDefaultSize`: boolean - opt into 40px height

### ButtonGroup
Group related buttons together.

```jsx
import { ButtonGroup, Button } from '@wordpress/components';

<ButtonGroup>
  <Button variant="primary">Save</Button>
  <Button variant="secondary">Preview</Button>
</ButtonGroup>
```

---

## Cards & Containers

### Card
Container for grouping related content with consistent styling.

```jsx
import { Card, CardHeader, CardBody, CardFooter, CardDivider, CardMedia } from '@wordpress/components';

<Card>
  <CardHeader>
    <Heading level={3}>Card Title</Heading>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardDivider />
  <CardBody>
    <p>Additional section</p>
  </CardBody>
  <CardFooter>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>

// With media
<Card>
  <CardMedia>
    <img src="image.jpg" alt="Preview" />
  </CardMedia>
  <CardBody>Description</CardBody>
</Card>

// Size variants
<Card size="small">Compact card</Card>
<Card size="medium">Default card</Card>
<Card size="large">Spacious card</Card>

// Elevation
<Card elevation={2}>Elevated card</Card>
```

**Card Props:**
- `size`: `'small'` | `'medium'` | `'large'`
- `elevation`: number (0-5) - shadow depth
- `isBorderless`: boolean

### Surface
Base container with background and border support.

```jsx
import { Surface } from '@wordpress/components';

<Surface variant="primary">Primary surface</Surface>
<Surface variant="secondary">Secondary surface</Surface>
<Surface variant="tertiary">Tertiary surface</Surface>
```

---

## Panels & Accordions

### Panel
Collapsible sections for organizing content.

```jsx
import { Panel, PanelBody, PanelRow, PanelHeader } from '@wordpress/components';

<Panel header="Settings Panel">
  <PanelBody title="General Settings" initialOpen>
    <PanelRow>
      <TextControl label="Site Title" value={title} onChange={setTitle} />
    </PanelRow>
    <PanelRow>
      <ToggleControl label="Public" checked={isPublic} onChange={setIsPublic} />
    </PanelRow>
  </PanelBody>
  <PanelBody title="Advanced" initialOpen={false}>
    <PanelRow>
      <SelectControl 
        label="Cache Duration" 
        options={cacheOptions}
        value={cache}
        onChange={setCache}
      />
    </PanelRow>
  </PanelBody>
</Panel>
```

**PanelBody Props:**
- `title`: string - section header
- `initialOpen`: boolean - start expanded
- `onToggle`: function - callback on expand/collapse
- `icon`: IconType - header icon

### ToolsPanel
For inspector-style controls with reset capability.

```jsx
import { ToolsPanel, ToolsPanelItem } from '@wordpress/components';

<ToolsPanel label="Dimensions" resetAll={() => resetDimensions()}>
  <ToolsPanelItem
    hasValue={() => !!width}
    label="Width"
    onDeselect={() => setWidth(undefined)}
  >
    <UnitControl value={width} onChange={setWidth} />
  </ToolsPanelItem>
</ToolsPanel>
```

---

## Layout

### Flex
Flexible container for horizontal/vertical layouts.

```jsx
import { Flex, FlexItem, FlexBlock } from '@wordpress/components';

// Horizontal layout (default)
<Flex gap={4} align="center" justify="space-between">
  <FlexItem>Logo</FlexItem>
  <FlexBlock>Main content (grows)</FlexBlock>
  <FlexItem>Actions</FlexItem>
</Flex>

// Vertical layout
<Flex direction="column" gap={3}>
  <FlexItem>First</FlexItem>
  <FlexItem>Second</FlexItem>
</Flex>

// Wrapping
<Flex wrap gap={2}>
  {items.map(item => <FlexItem key={item.id}>{item.name}</FlexItem>)}
</Flex>
```

**Flex Props:**
- `direction`: `'row'` | `'column'` | `'row-reverse'` | `'column-reverse'`
- `gap`: number - spacing between items (in grid units, 1 = 4px)
- `align`: `'center'` | `'flex-start'` | `'flex-end'` | `'stretch'`
- `justify`: `'center'` | `'flex-start'` | `'flex-end'` | `'space-between'` | `'space-around'`
- `wrap`: boolean

### HStack / VStack
Convenience wrappers for horizontal/vertical Flex.

```jsx
import { HStack, VStack } from '@wordpress/components';

<HStack spacing={3} alignment="center">
  <Icon icon={info} />
  <span>Horizontal stack</span>
</HStack>

<VStack spacing={4}>
  <Heading>Title</Heading>
  <Text>Description</Text>
  <Button>Action</Button>
</VStack>
```

### Grid
CSS Grid-based layout.

```jsx
import { Grid } from '@wordpress/components';

<Grid columns={3} gap={4}>
  <div>Cell 1</div>
  <div>Cell 2</div>
  <div>Cell 3</div>
</Grid>

// Responsive
<Grid columns={[1, 2, 3]} gap={4}>
  {/* 1 col mobile, 2 col tablet, 3 col desktop */}
</Grid>
```

### Spacer
Add consistent spacing between elements.

```jsx
import { Spacer } from '@wordpress/components';

<Heading>Title</Heading>
<Spacer marginBottom={4} />
<Text>Content with spacing above</Text>
```

---

## Form Controls

### TextControl
Single-line text input.

```jsx
import { TextControl } from '@wordpress/components';

<TextControl
  label="Username"
  help="Enter your username"
  value={username}
  onChange={setUsername}
  placeholder="johndoe"
/>

// With validation
<TextControl
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  __nextHasNoMarginBottom
/>
```

### TextareaControl
Multi-line text input.

```jsx
import { TextareaControl } from '@wordpress/components';

<TextareaControl
  label="Description"
  value={description}
  onChange={setDescription}
  rows={4}
/>
```

### SelectControl
Dropdown selection.

```jsx
import { SelectControl } from '@wordpress/components';

<SelectControl
  label="Country"
  value={country}
  onChange={setCountry}
  options={[
    { label: 'Select...', value: '' },
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
  ]}
/>

// Multiple selection
<SelectControl
  multiple
  label="Categories"
  value={categories}
  onChange={setCategories}
  options={categoryOptions}
/>
```

### ToggleControl
Boolean switch.

```jsx
import { ToggleControl } from '@wordpress/components';

<ToggleControl
  label="Enable notifications"
  help="Receive email updates"
  checked={notifications}
  onChange={setNotifications}
/>
```

### CheckboxControl
Checkbox input.

```jsx
import { CheckboxControl } from '@wordpress/components';

<CheckboxControl
  label="I agree to terms"
  checked={agreed}
  onChange={setAgreed}
/>
```

### RadioControl
Radio button group.

```jsx
import { RadioControl } from '@wordpress/components';

<RadioControl
  label="Visibility"
  selected={visibility}
  options={[
    { label: 'Public', value: 'public' },
    { label: 'Private', value: 'private' },
    { label: 'Password protected', value: 'password' },
  ]}
  onChange={setVisibility}
/>
```

### ToggleGroupControl
Segmented control for mutually exclusive options.

```jsx
import { ToggleGroupControl, ToggleGroupControlOption } from '@wordpress/components';

<ToggleGroupControl label="Alignment" value={align} onChange={setAlign} isBlock>
  <ToggleGroupControlOption value="left" label="Left" />
  <ToggleGroupControlOption value="center" label="Center" />
  <ToggleGroupControlOption value="right" label="Right" />
</ToggleGroupControl>
```

### RangeControl
Slider input.

```jsx
import { RangeControl } from '@wordpress/components';

<RangeControl
  label="Opacity"
  value={opacity}
  onChange={setOpacity}
  min={0}
  max={100}
  step={5}
/>
```

### NumberControl
Numeric input with increment/decrement.

```jsx
import { __experimentalNumberControl as NumberControl } from '@wordpress/components';

<NumberControl
  label="Quantity"
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={100}
/>
```

### ColorPicker / ColorPalette
Color selection.

```jsx
import { ColorPicker, ColorPalette } from '@wordpress/components';

<ColorPicker color={color} onChange={setColor} />

<ColorPalette
  colors={[
    { name: 'Red', color: '#f00' },
    { name: 'Blue', color: '#00f' },
  ]}
  value={color}
  onChange={setColor}
/>
```

### DateTimePicker
Date and time selection.

```jsx
import { DateTimePicker } from '@wordpress/components';

<DateTimePicker
  currentDate={date}
  onChange={setDate}
  is12Hour={true}
/>
```

### FormTokenField
Tag/token input.

```jsx
import { FormTokenField } from '@wordpress/components';

<FormTokenField
  label="Tags"
  value={tags}
  suggestions={allTags}
  onChange={setTags}
/>
```

---

## Feedback & Status

### Notice
Display messages to users.

```jsx
import { Notice } from '@wordpress/components';

<Notice status="success" isDismissible onRemove={dismiss}>
  Settings saved successfully!
</Notice>

<Notice status="error">
  An error occurred. Please try again.
</Notice>

<Notice status="warning">
  Your session will expire soon.
</Notice>

<Notice status="info">
  New features available!
</Notice>

// With actions
<Notice 
  status="info"
  actions={[
    { label: 'Learn more', url: '/docs' },
    { label: 'Dismiss', onClick: dismiss },
  ]}
>
  Updates available
</Notice>
```

**Notice Props:**
- `status`: `'success'` | `'error'` | `'warning'` | `'info'`
- `isDismissible`: boolean
- `onRemove`: function
- `actions`: array of action objects

### Snackbar
Temporary toast notifications.

```jsx
import { Snackbar } from '@wordpress/components';

<Snackbar>Post published!</Snackbar>

<Snackbar 
  actions={[{ label: 'Undo', onClick: undo }]}
>
  Item deleted
</Snackbar>
```

### Spinner
Loading indicator.

```jsx
import { Spinner } from '@wordpress/components';

<Spinner />

// In context
{isLoading ? <Spinner /> : <Content />}
```

### ProgressBar
Progress indicator.

```jsx
import { ProgressBar } from '@wordpress/components';

<ProgressBar value={75} />
```

---

## Navigation

### TabPanel
Tabbed interface.

```jsx
import { TabPanel } from '@wordpress/components';

<TabPanel
  tabs={[
    { name: 'general', title: 'General' },
    { name: 'advanced', title: 'Advanced' },
  ]}
>
  {(tab) => (
    <div>
      {tab.name === 'general' && <GeneralSettings />}
      {tab.name === 'advanced' && <AdvancedSettings />}
    </div>
  )}
</TabPanel>
```

### Navigator
Multi-screen navigation.

```jsx
import { 
  NavigatorProvider, 
  NavigatorScreen, 
  NavigatorButton, 
  NavigatorBackButton 
} from '@wordpress/components';

<NavigatorProvider initialPath="/">
  <NavigatorScreen path="/">
    <NavigatorButton path="/details">View Details</NavigatorButton>
  </NavigatorScreen>
  <NavigatorScreen path="/details">
    <NavigatorBackButton>Back</NavigatorBackButton>
    <p>Details content</p>
  </NavigatorScreen>
</NavigatorProvider>
```

---

## Overlays

### Modal
Dialog overlay.

```jsx
import { Modal, Button } from '@wordpress/components';

{isOpen && (
  <Modal
    title="Confirm Action"
    onRequestClose={closeModal}
    isDismissible
  >
    <p>Are you sure you want to continue?</p>
    <Flex justify="flex-end" gap={3}>
      <Button variant="secondary" onClick={closeModal}>Cancel</Button>
      <Button variant="primary" onClick={confirm}>Confirm</Button>
    </Flex>
  </Modal>
)}
```

### ConfirmDialog
Simplified confirmation modal.

```jsx
import { ConfirmDialog } from '@wordpress/components';

<ConfirmDialog
  isOpen={showConfirm}
  onConfirm={handleConfirm}
  onCancel={handleCancel}
>
  Are you sure you want to delete this item?
</ConfirmDialog>
```

### Popover
Floating content anchored to an element.

```jsx
import { Popover, Button } from '@wordpress/components';

<Button ref={buttonRef} onClick={togglePopover}>
  More options
</Button>
{isVisible && (
  <Popover anchor={buttonRef.current} onClose={closePopover}>
    <div style={{ padding: '16px' }}>
      Popover content
    </div>
  </Popover>
)}
```

### Dropdown
Combined trigger and popover.

```jsx
import { Dropdown, Button, MenuGroup, MenuItem } from '@wordpress/components';

<Dropdown
  renderToggle={({ isOpen, onToggle }) => (
    <Button onClick={onToggle} aria-expanded={isOpen}>
      Options
    </Button>
  )}
  renderContent={() => (
    <MenuGroup>
      <MenuItem onClick={edit}>Edit</MenuItem>
      <MenuItem onClick={duplicate}>Duplicate</MenuItem>
      <MenuItem onClick={del} isDestructive>Delete</MenuItem>
    </MenuGroup>
  )}
/>
```

### DropdownMenu
Pre-built dropdown with menu items.

```jsx
import { DropdownMenu } from '@wordpress/components';
import { moreVertical } from '@wordpress/icons';

<DropdownMenu
  icon={moreVertical}
  label="More actions"
  controls={[
    { title: 'Edit', onClick: edit },
    { title: 'Delete', onClick: del, isDestructive: true },
  ]}
/>
```

### Tooltip
Hover information.

```jsx
import { Tooltip, Button } from '@wordpress/components';

<Tooltip text="Save your changes">
  <Button icon={check} />
</Tooltip>
```

---

## Data Display

### Heading
Semantic headings with consistent styling.

```jsx
import { __experimentalHeading as Heading } from '@wordpress/components';

<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section Title</Heading>
<Heading level={3}>Subsection</Heading>
```

### Text
Styled text content.

```jsx
import { __experimentalText as Text } from '@wordpress/components';

<Text>Regular text</Text>
<Text variant="muted">Secondary text</Text>
<Text size="small">Small text</Text>
<Text weight="bold">Bold text</Text>
<Text isDestructive>Error text</Text>
```

### Truncate
Truncate overflowing text.

```jsx
import { __experimentalTruncate as Truncate } from '@wordpress/components';

<Truncate limit={50}>
  This is a very long text that will be truncated...
</Truncate>
```

### Icon
Display icons from @wordpress/icons.

```jsx
import { Icon } from '@wordpress/components';
import { settings, plus, check, close } from '@wordpress/icons';

<Icon icon={settings} />
<Icon icon={plus} size={24} />
```

---

## Utilities

### Disabled
Disable all interactive elements within.

```jsx
import { Disabled, Button, TextControl } from '@wordpress/components';

<Disabled>
  <TextControl value="Can't edit" />
  <Button>Can't click</Button>
</Disabled>
```

### VisuallyHidden
Hide content visually but keep accessible.

```jsx
import { VisuallyHidden } from '@wordpress/components';

<Button>
  <Icon icon={close} />
  <VisuallyHidden>Close dialog</VisuallyHidden>
</Button>
```

### SlotFill
Portal content to designated slots.

```jsx
import { SlotFillProvider, Slot, Fill } from '@wordpress/components';

<SlotFillProvider>
  <Slot name="toolbar" />
  {/* Elsewhere */}
  <Fill name="toolbar">
    <Button>Toolbar action</Button>
  </Fill>
</SlotFillProvider>
```

### Guide
Onboarding wizard.

```jsx
import { Guide } from '@wordpress/components';

<Guide
  onFinish={completeOnboarding}
  pages={[
    { content: <p>Welcome!</p> },
    { content: <p>Here's how to get started...</p> },
    { content: <p>You're all set!</p> },
  ]}
/>
```
