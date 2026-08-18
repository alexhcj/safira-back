import { IUnitSize } from './unit-size.interface';
import { PricingUnitEnum } from '../../enums/pricing-unit.enum';

export interface IPackaging {
  unitsPerPack?: number;
  unitSize?: IUnitSize;
  packagingType?: string;
  pricingUnit?: PricingUnitEnum;
}
