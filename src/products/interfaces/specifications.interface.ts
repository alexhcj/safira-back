import { ShelfLifeUnitEnum } from '../enums/shelf-life-unit.enum';
import { ICompanyData } from './specifications/company.interface';

export interface ISpecifications {
  company: ICompanyData;
  producingCountry?: string;
  quantity: number;
  shelfLife: {
    value: number;
    unit: ShelfLifeUnitEnum;
  };
}
