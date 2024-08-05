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
import { ChaosMeshVariableQuery, NODE_KIND, QUERY_TYPE_ENUMS } from 'types';

interface VariableQueryProps {
  query: ChaosMeshVariableQuery;
  onChange: (query: ChaosMeshVariableQuery, definition: string) => void;
}

const QUERY_TYPE = [
  {
    value: QUERY_TYPE_ENUMS.TAG,
    label: 'Query Tag',
  },
  {
    value: QUERY_TYPE_ENUMS.COMPONENT,
    label: 'Query component',
  },
  {
    value: QUERY_TYPE_ENUMS.NODE_BY_TAG,
    label: 'Query nodes by tag',
  },
  {
    value: QUERY_TYPE_ENUMS.NODE_BY_COMPONENT,
    label: 'Query nodes by component',
  },
  {
    value: QUERY_TYPE_ENUMS.NODE_BY_NODE,
    label: 'Query nodes by node',
  },
];

const KIND_NODE = [
  {
    value: NODE_KIND.TARGET,
    label: 'From',
  },
  {
    value: NODE_KIND.SOURCE,
    label: 'To',
  },
];

export const VariableQueryEditor = ({ onChange, query }: VariableQueryProps) => {
  const debouncedOnChange = useMemo(() => _.debounce(onChange, 300), [onChange]);
  const [state, setState] = useState(query);
  const [variableOptions, setVariableOptions] = useState<SelectableValue<string>[]>();

  const getVariables = () => {
    const variables = getTemplateSrv().getVariables();
    const filterVariablesStateEqualDone = variables.filter((variable) => variable.state === 'Done');
    const newVariableOptions = filterVariablesStateEqualDone.map((variable) => ({
      value: `$${variable.id}`,
      label: `$${variable.name}`,
    }));
    setVariableOptions(newVariableOptions);
  };

  useEffect(() => {
    debouncedOnChange(state, `user: ${state.queryType}`);
    debouncedOnChange(state, `tag: ${state.tag}`);
    debouncedOnChange(state, `variableTag: ${state.variableTag}`);
    debouncedOnChange(state, `variableComponent: ${state.variableComponent}`);
    debouncedOnChange(state, `kind: ${state.kind}`);
    debouncedOnChange(state, `variableNode: ${state.variableNode}`);
  }, [debouncedOnChange, state]);

  const onQueryTypeChange = (option: SelectableValue<ChaosMeshVariableQuery['queryType']>) => {
    setState({ ...state, queryType: option.value! });
  };

  const onVariableTagChange = (option: SelectableValue<ChaosMeshVariableQuery['variableTag']>) => {
    setState({ ...state, variableTag: option.value! });
  };

  const onVariableNodeChange = (option: SelectableValue<ChaosMeshVariableQuery['variableNode']>) => {
    setState({ ...state, variableNode: option.value! });
  };

  const onVariableComponentChange = (option: SelectableValue<ChaosMeshVariableQuery['variableComponent']>) => {
    setState({ ...state, variableComponent: option.value! });
  };

  const onVariableKindChange = (option: SelectableValue<ChaosMeshVariableQuery['kind']>) => {
    setState({ ...state, kind: option.value! });
  };

  const isQueryTypeEqualNodeByTag = state.queryType === QUERY_TYPE_ENUMS.NODE_BY_TAG;
  const isQueryTypeEqualNodeByComponent = state.queryType === QUERY_TYPE_ENUMS.NODE_BY_COMPONENT;
  const isQueryTypeEqualNodeByNode = state.queryType === QUERY_TYPE_ENUMS.NODE_BY_NODE;

  useEffect(() => {
    getVariables();
  }, []);

  return (
    <div className="gf-form">
      <InlineField label="Query type">
        <Select width={30} options={QUERY_TYPE} value={state.queryType} onChange={onQueryTypeChange} />
      </InlineField>

      {isQueryTypeEqualNodeByTag && (
        <>
          <InlineField label="Tag" labelWidth={14} interactive>
            <Select width={30} options={variableOptions} value={state.variable} onChange={onVariableTagChange} />
          </InlineField>
        </>
      )}

      {isQueryTypeEqualNodeByComponent && (
        <>
          <InlineField label="Tag" labelWidth={14} interactive>
            <Select width={30} options={variableOptions} value={state.variableTag} onChange={onVariableTagChange} />
          </InlineField>
          <InlineField label="Component" labelWidth={14} interactive>
            <Select
              width={30}
              options={variableOptions}
              value={state.variableComponent}
              onChange={onVariableComponentChange}
            />
          </InlineField>
        </>
      )}

      {isQueryTypeEqualNodeByNode && (
        <>
          <InlineField label="Node" labelWidth={14} interactive>
            <Select width={30} options={variableOptions} value={state.variableNode} onChange={onVariableNodeChange} />
          </InlineField>
          <InlineField label="Kind" labelWidth={14} interactive>
            <Select width={30} options={KIND_NODE} value={state.kind} onChange={onVariableKindChange} />
          </InlineField>
        </>
      )}
    </div>
  );
};
