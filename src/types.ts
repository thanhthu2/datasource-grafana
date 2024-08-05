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

export enum NODE_KIND {
  SOURCE = 'source',
  TARGET = 'target',
}

export enum QUERY_TYPE_ENUMS {
  COMPONENT = 'component',
  TAG = 'tag',
  NODE_BY_TAG = 'node-by-tag',
  NODE_BY_COMPONENT = 'node-by-component',
  NODE_BY_NODE = 'node-by-node',
}

export interface ChaosMeshVariableQuery {
  queryType: QUERY_TYPE_ENUMS;
  tag: string;
  component: string;
  variable: string;
  variableTag: string;
  variableComponent: string;
  variableNode: string;
  kind: NODE_KIND;
}

export interface MyQuery extends DataQuery {
  queryText?: string;
}

export interface MyDataSourceOptions extends DataSourceJsonData {}
