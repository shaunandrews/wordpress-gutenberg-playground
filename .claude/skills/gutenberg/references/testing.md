# Gutenberg Testing Guide

Comprehensive guide for testing in the Gutenberg project.

## Table of Contents

1. [Unit Testing](#unit-testing)
2. [E2E Testing with Playwright](#e2e-testing-with-playwright)
3. [PHP Testing](#php-testing)
4. [Test Utilities](#test-utilities)

## Unit Testing

Gutenberg uses Jest for JavaScript unit tests.

### Running Tests

```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm run test:unit -- packages/blocks/src/api/test/registration.js

# Run tests matching pattern
npm run test:unit -- --testNamePattern="should register"

# Watch mode
npm run test:unit -- --watch

# Update snapshots
npm run test:unit -- -u

# Coverage report
npm run test:unit -- --coverage
```

### Writing Unit Tests

```jsx
// packages/my-package/src/test/my-function.js
import { myFunction } from '../my-function';

describe('myFunction', () => {
    it('should return expected value', () => {
        expect(myFunction('input')).toBe('expected');
    });
    
    it('should throw on invalid input', () => {
        expect(() => myFunction(null)).toThrow();
    });
});
```

### Testing React Components

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from '../my-component';

describe('MyComponent', () => {
    it('renders correctly', () => {
        render(<MyComponent title="Test" />);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
    
    it('handles click events', () => {
        const onClick = jest.fn();
        render(<MyComponent onClick={onClick} />);
        
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
```

### Testing with Redux Stores

```jsx
import { createRegistry, RegistryProvider } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { render, screen } from '@testing-library/react';

describe('Component with data', () => {
    let registry;
    
    beforeEach(() => {
        registry = createRegistry();
        registry.register(blockEditorStore);
    });
    
    it('renders with store data', () => {
        render(
            <RegistryProvider value={registry}>
                <MyComponent />
            </RegistryProvider>
        );
        // assertions
    });
});
```

### Mocking

```jsx
// Mock a module
jest.mock('@wordpress/api-fetch', () => jest.fn());

// Mock specific export
jest.mock('@wordpress/data', () => ({
    ...jest.requireActual('@wordpress/data'),
    useSelect: jest.fn()
}));

// Mock implementation
import apiFetch from '@wordpress/api-fetch';
apiFetch.mockImplementation(() => Promise.resolve({ data: [] }));
```

## E2E Testing with Playwright

Gutenberg uses Playwright for end-to-end tests.

### Running E2E Tests

```bash
# Start wp-env first
npm run wp-env start

# Run all e2e tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- test/e2e/specs/editor/blocks/paragraph.spec.js

# Run tests with specific tag
npm run test:e2e -- --grep "@critical"

# Debug mode (headed browser)
npm run test:e2e:debug

# UI mode (interactive)
npx playwright test --ui
```

### Test Structure

```js
// test/e2e/specs/editor/blocks/my-block.spec.js
const { test, expect } = require('@wordpress/e2e-test-utils-playwright');

test.describe('My Block', () => {
    test.beforeEach(async ({ admin, page }) => {
        await admin.createNewPost();
    });
    
    test('should insert block', async ({ editor, page }) => {
        await editor.insertBlock({ name: 'core/paragraph' });
        
        await page.keyboard.type('Hello World');
        
        expect(await editor.getBlocks()).toMatchObject([
            {
                name: 'core/paragraph',
                attributes: { content: 'Hello World' }
            }
        ]);
    });
});
```

### Test Utilities (@wordpress/e2e-test-utils-playwright)

```js
test('using test utilities', async ({
    admin,      // Admin page actions
    editor,     // Editor actions
    page,       // Playwright page
    pageUtils,  // Page utility functions
    requestUtils // API request utilities
}) => {
    // Create new post
    await admin.createNewPost({ title: 'Test Post' });
    
    // Insert block
    await editor.insertBlock({
        name: 'core/image',
        attributes: { url: 'https://example.com/image.jpg' }
    });
    
    // Get all blocks
    const blocks = await editor.getBlocks();
    
    // Open sidebar
    await editor.openDocumentSettingsSidebar();
    
    // Publish post
    await editor.publishPost();
    
    // Use page utils
    await pageUtils.pressKeys('primary+a'); // Select all
    
    // API requests
    await requestUtils.createPost({
        title: 'API Created Post',
        status: 'publish'
    });
});
```

### Page Object Pattern

```js
// test/e2e/page-objects/my-block.js
class MyBlockPage {
    constructor(page, editor) {
        this.page = page;
        this.editor = editor;
    }
    
    async insertBlock() {
        await this.editor.insertBlock({ name: 'my-plugin/my-block' });
    }
    
    async setTitle(title) {
        await this.page.fill('[data-testid="title-input"]', title);
    }
    
    async getContent() {
        return await this.page.textContent('[data-testid="content"]');
    }
}

// In test file
test('my block workflow', async ({ editor, page }) => {
    const myBlock = new MyBlockPage(page, editor);
    
    await myBlock.insertBlock();
    await myBlock.setTitle('Test');
    
    expect(await myBlock.getContent()).toContain('Test');
});
```

### Common Assertions

```js
// Check block exists
expect(await editor.getBlocks()).toHaveLength(1);

// Check block attributes
expect(await editor.getBlocks()).toMatchObject([
    { name: 'core/paragraph', attributes: { content: 'text' } }
]);

// Check element visible
await expect(page.locator('.my-element')).toBeVisible();

// Check element text
await expect(page.locator('h1')).toHaveText('Title');

// Check element count
await expect(page.locator('.block')).toHaveCount(3);

// Check URL
await expect(page).toHaveURL(/\/post\/\d+/);

// Snapshot
expect(await editor.getBlocks()).toMatchSnapshot();
```

## PHP Testing

### Running PHP Tests

```bash
# Run via wp-env
npm run test:php

# Run with phpunit directly (requires local setup)
composer run test

# Run specific test file
npm run test:php -- --filter=Test_Block_Registration

# Run specific test method
npm run test:php -- --filter=test_register_block
```

### Writing PHP Tests

```php
// phpunit/class-block-test.php
class Block_Test extends WP_UnitTestCase {
    
    public function set_up() {
        parent::set_up();
        // Setup code
    }
    
    public function tear_down() {
        // Cleanup code
        parent::tear_down();
    }
    
    public function test_block_registration() {
        register_block_type('test/block', [
            'render_callback' => '__return_empty_string'
        ]);
        
        $this->assertTrue(
            WP_Block_Type_Registry::get_instance()->is_registered('test/block')
        );
    }
    
    public function test_block_render() {
        $block = [
            'blockName' => 'core/paragraph',
            'attrs' => ['content' => 'Hello'],
            'innerHTML' => '<p>Hello</p>'
        ];
        
        $output = render_block($block);
        
        $this->assertStringContainsString('Hello', $output);
    }
    
    /**
     * @dataProvider data_provider_example
     */
    public function test_with_data_provider($input, $expected) {
        $this->assertEquals($expected, my_function($input));
    }
    
    public function data_provider_example() {
        return [
            ['input1', 'expected1'],
            ['input2', 'expected2'],
        ];
    }
}
```

## Test Utilities

### @wordpress/e2e-test-utils-playwright

```js
const {
    test,
    expect,
    Admin,
    Editor,
    PageUtils,
    RequestUtils
} = require('@wordpress/e2e-test-utils-playwright');
```

### Useful Test Helpers

```js
// Wait for network idle
await page.waitForLoadState('networkidle');

// Wait for selector
await page.waitForSelector('.my-element');

// Wait for block to be inserted
await editor.insertBlock({ name: 'core/paragraph' });
await expect(page.locator('[data-type="core/paragraph"]')).toBeVisible();

// Screenshot for debugging
await page.screenshot({ path: 'screenshot.png' });

// Evaluate in page context
const result = await page.evaluate(() => {
    return wp.data.select('core/block-editor').getBlocks();
});

// Mock REST API
await page.route('**/wp-json/wp/v2/posts', route => {
    route.fulfill({
        status: 200,
        body: JSON.stringify([{ id: 1, title: 'Mocked' }])
    });
});
```

### Debugging Tests

```bash
# Run in debug mode
npm run test:e2e:debug

# Run with trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip

# Run specific test in debug
npm run test:e2e -- --debug test/e2e/specs/my-test.spec.js
```
