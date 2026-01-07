# Block API Reference

Comprehensive reference for creating and extending WordPress blocks.

## Table of Contents

1. [block.json Schema](#blockjson-schema)
2. [Block Supports](#block-supports)
3. [Block Attributes](#block-attributes)
4. [Block Editor Components](#block-editor-components)
5. [Data Stores](#data-stores)
6. [Hooks and Filters](#hooks-and-filters)
7. [Dynamic Blocks (PHP)](#dynamic-blocks-php)

## block.json Schema

Complete schema for block metadata:

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "namespace/block-name",
  "version": "1.0.0",
  "title": "Block Title",
  "category": "widgets",
  "parent": ["core/group"],
  "ancestor": ["core/columns"],
  "allowedBlocks": ["core/paragraph", "core/image"],
  "icon": "smiley",
  "description": "Block description",
  "keywords": ["keyword1", "keyword2"],
  "textdomain": "my-plugin",
  "attributes": {},
  "providesContext": {},
  "usesContext": [],
  "selectors": {},
  "supports": {},
  "styles": [],
  "example": {},
  "variations": [],
  "blockHooks": {},
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "render": "file:./render.php",
  "viewScript": "file:./view.js",
  "viewScriptModule": "file:./view.js",
  "viewStyle": "file:./view.css"
}
```

### Categories

Built-in categories: `text`, `media`, `design`, `widgets`, `theme`, `embed`

Register custom category:

```php
add_filter('block_categories_all', function($categories) {
    return array_merge($categories, [[
        'slug' => 'my-category',
        'title' => 'My Category',
        'icon' => 'star-filled'
    ]]);
});
```

## Block Supports

Enable WordPress features declaratively:

```json
{
  "supports": {
    "anchor": true,
    "align": ["wide", "full"],
    "alignWide": true,
    "ariaLabel": true,
    "className": true,
    "color": {
      "background": true,
      "gradients": true,
      "link": true,
      "text": true,
      "__experimentalDefaultControls": {
        "background": true,
        "text": true
      }
    },
    "customClassName": true,
    "dimensions": {
      "aspectRatio": true,
      "minHeight": true
    },
    "filter": {
      "duotone": true
    },
    "html": false,
    "inserter": true,
    "interactivity": true,
    "layout": {
      "default": { "type": "constrained" },
      "allowSwitching": true,
      "allowEditing": true,
      "allowInheriting": true,
      "allowSizingOnChildren": true,
      "allowVerticalAlignment": true,
      "allowJustification": true,
      "allowOrientation": true,
      "allowCustomContentAndWideSize": true
    },
    "lock": true,
    "multiple": true,
    "position": {
      "sticky": true
    },
    "renaming": true,
    "reusable": true,
    "shadow": true,
    "spacing": {
      "margin": true,
      "padding": true,
      "blockGap": true,
      "__experimentalDefaultControls": {
        "padding": true
      }
    },
    "splitting": true,
    "typography": {
      "fontSize": true,
      "lineHeight": true,
      "__experimentalFontFamily": true,
      "__experimentalFontStyle": true,
      "__experimentalFontWeight": true,
      "__experimentalLetterSpacing": true,
      "__experimentalTextDecoration": true,
      "__experimentalTextTransform": true,
      "__experimentalWritingMode": true,
      "__experimentalDefaultControls": {
        "fontSize": true
      }
    },
    "__experimentalBorder": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true,
      "__experimentalDefaultControls": {
        "color": true,
        "radius": true,
        "style": true,
        "width": true
      }
    }
  }
}
```

## Block Attributes

Define data storage for blocks:

```json
{
  "attributes": {
    "content": {
      "type": "string",
      "source": "html",
      "selector": "p"
    },
    "url": {
      "type": "string",
      "source": "attribute",
      "selector": "img",
      "attribute": "src"
    },
    "items": {
      "type": "array",
      "default": []
    },
    "settings": {
      "type": "object",
      "default": { "enabled": true }
    },
    "count": {
      "type": "integer",
      "default": 0
    },
    "isActive": {
      "type": "boolean",
      "default": false
    }
  }
}
```

### Attribute Sources

| Source | Description |
|--------|-------------|
| `html` | Inner HTML of selector |
| `text` | Inner text of selector |
| `attribute` | DOM attribute value |
| `query` | Array from multiple elements |
| `meta` | Post meta value |
| (none) | Stored in block comment |

## Block Editor Components

### From @wordpress/block-editor

```jsx
import {
  // Block wrapper
  useBlockProps,
  
  // Content editing
  RichText,
  PlainText,
  
  // Nested blocks
  InnerBlocks,
  useInnerBlocksProps,
  
  // Sidebar controls
  InspectorControls,
  InspectorAdvancedControls,
  
  // Toolbar controls
  BlockControls,
  BlockAlignmentToolbar,
  
  // Media handling
  MediaUpload,
  MediaUploadCheck,
  MediaPlaceholder,
  
  // Color & styling
  ColorPalette,
  ContrastChecker,
  PanelColorSettings,
  withColors,
  useSetting,
  
  // Link handling
  URLInput,
  URLPopover,
  
  // Layout
  BlockVerticalAlignmentToolbar,
  JustifyContentControl,
  
  // Utilities
  store as blockEditorStore
} from '@wordpress/block-editor';
```

### From @wordpress/components

```jsx
import {
  // Layout
  Panel,
  PanelBody,
  PanelRow,
  Flex,
  FlexItem,
  FlexBlock,
  
  // Forms
  TextControl,
  TextareaControl,
  SelectControl,
  CheckboxControl,
  RadioControl,
  ToggleControl,
  RangeControl,
  NumberControl,
  
  // Buttons
  Button,
  ButtonGroup,
  
  // Display
  Spinner,
  Placeholder,
  Notice,
  Tooltip,
  Icon,
  
  // Popovers & Modals
  Popover,
  Modal,
  Dropdown,
  DropdownMenu,
  
  // Navigation
  TabPanel,
  
  // Color
  ColorPicker,
  ColorIndicator,
  
  // Advanced
  FocalPointPicker,
  FontSizePicker,
  
  // Layout primitives
  Card,
  CardBody,
  CardHeader,
  CardFooter
} from '@wordpress/components';
```

## Data Stores

### Core Stores

| Store | Import | Purpose |
|-------|--------|---------|
| `core` | `@wordpress/core-data` | Entity data (posts, users, etc.) |
| `core/block-editor` | `@wordpress/block-editor` | Block editor state |
| `core/blocks` | `@wordpress/blocks` | Block types registry |
| `core/editor` | `@wordpress/editor` | Post editor state |
| `core/edit-post` | `@wordpress/edit-post` | Post editor UI |
| `core/notices` | `@wordpress/notices` | Admin notices |
| `core/preferences` | `@wordpress/preferences` | User preferences |

### Common Selectors

```jsx
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as editorStore } from '@wordpress/editor';

// Get current post
const post = useSelect(select => select(editorStore).getCurrentPost());

// Get entity records
const posts = useSelect(select => 
  select(coreStore).getEntityRecords('postType', 'post', { per_page: 10 })
);

// Get selected block
const selectedBlock = useSelect(select => 
  select(blockEditorStore).getSelectedBlock()
);

// Get blocks in editor
const blocks = useSelect(select => 
  select(blockEditorStore).getBlocks()
);
```

### Common Actions

```jsx
import { useDispatch } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { store as noticesStore } from '@wordpress/notices';

// Insert block
const { insertBlock } = useDispatch(blockEditorStore);

// Update block
const { updateBlockAttributes } = useDispatch(blockEditorStore);

// Create notice
const { createSuccessNotice, createErrorNotice } = useDispatch(noticesStore);
```

## Hooks and Filters

### JavaScript Filters

```jsx
import { addFilter } from '@wordpress/hooks';

// Modify block settings
addFilter(
  'blocks.registerBlockType',
  'my-plugin/modify-block',
  (settings, name) => {
    if (name === 'core/paragraph') {
      return {
        ...settings,
        supports: {
          ...settings.supports,
          color: { background: true }
        }
      };
    }
    return settings;
  }
);

// Modify block edit component
addFilter(
  'editor.BlockEdit',
  'my-plugin/with-custom-inspector',
  (BlockEdit) => (props) => {
    return (
      <>
        <BlockEdit {...props} />
        {props.name === 'core/paragraph' && (
          <InspectorControls>
            <PanelBody title="Custom Settings">
              {/* Custom controls */}
            </PanelBody>
          </InspectorControls>
        )}
      </>
    );
  }
);

// Modify block save output
addFilter(
  'blocks.getSaveElement',
  'my-plugin/modify-save',
  (element, blockType, attributes) => {
    if (blockType.name === 'core/image') {
      return cloneElement(element, {
        className: `${element.props.className} custom-class`
      });
    }
    return element;
  }
);
```

### PHP Filters

```php
// Modify block content on render
add_filter('render_block', function($content, $block) {
    if ($block['blockName'] === 'core/paragraph') {
        return '<div class="wrapper">' . $content . '</div>';
    }
    return $content;
}, 10, 2);

// Modify block data before render
add_filter('render_block_data', function($block, $source_block) {
    if ($block['blockName'] === 'core/image') {
        $block['attrs']['className'] = 'custom-image';
    }
    return $block;
}, 10, 2);

// Register block styles
add_action('init', function() {
    register_block_style('core/button', [
        'name' => 'fancy',
        'label' => 'Fancy'
    ]);
});
```

## Dynamic Blocks (PHP)

### Registration with Render Callback

```php
register_block_type('my-plugin/dynamic-block', [
    'api_version' => 3,
    'attributes' => [
        'count' => ['type' => 'integer', 'default' => 5]
    ],
    'render_callback' => function($attributes, $content, $block) {
        $posts = get_posts(['numberposts' => $attributes['count']]);
        
        ob_start();
        ?>
        <ul <?php echo get_block_wrapper_attributes(); ?>>
            <?php foreach ($posts as $post): ?>
                <li><?php echo esc_html($post->post_title); ?></li>
            <?php endforeach; ?>
        </ul>
        <?php
        return ob_get_clean();
    }
]);
```

### Using render.php

In block.json:
```json
{
  "render": "file:./render.php"
}
```

render.php:
```php
<?php
/**
 * @var array    $attributes Block attributes
 * @var string   $content    Inner blocks content
 * @var WP_Block $block      Block instance
 */

$wrapper_attributes = get_block_wrapper_attributes([
    'class' => 'my-custom-class'
]);
?>

<div <?php echo $wrapper_attributes; ?>>
    <h2><?php echo esc_html($attributes['title'] ?? 'Default'); ?></h2>
    <?php echo $content; ?>
</div>
```

### Interactivity API

For client-side interactivity in dynamic blocks:

```php
// In render.php
<?php
wp_interactivity_state('my-plugin', [
    'isOpen' => false
]);
?>
<div
    <?php echo get_block_wrapper_attributes(); ?>
    data-wp-interactive="my-plugin"
>
    <button data-wp-on--click="actions.toggle">
        Toggle
    </button>
    <div data-wp-bind--hidden="!state.isOpen">
        Content
    </div>
</div>
```

```js
// view.js
import { store } from '@wordpress/interactivity';

store('my-plugin', {
    actions: {
        toggle() {
            const context = getContext();
            context.isOpen = !context.isOpen;
        }
    }
});
```
