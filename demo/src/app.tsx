import "./app.css";

import {
  type ChangeEvent,
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import * as AwsIcons from "@cloud-icons/react/aws";
import * as AzureIcons from "@cloud-icons/react/azure";
import * as GcpIcons from "@cloud-icons/react/gcp";

type Provider = "all" | "aws" | "azure" | "gcp";

type IconEntry = {
  name: string;
  shortName: string;
  provider: Provider;
  importPath: string;
  component: ComponentType<{ size?: number; color?: string }>;
};

function loadIcons(
  icons: Record<string, unknown>,
  provider: "aws" | "azure" | "gcp",
  prefix: string,
): IconEntry[] {
  return Object.entries(icons)
    .filter(([, value]) => typeof value === "object" || typeof value === "function")
    .map(([name, component]) => ({
      name,
      shortName: name.replace(new RegExp(`^${prefix}`), ""),
      provider,
      importPath: `@cloud-icons/react/${provider}`,
      component: component as IconEntry["component"],
    }));
}

const allIcons: IconEntry[] = [
  ...loadIcons(AwsIcons, "aws", "Aws"),
  ...loadIcons(AzureIcons, "azure", "Azure"),
  ...loadIcons(GcpIcons, "gcp", "Gcp"),
].sort((a, b) => a.name.localeCompare(b.name));

const PROVIDER_COLORS: Record<string, string> = {
  aws: "#FF9900",
  azure: "#0078D4",
  gcp: "#4285F4",
};

const PROVIDER_COUNTS: Record<string, number> = {
  aws: allIcons.filter((i) => i.provider === "aws").length,
  azure: allIcons.filter((i) => i.provider === "azure").length,
  gcp: allIcons.filter((i) => i.provider === "gcp").length,
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  );
}

function CommandIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

