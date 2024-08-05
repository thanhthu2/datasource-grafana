import { BaseField, BaseResponse } from './base.types';

export interface TagModel extends BaseField {
  name: string;
  description: string;
  meta_data: string;
}

export type TagResponse = BaseResponse<TagModel>;
