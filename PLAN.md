# Cloud Icons — Piano di Implementazione

## Context

Libreria npm open-source multi-provider (AWS, Azure, GCP) e multi-framework (React, Vue, Angular) per icone cloud. Gli SVG vengono scaricati dai CDN ufficiali a build-time. Il pacchetto npm contiene i componenti generati con SVG inline come JSX/render functions native (no `dangerouslySetInnerHTML`).

## Struttura Monorepo

```
cloud-icons/
├── pnpm-workspace.yaml
├── package.json                    # Root: scripts pipeline
├── tsconfig.base.json
├── svgo.config.ts
├── icons-manifest.json             # Pinned URLs + sha256 per provider
├── .gitignore
│
├── scripts/
│   ├── download.ts                 # Step 1: Download ZIP dai CDN, verifica sha256
│   ├── cleanup.ts                  # Step 2: Normalizza filename
│   ├── optimize.ts                 # Step 3: SVGO + prefixIds
│   ├── generate.ts                 # Step 4: Genera componenti + metadata
│   ├── providers/
│   │   ├── types.ts                # ProviderConfig interface
│   │   ├── aws.ts
│   │   ├── azure.ts
│   │   └── gcp.ts
│   ├── generators/
│   │   ├── types.ts                # FrameworkGenerator interface
│   │   ├── core.ts                 # SVG strings + metadata JSON
│   │   ├── svg.ts                  # Copia SVG ottimizzati come file
│   │   ├── react.ts                # SVG → JSX AST (no dangerouslySetInnerHTML)
│   │   ├── vue.ts                  # SVG → render function
│   │   └── angular.ts              # SVG → template HTML
│   └── utils/
│       ├── naming.ts               # PascalCase, dedup, slug
│       ├── svg-parser.ts           # SVG → JSX/render function converter
│       └── template.ts             # Template helpers
│
├── packages/
│   ├── core/                       # @cloud-icons/core
│   │   ├── package.json
│   │   ├── tsup.config.ts
│   │   └── src/
│   │       ├── types.ts            # Hand-written: IconMetadata, ProviderName
│   │       ├── metadata.json       # GENERATED: search/category/aliases per icona
│   │       ├── aws/                # GENERATED: export const awsEc2Svg = '<path.../>'
│   │       ├── azure/              #            export const awsEc2ViewBox = '0 0 64 64'
│   │       ├── gcp/
│   │       └── index.ts
│   │
│   ├── svg/                        # @cloud-icons/svg
│   │   ├── package.json
│   │   ├── aws/                    # GENERATED: file .svg ottimizzati
│   │   ├── azure/
│   │   └── gcp/
│   │
│   ├── react/                      # @cloud-icons/react
│   │   ├── package.json
│   │   ├── tsup.config.ts
│   │   └── src/
│   │       ├── types.ts            # Hand-written: CloudIconProps
│   │       ├── icon-base.tsx       # Hand-written: createIcon factory (forwardRef + displayName)
│   │       ├── aws/                # GENERATED: export const AwsEc2 = createIcon(...)
│   │       ├── azure/              #   importa SVG content da @cloud-icons/core
│   │       ├── gcp/
│   │       └── index.ts
│   │
│   ├── vue/                        # @cloud-icons/vue
│   │   ├── package.json
│   │   ├── tsup.config.ts
│   │   └── src/
│   │       ├── types.ts
│   │       ├── icon-base.ts        # Hand-written: createIcon con defineComponent
│   │       ├── aws/
│   │       ├── azure/
│   │       ├── gcp/
│   │       └── index.ts
│   │
│   └── angular/                    # @cloud-icons/angular
│       ├── package.json
│       ├── ng-package.json         # ng-packagr
│       └── src/
│           ├── types.ts
│           ├── icon-base.component.ts  # Standalone component
│           ├── aws/
│           ├── azure/
│           ├── gcp/
│           └── index.ts
│
└── .raw-svgs/                      # GITIGNORED: SVG temporanei
    ├── aws/
    ├── azure/
    └── gcp/
```

## API Componenti

