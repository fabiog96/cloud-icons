# @cloud-icons/vue

Cloud provider icons (AWS, Azure, GCP) as tree-shakeable Vue components.

## Install

```bash
npm install @cloud-icons/vue
```

## Usage

```vue
<script setup>
import { AwsEc2, AwsS3 } from "@cloud-icons/vue/aws";
</script>

<template>
  <AwsEc2 :size="48" />
  <AwsS3 :size="48" color="#569A31" />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Width and height |
| `color` | `string` | `currentColor` | Fill color |

## Available providers

| Import path | Provider |
|-------------|----------|
| `@cloud-icons/vue/aws` | Amazon Web Services |
| `@cloud-icons/vue/azure` | Microsoft Azure |
| `@cloud-icons/vue/gcp` | Google Cloud Platform |

## Related packages

- [@cloud-icons/core](https://www.npmjs.com/package/@cloud-icons/core) — Framework-agnostic SVG content
- [@cloud-icons/react](https://www.npmjs.com/package/@cloud-icons/react) — React components
- [@cloud-icons/angular](https://www.npmjs.com/package/@cloud-icons/angular) — Angular components
- [@cloud-icons/svg](https://www.npmjs.com/package/@cloud-icons/svg) — Optimized SVG files

## License

[MIT](../../LICENSE)
