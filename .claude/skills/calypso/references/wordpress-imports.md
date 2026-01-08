# WordPress Imports Reference

Complete reference of exports from WordPress packages commonly used in Calypso.

## @wordpress/components

React UI components for WordPress interfaces.

### Layout Components
- `AlignmentMatrixControl`
- `Flex`, `FlexItem`, `FlexBlock`
- `Grid`
- `HStack`, `VStack`
- `Spacer`
- `Surface`

### Container Components
- `Card`, `CardBody`, `CardDivider`, `CardFooter`, `CardHeader`, `CardMedia`
- `Panel`, `PanelBody`, `PanelHeader`, `PanelRow`
- `Placeholder`

### Form Controls
- `BaseControl`
- `CheckboxControl`
- `ColorPalette`, `ColorPicker`
- `ComboboxControl`
- `CustomGradientPicker`, `GradientPicker`
- `CustomSelectControl`
- `DatePicker`, `DateTimePicker`, `TimePicker`
- `FormFileUpload`
- `FormTokenField`
- `FormToggle`
- `InputControl`
- `NumberControl`
- `QueryControls`
- `RadioControl`
- `RangeControl`
- `SearchControl`
- `SelectControl`
- `TextControl`
- `TextareaControl`
- `ToggleControl`
- `ToggleGroupControl`, `ToggleGroupControlOption`
- `TreeSelect`
- `UnitControl`

### Buttons & Actions
- `Button`
- `ButtonGroup`
- `ClipboardButton`
- `DropdownMenu`
- `IconButton` (deprecated, use Button with icon)

### Feedback & Status
- `Animate`
- `Notice`, `NoticeList`
- `Snackbar`, `SnackbarList`
- `Spinner`

### Navigation
- `NavigableContainer`, `NavigableMenu`
- `TabPanel`
- `TabbableContainer`

### Overlays
- `Dropdown`
- `Guide`
- `Modal`
- `Popover`
- `Tooltip`

### Typography & Display
- `Dashicon`
- `Icon`
- `Truncate`
- `VisuallyHidden`

### Media
- `DropZone`
- `Draggable`, `Droppable`
- `FocalPointPicker`
- `MediaPlaceholder`
- `ResponsiveWrapper`
- `SandBox`

### Advanced
- `AnglePickerControl`
- `BorderBoxControl`, `BorderControl`
- `BoxControl`
- `DuotonePicker`, `DuotoneSwatch`
- `FontSizePicker`
- `IsolatedEventContainer`
- `ItemGroup`
- `MenuGroup`, `MenuItem`
- `ResizableBox`
- `ScrollLock`
- `Shortcut`
- `SlotFill`, `SlotFillProvider`, `Slot`
- `Toolbar`, `ToolbarButton`, `ToolbarGroup`, `ToolbarItem`
- `TreeGrid`
- `ZStack`

### Experimental Components
- `__experimentalAlignmentMatrixControl`
- `__experimentalConfirmDialog`
- `__experimentalDimensionControl`
- `__experimentalDivider`
- `__experimentalHeading`
- `__experimentalHStack`, `__experimentalVStack`
- `__experimentalInputControl`
- `__experimentalItemGroup`
- `__experimentalNavigationBackButton`, `__experimentalNavigationGroup`, `__experimentalNavigationItem`, `__experimentalNavigationMenu`
- `__experimentalNumberControl`
- `__experimentalSpacer`
- `__experimentalText`
- `__experimentalToggleGroupControl`, `__experimentalToggleGroupControlOption`
- `__experimentalToolsPanel`, `__experimentalToolsPanelHeader`, `__experimentalToolsPanelItem`
- `__experimentalTruncate`
- `__experimentalUnitControl`
- `__experimentalView`
- `__experimentalZStack`

---

## @wordpress/block-editor

Components and utilities for the block editor.

### Editor Components
- `AlignmentControl`
- `BlockAlignmentControl`, `BlockAlignmentMatrixControl`
- `BlockBreadcrumb`
- `BlockControls`
- `BlockEdit`
- `BlockEditorKeyboardShortcuts`
- `BlockFormatControls`
- `BlockIcon`
- `BlockInspector`
- `BlockList`
- `BlockMover`
- `BlockNavigationDropdown`
- `BlockPreview`
- `BlockSelectionClearer`
- `BlockSettingsMenu`
- `BlockTitle`
- `BlockToolbar`

### Controls
- `ColorPaletteControl`
- `ContrastChecker`
- `FontSizePicker`
- `InspectorAdvancedControls`
- `InspectorControls`
- `LineHeightControl`
- `PanelColorSettings`