```tsx
// React
import { AwsEc2 } from "@cloud-icons/react/aws";
import { AzureVirtualMachine } from "@cloud-icons/react/azure";
import { GcpComputeEngine } from "@cloud-icons/react/gcp";
// oppure barrel (sconsigliato in prod)
import { AwsEc2, AzureVirtualMachine } from "@cloud-icons/react";

<AwsEc2 size={48} />
<AwsEc2 size={48} color="#FF9900" />
<AwsEc2 className="w-6 h-6" />

// ref forwarding (Radix, Headless UI, tooltip)
const ref = useRef<SVGSVGElement>(null);
<AwsEc2 ref={ref} size={24} />
```

```vue
<!-- Vue -->
<script setup>
import { AwsEc2 } from "@cloud-icons/vue/aws";
</script>
<template>
  <AwsEc2 :size="48" />
</template>
```

```html
<!-- Angular (standalone) -->
<ci-aws-ec2 [size]="48" />
```

```ts
// Core (framework-agnostic: Svelte, Solid, vanilla)
import { awsEc2Svg, awsEc2ViewBox } from "@cloud-icons/core/aws/ec2";

// SVG file diretto (designer, <img>, SSR)
import ec2Url from "@cloud-icons/svg/aws/ec2.svg";
```

Props comuni: `size` (number | string), `color` (string, default `currentColor`), + tutti gli SVG props nativi.

## Architettura Core -> Framework

1. **Core** esporta SVG inner content (senza tag `<svg>`) + viewBox come stringhe
2. I pacchetti framework **dipendono da core** a runtime (`@cloud-icons/core` in dependencies)
3. Ogni framework ha un `createIcon` factory che crea l'`<svg>` wrapper nativo
4. I componenti generati importano da core e chiamano `createIcon`

```ts
// core: packages/core/src/aws/ec2.ts
export const awsEc2Svg = `<path d="M..." />`;
export const awsEc2ViewBox = "0 0 64 64";

// react: packages/react/src/aws/ec2.tsx  (JSX nativo, no dangerouslySetInnerHTML)
import { awsEc2ViewBox } from "@cloud-icons/core/aws/ec2";
import { createIcon } from "../icon-base";

export const AwsEc2 = createIcon("AwsEc2", "0 0 64 64", (props) => (
  <>
    <path d="M..." fill="currentColor" />
    <rect x="10" y="10" width="44" height="44" />
  </>
));
```

### createIcon (React)

```tsx
export function createIcon(
  name: string,
  viewBox: string,
  renderFn: (props: SVGProps<SVGSVGElement>) => ReactNode,
) {
  const Icon = forwardRef<SVGSVGElement, CloudIconProps>(
    ({ size = 24, color, className, ...rest }, ref) => (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={viewBox}
        fill={color ?? "currentColor"}
        className={className}
        role="img"
        {...rest}
      >
        {renderFn(rest)}
      </svg>
    ),
  );
  Icon.displayName = name;
  return Icon;
}
```

## Versioning SVG Upstream

File `icons-manifest.json` committato nella root:

```json
{
  "aws": {
    "url": "https://d1.awsstatic.com/webteam/architecture-icons/...",
    "sha256": "a1b2c3...",
    "version": "Q1-2026",
    "lastUpdated": "2026-01-30"
  },
  "azure": {
    "url": "https://arch-center.azureedge.net/icons/...",
    "sha256": "d4e5f6...",
    "version": "2026-02",
    "lastUpdated": "2026-02-15"
  },
  "gcp": {
    "url": "https://cloud.google.com/static/icons/...",
    "sha256": "g7h8i9...",
    "version": "2026-03",
    "lastUpdated": "2026-03-01"
  }
}
```

Lo script `download.ts` verifica lo sha256 dopo il download. Se non matcha, fallisce. Per aggiornare le icone si crea un PR dedicato che aggiorna il manifest.

## Collisioni ID SVG

Risolte a build-time con il plugin SVGO `prefixIds`:

```ts
// svgo.config.ts
{
  plugins: [
    {
      name: "prefixIds",
      params: {
        prefix: (_, info) => slugify(info.path)  // "aws-ec2", "azure-vm", etc.
      }
    }
  ]
}
```

Trasforma `id="a"` in `id="aws-ec2-a"` e aggiorna tutti i `url(#a)` automaticamente.

## Metadata JSON

File generato in `packages/core/src/metadata.json`:

```json
{
  "awsEc2": {
    "provider": "aws",
    "category": "compute",
    "aliases": ["ec2", "virtual-machine", "instance"],
    "tags": ["compute", "server"]
  }
}
```

