// Shared building blocks used by EVERY product regardless of category.
// These are intentionally generic (unit-tagged values) so they don't need
// to change when new product types are added.

export enum MassUnitEnum {
  MG = 'mg',
  G = 'g',
  KG = 'kg',
}

export enum VolumeUnitEnum {
  ML = 'ml',
  L = 'l',
}

export enum LengthUnitEnum {
  MM = 'mm',
  CM = 'cm',
}

export const UnitEnumValues = [
  ...Object.values(MassUnitEnum),
  ...Object.values(VolumeUnitEnum),
] as const;
