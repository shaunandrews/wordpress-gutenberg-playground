# Reading Time Estimator

A WordPress plugin that displays estimated reading time for posts and pages with a beautiful, WordPress-native admin interface built using official `@wordpress/components` and design tokens.

## Features

- **Automatic Reading Time Calculation**: Estimates reading time based on word count and customizable reading speed
- **Flexible Display Options**: Show reading time before content, after content, both, or manually with a shortcode
- **Post Type Control**: Enable/disable reading time for specific post types
- **Customizable Appearance**: Custom labels, optional icon, and rounding preferences
- **WordPress-Native UI**: Settings page built with official WordPress components
- **Live Preview**: See changes before saving
- **REST API**: Modern settings management
- **Accessible**: Follows WordPress accessibility standards

## Installation

### For Development in this Monorepo

1. **Install Dependencies**:
   ```bash
   cd reading-time-estimator
   npm install
   ```

2. **Build the Plugin**:
   ```bash
   npm run build
   ```

3. **Link to WordPress Installation**:
   The plugin needs to be accessible from your WordPress plugins directory. You can either:

   **Option A**: Create a symbolic link (recommended for development):
   ```bash
   # From the WordPress plugins directory in your wp-env setup
   cd wordpress-develop/src/wp-content/plugins
   ln -s ../../../../reading-time-estimator reading-time-estimator
   ```

   **Option B**: Copy the plugin:
   ```bash
   cp -r reading-time-estimator wordpress-develop/src/wp-content/plugins/
   ```

4. **Start wp-env** (if not already running):
   ```bash
   cd gutenberg
   npm run wp-env start
   ```

5. **Activate the Plugin**:
   - Navigate to http://localhost:8888/wp-admin
   - Login with username `admin` and password `password`
   - Go to Plugins and activate "Reading Time Estimator"

### For Standalone WordPress Installation

1. Download or clone this plugin to your WordPress `wp-content/plugins/` directory
2. Run `npm install` in the plugin directory
3. Run `npm run build`
4. Activate the plugin from the WordPress admin

## Development

### Build Commands

```bash
# Development build with watch mode
npm run start

# Production build
npm run build

# Format code
npm run format

# Lint JavaScript
npm run lint:js
```

### File Structure

```
reading-time-estimator/
├── reading-time-estimator.php    # Main plugin file
├── includes/
│   ├── class-settings.php        # Settings & REST API
│   └── class-reading-time.php    # Reading time calculation
├── admin/
│   ├── class-admin.php           # Admin menu & assets
│   └── settings-page.php         # Settings page template
├── src/
│   ├── index.js                  # React app entry
│   ├── SettingsPage.js           # Main settings component
│   ├── components/               # Individual setting components
│   └── style.scss                # Styles using WP tokens
├── build/                        # Compiled assets (generated)
├── package.json                  # Dependencies
└── webpack.config.js             # Build configuration
```

## Usage

### Settings

After activation, go to **Settings > Reading Time** to configure:

1. **General Settings**
   - **Words Per Minute**: Average reading speed (default: 200)
   - **Display Location**: Where to show reading time (before/after/both/manual)
   - **Custom Label**: Text before the reading time (default: "Reading time: ")

2. **Enabled Post Types**
   - Choose which post types display reading time
   - Defaults to Posts and Pages

3. **Display Options**
   - **Show Icon**: Display 📖 icon before reading time
   - **Rounding Preference**: How to round the time (round/up/down)

### Manual Placement

If you select "Manual" for display location, use the shortcode anywhere in your content:

```
[reading_time]
```

### Example Output

With default settings, the reading time displays as:

```
📖 Reading time: 5 minutes
```

## Technical Details

### WordPress Components Used

This plugin demonstrates proper usage of:
- `<Card>`, `<CardHeader>`, `<CardBody>`, `<CardFooter>`
- `<Panel>`, `<PanelBody>`, `<PanelRow>`
- `<Button>`, `<Notice>`, `<Spinner>`
- `<Flex>`, `<FlexItem>`
- `<TextControl>`, `<SelectControl>`, `<ToggleControl>`

### Design Tokens

All styling uses WordPress CSS custom properties:
- `--wp-admin-theme-color`
- `--wp-components-color-background`
- `--wp-components-color-foreground`
- `--wp-components-color-gray-*`

### REST API Endpoints

- `GET /wp-json/reading-time-estimator/v1/settings` - Get current settings
- `POST /wp-json/reading-time-estimator/v1/settings` - Update settings
- `GET /wp-json/reading-time-estimator/v1/post-types` - Get available post types

## Customization

### Frontend Styling

The reading time output has the class `.reading-time-display`. You can customize it in your theme:

```css
.reading-time-display {
  /* Your custom styles */
  background: #f0f0f0;
  padding: 12px;
  border-left: 3px solid #2271b1;
}
```

### Programmatic Access

Get reading time for any post:

```php
$reading_time_instance = RTE_Reading_Time::get_instance();
$content = get_post_field( 'post_content', $post_id );
$minutes = $reading_time_instance->calculate_reading_time( $content );
```

## Browser Support

Supports all modern browsers that WordPress supports:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

GPL v2 or later

## Credits

Built with:
- [@wordpress/scripts](https://www.npmjs.com/package/@wordpress/scripts)
- [@wordpress/components](https://www.npmjs.com/package/@wordpress/components)
- [@wordpress/element](https://www.npmjs.com/package/@wordpress/element)
- [@wordpress/api-fetch](https://www.npmjs.com/package/@wordpress/api-fetch)
- [@wordpress/i18n](https://www.npmjs.com/package/@wordpress/i18n)

## Support

For issues or questions, please open an issue in the repository.
