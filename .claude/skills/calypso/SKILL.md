---
name: calypso
description: "Calypso reference skill for WordPress imports and E2E testing. Use when working on: (1) Looking up @wordpress package exports, (2) Writing E2E tests with Playwright, (3) Migrating legacy tests, (4) Understanding test fixtures, (5) Debugging test failures, (6) Feature flags usage, or (7) SCSS styling with WordPress tokens."
---

# Calypso Skill

This skill provides reference material for Calypso development:
- **WordPress Imports**: See [references/wordpress-imports.md](references/wordpress-imports.md) for complete `@wordpress/*` package exports
- **E2E Testing**: Playwright Test patterns and migration guide (below)
- **Feature Flags**: Quick reference for gating features

---

# Feature Flags

Calypso uses feature flags to gate new features. Quick reference:

## Adding a Feature Flag

```json
// config/development.json
{ "features": { "me/my-feature": true } }

// config/production.json
{ "features": { "me/my-feature": false } }
```

## Using in Code

```typescript
import { isEnabled } from '@automattic/calypso-config';

const isFeatureEnabled = isEnabled( 'me/my-feature' );
```

## Testing via URL

- Enable: `?flags=me/my-feature`
- Disable: `?flags=-me/my-feature`

**Important:** Config changes require server restart (hot reload doesn't pick them up).

---

# Styling Quick Reference

Dashboard components use SCSS with WordPress tokens. Always create `style.scss` files - avoid inline styles.

```scss
@import '@wordpress/base-styles/variables';

.my-component {
  padding: $grid-unit-15;        // 12px
  border-radius: $radius-medium; // 4px
  gap: $grid-unit-10;            // 8px
}
```

| Token | Value |
|-------|-------|
| `$grid-unit-05` | 4px |
| `$grid-unit-10` | 8px |
| `$grid-unit-15` | 12px |
| `$grid-unit-20` | 16px |
| `$radius-medium` | 4px |

---

# E2E Testing

E2E tests for Calypso are located in `test/e2e/` and use Playwright Test framework.

## Documentation

Full documentation is available in:
- `test/e2e/docs-new/` - New Playwright Test framework documentation (preferred)
- `test/e2e/docs/` - Legacy framework documentation

Key docs to reference:
- `test/e2e/docs-new/overview.md` - Framework overview
- `test/e2e/docs-new/setup.md` - Environment setup
- `test/e2e/docs-new/running_debugging_tests.md` - Running and debugging
- `test/e2e/docs-new/creating_reliable_tests.md` - Best practices
- `test/e2e/docs-new/new_style_guide.md` - Style guide
- `test/e2e/docs-new/custom_fixtures.md` - Custom fixtures

## Framework Migration Status

We are migrating from the legacy framework to Playwright Test:

| Framework | File Pattern | Status |
|-----------|--------------|--------|
| **Playwright Test (new)** | `*.spec.ts` | Target for all new tests |
| **Legacy (Playwright + Jest)** | `*.ts` (without `.spec.`) | Being phased out |

**Always write new tests using Playwright Test (`.spec.ts` files).**

## Running Tests

### Playwright Test (`.spec.ts`)

**IMPORTANT**: Always use `--reporter=list` to prevent the HTML report from opening automatically on failure:

```bash
# CORRECT - process exits immediately after test completion
yarn playwright test specs/path/to/test.spec.ts --reporter=list

# INCORRECT - hangs on failure waiting for HTML report to close
yarn playwright test specs/path/to/test.spec.ts
```

### Legacy Tests (`.ts` without `.spec.`)

```bash
yarn test specs/path/to/test.ts
```

## Test Structure

### Playwright Test Format

```typescript
import { tags, test, expect } from '../../lib/pw-base';

test.describe( 'Feature Name', { tag: [ tags.TAG_NAME ] }, () => {
  test( 'As a user, I can do something', async ( { page } ) => {
    await test.step( 'Given precondition', async function () {
      // Setup code
    } );

    await test.step( 'When I perform action', async function () {
      // Action code
    } );

    await test.step( 'Then I see result', async function () {
      // Assertion code
    } );
  } );
} );
```

### Given/When/Then Pattern

Use `test.step()` with descriptive names following BDD conventions:

- **Given**: Preconditions and setup
- **When**: Actions performed
- **Then**: Assertions and expected outcomes
- **And**: Continuation of any section

```typescript
await test.step( 'Given I am on the login page', async function () {
  await page.goto( '/login' );
} );

await test.step( 'When I enter valid credentials', async function () {
  await page.fill( '[name="username"]', 'user@example.com' );
  await page.fill( '[name="password"]', 'password' );
  await page.click( 'button[type="submit"]' );
} );

await test.step( 'Then I am redirected to the dashboard', async function () {
  await expect( page ).toHaveURL( /dashboard/ );
} );
```

## Fixtures

### Available Account Fixtures

```typescript
test( 'Test name', async ( {
  accountDefaultUser,
  accountGivenByEnvironment,
  accountAtomic,
  accountGutenbergSimple,
  accounti18n,
  accountPreRelease,
  accountSimpleSiteFreePlan,
  accountSMS,
} ) => {
  await accountDefaultUser.authenticate( page );
} );
```

### Page/Component Fixtures

Naming conventions:
- `page*` - Pages (e.g., `pageLogin`, `pageEditor`, `pagePeople`)
- `component*` - Components (e.g., `componentSidebar`, `componentGutenberg`)
- `flow*` - Flows (e.g., `flowStartWriting`)

```typescript
test( 'Test name', async ( { pageLogin, componentSidebar } ) => {
  await pageLogin.visit();
  await componentSidebar.navigate( 'Menu', 'Item' );
} );
```

### Other Fixtures

- `clientEmail` - Email client
- `clientRestAPI` - REST API client
- `secrets` - Test secrets
- `environment` - Environment configuration
- `pageIncognito` - Unauthenticated page context
- `sitePublic` - Public site data

## Migration Reference

### File Structure

```
Legacy: specs/feature/test-name.ts
New:    specs/feature/test-name.spec.ts
```

### Import Changes

```typescript
// Legacy
import { DataHelper, LoginPage, TestAccount } from '@automattic/calypso-e2e';
import { Page, Browser } from 'playwright';
declare const browser: Browser;

// New
import { tags, test, expect } from '../../lib/pw-base';
```

### Test Structure Changes

```typescript
// Legacy
describe( DataHelper.createSuiteTitle( 'Test Suite' ), function () {
  let page: Page;

  beforeAll( async () => {
    page = await browser.newPage();
  } );

  it( 'Step 1', async function () {
    // test code
  } );

  afterAll( async () => {
    await page.close();
  } );
} );

// New
test.describe( 'Test Suite', { tag: [ tags.TAG_NAME ] }, () => {
  test( 'As a user, I can do something', async ( { page } ) => {
    await test.step( 'Given precondition', async function () {
      // test code
    } );
  } );
} );
```

### Authentication Changes

```typescript
// Legacy
const testAccount = new TestAccount( 'accountName' );
await testAccount.authenticate( page );

// New - use fixtures
test( 'Test', async ( { accountDefaultUser, page } ) => {
  await test.step( 'Given I am authenticated', async function () {
    await accountDefaultUser.authenticate( page );
  } );
} );
```

### Page Objects & Components

```typescript
// Legacy
const loginPage = new LoginPage( page );
const sidebar = new SidebarComponent( page );

// New - use fixtures
test( 'Test', async ( { pageLogin, componentSidebar } ) => {
  await pageLogin.visit();
  await componentSidebar.navigate( 'Menu', 'Item' );
} );
```

### Skip Conditions

```typescript
// Legacy
skipDescribeIf( condition )( 'Suite', function () {} );

// New
test( 'Test', async ( { environment } ) => {
  test.skip( environment.TEST_ON_ATOMIC, 'Reason for skipping' );
} );
```

### Multiple Contexts

```typescript
// Legacy
const newContext = await browser.newContext();
const newPage = await newContext.newPage();

// New
test( 'Test', async ( { page, pageIncognito } ) => {
  // page = authenticated context
  // pageIncognito = unauthenticated context
} );
```

## Best Practices

1. **Always use `.spec.ts`** for new tests
2. **Use descriptive test names** that describe user intent
3. **Follow Given/When/Then** pattern for clarity
4. **Use fixtures** instead of manual setup
5. **Always use `--reporter=list`** when running tests
6. **Consider migrating** legacy tests when modifying them

## Example Complete Test

```typescript
import { tags, test, expect } from '../../lib/pw-base';

test.describe( 'Site Settings', { tag: [ tags.JETPACK ] }, () => {
  test( 'As a site owner, I can update my site title', async ( {
    accountDefaultUser,
    page,
    componentSidebar,
  } ) => {
    await test.step( 'Given I am logged in', async function () {
      await accountDefaultUser.authenticate( page );
    } );

    await test.step( 'And I navigate to site settings', async function () {
      await componentSidebar.navigate( 'Settings', 'General' );
    } );

    await test.step( 'When I update the site title', async function () {
      await page.fill( '[name="blogname"]', 'My New Site Title' );
      await page.click( 'button:has-text("Save settings")' );
    } );

    await test.step( 'Then I see a success message', async function () {
      await expect( page.locator( '.notice--success' ) ).toBeVisible();
    } );

    await test.step( 'And the title is updated', async function () {
      await expect( page.locator( '[name="blogname"]' ) ).toHaveValue( 'My New Site Title' );
    } );
  } );
} );
```
