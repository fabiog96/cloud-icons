# @cloud-icons/svg

Optimized SVG files for cloud provider icons (AWS, Azure, GCP).

## Install

```bash
npm install @cloud-icons/svg
```

## Usage

Import SVG files directly:

```ts
import ec2Icon from "@cloud-icons/svg/aws/ec2.svg";
```

Use as image source:

```html
<img src="@cloud-icons/svg/aws/ec2.svg" alt="EC2" width="48" height="48" />
```

Or copy the files from `node_modules/@cloud-icons/svg/` into your project.

## Available providers

| Path | Provider |
|------|----------|
| `@cloud-icons/svg/aws/` | Amazon Web Services |
| `@cloud-icons/svg/azure/` | Microsoft Azure |
| `@cloud-icons/svg/gcp/` | Google Cloud Platform |

## Related packages

- [@cloud-icons/core](https://www.npmjs.com/package/@cloud-icons/core) — Framework-agnostic SVG content
- [@cloud-icons/react](https://www.npmjs.com/package/@cloud-icons/react) — React components

## License

[MIT](../../LICENSE)
