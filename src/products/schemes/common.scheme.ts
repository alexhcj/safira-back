import { Prop, Schema } from '@nestjs/mongoose';
import {
  LengthUnitEnum,
  MassUnitEnum,
  VolumeUnitEnum,
} from '../enums/common.enum';
import { PricingUnitEnum } from '../enums/pricing-unit.enum';

// ---------------------------------------------------------------------------
// Packaging: describes the physical unit(s) the customer receives.
// This is what powers "6 x 350ml" style slugs/labels and lets you compute
// total volume/weight without re-deriving it from free text.
// ---------------------------------------------------------------------------
@Schema({ _id: false })
export class UnitSize {
  @Prop({ required: true, min: 0 })
  readonly value: number;

  @Prop({
    required: true,
    type: String,
    enum: { ...MassUnitEnum, ...VolumeUnitEnum },
  })
  readonly unit: MassUnitEnum | VolumeUnitEnum;
}

@Schema({ _id: false })
export class Packaging {
  // 1 for a solo item, 6 for a 6-pack of cans, 30 for a tray of eggs, etc.
  @Prop({ min: 1, default: 1 })
  readonly unitsPerPack: number;

  // Size of a SINGLE unit inside the pack (one can, one egg-tray-slot is N/A,
  // one bottle, etc). Omit only when the product genuinely has no
  // meaningful single-unit size (e.g. a bunch of loose vegetables).
  @Prop({ type: UnitSize })
  readonly unitSize?: UnitSize;

  // Free-form packaging material/type, used for both display and
  // downstream shipping-box selection. Kept as a string (not enum) because
  // suppliers use inconsistent vocabulary and this list will grow constantly;
  // the enum-worthy structured data lives in ShippingDetails instead.
  @Prop()
  readonly packagingType?: string; // e.g. 'can', 'bottle', 'carton', 'tray', 'bag'

  // What the listed price is actually for
  @Prop({ enum: PricingUnitEnum })
  readonly pricingUnit?: PricingUnitEnum; // 'per-item' | 'per-kg' | 'per-100g' | 'per-pack'
}

// ---------------------------------------------------------------------------
// Shipping: the OUTER logistics envelope (courier box), independent of how
// the product itself is packaged for retail display. Kept separate from
// Packaging on purpose — a 6-pack of beer has a packaging.unitsPerPack of 6,
// but a shippingDetails.weight that reflects the whole shipped parcel.
// ---------------------------------------------------------------------------
@Schema({ _id: false })
export class Dimensions {
  @Prop({ required: true, min: 0 })
  readonly width: number;

  @Prop({ required: true, min: 0 })
  readonly height: number;

  @Prop({ required: true, min: 0 })
  readonly depth: number;

  @Prop({
    required: true,
    type: String,
    enum: LengthUnitEnum,
    default: LengthUnitEnum.CM,
  })
  readonly unit: LengthUnitEnum;
}

@Schema({ _id: false })
export class ShippingDetails {
  @Prop({ type: UnitSize })
  readonly weight?: UnitSize; // total shipped weight, mass units only

  @Prop({ type: Dimensions })
  readonly dimensions?: Dimensions;
}

// ---------------------------------------------------------------------------
// Storage
// ---------------------------------------------------------------------------
@Schema({ _id: false })
export class StorageInformation {
  @Prop({ required: true })
  readonly instructions: string; // "Store in a cool, dry place", "Keep chilled at 4°C and below"

  // Structured max temperature. Lets you filter/badge "needs
  // chilling" items or drive delivery-route logic without parsing `instructions`.
  @Prop({ min: -30, max: 60 })
  readonly maxTempCelsius?: number;
}

// ---------------------------------------------------------------------------
// Ingredients
// ---------------------------------------------------------------------------
@Schema({ _id: false })
export class Ingredient {
  @Prop({ required: true })
  readonly name: string;

  // Display/legal order (ingredient lists are conventionally ordered by
  // proportion, heaviest first) — keep explicit rather than relying on
  // array order, since arrays get re-sorted/edited over time.
  @Prop({ required: true, min: 0 })
  readonly order: number;

  @Prop({ default: false })
  readonly isAllergen: boolean;
}

// ---------------------------------------------------------------------------
// Nutritional data. Core macros are fixed fields (near-universal, worth
// indexing/filtering on). Vitamins/amino-acids/fatty-acid breakdowns are a
// name/amount array because coverage varies wildly by product and a fixed
// field per nutrient would mean a schema migration every time a new
// nutrient shows up on a label.
// ---------------------------------------------------------------------------
@Schema({ _id: false })
export class MacroBreakdown {
  @Prop({ min: 0 })
  readonly total: number;

  @Prop({ min: 0 })
  readonly saturated?: number; // fat only

  @Prop({ min: 0 })
  readonly mono?: number; // fat only

  @Prop({ min: 0 })
  readonly poly?: number; // fat only

  @Prop({ min: 0 })
  readonly trans?: number; // fat only

  @Prop({ min: 0 })
  readonly sugars?: number; // carbohydrate only

  @Prop({ min: 0 })
  readonly fibre?: number; // carbohydrate only
}

@Schema({ _id: false })
export class NutrientEntry {
  @Prop({ required: true })
  readonly name: string; // 'Vitamin E', 'Omega 3', 'Leucine', ...

  @Prop({ required: true, min: 0 })
  readonly amount: number;

  @Prop({ required: true })
  readonly unit: string; // 'mg', 'g', 'mcg' — kept as string, too many DV units to enum safely
}

@Schema({ _id: false })
export class NutritionalData {
  @Prop({ required: true, type: UnitSize })
  readonly servingSize: UnitSize; // e.g. { value: 50, unit: 'g' }

  @Prop({ min: 0 })
  readonly energyKcal?: number;

  @Prop({ min: 0 })
  readonly protein?: number;

  @Prop({ type: MacroBreakdown })
  readonly fat?: MacroBreakdown;

  @Prop({ type: MacroBreakdown })
  readonly carbohydrate?: MacroBreakdown;

  @Prop({ min: 0 })
  readonly sodium?: number;

  @Prop({ min: 0 })
  readonly cholesterol?: number;

  // Vitamins, minerals, amino acids, fatty acid breakdowns not already
  // covered above (linoleic acid, alpha-linolenic acid, EPA/DHA, ...).
  @Prop({ type: [NutrientEntry], default: [] })
  readonly micronutrients: NutrientEntry[];
}
