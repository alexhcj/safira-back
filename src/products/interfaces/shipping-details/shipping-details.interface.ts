import { IDimensions } from './dimensions.interface';
import { IUnitSize } from '../packaging/unit-size.interface';

export class IShippingDetails {
  weight?: IUnitSize;
  dimensions?: IDimensions;
}
