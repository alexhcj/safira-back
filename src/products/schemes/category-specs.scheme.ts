// Adding a new category — just map it to an existing archetype in a config
// table (see CATEGORY_ARCHETYPE_MAP below). Only add a new discriminator
// when a genuinely new SHAPE of data appears that no existing archetype covers.

import { Prop, Schema } from '@nestjs/mongoose';
import { SpecArchetype } from '../enums/category-specs.enum';
import { PackingMediumEnum } from '../enums/packing-medium.enum';
import { ExtractionMethod } from '../enums/extraction-method.enum';
import { FarmedOrWildEnum } from '../enums/farmed-or-wild.enum';
import { UnitSize } from './common.scheme';

// Base shape every archetype extends. The discriminator key lives here.
@Schema({ _id: false, discriminatorKey: 'specArchetype' })
export class CategorySpecsBase {
  readonly specArchetype: SpecArchetype;
}

// --- Archetype: generic -----------------------------------------------
@Schema({ _id: false })
export class GenericSpecs extends CategorySpecsBase {}

// --- Archetype: alcoholicBeverage --------------------------------------
// Covers: beer, wine, spirits, cider, ready-to-drink cocktails.
@Schema({ _id: false })
export class AlcoholicBeverageSpecs extends CategorySpecsBase {
  @Prop({ required: true, min: 0, max: 100 })
  readonly abv: number; // "% alcohol"

  @Prop()
  readonly beverageStyle?: string; // 'lager', 'pilsner', 'IPA', 'red wine', ...

  @Prop()
  readonly flavour?: string; // 'citrus, coriander spice'
}

// --- Archetype: nonAlcoholicBeverage --------------------------------------
// Covers: orange-juice, apple-juice.
@Schema({ _id: false })
export class NonAlcoholicBeverageSpecs extends CategorySpecsBase {
  @Prop()
  readonly isFromConcentrate?: boolean; // your Marigold Packet Juice vs Peel Fresh likely differ on this

  @Prop()
  readonly addedSugar?: boolean;
}

// --- Archetype: perishableProtein ---------------------------------------
// Covers: fresh/frozen meat, poultry, fish, seafood.
@Schema({ _id: false })
export class PerishableProteinSpecs extends CategorySpecsBase {
  @Prop({ enum: FarmedOrWildEnum })
  readonly farmedOrWild?: FarmedOrWildEnum;

  @Prop()
  readonly cut?: string; // 'ribeye', 'striploin', 'fillet', 'mince'

  @Prop({ default: false })
  readonly isFrozen: boolean;

  @Prop({ default: false })
  readonly boneIn: boolean;
}

// --- Archetype: packagedCount --------------------------------------------
// Covers: eggs
@Schema({ _id: false })
export class PackagedCountSpecs extends CategorySpecsBase {
  @Prop()
  readonly gradeOrSize?: string; // 'Grade A', 'Large', 'Jumbo'
}

// --- Archetype: cookingOil -----------------------------------------------
// Covers: olive-oil now, would auto-cover sesame/coconut/canola oil.
@Schema({ _id: false })
export class CookingOilSpecs extends CategorySpecsBase {
  @Prop({ enum: ExtractionMethod })
  readonly extractionMethod?: ExtractionMethod;

  @Prop()
  readonly oilType?: string; // 'extra virgin olive oil', 'sunflower blend', ...

  @Prop()
  readonly acidityPercent?: number; // meaningful for EVOO grading (<0.8% = extra virgin)
}

// --- Archetype: preservedFood --------------------------------------------
// Covers: canned-vegetables.
@Schema({ _id: false })
export class PreservedFoodSpecs extends CategorySpecsBase {
  @Prop({ enum: PackingMediumEnum })
  readonly packingMedium?: PackingMediumEnum;

  // Standard canned-good label field (drained weight ≠ total can weight) and
  // directly improves nutrition-per-serving accuracy for the canned items
  @Prop({ type: UnitSize })
  readonly drainedWeight?: UnitSize;
}

// ---------------------------------------------------------------------------
// Config table: which archetype a given basicCategory maps to. This is the
// ONLY thing you touch when a new category is added and it fits an existing
// archetype (the overwhelming majority of the time).
// ---------------------------------------------------------------------------
export const CATEGORY_ARCHETYPE_MAP: Record<string, SpecArchetype> = {
  'lager-and-pilsner': SpecArchetype.ALCOHOLIC_BEVERAGE,
  wine: SpecArchetype.ALCOHOLIC_BEVERAGE,
  spirits: SpecArchetype.ALCOHOLIC_BEVERAGE,
  'orange-juice': SpecArchetype.NON_ALCOHOLIC_BEVERAGE,
  'apple-juice': SpecArchetype.NON_ALCOHOLIC_BEVERAGE,
  'fresh-beef-lamb': SpecArchetype.PERISHABLE_PROTEIN,
  'fresh-fish-seafood': SpecArchetype.PERISHABLE_PROTEIN,
  'frozen-fish': SpecArchetype.PERISHABLE_PROTEIN,
  eggs: SpecArchetype.PACKAGED_COUNT,
  'bread-slice': SpecArchetype.PACKAGED_COUNT,
  'olive-oil': SpecArchetype.COOKING_OIL,
  'canned-vegetables': SpecArchetype.PRESERVED_FOOD,
  // anything absent from this map falls back to SpecArchetype.GENERIC
};

export function resolveArchetype(basicCategorySlug: string): SpecArchetype {
  return CATEGORY_ARCHETYPE_MAP[basicCategorySlug] ?? SpecArchetype.GENERIC;
}
