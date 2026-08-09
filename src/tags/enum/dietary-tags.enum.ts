export enum DietaryTagsEnum {
  GLUTEN_FREE = 'GLUTEN_FREE',
  HALAL = 'HALAL',
  HEALTHIER_CHOICE = 'HEALTHIER_CHOICE',
  HYPOALLERGENIC = 'HYPOALLERGENIC',
  LACTOSE_FREE = 'LACTOSE_FREE',
  ORGANIC = 'ORGANIC',
  TRANS_FAT_FREE = 'TRANS_FAT_FREE',
  VEGETARIAN = 'VEGETARIAN',
}

export const DIETARY_TAG_LABELS: Record<DietaryTagsEnum, string> = {
  [DietaryTagsEnum.GLUTEN_FREE]: 'Gluten free',
  [DietaryTagsEnum.HALAL]: 'Halal',
  [DietaryTagsEnum.HEALTHIER_CHOICE]: 'Healthier choice',
  [DietaryTagsEnum.HYPOALLERGENIC]: 'Hypoallergenic',
  [DietaryTagsEnum.LACTOSE_FREE]: 'Lactose free',
  [DietaryTagsEnum.ORGANIC]: 'Organic',
  [DietaryTagsEnum.TRANS_FAT_FREE]: 'Trans fat free',
  [DietaryTagsEnum.VEGETARIAN]: 'Vegetarian',
};
