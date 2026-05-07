# Cloud Icons

Cloud architecture icons as tree-shakeable React components.

> 1716 icons from AWS, Azure, and GCP — ready to use.

## Install

```bash
npm install @cloud-icons/react
```

## Quick start

```tsx
import { AwsEc2, AwsS3 } from "@cloud-icons/react/aws";
import { AzureAlerts } from "@cloud-icons/react/azure";
import { GcpBigquery } from "@cloud-icons/react/gcp";

function App() {
  return (
    <div>
      <AwsEc2 size={48} />
      <AwsS3 size={48} color="#569A31" />
      <AzureAlerts size={48} />
      <GcpBigquery size={48} />
    </div>
  );
}
```

## Features

- **Tree-shakeable** — import 1 icon, bundle 1 icon
- **TypeScript** — full type definitions included
- **Native JSX** — no `dangerouslySetInnerHTML`, real React elements
- **forwardRef** — works with Radix, Headless UI, tooltips
- **Optimized** — SVGO-processed, unique SVG IDs, no collisions

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Width and height |
| `color` | `string` | `currentColor` | Fill color |
| `className` | `string` | — | CSS class |
| `ref` | `Ref<SVGSVGElement>` | — | Forwarded ref |

Plus all native SVG attributes.

## Import patterns

```tsx
// Per provider (recommended)
import { AwsEc2 } from "@cloud-icons/react/aws";
import { AzureAlerts } from "@cloud-icons/react/azure";
import { GcpBigquery } from "@cloud-icons/react/gcp";

// All icons (not recommended for production)
import { AwsEc2 } from "@cloud-icons/react";
```

## Providers

| Provider | Icons | Import path |
|----------|-------|-------------|
| AWS | 795 | `@cloud-icons/react/aws` |
| Azure | 705 | `@cloud-icons/react/azure` |
| GCP | 216 | `@cloud-icons/react/gcp` |

## Development

```bash
# Install dependencies
npm install

# Run the full icon pipeline
npm run icons:pipeline

# Build all packages
npm run build:packages
```

## License

[MIT](./LICENSE) — applies to the source code of this library (scripts, components, build pipeline) only.

SVG icons are property of their respective owners and subject to their terms of use:
- [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/) — Amazon Web Services
- [Azure Architecture Icons](https://learn.microsoft.com/en-us/azure/architecture/icons/) — Microsoft
- [Google Cloud Icons](https://cloud.google.com/icons) — Google

The icons are provided for use in architecture diagrams, technical documentation, and presentations. This library does not claim ownership of the icon assets. Please refer to each provider's terms for permitted usage.
