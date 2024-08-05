import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
} from '@grafana/data';
import { getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { isEmpty } from 'lodash';
import { ComponentModel } from 'types/component.types';
import { TagModel } from 'types/tag.types';
import { transformRequest } from 'utils/helpers';
import { ChaosMeshVariableQuery, MyDataSourceOptions, MyQuery, QUERY_TYPE_ENUMS } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;
  tagCache: TagModel[] | [] = [];
  listComponentCache: ComponentModel[] | [] = [];
  listNodeByTag: any | [] = [];
  datasourceUID: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url!;
    this.datasourceUID = instanceSettings.uid;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    return [];
  }

  async handleGetTags() {
    const [err, res] = await transformRequest(
      getBackendSrv().get(`api/datasources/uid/${this.datasourceUID}/resources/tags`)
    );
    if (err) {
      return;
    }
    this.tagCache = res.data || [];
    return (res.data || []).map((tag: any) => ({ text: tag?.name }));
  }

  async handleGetComponents() {
    const [err, res] = await transformRequest(
      getBackendSrv().get(`api/datasources/uid/${this.datasourceUID}/resources/components`)
    );
    if (err) {
      return;
    }
    this.listComponentCache = res.data || [];
    return (res.data || []).map((component: any) => ({ text: component?.name }));
  }

  getCurrentTagUID(variable: string) {
    const tagName = getTemplateSrv().replace(variable, {}, 'text');
    return this.tagCache.find((tag) => tag.name === tagName)?.uid;
  }

  getCurrentNodeUID(variable: string) {
    const nodeName = getTemplateSrv().replace(variable, {}, 'text');
    const transformNodes = this.listNodeByTag.map((node: any) => ({ ...node, meta_data: JSON.parse(node.meta_data) }));
    return transformNodes.find((node: any) => node?.meta_data?.selected === nodeName).uid;
  }

  getCurrentComponentUID(variable: string) {
    const componentName = getTemplateSrv().replace(variable, {}, 'text');
    return this.listComponentCache.find((component) => component.name === componentName)?.uid;
  }

  async handleGetNodesByTagID(variable: string) {
    const [err, res] = await transformRequest(
      getBackendSrv().get(`api/datasources/uid/${this.datasourceUID}/resources/nodes`, {
        tagID: this.getCurrentTagUID(variable),
      })
    );
    if (err) {
      return;
    }

    const transformData = res.data.reduce((acc: any[], node: any) => {
      const parseMetaData = JSON.parse(node.meta_data);
      const text = isEmpty(parseMetaData) ? null : parseMetaData?.selected;

      if (text) {
        acc.push({ text });
      }

      return acc;
    }, []);
    this.listNodeByTag = res.data;
    return transformData;
  }

  async handleGetNodeByComponent(options: any) {
    const variableComponent = options?.variable?.query?.variableComponent;
    const variableTag = options?.variable?.query?.variableTag;
    if (!variableComponent || !variableTag) return [];

    const [err, res] = await transformRequest(
      getBackendSrv().get(`api/datasources/uid/${this.datasourceUID}/resources/nodes-by-component`, {
        tagID: this.getCurrentTagUID(variableTag),
        componentUID: this.getCurrentComponentUID(variableComponent),
      })
    );
    if (err) {
      return;
    }
    const transformData = res.data.reduce((acc: any[], node: any) => {
      const parseMetaData = JSON.parse(node.meta_data);
      const text = isEmpty(parseMetaData) ? null : parseMetaData?.selected;

      if (text) {
        acc.push({ text });
      }

      return acc;
    }, []);

    return transformData;
  }

  async handleGetNodesByNode(options: any) {
    const variableNode = options?.variable?.query?.variableNode;
    const kind = options?.variable?.query?.kind;

    if (!variableNode || !kind) return [];
    const [err, res] = await transformRequest(
      getBackendSrv().get(`api/datasources/uid/${this.datasourceUID}/resources/nodes-by-node`, {
        nodeID: this.getCurrentNodeUID(variableNode),
        kind: kind,
      })
    );
    if (err) {
      return;
    }
    const transformData = res.data.reduce((acc: any[], node: any) => {
      const parseMetaData = JSON.parse(node.meta_data);
      const text = isEmpty(parseMetaData) ? null : parseMetaData?.selected;

      if (text) {
        acc.push({ text });
      }

      return acc;
    }, []);

    return transformData;
  }

  async metricFindQuery(query: ChaosMeshVariableQuery, options: any): Promise<MetricFindValue[]> {
    if (query.queryType === QUERY_TYPE_ENUMS.TAG) {
      return await this.handleGetTags();
    } else if (query.queryType === QUERY_TYPE_ENUMS.COMPONENT) {
      return await this.handleGetComponents();
    } else if (query.queryType === QUERY_TYPE_ENUMS.NODE_BY_TAG) {
      const { variableTag } = options.variable.query;
      return await this.handleGetNodesByTagID(variableTag);
    } else if (query.queryType === QUERY_TYPE_ENUMS.NODE_BY_COMPONENT) {
      return await this.handleGetNodeByComponent(options);
    } else {
      return await this.handleGetNodesByNode(options);
    }
  }

  async testDatasource() {
    return {
      status: 'success',
      message: 'Success',
    };
  }
}
