import { BaseField, BaseResponse } from './base.types';

export interface ComponentModel extends BaseField {
  name: string;
  meta_data: string;
}

export type ComponentResponse = BaseResponse<ComponentModel>;
