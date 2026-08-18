import { IPackaging } from '../../products/interfaces/packaging/packaging.interface';

export function toSlug(value: string): string {
  return value.toLowerCase().replace(/_/g, '-');
}

export function fromSlug<T extends Record<string, string>>(
  slug: string,
  enumObj: T,
): T[keyof T] | undefined {
  return (Object.values(enumObj) as string[]).find(
    (val) => toSlug(val) === slug,
  ) as T[keyof T] | undefined;
}

export function fromSlugValue(
  slug: string,
  map: Record<string, string>,
): string | undefined {
  return map[slug];
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/'/g, '') // replace single quotes with hyphens
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/[^\w-]/g, '') // remove non-url characters but retain hyphens
    .replace(/-+/g, '-'); // replace multiple consecutive hyphens with a single one
}

export function buildProductSlug(name: string, packaging: IPackaging): string {
  const base = slugify(name);
  const parts = [base];

  if (packaging.unitsPerPack > 1) {
    parts.push(`${packaging.unitsPerPack}x`);
  }

  if (packaging.unitSize) {
    parts.push(`${packaging.unitSize.value}${packaging.unitSize.unit}`);
  }

  return parts.join('-');
}
