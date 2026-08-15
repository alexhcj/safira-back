import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import {
  Ingredient,
  NutritionalData,
  Packaging,
  ShippingDetails,
  StorageInformation,
} from './common.scheme';
import {
  AlcoholicBeverageSpecs,
  CategorySpecsBase,
  CookingOilSpecs,
  GenericSpecs,
  NonAlcoholicBeverageSpecs,
  PackagedCountSpecs,
  PerishableProteinSpecs,
  PreservedFoodSpecs,
} from './category-specs.scheme';
import { Inventory } from './inventory.scheme';
import { Price, PriceDocument } from '../../prices/schemes/price.scheme';
import { Tag } from '../../tags/schemes/tag.scheme';
import { Review } from '../../reviews/schemes/review.scheme';
import { ShelfLifeUnitEnum } from '../enums/shelf-life-unit.enum';
import { SpecArchetype } from '../enums/category-specs.enum';
import { getSubdocumentPath } from '../utils/get-sub-document-path';

@Schema({ _id: false })
class Company {
  @Prop({ required: true })
  readonly displayName: string;

  @Prop({ required: true })
  readonly normalizedName: string;

  @Prop({ required: true })
  readonly slug: string;
}

@Schema({ _id: false })
class ShelfLife {
  @Prop({ required: true, min: 1 })
  readonly value: number;

  @Prop({ required: true, type: String, enum: ShelfLifeUnitEnum })
  readonly unit: ShelfLifeUnitEnum;
}

@Schema({ _id: false })
export class Specifications {
  @Prop({ required: true })
  readonly company: Company;

  @Prop()
  readonly producingCountry?: string;

  @Prop({ required: true })
  readonly shelfLife: ShelfLife;

  @Prop({ type: [Ingredient], default: [] })
  readonly ingredients: Ingredient[];

  @Prop({ type: StorageInformation })
  readonly storageInformation?: StorageInformation;

  @Prop({ type: NutritionalData })
  readonly nutritionalData?: NutritionalData;

  // Discriminated sub-document — actual shape depends on specArchetype
  // (see category-specs.scheme.ts). Typed loosely here at the base-class
  // level; Mongoose resolves the concrete discriminator shape at runtime
  // based on the stored `specArchetype` value.
  @Prop({ type: CategorySpecsBase })
  readonly categorySpecs?: CategorySpecsBase;
}

export type ProductDocument = Product & Document;

@Schema({
  collection: 'products',
  timestamps: true,
})
export class Product {
  @Prop({ required: true })
  readonly name: string;

  @Prop({ required: true, unique: true })
  readonly slug: string;

  // Full detail copy. Stays `string` for now (plain text); promote to a
  // rich-text/HTML/markdown representation when the content editor feature ships
  @Prop()
  readonly description?: string;

  // Short, plain-text, card/preview copy
  @Prop({ required: true, maxlength: 200 })
  readonly excerpt: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Price.name })
  price: PriceDocument;

  @Prop({ required: true, type: String })
  readonly primeCategory: string;

  @Prop({ type: String, default: undefined })
  readonly subCategory: string;

  @Prop({ type: String, default: undefined })
  readonly basicCategory: string;

  @Prop({ default: 0 })
  readonly popularity: number;

  @Prop({ default: 0 })
  readonly views: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Tag.name, default: undefined })
  readonly tags: Tag;

  @Prop({ type: SchemaTypes.ObjectId, ref: Review.name, default: undefined })
  readonly reviews: Review;

  @Prop({ required: true, type: Specifications })
  readonly specifications: Specifications;

  // Stock, deliberately separate from `specifications` (it's operational
  // data, not a spec of the product) and separate from `packaging.unitsPerPack`
  // (that's "how many units come in one purchasable pack", this is
  // "how many packs/units are in stock").
  @Prop({ type: Inventory, default: () => ({ stockQuantity: 0 }) })
  readonly inventory: Inventory;

  @Prop({ type: Packaging, default: () => ({ unitsPerPack: 1 }) })
  readonly packaging: Packaging;

  @Prop({ type: ShippingDetails })
  readonly shippingDetails?: ShippingDetails;

  // OPTION B ONLY (variant grouping) — see design-notes.md.
  // Leave undefined entirely if you go with Option A.
  // @Prop({ type: SchemaTypes.ObjectId, ref: 'VariantGroup', default: undefined })
  // readonly variantGroup?: string;
}

export const ProductScheme = SchemaFactory.createForClass(Product);
const genericSchema = SchemaFactory.createForClass(GenericSpecs);
const alcoholicBeverageSchema = SchemaFactory.createForClass(
  AlcoholicBeverageSpecs,
);
const nonAlcoholicBeverageSchema = SchemaFactory.createForClass(
  NonAlcoholicBeverageSpecs,
);
const perishableProteinSchema = SchemaFactory.createForClass(
  PerishableProteinSpecs,
);
const packagedCountSchema = SchemaFactory.createForClass(PackagedCountSpecs);
const cookingOilSchema = SchemaFactory.createForClass(CookingOilSpecs);
const preservedFoodSchema = SchemaFactory.createForClass(PreservedFoodSpecs);

const specificationsPath = getSubdocumentPath(ProductScheme, 'specifications');

getSubdocumentPath(specificationsPath.schema, 'categorySpecs').discriminator(
  SpecArchetype.GENERIC,
  genericSchema,
);
getSubdocumentPath(specificationsPath.schema, 'categorySpecs').discriminator(
  SpecArchetype.ALCOHOLIC_BEVERAGE,
  alcoholicBeverageSchema,
);
getSubdocumentPath(specificationsPath.schema, 'categorySpecs').discriminator(
  SpecArchetype.NON_ALCOHOLIC_BEVERAGE,
  nonAlcoholicBeverageSchema,
);
getSubdocumentPath(specificationsPath.schema, 'categorySpecs').discriminator(
  SpecArchetype.PERISHABLE_PROTEIN,
  perishableProteinSchema,
);
getSubdocumentPath(specificationsPath.schema, 'categorySpecs').discriminator(
  SpecArchetype.PACKAGED_COUNT,
  packagedCountSchema,
);
getSubdocumentPath(specificationsPath.schema, 'categorySpecs').discriminator(
  SpecArchetype.COOKING_OIL,
  cookingOilSchema,
);
getSubdocumentPath(specificationsPath.schema, 'categorySpecs').discriminator(
  SpecArchetype.PRESERVED_FOOD,
  preservedFoodSchema,
);
