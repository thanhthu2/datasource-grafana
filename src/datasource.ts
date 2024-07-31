import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
  ScopedVars,
} from '@grafana/data';
import { getBackendSrv, getTemplateSrv, isFetchError } from '@grafana/runtime';
import { lastValueFrom } from 'rxjs';
import { DataSourceResponse, MyDataSourceOptions, MyQuery, MyVariableQuery } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  baseUrl: string;

  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
    this.baseUrl = instanceSettings.url!;
  }

  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    // const query = getTemplateSrv().replace('SELECT * FROM services WHERE id = "$service"', options.scopedVars);
    console.log('onchange', options);
    const rawQuery = '$user';

    // Sử dụng interpolateVariablesInQueries để thay thế biến
    const query1 = getTemplateSrv().replace(rawQuery, options.scopedVars);
    const promises = options.targets.map((target) => {
      // const query = getTemplateSrv().replace(target.queryText, options.scopedVars);
      return this.fetchPosts(query1);
    });

    const data = await Promise.all(promises);
    return { data: data.flat() };
  }

  async fetchPosts(userId: string): Promise<any> {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const posts = await response.json();
    return posts.map((post: any) => ({
      target: `userId ${userId}`,
      datapoints: [[post.id, post.userId]],
    }));
  }

  async request(url: string, params?: string) {
    const response = getBackendSrv().fetch<DataSourceResponse>({
      url: `${this.baseUrl}${url}${params?.length ? `?${params}` : ''}`,
    });

    return lastValueFrom(response);
  }

  async metricFindQuery(query: MyVariableQuery, options: any): Promise<MetricFindValue[]> {
    console.log({ options });
    if (query.queryType === 'user') {
      const data = await fetch(`https://jsonplaceholder.typicode.com/users`).then((res) => res.json());
      return data.map((user: any) => ({ text: user.name, value: user.id }));
    } else {
      const userId = options.variable.query.user;
      const data = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`).then((res) =>
        res.json()
      );
      return data.map((post: any) => ({ text: post.title, value: post.id }));
    }
  }

  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.request('/health');
      if (response.status === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: response.statusText ? response.statusText : defaultErrorMessage,
        };
      }
    } catch (err) {
      let message = defaultErrorMessage;
      if (typeof err === 'string') {
        message = err;
      } else if (isFetchError(err)) {
        message = `Fetch error: ${err.data.error?.message ?? err.statusText}`;
      }
      return {
        status: 'error',
        message,
      };
    }
  }
}