### Content
- `CopyHandler`
- `DefaultBlockAppender`
- `InnerBlocks`
- `MediaPlaceholder`
- `MediaUpload`, `MediaUploadCheck`
- `NavigableToolbar`
- `ObserveTyping`
- `PlainText`
- `RichText`, `RichTextShortcut`, `RichTextToolbarButton`
- `SkipToSelectedBlock`
- `TableOfContents`
- `URLInput`, `URLInputButton`, `URLPopover`
- `Warning`
- `WritingFlow`

### Hooks & Utilities
- `useBlockProps`
- `useInnerBlocksProps`
- `store` - The block editor data store
- `transformStyles`
- `getColorClassName`
- `getColorObjectByAttributeValues`
- `getColorObjectByColorValue`
- `getFontSize`, `getFontSizeClass`
- `withColors`, `withFontSizes`

### Experimental
- `__experimentalBlockAlignmentMatrixToolbar`
- `__experimentalBlockFullHeightAligmentControl`
- `__experimentalBlockPatternSetup`
- `__experimentalBlockVariationPicker`
- `__experimentalBorderRadiusControl`
- `__experimentalImageSizeControl`
- `__experimentalLinkControl`
- `__experimentalPanelColorGradientSettings`
- `__experimentalUnitControl`
- `__experimentalUseEditorFeature`
- `__experimentalUseGradient`
- `__experimentalUseMultipleOriginColorsAndGradients`
- `__experimentalGetGradientClass`
- `__experimentalGetGradientValueBySlug`

---

## @wordpress/data

State management utilities (Redux-like).

### Store Management
- `batch` - Batches multiple dispatch calls to optimize rendering
- `combineReducers` - Helper to combine multiple reducers
- `createReduxStore` - Creates a data store descriptor
- `createRegistry` - Creates a new store registry
- `createRegistryControl` - Creates a control with registry access
- `createRegistrySelector` - Creates a selector with registry access
- `createSelector` - Creates a memoized selector
- `register` - Registers a store descriptor

### Accessing State
- `dispatch` - Returns store's action creators
- `select` - Returns store's selectors
- `resolveSelect` - Returns promise-wrapped selectors
- `suspendSelect` - Returns suspense-wrapped selectors
- `subscribe` - Subscribes to store updates

### React Integration
- `useDispatch` - Hook for dispatch actions
- `useSelect` - Hook for state selection
- `useSuspenseSelect` - Suspense-enabled selection hook
- `useRegistry` - Hook for registry access
- `withDispatch` - HOC for dispatch actions
- `withSelect` - HOC for state selection
- `withRegistry` - HOC for registry access

### Context
- `RegistryConsumer` - React Context consumer for registry
- `RegistryProvider` - React Context provider for registry

### Plugins
- `plugins` - Available registry plugins
- `use` - Extends registry with plugin

### Deprecated
- `controls` - (Deprecated) Control handler system
- `registerGenericStore` - (Deprecated) Registers generic store
- `registerStore` - (Deprecated) Registers standard store

---

## @wordpress/core-data

Entity store for WordPress data (posts, users, settings, etc.).

### Entity Record Management
- `getEntityRecord` - Get a single entity record
- `getEntityRecords` - Get multiple entity records
- `getEditedEntityRecord` - Get entity record with edits
- `hasEntityRecords` - Check if records exist
- `saveEntityRecord` - Save an entity record
- `deleteEntityRecord` - Delete an entity record
- `editEntityRecord` - Edit an entity record
- `getRawEntityRecord` - Get raw record data
- `getEntityRecordsTotalItems` - Get total available records
- `getEntityRecordsTotalPages` - Get total available pages
- `getEntityRecordNonTransientEdits` - Get non-transient edits

### Entity Configuration
- `getEntityConfig` - Get entity configuration
- `getEntitiesConfig` - Get multiple entities configuration

### Revisions & Autosaves
- `getRevisions` - Get entity revisions
- `getRevision` - Get a specific revision
- `getAutosave` - Get autosave for post/author
- `getAutosaves` - Get all autosaves for post

### User & Permissions
- `canUser` - Check user permissions
- `canUserEditEntityRecord` - Check edit permissions
- `getCurrentUser` - Get current user data

### State Management
- `hasEditsForEntityRecord` - Check for pending edits
- `hasUndo` - Check for available undo
- `hasRedo` - Check for available redo
- `undo` - Undo last edit
- `redo` - Redo last undone edit

### React Hooks
- `useEntityRecord` - Hook for single record management
- `useEntityRecords` - Hook for multiple records management
- `useEntityProp` - Hook for entity property management
- `useEntityBlockEditor` - Hook for entity block editor
- `useEntityId` - Hook for entity ID access
- `useResourcePermissions` - Hook for checking resource permissions

### Status & Error Handling
- `isSavingEntityRecord` - Check save status
- `isDeletingEntityRecord` - Check delete status
- `isAutosavingEntityRecord` - Check autosave status
- `getLastEntitySaveError` - Get last save error
- `getLastEntityDeleteError` - Get last delete error
