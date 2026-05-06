# @cloud-icons/angular

Cloud provider icons (AWS, Azure, GCP) as Angular standalone components.

## Install

```bash
npm install @cloud-icons/angular
```

## Usage

```typescript
import { CiAwsEc2 } from "@cloud-icons/angular/aws";

@Component({
  imports: [CiAwsEc2],
  template: `<ci-aws-ec2 [size]="48" />`,
})
export class MyComponent {}
```

## Props

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `size` | `number \| string` | `24` | Width and height |
| `color` | `string` | `currentColor` | Fill color |

## Available providers

| Import path | Provider |
|-------------|----------|
| `@cloud-icons/angular/aws` | Amazon Web Services |
| `@cloud-icons/angular/azure` | Microsoft Azure |
| `@cloud-icons/angular/gcp` | Google Cloud Platform |

## Related packages

- [@cloud-icons/core](https://www.npmjs.com/package/@cloud-icons/core) — Framework-agnostic SVG content
- [@cloud-icons/react](https://www.npmjs.com/package/@cloud-icons/react) — React components
- [@cloud-icons/vue](https://www.npmjs.com/package/@cloud-icons/vue) — Vue components
- [@cloud-icons/svg](https://www.npmjs.com/package/@cloud-icons/svg) — Optimized SVG files

## License

[MIT](../../LICENSE)
