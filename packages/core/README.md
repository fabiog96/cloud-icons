# @cloud-icons/core

Framework-agnostic SVG content for cloud provider icons (AWS, Azure, GCP).

## Install

```bash
npm install @cloud-icons/core
```

## Usage

Each icon exports its SVG inner content and viewBox as strings:

```ts
import { awsEc2Svg, awsEc2ViewBox } from "@cloud-icons/core/aws";
```

Use the raw SVG content in any framework or vanilla JS:

```ts
document.getElementById("icon").innerHTML = `
  <svg viewBox="${awsEc2ViewBox}" width="48" height="48">
    ${awsEc2Svg}
  </svg>
`;
```

## Available providers

| Import path | Provider |
|-------------|----------|
| `@cloud-icons/core/aws` | Amazon Web Services |
| `@cloud-icons/core/azure` | Microsoft Azure |
| `@cloud-icons/core/gcp` | Google Cloud Platform |

## Related packages

- [@cloud-icons/react](https://www.npmjs.com/package/@cloud-icons/react) — React components
- [@cloud-icons/svg](https://www.npmjs.com/package/@cloud-icons/svg) — Optimized SVG files

## License

[MIT](../../LICENSE)
