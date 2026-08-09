import { ICompanyData } from './company.interface';
import { ShelfLifeUnitEnum } from '../enums/shelf-life-unit.enum';

export interface ISpecifications {
  company: ICompanyData;
  producingCountry?: string;
  quantity: number;
  shelfLife: {
    value: number;
    unit: ShelfLifeUnitEnum;
  };
}
