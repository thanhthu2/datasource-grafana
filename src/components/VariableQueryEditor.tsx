/*
 * Copyright 2022 Chaos Mesh Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { SelectableValue } from '@grafana/data';
import { getTemplateSrv } from '@grafana/runtime';
import { InlineField, Select } from '@grafana/ui';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { ChaosMeshVariableQuery } from 'types';

interface VariableQueryProps {
  query: ChaosMeshVariableQuery;
  onChange: (query: ChaosMeshVariableQuery, definition: string) => void;
}

const QUERY_TYPE = [
  {
    value: 'post',
    label: 'post',
  },
  {
    value: 'user',
    label: 'user',
  },
];

export const VariableQueryEditor = ({ onChange, query }: VariableQueryProps) => {
  const debouncedOnChange = useMemo(() => _.debounce(onChange, 300), [onChange]);
  const [state, setState] = useState(query);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [variables, setVariables] = useState<any[]>([]);

  useEffect(() => {
    const templateSrv = getTemplateSrv();
    const variables = templateSrv.getVariables();
    setVariables(variables);
  }, []);

  useEffect(() => {
    debouncedOnChange(state, `user: ${state.user}`);
  }, [debouncedOnChange, state]);

  const onQueryTypeChange = (option: SelectableValue<ChaosMeshVariableQuery['queryType']>) => {
    setState({ ...state, queryType: option.value! });
  };

  const onUserChange = (option: SelectableValue<ChaosMeshVariableQuery['user']>) => {
    setState({ ...state, user: option.value! });
  };

  const onPostChange = (option: SelectableValue<ChaosMeshVariableQuery['post']>) => {
    setState({ ...state, post: option.value! });
  };

  const onVariableChange = (option: SelectableValue<ChaosMeshVariableQuery['variable']>) => {
    setState({ ...state, variable: option.value! });
  };

  const fetchPosts = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    const posts = await response.json();
    setPosts(posts);
  };

  const fetchUsers = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
    const users = await response.json();
    setUsers(users);
  };

  const postOptions = posts.map((post: any) => {
    return {
      value: post.id,
      label: post.title,
    };
  });

  const userOptions = users.map((user: any) => {
    return {
      value: user.id,
      label: user.name,
    };
  });

  const varOptions = variables.map((variable: any) => {
    return {
      value: `$${variable.id}`,
      label: `$${variable.name}`,
    };
  });

  useEffect(() => {
    fetchPosts();
    fetchUsers();
  }, []);

  return (
    <div className="gf-form">
      <InlineField label="Query type">
        <Select width={30} options={QUERY_TYPE} value={state.queryType} onChange={onQueryTypeChange} />
      </InlineField>

      {state.queryType === 'user' && (
        <>
          <InlineField label="User">
            <Select width={30} options={userOptions} value={state.user} onChange={onUserChange} />
          </InlineField>
        </>
      )}

      {state.queryType === 'post' && (
        <>
          {/* <InlineField label="Post">
            <Select width={30} options={postOptions} value={state.post} onChange={onPostChange} />
          </InlineField> */}

          <InlineField label="User">
            <Select width={30} options={userOptions} value={state.user} onChange={onUserChange} />
          </InlineField>
        </>
      )}

      {/* <InlineField label="Metric" tooltip="Select a metric to generate different sets of variable">
        <Select width={30} options={metricOptions} value={state.metric} onChange={onMetricChange} />
      </InlineField> */}
    </div>
  );
};