Abilita icon picker / search UI. Asset statico, non impatta il bundle se non importato.

## Build Pipeline

```bash
pnpm icons:download    # Scarica ZIP da CDN, verifica sha256 vs icons-manifest.json
pnpm icons:cleanup     # Normalizza nomi file -> .raw-svgs/*/cleaned/
pnpm icons:optimize    # SVGO + prefixIds -> .raw-svgs/*/optimized/
pnpm icons:generate    # Genera src/ in ogni package + metadata.json
pnpm build:packages    # tsup/ng-packagr -> dist/
```

## Tree-shaking

- `sideEffects: false` in ogni package.json
- Deep imports: `@cloud-icons/react/aws/ec2`
- Provider barrel: `@cloud-icons/react/aws`
- Root barrel: `@cloud-icons/react` (sconsigliato in prod)

## Exports Map (per ogni package framework)

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./aws": { "types": "./dist/aws/index.d.ts", "import": "./dist/aws/index.js", "require": "./dist/aws/index.cjs" },
    "./aws/*": { "types": "./dist/aws/*.d.ts", "import": "./dist/aws/*.js", "require": "./dist/aws/*.cjs" },
    "./azure": { "types": "./dist/azure/index.d.ts", "import": "./dist/azure/index.js", "require": "./dist/azure/index.cjs" },
    "./azure/*": { "types": "./dist/azure/*.d.ts", "import": "./dist/azure/*.js", "require": "./dist/azure/*.cjs" },
    "./gcp": { "types": "./dist/gcp/index.d.ts", "import": "./dist/gcp/index.js", "require": "./dist/gcp/*.cjs" },
    "./gcp/*": { "types": "./dist/gcp/*.d.ts", "import": "./dist/gcp/*.js", "require": "./dist/gcp/*.cjs" }
  }
}
```

## Test

| Livello | Cosa | Tool |
|---------|------|------|
| Pipeline | Il generator produce output coerente (snapshot 3-5 icone campione) | Vitest |
| Runtime | Il componente renderizza `<svg>` con viewBox corretto | Vitest + @testing-library/react |

I test si aggiungono per ogni framework quando viene implementato.

## Ordine di Implementazione

### Fase 1 — Scaffolding
- Init pnpm workspace + git
- Root package.json, tsconfig.base.json, .gitignore
- Scaffold packages/*/package.json con exports map
- File hand-written: types.ts e icon-base.* per core e react
- icons-manifest.json con URL AWS
- svgo.config.ts con prefixIds

### Fase 2 — Pipeline (AWS + React + Core + SVG)
- scripts/providers/aws.ts
- scripts/download.ts -> cleanup.ts -> optimize.ts (con sha256 check)
- scripts/generators/core.ts + svg.ts + react.ts (SVG -> JSX AST)
- scripts/generate.ts orchestrator
- metadata.json generator
- Test pipeline (Vitest snapshot)
- Test runtime React (@testing-library/react)
- Verifica con app Vite

### Fase 3 — Altri provider (Azure + GCP)
- scripts/providers/azure.ts + gcp.ts
- icons-manifest.json con URL Azure e GCP
- Aggiornare cleanup rules per naming di ogni provider
- Rigenerare e verificare

### Fase 4 — Vue
- scripts/generators/vue.ts (render function)
- packages/vue/ build config (tsup)
- Test runtime Vue

### Fase 5 — Angular
- scripts/generators/angular.ts (standalone components)
- packages/angular/ build config (ng-packagr)
- Test runtime Angular

### Fase 6 — Polish
- GitHub Actions CI (lint + test + build)
- Changesets per versioning
- README con esempi per ogni framework
- Pagina demo / icon picker (opzionale)

## Verifica

1. Dopo Fase 2: `import { AwsEc2 } from "@cloud-icons/react/aws"` funziona in un'app Vite
2. Dopo Fase 3: tutte le icone AWS + Azure + GCP disponibili in core/react/svg
3. Dopo Fase 4: stessa verifica per Vue
4. Dopo Fase 5: stessa verifica per Angular
5. Tree-shaking: verificare che il bundle includa solo le icone importate
6. Nessuna collisione di ID SVG quando piu icone sono renderizzate insieme
7. metadata.json contiene tutte le icone con category/aliases corretti
