import { DataSourceJsonData } from '@grafana/data';
import { DataQuery } from '@grafana/schema';

export interface DataPoint {
  Time: number;
  Value: number;
}

export interface DataSourceResponse {
  datapoints: DataPoint[];
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {
  apiKey?: string;
}

export interface MyVariableQuery extends ChaosMeshVariableQuery {
  namespace: string;
  rawQuery: string;
}

export interface ChaosMeshVariableQuery {
  user: string;
  post: string;
  queryType: string;
  variable:string
  queryString?: string;
}

export interface MyQuery extends DataQuery {
  queryText?: string;
}

export interface MyDataSourceOptions extends DataSourceJsonData {}