export function App() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [selected, setSelected] = useState<IconEntry | null>(null);
  const [activeProvider, setActiveProvider] = useState<Provider>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let icons = allIcons;
    if (activeProvider !== "all") {
      icons = icons.filter((icon) => icon.provider === activeProvider);
    }
    if (search) {
      const lower = search.toLowerCase();
      icons = icons.filter((icon) => icon.name.toLowerCase().includes(lower));
    }
    return icons;
  }, [search, activeProvider]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCopy = useCallback((icon: IconEntry, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const importStr = `import { ${icon.name} } from "${icon.importPath}";`;
    navigator.clipboard.writeText(importStr);
    setCopied(icon.name);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setSelected(null);
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-[var(--color-border-dim)] bg-[var(--color-surface-1)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center gap-6 px-6 py-3">
          <div className="flex items-center gap-2.5 text-[var(--color-accent)]">
            <CloudIcon />
            <span className="font-sans text-[15px] font-semibold tracking-tight text-[var(--color-text-primary)]">
              cloud-icons
            </span>
            <span className="ml-1 rounded bg-[var(--color-surface-3)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--color-text-muted)]">
              v0.0.1
            </span>
          </div>

          <div className="relative max-w-2xl flex-1">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <SearchIcon />
            </div>
            <input
              ref={searchRef}
              type="text"
              placeholder={`Search ${allIcons.length} icons...`}
              value={search}
              onChange={handleSearch}
              className="w-full rounded-lg border border-[var(--color-border-dim)] bg-[var(--color-surface-0)] py-2 pl-10 pr-20 font-sans text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-dim)] focus:bg-[var(--color-surface-2)]"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded border border-[var(--color-border-dim)] bg-[var(--color-surface-2)] px-1.5 py-0.5 text-[var(--color-text-muted)]">
              <CommandIcon />
              <span className="font-mono text-[11px]">K</span>
            </div>
          </div>

          <div className="hidden items-center gap-1 md:flex">
            {(["all", "aws", "azure", "gcp"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setActiveProvider(p)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-sans text-xs transition-colors ${
                  activeProvider === p
                    ? "bg-[var(--color-surface-3)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                {p !== "all" && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: PROVIDER_COLORS[p] }}
                  />
                )}
                <span>{p === "all" ? "All" : p.toUpperCase()}</span>
                <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                  {p === "all" ? allIcons.length : PROVIDER_COUNTS[p]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full max-w-[1440px] flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-sans text-[13px] text-[var(--color-text-muted)]">
            {search ? (
              <>
                <span className="text-[var(--color-text-secondary)]">{filtered.length}</span>
                {" "}result{filtered.length !== 1 ? "s" : ""} for "<span className="text-[var(--color-accent)]">{search}</span>"
              </>
            ) : (
              <>
                <span className="text-[var(--color-text-secondary)]">{allIcons.length}</span>
                {" "}icons available
              </>
            )}
          </p>
          <p className="font-sans text-[11px] text-[var(--color-text-muted)]">
            Click icon for details
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[var(--color-border-dim)] py-24">
            <SearchIcon />
            <p className="font-sans text-sm text-[var(--color-text-muted)]">
              No icons match "<span className="text-[var(--color-text-secondary)]">{search}</span>"
            </p>
            <button
              onClick={() => setSearch("")}
              className="rounded-md bg-[var(--color-surface-3)] px-3 py-1.5 font-sans text-xs text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-4)]"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2">
            {filtered.map((icon, i) => {
              const { name, shortName, component: Icon, provider } = icon;
              const isCopied = copied === name;
              const isSelected = selected?.name === name;

              return (
                <button
                  key={name}
                  onClick={() => setSelected(icon)}
                  style={{ animationDelay: `${Math.min(i * 8, 300)}ms` }}
                  className={`
                    group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 pb-2.5 transition-all
                    [animation:fade-in_0.25s_ease_both]
                    ${isSelected
                      ? "border-[var(--color-accent-dim)] bg-[var(--color-accent-glow)] shadow-[0_0_0_1px_var(--color-accent-dim)]"
                      : "border-[var(--color-border-dim)] bg-[var(--color-surface-1)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-surface-2)]"
                    }
                    ${isCopied ? "[animation:pulse-ring_0.6s_ease]" : ""}
                  `}
                >
                  <div className="flex h-10 w-10 items-center justify-center">
                    <Icon size={36} />
                  </div>
                  <span className={`
                    max-w-full truncate font-sans text-[10px] leading-tight transition-colors
                    ${isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]"}
                  `}>
                    {isCopied ? "Copied!" : shortName}
                  </span>
                  <span
                    className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full opacity-60"
                    style={{ backgroundColor: PROVIDER_COLORS[provider] }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm [animation:fade-in_0.15s_ease_both]"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-[var(--color-border-dim)] bg-[var(--color-surface-1)] shadow-2xl shadow-black/50 [animation:modal-in_0.2s_ease_both]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border-dim)] px-6 py-4">
              <div className="flex items-center gap-3">
                <selected.component size={28} />
                <div>
                  <h2 className="font-sans text-sm font-semibold text-[var(--color-text-primary)]">
                    {selected.shortName}
                  </h2>
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                    {selected.name}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium"
                  style={{
                    backgroundColor: `${PROVIDER_COLORS[selected.provider]}20`,
                    color: PROVIDER_COLORS[selected.provider],
                  }}
                >
                  {selected.provider.toUpperCase()}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-secondary)]"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="flex flex-col gap-5 p-6">
              {/* Preview sizes */}
              <div className="flex items-end justify-center gap-6 rounded-xl border border-[var(--color-border-dim)] bg-[var(--color-surface-0)] py-8">
                {[16, 24, 32, 48, 64].map((size) => (
                  <div key={size} className="flex flex-col items-center gap-2.5">
                    <selected.component size={size} />
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)]">{size}px</span>
                  </div>
                ))}
              </div>

              {/* Import */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Import
                </label>
                <div className="group relative">
                  <pre className="overflow-x-auto rounded-lg border border-[var(--color-border-dim)] bg-[var(--color-surface-0)] p-3 font-mono text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                    <span className="text-[#c792ea]">import</span>{" "}
                    <span className="text-[var(--color-text-primary)]">{"{ "}{selected.name}{" }"}</span>{" "}
                    <span className="text-[#c792ea]">from</span>{" "}
                    <span className="text-[var(--color-success)]">"{selected.importPath}"</span>
                    <span className="text-[var(--color-text-muted)]">;</span>
                  </pre>
                  <button
                    onClick={(e) => handleCopy(selected, e)}
                    className="absolute right-2 top-2 rounded-md border border-[var(--color-border-dim)] bg-[var(--color-surface-2)] p-1.5 text-[var(--color-text-muted)] opacity-0 transition-all hover:border-[var(--color-border-bright)] hover:text-[var(--color-text-secondary)] group-hover:opacity-100"
                  >
                    {copied === selected.name ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
              </div>

              {/* Usage */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                  Usage
                </label>
                <pre className="overflow-x-auto rounded-lg border border-[var(--color-border-dim)] bg-[var(--color-surface-0)] p-3 font-mono text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                  <span className="text-[var(--color-text-muted)]">{"<"}</span>
                  <span className="text-[#f07178]">{selected.name}</span>{" "}
                  <span className="text-[var(--color-accent)]">size</span>
                  <span className="text-[var(--color-text-muted)]">=</span>
                  <span className="text-[var(--color-aws)]">{"{24}"}</span>{" "}
                  <span className="text-[var(--color-text-muted)]">{"/>"}</span>
                </pre>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-between border-t border-[var(--color-border-dim)] px-6 py-3">
              <span className="font-sans text-[11px] text-[var(--color-text-muted)]">
                Press <kbd className="rounded border border-[var(--color-border-dim)] bg-[var(--color-surface-3)] px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd> to close
              </span>
              <button
                onClick={(e) => handleCopy(selected, e)}
                className="flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-4 py-2 font-sans text-xs font-medium text-[var(--color-surface-0)] transition-colors hover:bg-[var(--color-accent)]/90"
              >
                {copied === selected.name ? <CheckIcon /> : <CopyIcon />}
                {copied === selected.name ? "Copied!" : "Copy import"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {copied && !selected && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 [animation:toast-in_0.2s_ease_both]">
          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-success)]/20 bg-[var(--color-surface-2)] px-4 py-2.5 shadow-xl shadow-black/40">
            <CheckIcon />
            <span className="font-sans text-sm text-[var(--color-success)]">Import copied</span>
          </div>
        </div>
      )}
    </div>
  );
}
