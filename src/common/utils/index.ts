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

export function slugify(title: string, addRandom = false): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/'/g, '') // replace single quotes with hyphens
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/[^\w-]/g, '') // remove non-url characters but retain hyphens
    .replace(/-+/g, '-'); // replace multiple consecutive hyphens with a single one

  const suffix = addRandom ? '-' + Math.random().toString(36).slice(2, 8) : '';

  return base + suffix;
}
