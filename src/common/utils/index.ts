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

export function slugify(title: string, addRandom = false): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/[^a-z0-9-]/g, ''); // remove non-url characters

  const suffix = addRandom ? '-' + Math.random().toString(36).slice(2, 8) : '';

  return base + suffix;
}
