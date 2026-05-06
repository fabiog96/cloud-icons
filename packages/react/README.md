# @cloud-icons/react

Cloud provider icons (AWS, Azure, GCP) as tree-shakeable React components.

## Install

```bash
npm install @cloud-icons/react
```

## Usage

Import icons by provider for optimal tree-shaking:

```tsx
import { AwsEc2, AwsS3 } from "@cloud-icons/react/aws";

function App() {
  return (
    <div>
      <AwsEc2 size={48} />
      <AwsS3 size={48} color="#569A31" />
    </div>
  );
}
```

## Props

All icons accept standard SVG props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Width and height |
| `color` | `string` | `currentColor` | Fill color |
| `className` | `string` | — | CSS class |
| `ref` | `Ref<SVGSVGElement>` | — | Forwarded ref |

```tsx
<AwsEc2 size={32} color="#FF9900" className="my-icon" />
```

## Available providers

| Import path | Provider |
|-------------|----------|
| `@cloud-icons/react/aws` | Amazon Web Services |
| `@cloud-icons/react/azure` | Microsoft Azure |
| `@cloud-icons/react/gcp` | Google Cloud Platform |

## Related packages

- [@cloud-icons/core](https://www.npmjs.com/package/@cloud-icons/core) — Framework-agnostic SVG content
- [@cloud-icons/vue](https://www.npmjs.com/package/@cloud-icons/vue) — Vue components
- [@cloud-icons/angular](https://www.npmjs.com/package/@cloud-icons/angular) — Angular components
- [@cloud-icons/svg](https://www.npmjs.com/package/@cloud-icons/svg) — Optimized SVG files

## License

[MIT](../../LICENSE)
