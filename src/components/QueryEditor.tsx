import { QueryEditorProps } from '@grafana/data';
import React, { ChangeEvent } from 'react';
import { DataSource } from '../datasource';
import { MyDataSourceOptions, MyQuery } from '../types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export const QueryEditor: React.FC<Props> = ({ query, onChange, onRunQuery }) => {
  const onQueryTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, queryText: event.target.value });
    onRunQuery();
  };

  return (
    <div className="gf-form">
      <span className="gf-form-label width-8">Variable</span>
      <input
        type="text"
        className="gf-form-input"
        value={query.queryText || ''}
        onChange={onQueryTextChange}
        placeholder="Enter variable variable"
      />
    </div>
  );
};
