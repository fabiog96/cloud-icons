export function toPascalCase(kebab: string): string {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toCamelCase(kebab: string): string {
  const pascal = toPascalCase(kebab);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function toSlug(provider: string, kebab: string): string {
  return `${provider}-${kebab}`;
}

export function dedup(names: string[]): string[] {
  const seen = new Map<string, number>();
  const result: string[] = [];

  for (const name of names) {
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    result.push(count === 0 ? name : `${name}-${count + 1}`);
  }

  return result;
}
