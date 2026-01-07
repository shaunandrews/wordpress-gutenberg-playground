# WordPress UI Patterns Reference

Complex UI recipes using official components and tokens. Copy and adapt these patterns for consistent WordPress interfaces.

## Table of Contents
1. [Pricing Table](#pricing-table)
2. [Settings Page](#settings-page)
3. [Dashboard Cards](#dashboard-cards)
4. [Data Table](#data-table)
5. [Empty State](#empty-state)
6. [Onboarding Flow](#onboarding-flow)
7. [Form Wizard](#form-wizard)
8. [Sidebar Settings](#sidebar-settings)
9. [Confirmation Dialog](#confirmation-dialog)
10. [Loading States](#loading-states)

---

## Pricing Table

A WordPress-native pricing comparison table.

```jsx
import {
  Card, CardHeader, CardBody, CardFooter,
  Flex, FlexItem,
  Button,
  __experimentalHeading as Heading,
  __experimentalText as Text,
  Icon
} from '@wordpress/components';
import { check, close } from '@wordpress/icons';

const PricingTable = ({ plans }) => (
  <Flex gap={4} wrap justify="center">
    {plans.map((plan) => (
      <FlexItem key={plan.id} style={{ flex: '1 1 300px', maxWidth: '350px' }}>
        <Card 
          elevation={plan.featured ? 2 : 0}
          style={{
            border: plan.featured 
              ? '2px solid var(--wp-admin-theme-color)' 
              : undefined
          }}
        >
          {plan.featured && (
            <div style={{
              background: 'var(--wp-admin-theme-color)',
              color: 'white',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              textAlign: 'center'
            }}>
              Most Popular
            </div>
          )}
          <CardHeader>
            <Flex direction="column" gap={1}>
              <Heading level={3}>{plan.name}</Heading>
              <Flex align="baseline" gap={1}>
                <Text size="2xl" weight="bold">${plan.price}</Text>
                <Text variant="muted">/month</Text>
              </Flex>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text variant="muted" style={{ marginBottom: '16px', display: 'block' }}>
              {plan.description}
            </Text>
            <Flex direction="column" gap={2}>
              {plan.features.map((feature, i) => (
                <Flex key={i} gap={2} align="flex-start">
                  <Icon 
                    icon={feature.included ? check : close} 
                    style={{ 
                      color: feature.included 
                        ? 'var(--wp-components-color-accent)' 
                        : 'var(--wp-components-color-gray-400)'
                    }}
                  />
                  <Text 
                    style={{ 
                      color: feature.included 
                        ? undefined 
                        : 'var(--wp-components-color-gray-400)'
                    }}
                  >
                    {feature.name}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </CardBody>
          <CardFooter>
            <Button 
              variant={plan.featured ? 'primary' : 'secondary'}
              style={{ width: '100%' }}
              __next40pxDefaultSize
            >
              {plan.cta || 'Get Started'}
            </Button>
          </CardFooter>
        </Card>
      </FlexItem>
    ))}
  </Flex>
);

// Usage
const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      { name: '1 site', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: false },
      { name: 'Custom domain', included: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    description: 'For growing businesses',
    featured: true,
    features: [
      { name: 'Unlimited sites', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom domain', included: true },
    ]
  },
  // ...
];
```

---

## Settings Page

Full settings page with sections.

```jsx
import {
  Panel, PanelBody, PanelRow,
  TextControl, SelectControl, ToggleControl, RangeControl,
  Button, Notice,
  Flex, FlexItem,
  __experimentalHeading as Heading,
  __experimentalText as Text,
  Card, CardBody
} from '@wordpress/components';

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: '24px' }}>
        <Heading level={1}>Settings</Heading>
        <Button 
          variant="primary" 
          onClick={saveSettings}
          __next40pxDefaultSize
        >
          Save Changes
        </Button>
      </Flex>
      
      {saved && (
        <Notice status="success" isDismissible onRemove={() => setSaved(false)}>
          Settings saved successfully!
        </Notice>
      )}
      
      <Panel>
        <PanelBody title="General" initialOpen>
          <PanelRow>
            <TextControl
              label="Site Title"
              value={settings.siteTitle}
              onChange={(v) => updateSetting('siteTitle', v)}
              __nextHasNoMarginBottom
            />
          </PanelRow>
          <PanelRow>
            <TextControl
              label="Tagline"
              value={settings.tagline}
              onChange={(v) => updateSetting('tagline', v)}
              __nextHasNoMarginBottom
            />
          </PanelRow>
          <PanelRow>
            <SelectControl
              label="Timezone"
              value={settings.timezone}
              options={timezoneOptions}
              onChange={(v) => updateSetting('timezone', v)}
              __nextHasNoMarginBottom
            />
          </PanelRow>
        </PanelBody>
        
        <PanelBody title="Display" initialOpen={false}>
          <PanelRow>
            <ToggleControl
              label="Show site title"
              checked={settings.showTitle}
              onChange={(v) => updateSetting('showTitle', v)}
            />
          </PanelRow>
          <PanelRow>
            <RangeControl
              label="Posts per page"
              value={settings.postsPerPage}
              onChange={(v) => updateSetting('postsPerPage', v)}
              min={1}
              max={50}
            />
          </PanelRow>
        </PanelBody>
        
        <PanelBody title="Advanced" initialOpen={false}>
          <Card size="small" style={{ marginBottom: '16px' }}>
            <CardBody>
              <Flex gap={2} align="flex-start">
                <Icon icon={warning} />
                <Text variant="muted">
                  These settings are for advanced users.
                </Text>
              </Flex>
            </CardBody>
          </Card>
          {/* Advanced settings */}
        </PanelBody>
      </Panel>
    </div>
  );
};
```

---

## Dashboard Cards

Metric cards for dashboards.

```jsx
import {
  Card, CardBody,
  Flex, FlexItem,
  __experimentalHeading as Heading,
  __experimentalText as Text,
  Icon
} from '@wordpress/components';
import { arrowUp, arrowDown } from '@wordpress/icons';

const MetricCard = ({ title, value, change, changeLabel, icon }) => (
  <Card>
    <CardBody>
      <Flex justify="space-between" align="flex-start">
        <Flex direction="column" gap={1}>
          <Text variant="muted" size="small">{title}</Text>
          <Heading level={2} style={{ margin: 0 }}>{value}</Heading>
          {change !== undefined && (
            <Flex gap={1} align="center">
              <Icon 
                icon={change >= 0 ? arrowUp : arrowDown}
                size={16}
                style={{ 
                  color: change >= 0 
                    ? 'var(--wp-components-color-green-600)' 
                    : 'var(--wp-components-color-red-600)'
                }}
              />
              <Text 
                size="small"
                style={{ 
                  color: change >= 0 
                    ? 'var(--wp-components-color-green-600)' 
                    : 'var(--wp-components-color-red-600)'
                }}
              >
                {Math.abs(change)}% {changeLabel || 'vs last period'}
              </Text>
            </Flex>
          )}
        </Flex>
        {icon && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            background: 'var(--wp-components-color-gray-100)'
          }}>
            <Icon icon={icon} size={24} />
          </div>
        )}
      </Flex>
    </CardBody>
  </Card>
);

const Dashboard = () => (
  <Flex gap={4} wrap>
    <FlexItem style={{ flex: '1 1 200px' }}>
      <MetricCard 
        title="Total Views" 
        value="12,345" 
        change={12.5}
        icon={chartBar}
      />
    </FlexItem>
    <FlexItem style={{ flex: '1 1 200px' }}>
      <MetricCard 
        title="Subscribers" 
        value="1,234" 
        change={-3.2}
        icon={people}
      />
    </FlexItem>
    <FlexItem style={{ flex: '1 1 200px' }}>
      <MetricCard 
        title="Revenue" 
        value="$9,876" 
        change={8.1}
        icon={payment}
      />
    </FlexItem>
  </Flex>
);
```

---

## Data Table

Simple data table with actions.

```jsx
import {
  Card, CardHeader, CardBody,
  Flex, FlexItem,
  Button, ButtonGroup,
  DropdownMenu,
  __experimentalHeading as Heading,
  __experimentalText as Text,
  SearchControl,
  CheckboxControl
} from '@wordpress/components';
import { moreVertical, edit, trash } from '@wordpress/icons';

const DataTable = ({ data, columns, onEdit, onDelete }) => {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  
  const filtered = data.filter(row => 
    columns.some(col => 
      String(row[col.key]).toLowerCase().includes(search.toLowerCase())
    )
  );
  
  return (
    <Card>
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading level={3}>Items</Heading>
          <Flex gap={2}>
            <SearchControl 
              value={search} 
              onChange={setSearch}
              placeholder="Search..."
            />
            <Button variant="primary" __next40pxDefaultSize>
              Add New
            </Button>
          </Flex>
        </Flex>
      </CardHeader>
      <CardBody style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--wp-components-color-gray-200)' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>
                <CheckboxControl
                  checked={selected.length === filtered.length}
                  onChange={(checked) => 
                    setSelected(checked ? filtered.map(r => r.id) : [])
                  }
                />
              </th>
              {columns.map(col => (
                <th key={col.key} style={{ padding: '12px', textAlign: 'left' }}>
                  <Text weight="semibold">{col.label}</Text>
                </th>
              ))}
              <th style={{ padding: '12px', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr 
                key={row.id}
                style={{ borderBottom: '1px solid var(--wp-components-color-gray-100)' }}
              >
                <td style={{ padding: '12px' }}>
                  <CheckboxControl
                    checked={selected.includes(row.id)}
                    onChange={(checked) => 
                      setSelected(prev => 
                        checked 
                          ? [...prev, row.id] 
                          : prev.filter(id => id !== row.id)
                      )
                    }
                  />
                </td>
                {columns.map(col => (
                  <td key={col.key} style={{ padding: '12px' }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td style={{ padding: '12px' }}>
                  <DropdownMenu
                    icon={moreVertical}
                    label="Actions"
                    controls={[
                      { title: 'Edit', icon: edit, onClick: () => onEdit(row) },
                      { title: 'Delete', icon: trash, onClick: () => onDelete(row), isDestructive: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};
```

---

## Empty State

Placeholder for empty content areas.

```jsx
import {
  Card, CardBody,
  Flex,
  Button,
  __experimentalHeading as Heading,
  __experimentalText as Text,
  Icon
} from '@wordpress/components';
import { plus, page } from '@wordpress/icons';

const EmptyState = ({ icon, title, description, action, actionLabel }) => (
  <Card>
    <CardBody>
      <Flex 
        direction="column" 
        align="center" 
        gap={4} 
        style={{ padding: '48px 24px', textAlign: 'center' }}
      >
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--wp-components-color-gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon icon={icon || page} size={32} />
        </div>
        <Flex direction="column" gap={1}>
          <Heading level={3}>{title}</Heading>
          <Text variant="muted">{description}</Text>
        </Flex>
        {action && (
          <Button variant="primary" onClick={action} __next40pxDefaultSize>
            {actionLabel || 'Get Started'}
          </Button>
        )}
      </Flex>
    </CardBody>
  </Card>
);

// Usage
<EmptyState
  icon={page}
  title="No posts yet"
  description="Create your first post to get started with your blog."
  action={createPost}
  actionLabel="Create Post"
/>
```

---

## Onboarding Flow

Multi-step onboarding wizard.

```jsx
import {
  Modal,
  Button,
  Flex, FlexItem,
  ProgressBar,
  TextControl,
  SelectControl,
  __experimentalHeading as Heading,
  __experimentalText as Text
} from '@wordpress/components';

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  
  const steps = [
    { title: 'Welcome', component: WelcomeStep },
    { title: 'Profile', component: ProfileStep },
    { title: 'Preferences', component: PreferencesStep },
    { title: 'Complete', component: CompleteStep },
  ];
  
  const CurrentStep = steps[step].component;
  const progress = ((step + 1) / steps.length) * 100;
  
  return (
    <Modal
      title={steps[step].title}
      onRequestClose={() => {}}
      isDismissible={false}
      style={{ maxWidth: '500px' }}
    >
      <ProgressBar value={progress} />
      
      <div style={{ padding: '24px 0' }}>
        <CurrentStep 
          data={data} 
          onChange={(newData) => setData(prev => ({ ...prev, ...newData }))}
        />
      </div>
      
      <Flex justify="space-between">
        <FlexItem>
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </Button>
          )}
        </FlexItem>
        <FlexItem>
          {step < steps.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(s => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={() => onComplete(data)}>
              Get Started
            </Button>
          )}
        </FlexItem>
      </Flex>
    </Modal>
  );
};

const WelcomeStep = () => (
  <Flex direction="column" gap={3} align="center" style={{ textAlign: 'center' }}>
    <Heading level={2}>Welcome to the app!</Heading>
    <Text variant="muted">
      Let's get you set up in just a few steps.
    </Text>
  </Flex>
);

const ProfileStep = ({ data, onChange }) => (
  <Flex direction="column" gap={3}>
    <TextControl
      label="Your name"
      value={data.name || ''}
      onChange={(name) => onChange({ name })}
    />
    <TextControl
      label="Email"
      type="email"
      value={data.email || ''}
      onChange={(email) => onChange({ email })}
    />
  </Flex>
);
```

---

## Confirmation Dialog

Reusable confirmation pattern.

```jsx
import {
  Modal,
  Button,
  Flex,
  __experimentalText as Text
} from '@wordpress/components';

const ConfirmationDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;
  
  return (
    <Modal
      title={title}
      onRequestClose={onCancel}
      style={{ maxWidth: '400px' }}
    >
      <Text style={{ marginBottom: '24px', display: 'block' }}>
        {message}
      </Text>
      <Flex justify="flex-end" gap={3}>
        <Button variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button 
          variant="primary" 
          isDestructive={isDestructive}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </Flex>
    </Modal>
  );
};

// Usage
<ConfirmationDialog
  isOpen={showDeleteConfirm}
  title="Delete Item"
  message="Are you sure you want to delete this item? This action cannot be undone."
  confirmLabel="Delete"
  isDestructive
  onConfirm={handleDelete}
  onCancel={() => setShowDeleteConfirm(false)}
/>
```

---

## Loading States

Various loading patterns.

```jsx
import {
  Spinner,
  Flex,
  Card, CardBody,
  __experimentalText as Text,
  Placeholder
} from '@wordpress/components';

// Inline spinner
const InlineLoading = () => (
  <Flex gap={2} align="center">
    <Spinner />
    <Text>Loading...</Text>
  </Flex>
);

// Full card loading
const CardLoading = () => (
  <Card>
    <CardBody>
      <Flex justify="center" align="center" style={{ padding: '48px' }}>
        <Spinner />
      </Flex>
    </CardBody>
  </Card>
);

// Skeleton loading with Placeholder
const SkeletonCard = () => (
  <Card>
    <CardBody>
      <Placeholder>
        <Flex direction="column" gap={3}>
          <div style={{ 
            height: '24px', 
            width: '60%', 
            background: 'var(--wp-components-color-gray-200)',
            borderRadius: '4px'
          }} />
          <div style={{ 
            height: '16px', 
            width: '100%', 
            background: 'var(--wp-components-color-gray-100)',
            borderRadius: '4px'
          }} />
          <div style={{ 
            height: '16px', 
            width: '80%', 
            background: 'var(--wp-components-color-gray-100)',
            borderRadius: '4px'
          }} />
        </Flex>
      </Placeholder>
    </CardBody>
  </Card>
);

// Button loading state
const LoadingButton = ({ isLoading, children, ...props }) => (
  <Button {...props} isBusy={isLoading} disabled={isLoading}>
    {isLoading ? 'Loading...' : children}
  </Button>
);
```

---

## Best Practices Summary

1. **Always use components over custom HTML** - `Card` over `<div>`, `Button` over `<button>`
2. **Use semantic spacing** - Component `gap` props and `Spacer` over margin hacks
3. **Leverage built-in states** - `isBusy`, `disabled`, `isDestructive` props
4. **Consistent typography** - `Heading` and `Text` components
5. **Use elevation for depth** - Card `elevation` prop for visual hierarchy
6. **Token-based colors** - CSS custom properties, never hardcoded values
7. **Accessible by default** - Components handle focus, ARIA automatically
